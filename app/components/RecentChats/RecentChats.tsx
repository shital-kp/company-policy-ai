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
  answer: string;
};

const RecentChats: React.FC = () => {
  const [recentChats, setRecentChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();


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
      <h2 className={styles.title}>
        Chat History
      </h2>
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
              <p className={styles.question}>{chat.question}</p>
              <p className={styles.answer}>{chat.answer}</p>
            </button>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentChats;