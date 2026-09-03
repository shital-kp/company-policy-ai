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

    if (!message.trim() || loading) {
      return;
    }

    const question = message.trim();

    setMessage("");

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
              <ArrowUp className="icon" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}