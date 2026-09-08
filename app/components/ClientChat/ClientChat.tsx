
"use client";
import { useEffect, useRef, useState } from "react";
import ChatInput from "@/app/components/ChatInput/ChatInput";
import SampleQuestions from "../SampleQuestions/SampleQuestions";
import HomeWelcomeSection from "../HomeWelcomeSection/HomeWelcomeSection"
import styles from "./ClientChat.module.scss";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatClientProps = {
  welcome: React.ReactNode;
};

export default function ChatClient({ welcome }: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSampleQuestions, setShowSampleQuestions] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Add user question to chat
  const handleMessageStart = (question: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      },
    ]);
  };

  // Add AI answer to chat
  const handleMessageComplete = (answer: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
      },
    ]);
  };

  // Common handler for:
  // 1. Typed question
  // 2. Sample question
  const handleQuestion = async (question: string) => {
    if (!question.trim() || loading) return;

    const trimmedQuestion = question.trim();

    console.log("🚀 Sending question:", trimmedQuestion);

    // Immediately update UI
    setShowSampleQuestions(false);

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setLoading(true);

    const requestStart = performance.now();

    try {
      console.log("📡 Calling /api/chat...");

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
        "📥 Response received:",
        Math.round(performance.now() - requestStart),
        "ms"
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();

      console.log("📥 Chat API response:", data);

      let answer = "";

      if (typeof data.answer === "string") {
        answer = data.answer;
      } else if (typeof data.message === "string") {
        answer = data.message;
      } else {
        answer =
          "Sorry, I couldn't get an answer. Please try again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: answer,
        },
      ]);

      console.log(
        "🏁 Finished:",
        Math.round(performance.now() - requestStart),
        "ms"
      );
    } catch (error) {
      console.error("❌ Chat API error:", error);

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
      setLoading(false);
    }
  };

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className={styles.chatContainer}>
      <HomeWelcomeSection />
      <div className={styles.scrollContent}>
        {messages.length === 0 ? (
          welcome
        ) : (
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

            <div ref={bottomRef} />
          </div>
        )}
        {showSampleQuestions && (
          <SampleQuestions
            onQuestionSelect={handleQuestion}
          />
        )}

      </div>

      <ChatInput
        onSubmit={handleQuestion}
        loading={loading}
      />
    </div>
  );
}

