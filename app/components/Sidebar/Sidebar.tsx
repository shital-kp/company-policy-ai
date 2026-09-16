
"use client";

import React from "react";
import styles from "./Sidebar.module.scss";
import NewChatIcon from "@/public/new-chat-icon.png";
import DocumentIcon from "@/public/document-icon.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SignOutIcon from "@/public/log-out-icon.png";
import chatIcon from "@/public/chat-history.png";

type SidebarProps = {
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isSettingOpen, setIsSettingOpen] = React.useState(false);
  const [isDocumentOpen, setIsDocumentOpen] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Check whether user is logged in
  React.useEffect(() => {
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!user);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");

    window.location.href = "/signin";
  };

  const handleProfileBtn = () => {
    setIsSettingOpen(!isSettingOpen);
  };

  const documentShow = () => {
    setIsDocumentOpen(!isDocumentOpen);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTitle}>
        AI BOT

        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>

      <div className={styles.sidebarDetails}>
        {/* New Chat */}
        <a href="/" className={styles.newChat}>
          <img
            src={NewChatIcon.src}
            width={25}
            height={25}
            alt="new-chat-icon"
          />

          <span>New Chat</span>
        </a>

        {/* Documents */}
        <a href="/admin"
          className={styles.documentManagement}
          onClick={documentShow}
        >
          <img
            src={DocumentIcon.src}
            width={25}
            height={25}
            alt="document-icon"
          />

          Documents
        </a>

        {/* Chat History */}
        <a
          href="/chat-history"
          className={styles.recentBtn}
        >
          <img
            src={chatIcon.src}
            width={25}
            height={25}
            alt="chat history icon"
            className={`companyLogo ${styles.logo}`}
          />

          Chat History
        </a>
      </div>

      {/* User Profile - show only when logged in */}
      {isLoggedIn && (
        <div className={styles.profileAndToggle}>
          {isSettingOpen && (
            <div className={styles.themeToggleBtn}>
              <div className={styles.togglePopup}>
                <div className={styles.theme}>
                  <span>Theme</span>
                  <ThemeToggle />
                </div>

                <button
                  className={styles.signout}
                  onClick={handleSignOut}
                >
                  <img
                    src={SignOutIcon.src}
                    width={20}
                    height={20}
                    alt="log-out-icon"
                  />

                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          <div
            className={styles.userProfile}
            onClick={handleProfileBtn}
          >
            <span className={styles.userName}>
              User Profile
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

