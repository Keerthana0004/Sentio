import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import "./LoginPage.css";
// This component handles the UI and logic for the login screen.
function LoginPage() {
    // We get the auth instance, but we don't initialize the app here.
    // The app is initialized once in the main App.js file.
    const auth = getAuth();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome to Sentiment Journal</h1>
            <p>Please sign in to continue</p>
            <button onClick={handleGoogleLogin} className="login-button">
                Sign in with Google
            </button>
        </div>
    );
}

export default LoginPage;

