'use client';
import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import sidebarIn from "@/public/sidebar-in.png";
import sidebarOut from "@/public/sidebar-out.png";
import ThemeToggle from "@/app/components/ThemeToggle/ThemeToggle";
import Sidebar from "@/app/components/Sidebar/Sidebar";

type User = {
  name: string;
  email: string;
};

type HeaderProps = {
  handleSidebarClick?: () => void;
  user?: User | null;
};

const Header: React.FC<HeaderProps> = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSidebarClick = () => {
    setShowSidebar((prev) => !prev);
  }

  return (
    <>
      <div className={styles.header} data-name="header">
        <button className={`sidebarIcon ${showSidebar === true && styles.showSidebar} ${styles.sidebarBtn}`} onClick={handleSidebarClick}><img src={showSidebar === true ? sidebarOut.src : sidebarIn.src} width={40} height={40} alt="sidebat-icon" /></button>
        {isLoggedIn && user ? (
          <span>
            {user.name}
          </span>
        ) : (
          <a
            href="/signin"
            className={styles.signin}
          >
            Sign In
          </a>
        )}
      </div>
      {showSidebar && (
        <Sidebar
          onClose={() => setShowSidebar(false)}
        />
      )}

      {showSidebar && (
        <div
          className={styles.overlay}
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
}

export default Header;