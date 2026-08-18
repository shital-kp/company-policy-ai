"use client";
import React, { useState } from "react";
import DocumentUpload from "./parts/DocumentUpload/DocumentUpload";
import UploadProgress from "./parts/DocumentUploadProgress/DocumentUploadProgress";
import DocumentList from "./parts/DocumentList/DocumentList";
import styles from "./Documents.module.scss";

type DocumentItem = {
  id: number;
  name: string;
  size: string;
  status: string;
  uploadDate: string;
};

const Documents = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  React.useEffect(() => {
    const savedDocuments = localStorage.getItem("documents");

    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProgress(0);
    setIsUploading(false);
  };



  const handleUpload = () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 10;

        if (nextProgress >= 100) {
          clearInterval(interval);

          const newDocument: DocumentItem = {
            id: Date.now(),
            name: selectedFile.name,
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
            status: "Uploaded",
            uploadDate: new Date().toLocaleDateString("en-IN"),
          };

          setDocuments((prev) => {
            const alreadyExists = prev.some(
              (document) => document.name === newDocument.name
            );

            if (alreadyExists) {
              return prev;
            }

            const updatedDocuments = [...prev, newDocument];

            localStorage.setItem(
              "documents",
              JSON.stringify(updatedDocuments)
            );

            return updatedDocuments;
          });

          setIsUploading(false);

          return 100;
        }

        return nextProgress;
      });
    }, 300);
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments((prev) => {
      const updatedDocuments = prev.filter(
        (document) => document.id !== id
      );

      localStorage.setItem(
        "documents",
        JSON.stringify(updatedDocuments)
      );

      return updatedDocuments;
    });
  };



  return (
    <main className={styles.documents}>

      <div className={styles.documentsHeader}>
        <h1>Documents</h1>
        <p>Manage company policy documents</p>
      </div>

      <DocumentUpload
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      {isUploading && selectedFile && (
        <UploadProgress
          file={selectedFile}
          progress={progress}
          isUploading={isUploading}
        />
      )}

      <DocumentList
        documents={documents}
        onDelete={handleDeleteDocument}
      />

    </main>
  );
};

export default Documents;