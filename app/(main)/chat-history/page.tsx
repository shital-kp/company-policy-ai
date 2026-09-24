import styles from "./page.module.scss";
import RecentChats from "@/app/components/RecentChats/RecentChats"; 

export default function AdminLayout() {
  return (
    <div className={styles.mainContent}>
      <RecentChats />
    </div>
  );
}