# Fashion Studio - Full Stack Application

A modern fashion studio portfolio website with admin panel, built with React and Node.js.

## 📁 Project Structure

```
fashion-studio/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
│
├── api/              # Serverless API functions
│   ├── sign-upload.js    # Cloudinary upload signature
│   └── delete-image.js   # Cloudinary image deletion
│
├── backend/          # Backend utilities (dev-server for local testing)
│   └── dev-server.js # Local development server
│
└── package.json     # Root package.json with helper scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thebyte24/client-new24.git
cd client-new24
```

2. Install dependencies for both frontend and backend:
```bash
npm run install:all
```

Or install separately:
```bash
npm run install:frontend
npm run install:backend
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `frontend` and `backend` folders
   - Update the values with your credentials

### Running the Application

**Development Mode:**

Run frontend (in one terminal):
```bash
npm run dev:frontend
```

Run backend (in another terminal):
```bash
npm run dev:backend
```

**Production Build:**
```bash
npm run build:frontend
npm run start:backend
```

## 🔐 Admin Panel

Access the admin panel at `/admin` with the configured credentials.

## 🛠️ Technologies Used

### Frontend
- React 19
- Vite
- React Router
- Axios
- OGL (3D graphics)

### Backend
- Node.js
- Express
- Cloudinary (image management)

## 📝 Environment Variables

### Frontend (.env)
```
VITE_ADMIN_USER=your_admin_username
VITE_ADMIN_PASS=your_admin_password
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Backend (.env)
```
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🔥 Firebase Setup

This project uses Firebase Firestore for real-time data synchronization across all users.

**Quick Start:**
1. Follow the step-by-step guide in [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md)
2. Create a Firebase project at https://console.firebase.google.com/
3. Enable Firestore Database
4. Copy your Firebase config to `.env` file
5. Start the app - existing localStorage data will be migrated automatically!

**Features:**
- ✅ Real-time data sync across all devices
- ✅ Automatic migration from localStorage
- ✅ Admin changes visible to everyone instantly
- ✅ Contact form submissions reach the admin
- ✅ Persistent data storage

## 📦 Deployment

This project is configured for deployment on Vercel. Make sure to set up environment variables in your deployment platform.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
