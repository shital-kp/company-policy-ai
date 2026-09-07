"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "@/app/components/ChatInput/ChatInput";
import SampleQuestions from "../SampleQuestions/SampleQuestions";
import HomeWelcomeSection from "../HomeWelcomeSection/HomeWelcomeSection";
import styles from "./ClientChat.module.scss";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  success: boolean;
  question?: string;
  answer?: unknown;
  message?: unknown;
  sources?: unknown;
};

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSampleQuestions, setShowSampleQuestions] =
    useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleQuestion = async (question: string) => {
    if (!question.trim() || loading) return;

    const trimmedQuestion = question.trim();

    const requestStart = performance.now();

    console.log("🚀 Request started:", trimmedQuestion);

    // existing code...

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
        }),
      });

      console.log(
        "📡 Response headers received:",
        Math.round(performance.now() - requestStart),
        "ms"
      );

      const data = await response.json();

      console.log(
        "📦 JSON parsed:",
        Math.round(performance.now() - requestStart),
        "ms"
      );

      // existing answer handling...

      console.log(
        "🏁 UI update:",
        Math.round(performance.now() - requestStart),
        "ms"
      );
    } catch (error) {
      // existing error handling
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.scrollContent}>

        {/* Welcome section */}
        {messages.length === 0 && (
          <HomeWelcomeSection />
        )}

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage
                }
              >
                <div
                  className={
                    styles.messageBubble
                  }
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div
                className={
                  styles.assistantMessage
                }
              >
                <div
                  className={
                    styles.loadingMessage
                  }
                >
                  <span
                    className={
                      styles.spinner
                    }
                  />

                  <span>
                    Searching company policies...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        {/* Sample questions */}
        {showSampleQuestions && (
          <SampleQuestions
            onQuestionSelect={handleQuestion}
          />
        )}
      </div>

      {/* Chat input */}
      <ChatInput
        onSubmit={handleQuestion}
        loading={loading}
      />
    </div>
  );
}