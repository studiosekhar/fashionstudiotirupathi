/**
 * Cloudinary upload utility
 *
 * Flow:
 * 1. Compress image client-side if > 8 MB (DSLR/laptop photos)
 * 2. Ask our own backend (/api/sign-upload) for a signed timestamp
 * 3. POST the file directly to Cloudinary's upload endpoint
 * 4. Return the secure HTTPS URL + public_id (needed for future deletion)
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

/**
 * Compress an image file in the browser using a Canvas.
 * Reduces file size while keeping good visual quality.
 * @param {File} file
 * @param {number} maxSizeMB - Target max size in MB
 * @param {number} maxWidth  - Max width/height in px
 * @returns {Promise<File>}
 */
async function compressImage(file, maxSizeMB = 8, maxWidth = 2400) {
  // GIF and AVIF can't be compressed via canvas — return as-is
  if (file.type === 'image/gif' || file.type === 'image/avif') return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate new dimensions keeping aspect ratio
      let { width, height } = img
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height / width) * maxWidth)
          width = maxWidth
        } else {
          width = Math.round((width / height) * maxWidth)
          height = maxWidth
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Start with quality 0.85, reduce if still too big
      const tryCompress = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }

            const sizeMB = blob.size / (1024 * 1024)

            if (sizeMB > maxSizeMB && quality > 0.3) {
              // Still too big — reduce quality and try again
              tryCompress(quality - 0.1)
            } else {
              const compressed = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressed)
            }
          },
          'image/jpeg',
          quality
        )
      }

      tryCompress(0.85)
    }

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

/**
 * Upload a File object to Cloudinary via the signed-upload flow.
 * Large images are automatically compressed before upload.
 * @param {File} file - The image file to upload
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error('No file provided')

  // Validate file type
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, GIF and AVIF images are allowed')
  }

  // Hard limit before even trying
  const HARD_MAX = 100 * 1024 * 1024 // 100 MB
  if (file.size > HARD_MAX) {
    throw new Error('Image must be under 100 MB')
  }

  // Auto-compress if file is larger than 8 MB
  const COMPRESS_THRESHOLD = 8 * 1024 * 1024 // 8 MB
  let uploadFile = file
  if (file.size > COMPRESS_THRESHOLD) {
    uploadFile = await compressImage(file, 8, 2400)
    console.log(`Compressed: ${(file.size/1024/1024).toFixed(1)}MB → ${(uploadFile.size/1024/1024).toFixed(1)}MB`)
  }

  // 1 — Get a fresh signature from our serverless function
  const signRes = await fetch('/api/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!signRes.ok) {
    const err = await signRes.json().catch(() => ({}))
    throw new Error(err.error ?? 'Failed to get upload signature')
  }

  const { signature, timestamp, uploadPreset, apiKey, cloudName } = await signRes.json()

  // 2 — Upload directly to Cloudinary
  const formData = new FormData()
  formData.append('file', uploadFile)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'fashion-studio')

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName ?? CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}))
    throw new Error(err.error?.message ?? 'Cloudinary upload failed')
  }

  const data = await uploadRes.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

/**
 * Delete an image from Cloudinary via the backend.
 * @param {string} publicId - The Cloudinary public_id of the image
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId || publicId.startsWith('data:') || publicId.startsWith('http')) {
    return
  }

  const res = await fetch('/api/delete-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.warn('Cloudinary delete failed:', err.error ?? 'unknown error')
  }
}
