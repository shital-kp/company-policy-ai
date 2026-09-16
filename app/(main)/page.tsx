import ClientChat from "@/app/components/ClientChat/ClientChat";
import styles from "./page.module.scss";

export default function ChatPage() {
  return (
    <div className={styles.mainContent}>
      <ClientChat />
    </div>
  );
}