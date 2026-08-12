import React from "react";
import SignUpForm from "@/app/components/SignUpForm/SignUpForm";
import styles from "./page.module.scss";



export default function SignupPage() {
    return (
        <div className={styles.signupPage}>
            <SignUpForm />
        </div>
    );
}