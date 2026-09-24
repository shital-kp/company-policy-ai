
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
  success?: boolean;
  answer?: string;
  message?: string;
  chatId?: string;
};

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSampleQuestions, setShowSampleQuestions] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // Common question handler
  // Used by:
  // 1. Typed question
  // 2. Sample question
  // ==========================================

  const handleQuestion = async (question: string) => {
    if (!question.trim() || loading) {
      return;
    }

    const trimmedQuestion = question.trim();

    // Hide sample questions after first question
    setShowSampleQuestions(false);

    // Create message IDs
    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    // Immediately show user question
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    // Start loading
    setLoading(true);

    try {
      // Call Chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
        }),
      });

      // Check API response
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();

      // Get answer
      let answer = "";

      if (typeof data.answer === "string") {
        answer = data.answer;
      } else if (typeof data.message === "string") {
        answer = data.message;
      } else {
        answer =
          "Sorry, I couldn't get an answer. Please try again.";
      }

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error("❌ Chat API error:", error);

      // Show error message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content:
            "Sorry, I couldn't get an answer. Please try again.",
        },
      ]);
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // ==========================================
  // Scroll to latest message
  // ==========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className={styles.chatContainer}>
      {/* Welcome section */}
      {messages.length === 0 && <HomeWelcomeSection />}

      <div className={styles.scrollContent}>
        {/* Chat messages */}
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
              <div className={styles.messageBubble}>
                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className={styles.assistantMessage}>
              <div className={styles.loadingMessage}>
                <span className={styles.spinner}></span>

                <span>
                  Searching company policies...
                </span>
              </div>
            </div>
          )}

          {/* Scroll target */}
          <div ref={bottomRef} />
        </div>

        {/* Sample questions */}
        {showSampleQuestions && (
          <SampleQuestions
            onQuestionSelect={handleQuestion}
          />
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        onSubmit={handleQuestion}
        loading={loading}
      />
    </div>
  );
}
