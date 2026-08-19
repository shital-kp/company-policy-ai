"use client";

import React, { useState } from "react";
import styles from "./ForgetPassword.module.scss";

interface ForgotPasswordProps {
    onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
    onClose,
}) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email
        if (!emailRegex.test(email)) {
            setError("Email address is invalid.");
            return;
        }

        // Loading state
        setLoading(true);

        // Temporary frontend simulation
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
            >
                {!success ? (
                    <>
                        <h2 className={styles.title}>
                            FORGOT PASSWORD
                        </h2>

                        <p className={styles.description}>
                            Enter your account email to receive a
                            password reset link.
                        </p>

                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                        >
                            <label htmlFor="forgot-email">
                                Email:
                            </label>

                            <input
                                type="email"
                                id="forgot-email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError("");
                                }}
                                disabled={loading}
                                autoFocus
                            />

                            {error && (
                                <p className={styles.error}>
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={styles.sendButton}
                                disabled={loading}
                            >
                                {loading
                                    ? " Processing..."
                                    : "Send Reset Link"}
                            </button>
                        </form>

                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Back to Sign In
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className={styles.title}>
                            RESET LINK SENT
                        </h2>

                        <p className={styles.description}>
                            A password reset link has been
                            successfully sent to
                            <strong> {email}</strong>.
                            <br />
                            Please check your inbox and follow
                            the instructions.
                        </p>

                        <div className={styles.emailIcon}>
                            ✉
                        </div>

                        <button
                            type="button"
                            className={styles.sendButton}
                            onClick={onClose}
                        >
                            Done / Back to Sign In
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;