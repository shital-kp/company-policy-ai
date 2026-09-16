"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";

import styles from "./ChatInput.module.scss";

type ChatInputProps = {
  onSubmit: (question: string) => void;
  loading: boolean;
};

export default function ChatInput({
  onSubmit,
  loading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit empty message
    if (!message.trim() || loading) {
      return;
    }

    const question = message.trim();

    // Clear input
    setMessage("");

    // Send question to parent
    onSubmit(question);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.chatInput}
    >
      <div className={styles.inputBlock}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about leave, benefits, work policies..."
          className={styles.searchInput}
          disabled={loading}
        />

        <div className={styles.btnBlock}>
          <button
            type="submit"
            disabled={!message.trim() || loading}
            title="Send"
            className={styles.sendBtn}
          >
            {loading ? (
              <span className={styles.buttonSpinner}></span>
            ) : (
              <ArrowUp />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}