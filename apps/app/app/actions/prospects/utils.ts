import type { Prospect } from "./search";

/**
 * Convert an array of prospects to CSV format
 * @param prospects - Array of prospect objects
 * @returns CSV string with header and data rows
 */
export const convertProspectsToCSV = (prospects: Prospect[]): string => {
	if (prospects.length === 0) {
		return "";
	}

	// Define CSV headers
	const headers = [
		"Name",
		"Organization",
		"Role Title",
		"Priority",
		"Enrichment Status",
		"LinkedIn Status",
		"Domain Status",
		"Outreach Ready",
		"Lists",
		"Created At",
	];

	// Convert each prospect to a CSV row
	const rows = prospects.map((prospect) => {
		const fields = [
			prospect.name || "",
			prospect.organization || "",
			prospect.role_title || "",
			prospect.priority_bucket || "",
			prospect.enrichment?.status || "pending",
			prospect.enrichment?.linkedin_status || "pending",
			prospect.enrichment?.domain_status || "pending",
			prospect.outreach?.ready ? "Yes" : "No",
			prospect.list_ids?.join("; ") || "",
			prospect.created_at || "",
		];

		// Escape fields that contain commas, quotes, or newlines
		return fields
			.map((field) => {
				const stringField = String(field);
				// If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
				if (
					stringField.includes(",") ||
					stringField.includes('"') ||
					stringField.includes("\n")
				) {
					return `"${stringField.replace(/"/g, '""')}"`;
				}
				return stringField;
			})
			.join(",");
	});

	// Combine headers and rows
	return [headers.join(","), ...rows].join("\n");
};
