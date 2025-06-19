const config = {
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    socket: import.meta.env.VITE_SOCKET_URL,
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
        messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    },
    cloudinary: {
        cloudName: import.meta.env.VITE_CLOUD_NAME,
        cloudPreset: import.meta.env.VITE_CLOUD_PRESET,
    },
    map: {
        apiKey: import.meta.env.VITE_MAP_API_KEY,
        gecodeApi: import.meta.env.VITE_OPENCAGE_API_KEY
    },
    payment: {
        RPayKey: import.meta.env.VITE_RAZORPAY_KEY_ID,
        StripeKey: import.meta.env.VITE_STRIPE_KEY,
    },
    liveKit: {
        url: import.meta.env.VITE_LIVEKIT_URL,
    }
}

export default config;