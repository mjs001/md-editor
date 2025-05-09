import React, { useState, useRef } from "react";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

const MarkdownEditor = () => {
	const [editorContent, setEditorContent] = useState(`# Welcome!`);

	const previewContainerRef = useRef(null);

	const handleTextCopy = () => {
		if (previewContainerRef.current) {
			const htmlContent = previewContainerRef.current.innerHTML;
			navigator.clipboard
				.writeText(htmlContent)
				.then(() => {
					alert("Copied!");
				})
				.catch((err) => {
					alert("Failed to copy HTML content.");
				});
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
		<div
			style={{
				display: "flex",
				height: "100vh",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<textarea
				value={editorContent}
				onChange={(e) => setEditorContent(e.target.value)}
				style={{
					width: "50%",
					padding: "20px",
					backgroundColor: "#ffffff",
					color: "#000000",
					fontSize: "1rem",
					border: "none",
					borderRight: "3px solid #dcdcdc",
					outline: "none",
					resize: "none",
				}}
			/>
			<div
				style={{ width: "50%", backgroundColor: "#f8f8f8", padding: "2rem" }}
			>
				<div
					ref={previewContainerRef}
					dangerouslySetInnerHTML={{ __html: renderedHtml }}
					style={{ color: "#333", fontSize: "1.1rem", lineHeight: "1.75" }}
				/>
				<div
					style={{
						marginTop: "1.5rem",
						display: "flex",
						justifyContent: "center",
						gap: "1.2rem",
					}}
				>
					<button
						onClick={handleTextCopy}
						style={{
							background: "#444",
							color: "#fff",
							padding: "8px 16px",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						}}
					>
						Copy HTML
					</button>
					<button
						onClick={handleDownloadPDF}
						style={{
							background: "#28a745",
							color: "#fff",
							padding: "8px 16px",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						}}
					>
						Export
					</button>
				</div>
			</div>
		</div>
	);
};

export default MarkdownEditor;
