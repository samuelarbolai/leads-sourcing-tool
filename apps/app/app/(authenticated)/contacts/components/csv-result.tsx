"use client";

import { useState } from "react";

type CsvResultProps = {
	csv: string;
	totalFetched: number;
};

export function CsvResult({ csv, totalFetched }: CsvResultProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(csv);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = () => {
		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};

	// Parse CSV to show preview
	const lines = csv.split("\n");
	const headers = lines[0]?.split(",") || [];
	const previewRows = lines.slice(1, 6); // Show first 5 rows

	return (
		<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<svg
							className="h-5 w-5 text-green-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Success</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="font-medium text-gray-900 text-sm">
							Found {totalFetched} leads
						</span>
					</div>
					<div className="flex gap-2">
						<button
							onClick={handleCopy}
							className="rounded-md bg-white px-3 py-1.5 text-gray-700 text-sm ring-1 ring-gray-300 ring-inset transition-colors hover:bg-gray-50"
							type="button"
						>
							{copied ? "✓ Copied" : "Copy CSV"}
						</button>
						<button
							onClick={handleDownload}
							className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
							type="button"
						>
							Download CSV
						</button>
					</div>
				</div>
			</div>

			<div className="p-4">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-gray-200">
								{headers.map((header, i) => (
									<th
										key={i}
										className="px-3 py-2 font-medium text-gray-900"
									>
										{header.replace(/"/g, "")}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{previewRows.map((row, i) => {
								if (!row.trim()) return null;
								const cells = row.split(",");
								return (
									<tr key={i} className="border-b border-gray-100">
										{cells.map((cell, j) => (
											<td key={j} className="px-3 py-2 text-gray-700">
												{cell.replace(/"/g, "")}
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{lines.length > 6 && (
					<p className="mt-3 text-gray-500 text-sm">
						... and {lines.length - 6} more rows
					</p>
				)}
			</div>
		</div>
	);
}
