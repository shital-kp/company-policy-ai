"use client";

import React from "react";
import styles from "./SampleQuestions.module.scss";

const questions = [
  {
    question: "How many days of leave can I take?",
  },
  {
    question: "Can I carry forward unused leave?",
  },
  {
    question: "What is the work from home policy?",
  },
  {
    question: "What are the working hours?",
  },
];

type SampleQuestionsProps = {
  onQuestionSelect: (question: string) => void;
};

export default function SampleQuestions({
  onQuestionSelect,
}: SampleQuestionsProps) {
  return (
    <section className={styles.SampleQuestions}>
      {questions.map((item) => (
        <button
          key={item.question}
          type="button"
          className={styles.questionBtn}
          onClick={() => onQuestionSelect(item.question)}
        >
          {item.question}
        </button>
      ))}
    </section>
  );
}