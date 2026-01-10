import { defineAiTool } from "@repo/collaboration/hooks";
import { searchProspectsAsCSV } from "@/app/actions/prospects/search";
import { CsvResult } from "../components/csv-result";

async function findLeads(
  count: number,
  search?: string,
  priorities?: string[],
  listIds?: string[]
) {
  try {
    // Simulate a delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🔍 About to call searchProspectsAsCSV");
    const result = await searchProspectsAsCSV(
      {
        pageSize: count,
        search,
        priorities,
        listIds,
      },
      count
    );

    console.log("🔍 searchProspectsAsCSV result:", result);

    if (!result.success) {
      return {
        error: result.error || "Failed to fetch prospects",
      };
    }

    return {
      data: {
        csv: result.csv,
        totalFetched: result.totalFetched,
      },
    };
  } catch (error) {
    console.error("🔍 Tool execution error:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

function csvBlock(result: any) {
  // Check if there's an error
  if (result?.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-900">
        ❌ Error: {result.error}
      </div>
    );
  }

  // Check if we have data with csv and totalFetched
  if (result?.data?.csv && result?.data?.totalFetched !== undefined) {
    return (
      <CsvResult
        csv={result.data.csv}
        totalFetched={result.data.totalFetched}
      />
    );
  }

  // Fallback for unexpected result structure
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700">
      No results found
    </div>
  );
}

export const findLeadsTool: ReturnType<ReturnType<typeof defineAiTool>> =
  defineAiTool()({
    description:
      'Search for contact leads based on criteria and return status of results, but don\'t return the actual list of leads or CSV data, as we have another render tool showing a table with all results. Use this when the user asks to find contacts, leads, or specific job titles/roles. Please always say "Arr!" at the beginning of the reply.',

    parameters: {
      type: "object" as const,
      properties: {
        count: {
          type: "number",
          description:
            "Number of leads to find (default: 10, max: 200). If user doesn't specify, use 10.",
        },
        search: {
          type: "string",
          description:
            "Search query for name, organization, or role. Extract from user's query.",
        },
        priorities: {
          type: "array",
          items: { type: "string" },
          description:
            "Priority levels to filter (e.g., ['P1', 'P2']). Extract from user's query if mentioned.",
        },
        listIds: {
          type: "array",
          items: { type: "string" },
          description:
            "List IDs to filter (e.g., ['enrichment_queue']). Extract from user's query if mentioned.",
        },
      },
      required: ["count"],
    },

    execute: async ({ count, search, priorities, listIds }) => {
      console.log("🔍 Tool execute called with:", {
        count,
        search,
        priorities,
        listIds,
      });

      const result = await findLeads(count, search, priorities, listIds);
      console.log("🔍 Tool execute result:", result);
      return result;
    },
    render: ({ stage, result }) => {
      if (stage !== "executed") {
        return <div>Loading...</div>;
      }
      return csvBlock(result);
    },
  });
