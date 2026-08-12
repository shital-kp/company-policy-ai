import LogInForm from "@/app/components/LogInForm/LogInForm";
import styles from "./page.module.scss";

export default function SignInPage() {
  return (
    <div className={styles.signInPage}>
      <LogInForm />
    </div>
  );
}
