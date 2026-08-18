import React from "react";
import LogInForm from "@/app/components/LogInForm/LogInForm";
import styles from "./page.module.scss";



export default function SignInPage() {
    return (
        <div className={`container ${styles.signInPage}`}>
            <LogInForm />
        </div>
    );
}