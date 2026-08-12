import React from "react";
import styles from "./SignUpForm.module.scss";
import logo from "@/public/companyLogo.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";


const LogInForm: React.FC = () => {
    return (
        <div className={styles.signupForm}>
            <div className={styles.titleBlock}>
                <img src={logo.src} alt="Logo" className={`companyLogo ${styles.logo}`} width={150} height={50} />
                <h2 className={styles.title}>Sign Up</h2>
                <p className={styles.description}>Use your email and password to sign up</p>
            </div>

            <form className={styles.form}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password</label>

                <input type="password" id="password" name="password" required />
                {/* <p className={styles.passwordText}>forgot password?</p> */}

                <button type="submit" className={styles.submitBtn}>Sign Up</button>

                {/* <p className={styles.text}>Don't have an account? <a href="/signup" className={styles.boldText}>Sign Up</a></p> */}
            </form>

            <ThemeToggle />
        </div>
    );
}

export default LogInForm;