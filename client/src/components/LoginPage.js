import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import "./LoginPage.css";
import { auth } from './firebase';

// This component handles the UI and logic for the login screen.
function LoginPage() {
    const [error, setError] = useState(null);
    // We get the auth instance, but we don't initialize the app here.
    // The app is initialized once in the main App.js file.

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        try {
            setError(null);
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome to Sentiment Journal</h1>
            <p>Please sign in to continue</p>
             {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <button onClick={handleGoogleLogin} className="login-button">
                Sign in with Google
            </button>
        </div>
    );
}

export default LoginPage;

