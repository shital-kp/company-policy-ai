"use client";

import React, { useEffect, useState } from "react";
import DocumentUpload from "./parts/DocumentUpload/DocumentUpload";
import UploadProgress from "./parts/DocumentUploadProgress/DocumentUploadProgress";
import DocumentList from "./parts/DocumentList/DocumentList";
import styles from "./Documents.module.scss";

type DocumentItem = {
  id: string;
  name: string;
  size: string;
  status: string;
  uploadDate: string;
};

const Documents = () => {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [progress, setProgress] = useState(0);

  const [isUploading, setIsUploading] =
    useState(false);

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  // Load documents from database
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetch("/api/documents");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load documents"
          );
        }

        const formattedDocuments: DocumentItem[] =
          data.documents.map((document: any) => ({
            id: document.id,
            name: document.fileName,
            size: `${(
              document.fileSize /
              (1024 * 1024)
            ).toFixed(2)} MB`,
            status: document.status,
            uploadDate: new Date(
              document.createdAt
            ).toLocaleDateString("en-IN"),
          }));

        setDocuments(formattedDocuments);
      } catch (error) {
        console.error(
          "Failed to load documents:",
          error
        );
      }
    };

    loadDocuments();
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProgress(0);
    setIsUploading(false);
  };

  // Upload document
  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    // Prevent duplicate upload
    const duplicateDocument = documents.some(
      (document) =>
        document.name ===
        selectedFile.name
    );

    console.log('duplicateDocument', duplicateDocument);

    if (duplicateDocument) {
      alert(
        "This document has already been uploaded."
      );
      return;
    }

    try {
      setIsUploading(true);
      setProgress(10);

      const formData = new FormData();
      formData.append("file", selectedFile);

      setProgress(30);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      setProgress(70);

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      const uploadedDocument: DocumentItem = {
        id: data.document.id,
        name: data.document.fileName,
        size: `${(
          data.document.fileSize /
          (1024 * 1024)
        ).toFixed(2)} MB`,
        status: data.document.status,
        uploadDate: new Date(
          data.document.createdAt
        ).toLocaleDateString("en-IN"),
      };

      // Add uploaded document to list
      setDocuments((prev) => [
        uploadedDocument,
        ...prev,
      ]);

      setProgress(100);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete document from database
  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(
        `/api/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete document"
        );
      }

      // Remove from UI only after database deletion succeeds
      setDocuments((prev) =>
        prev.filter(
          (document) => document.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete document error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete document"
      );
    }
  };

  return (
    <main className={styles.documents}>
      <div className={styles.documentsHeader}>
        <h1>Documents</h1>

        <p>
          Manage company policy documents
        </p>
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