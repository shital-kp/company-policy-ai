import React from "react";
import Documents from "@/app/components/Documents/Documents";
import styles from "./page.module.scss";

export default function AdminLayout() {
  return (
    <div className={styles.mainContent}>
      <Documents />
    </div>
  );
}