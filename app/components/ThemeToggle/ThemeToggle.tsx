"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />

      <div className={styles.toggleSlot}>
        <div className={styles.sunIcon}>
          <Sun size={15} />
        </div>

        <div className={styles.toggleButton} />

        <div className={styles.moonIcon}>
          <Moon size={15} />
        </div>
      </div>
    </label>
  );
}