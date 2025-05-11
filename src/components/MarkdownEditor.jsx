import React, { useState, useRef } from "react";
import { marked } from "marked";
import html2pdf from "html2pdf.js";
import "../App.css";

const MarkdownEditor = () => {
	const [editorContent, setEditorContent] = useState(`# Welcome!`);
	const [copyStatus, setCopyStatus] = useState("");

	const previewContainerRef = useRef(null);

	const handleTextCopy = () => {
		if (!previewContainerRef.current) return;

		try {
			const htmlContent = previewContainerRef.current.innerHTML;

			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = htmlContent;

			const textarea = document.createElement("textarea");
			textarea.value = tempDiv.innerHTML;

			textarea.style.position = "fixed";
			textarea.style.opacity = 0;

			document.body.appendChild(textarea);

			textarea.select();

			document.execCommand("copy");

			document.body.removeChild(textarea);

			setCopyStatus("Copied successfully!");
			setTimeout(() => setCopyStatus(""), 2000);
		} catch (error) {
			console.error("Copy failed:", error);
			setCopyStatus("Failed to copy. Please try again.");
			setTimeout(() => setCopyStatus(""), 2000);
		}
	};

	const handleDownloadPDF = () => {
		if (previewContainerRef.current) {
			const clonedContent = previewContainerRef.current.cloneNode(true);
			clonedContent.style.backgroundColor = "#f8f8f8";
			clonedContent.style.color = "#333";
			clonedContent.style.padding = "1rem";
			clonedContent.style.width = "100%";

			html2pdf()
				.set({
					margin: 0.5,
					filename: "document.pdf",
					html2canvas: { scale: 2 },
					jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
				})
				.from(clonedContent)
				.save();
		}
	};

	const renderedHtml = marked.parse(editorContent, { breaks: true });

	return (
		<>
			<div className="editor-wrapper">
				<h1 className="title">Markdown Editor:</h1>
				<div className="editor-container">
					<textarea
						className="editor-textarea"
						value={editorContent}
						onChange={(e) => setEditorContent(e.target.value)}
					/>
					<div className="preview-section">
						<div ref={previewContainerRef} className="preview-container">
							<div
								className="preview-content"
								dangerouslySetInnerHTML={{ __html: renderedHtml }}
							/>
						</div>
						<div className="button-container">
							<button onClick={handleTextCopy} className="button copy-button">
								{copyStatus || "Copy HTML"}
							</button>
							<button
								onClick={handleDownloadPDF}
								className="button export-button"
							>
								Export
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MarkdownEditor;
