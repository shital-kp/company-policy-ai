"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.scss";
import logo from "@/public/companyLogo.png";
import ForgotPassword from "@/app/components/ForgetPassword/ForgetPassword";

const LogInForm: React.FC = () => {
  const router = useRouter();

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Temporary frontend login
    if (email && password) {
      const user = {
        name: email,
        email: email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      router.push("/");
    }
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
        {/* Email */}
        <label htmlFor="email">
          Email
        </label>

        <input
          type="email"
          id="email"
          name="email"
          required
        />

        {/* Password */}
        <label htmlFor="password">
          Password
        </label>

        <input
          type="password"
          id="password"
          name="password"
          required
        />

        {/* Forgot Password */}
        <button
          type="button"
          className={styles.passwordText}
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot password?
        </button>

        {/* Sign In */}
        <button
          type="submit"
          className={styles.submitBtn}
        >
          Sign In
        </button>

        {/* Sign Up */}
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