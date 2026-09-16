"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./Header.module.scss";
import sidebarIn from "@/public/sidebar-in.png";
import sidebarOut from "@/public/sidebar-out.png";
import Sidebar from "@/app/components/Sidebar/Sidebar";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  const [showSidebar, setShowSidebar] = useState(true);

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
  };

  const isLoggedIn = status === "authenticated";

  return (
    <>
      <div className={styles.header} data-name="header">
        <button
          className={`sidebarIcon ${
            showSidebar === true && styles.showSidebar
          } ${styles.sidebarBtn}`}
          onClick={handleSidebarClick}
        >
          <img
            src={showSidebar ? sidebarOut.src : sidebarIn.src}
            width={40}
            height={40}
            alt="sidebar-icon"
          />
        </button>

        {isLoggedIn ? (
          <span>
            {session.user?.email}
          </span>
        ) : (
          <a href="/signin" className={styles.signin}>
            Sign In
          </a>
        )}
      </div>

      {showSidebar && (
        <Sidebar onClose={() => setShowSidebar(false)} />
      )}

      {showSidebar && (
        <div
          className={styles.overlay}
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
};

export default Header;