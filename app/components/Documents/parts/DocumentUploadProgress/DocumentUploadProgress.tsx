import React from "react";
import styles from "./DocumentUploadProgress.module.scss";

type UploadProgressProps = {
  file: File;
  progress: number;
  isUploading: boolean;
};

const UploadProgress: React.FC<UploadProgressProps> = ({
  file,
  progress,
  isUploading,
}) => {
  const getStatus = () => {
    if (progress === 100) {
      return "Upload complete";
    }

    if (isUploading) {
      return "Uploading...";
    }

    return "Ready to upload";
  };

  return (
    <section className={styles.progressSection}>
      <h2>Upload Progress</h2>

      <div className={styles.progressCard}>
        <div className={styles.fileInfo}>
          <div className={styles.fileName}>
            <span>📄</span>
            <span>{file.name}</span>
          </div>

          <span>{progress}%</span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className={styles.status}>
          {getStatus()}
        </span>
      </div>
    </section>
  );
};

export default UploadProgress;