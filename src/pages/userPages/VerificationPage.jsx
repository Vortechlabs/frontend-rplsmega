// VerificationPage.jsx
import React from 'react';

function VerificationPage() {
    return (
        <div className="container">
            <div className="mt-14"></div>
            <div className="text-center">
                <h2 className="text-3xl font-extrabold">Check Your Email</h2>
                <p className="text-lg">We’ve sent you an email to verify your account. Please check your inbox (and spam folder) for the verification link.</p>
                <p className="text-lg">If you didn’t receive the email, <a href="/resend-verification" className="text-blue-600">click here to resend it</a>.</p>
            </div>
        </div>
    );
}

export default VerificationPage;
