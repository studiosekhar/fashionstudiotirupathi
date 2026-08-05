# 🔥 Firebase Setup Guide for Fashion Studio

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Project name: `fashion-studio` (or any name you prefer)
   - Click "Continue"

3. **Google Analytics (Optional)**
   - You can enable or disable Google Analytics
   - For this project, you can disable it
   - Click "Create project"
   - Wait for project creation (takes ~30 seconds)
   - Click "Continue" when done

## Step 2: Register Your Web App

1. **Add Web App**
   - In your Firebase project dashboard
   - Click on the **Web icon** `</>` (above "Add an app to get started")
   - Or go to Project Settings → General → Your apps → Add app → Web

2. **Register App**
   - App nickname: `fashion-studio-web`
   - ✅ Check "Also set up Firebase Hosting" (optional, but recommended for deployment)
   - Click "Register app"

3. **Copy Firebase Configuration**
   - You'll see a configuration object like this:
   
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```
   
   - **COPY THESE VALUES** - you'll need them in Step 5
   - Click "Continue to console"

## Step 3: Set Up Firestore Database

1. **Create Firestore Database**
   - In the left sidebar, click "Build" → "Firestore Database"
   - Click "Create database"

2. **Choose Starting Mode**
   - Select **"Start in production mode"** (we'll set custom rules)
   - Click "Next"

3. **Choose Location**
   - Select a location closest to your users (e.g., `us-central` or `asia-south1`)
   - Click "Enable"
   - Wait for database creation (~30 seconds)

4. **Set Security Rules**
   - Click on "Rules" tab
   - Replace the content with these rules:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to read data
       match /{document=**} {
         allow read: if true;
       }
       
       // Only authenticated users can write
       match /studio/{document=**} {
         allow write: if request.auth != null;
       }
       
       // For now, allow all writes (we'll secure this later with admin authentication)
       match /{document=**} {
         allow write: if true;
       }
     }
   }
   ```
   
   - Click "Publish"

## Step 4: Set Up Firebase Authentication

1. **Enable Authentication**
   - In the left sidebar, click "Build" → "Authentication"
   - Click "Get started"

2. **Enable Email/Password Sign-In**
   - Click on "Sign-in method" tab
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

3. **Create Admin User**
   - Click on "Users" tab
   - Click "Add user"
   - Email: Your admin email (e.g., `admin@fashionstudio.com`)
   - Password: Create a strong password
   - Click "Add user"
   - **SAVE THESE CREDENTIALS** - this is your admin login

## Step 5: Configure Your Project

1. **Open Your Project**
   - Navigate to your project folder
   - Open: `frontend/.env` (create if it doesn't exist)

2. **Add Firebase Configuration**
   - Copy the values from Step 2
   - Add them to your `.env` file:

   ```bash
   # Admin Credentials
   VITE_ADMIN_USER=your_admin_username
   VITE_ADMIN_PASS=your_admin_password
   
   # Cloudinary
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_API_KEY=your_api_key
   
   # Firebase Configuration (ADD THESE)
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

3. **Save the file**

## Step 6: Firestore Database Structure

Your data will be stored in these collections:

```
fashion-studio (root)
├── portfolio/          # Portfolio images
│   └── {id}           # Each photo document
├── categories/        # Portfolio categories
│   └── list           # Array of category names
├── categoryImages/    # Category profile pictures
│   └── {category}     # Image for each category
├── about/            # About page data
│   └── data          # Single document with all about info
├── youtubeVideos/    # YouTube embeds
│   └── {id}          # Each video document
├── services/         # Services list
│   └── {id}          # Each service document
├── testimonials/     # Client testimonials
│   └── {id}          # Each testimonial document
├── inquiries/        # Contact form submissions
│   └── {id}          # Each inquiry document
├── heroPhotos/       # Hero section polaroids
│   └── {id}          # Each photo document
└── gallery/          # Circular gallery items
    └── {id}          # Each gallery item document
```

## Step 7: Deploy and Test

1. **Install Dependencies** (done automatically)
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test the Connection**
   - Open http://localhost:5173
   - Go to /admin
   - Login with your credentials
   - Try adding a portfolio item
   - Open the site in another browser/device
   - You should see the changes!

## Step 8: Security Best Practices

### 🔒 **Important Security Steps:**

1. **Secure Your Environment Variables**
   - Never commit `.env` file to Git
   - Add `.env` to `.gitignore`

2. **Update Firestore Rules (After Authentication Works)**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Public read access
       match /{document=**} {
         allow read: if true;
       }
       
       // Only authenticated admin can write
       match /{collection}/{document=**} {
         allow write: if request.auth != null && 
                        request.auth.token.email == "admin@fashionstudio.com";
       }
     }
   }
   ```

3. **Enable App Check (Optional but Recommended)**
   - In Firebase Console → Build → App Check
   - Register your app
   - This prevents unauthorized API access

## 🎉 Success Checklist

- ✅ Firebase project created
- ✅ Web app registered
- ✅ Firestore database enabled
- ✅ Authentication enabled
- ✅ Admin user created
- ✅ Environment variables configured
- ✅ Dependencies installed
- ✅ App running and connected

## 🆘 Troubleshooting

### "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console

### "Missing or insufficient permissions"
- Check Firestore security rules
- Make sure you're signed in as admin

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- Firebase is initialized twice
- Check that you're importing from the correct firebase config file

### Changes not syncing
- Check browser console for errors
- Verify Firebase config values are correct
- Make sure you're connected to the internet

## 📚 Additional Resources

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Documentation: https://firebase.google.com/docs/firestore
- Firebase Authentication: https://firebase.google.com/docs/auth

---

**Need Help?** Check the Firebase Console for detailed error messages and logs.
