"use client";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import Documents from "@/app/components/Documents/Documents";
import styles from "./page.module.scss";
import Header from "@/app/components/Header/Header";

export default function AdminLayout() {
  return (
    <div className={styles.mainContent}>
      <Documents />
    </div>
  );
}