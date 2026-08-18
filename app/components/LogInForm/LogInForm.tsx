"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./LoginForm.module.scss";
import logo from "@/public/companyLogo.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const LogInForm: React.FC = () => {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Temporary frontend login
    // Backend authentication will be added later
    if (username && password) {
      const user = {
        name: username,
        email: username,
      };

      localStorage.setItem("user", JSON.stringify(user));

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
        <label htmlFor="username">
          Username
        </label>

        <input
          type="text"
          id="username"
          name="username"
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

        <p className={styles.passwordText}>
          forgot password?
        </p>

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
    </div>
  );
};

export default LogInForm;