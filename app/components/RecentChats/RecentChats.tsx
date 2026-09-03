"use client";

import React, { useEffect, useState } from "react";
import styles from "./RecentChats.module.scss";
import chatIcon from "@/public/chat-history.png";
import { useRouter } from "next/navigation";

type ChatHistory = {
  id: string;
  title: string;
  question: string;
  time: string;
};

const RecentChats: React.FC = () => {
  const [expandChat, setExpandChat] = useState(false);
  const [recentChats, setRecentChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleExpandChat = () => {
    setExpandChat((prev) => !prev);
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/chat-history");

        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }

        const data = await response.json();

        setRecentChats(data.chats || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat?chatId=${chatId}`);
  };

  return (
    <section className={styles.recentChat}>
      <button
        type="button"
        onClick={handleExpandChat}
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
      </button>

      {expandChat && (
        <div className={styles.chatDetails}>
          {loading ? (
            <p>Loading chats...</p>
          ) : recentChats.length === 0 ? (
            <p>No chat history</p>
          ) : (
            recentChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => handleChatSelect(chat.id)}
              >
                <p>{chat.question}</p>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default RecentChats;