import type { Prospect } from "./types";

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
  ];

  // Helper to safely parse JSON fields that might be strings or arrays
  const parseJsonField = (field: any): string => {
    if (!field) return "";
    if (Array.isArray(field)) return field.join("; ");
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed.join("; ") : String(parsed);
      } catch {
        return field;
      }
    }
    return String(field);
  };

  // Convert each prospect to a CSV row
  const rows = prospects.map((prospect) => {
    const fields = [
      prospect.name || "",
      prospect.organization || "",
      prospect.role_title || "",
      // prospect.priority_bucket || "",
      // parseJsonField(prospect.social),
      // parseJsonField(prospect.list_ids),
      // prospect.created_at || "",
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