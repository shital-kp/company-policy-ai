"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.scss";
import logo from "@/public/companyLogo.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ForgotPassword from "@/app/components/ForgetPassword/ForgetPassword";

const LogInForm: React.FC = () => {
  const router = useRouter();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Temporary frontend testing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.titleBlock}>
        <img
          src={logo.src}
          alt="Logo"
          className={`companyLogo ${styles.logo}`}
          width={150}
          height={50}
        />

        <h2 className={styles.title}>
          Sign In
        </h2>

        <p className={styles.description}>
          Use your email and password to sign in
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <label htmlFor="username">
          Username
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
          required
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          type="password"
          id="password"
          name="password"
          required
        />

        <button
          type="button"
          className={styles.passwordText}
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot password?
        </button>

        <button
          type="submit"
          className={styles.submitBtn}
        >
          Sign In
        </button>

        <p className={styles.text}>
          Don't have an account?{" "}
          <a
            href="/signup"
            className={styles.boldText}
          >
            Sign Up
          </a>
        </p>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPassword
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
};

export default LogInForm;