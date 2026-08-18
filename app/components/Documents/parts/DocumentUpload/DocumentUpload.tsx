"use client";

import React from "react";
import styles from "./DocumentUpload.module.scss";

type DocumentUploadProps = {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  isUploading: boolean;
};

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  selectedFile,
  onFileSelect,
  onUpload,
  isUploading
}) => {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);
  };

  return (
    <section className={styles.uploadSection}>
      <h2>Upload Documents</h2>

      <div className={styles.uploadBox}>
        <p>Drag & drop your document here</p>

        <span>or</span>

        <label className={styles.chooseButton}>
          Choose File

          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            onChange={handleFileChange}
          />
        </label>

        {selectedFile && (
          <div className={styles.selectedFile}>
            <span>📄</span>
            <span>{selectedFile.name}</span>
          </div>
        )}

        {selectedFile && (
          <button
            type="button"
            className={styles.uploadButton}
            onClick={onUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}

        <small>
          Supported formats: PDF, DOC, DOCX
        </small>
      </div>
    </section>
  );
};

export default DocumentUpload;