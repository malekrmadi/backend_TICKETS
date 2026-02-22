import { useState, useRef } from "react";

export default function UploadPage({ onSubmit, error }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onSubmit(file);
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="upload-header">
          <span className="upload-icon">🎫</span>
          <h1>Tickets Assistant</h1>
          <p className="upload-subtitle">
            Importez votre fichier Excel pour analyser et prioriser les tickets de votre équipe.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleChange}
              style={{ display: "none" }}
            />
            {file ? (
              <div className="file-selected">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <div className="drop-hint">
                <span className="drop-icon">📂</span>
                <p>Glissez votre fichier Excel ici</p>
                <span className="drop-or">ou cliquez pour parcourir</span>
              </div>
            )}
          </div>

          {error && (
            <div className="upload-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!file}
          >
            Analyser les tickets →
          </button>
        </form>
      </div>
    </div>
  );
}
