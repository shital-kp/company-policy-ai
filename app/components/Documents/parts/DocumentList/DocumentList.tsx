import React from "react";
import { Trash2 } from "lucide-react";
import styles from "./DocumentList.module.scss";

type DocumentItem = {
  id: number;
  name: string;
  size: string;
  status: string;
  uploadDate: string;
};

type DocumentListProps = {
  documents: DocumentItem[];
  onDelete: (id: number) => void;
};

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
}) => {
  return (
    <section className={styles.documentList}>

      <div className={styles.listHeader}>
        <h2>Uploaded Documents</h2>

        <span>
          {documents.length}{" "}
          {documents.length === 1 ? "document" : "documents"}
        </span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Size</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={styles.emptyState}
                >
                  No documents uploaded yet.
                </td>
              </tr>
            ) : (
              documents.map((document) => (
                <tr key={document.id}>

                  <td className={styles.documentName}>
                    📄 {document.name}
                  </td>

                  <td>
                    {document.size}
                  </td>

                  <td>
                    {document.uploadDate}
                  </td>

                  <td>
                    <span className={styles.status}>
                      {document.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => onDelete(document.id)}
                      aria-label={`Delete ${document.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </section>
  );
};

export default DocumentList;