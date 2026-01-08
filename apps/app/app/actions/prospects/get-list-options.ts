"use server";

const PROSPECT_API_BASE_URL =
	process.env.PROSPECT_API_URL ||
	"https://prospect-api-633098049477.us-central1.run.app";

/**
 * Get available list IDs from the Prospect API
 * This helps the AI understand what list filters are available
 * @returns Array of list ID options or error
 */
export const getListOptions = async (): Promise<
	| {
			success: true;
			options: string[];
	  }
	| {
			success: false;
			error: string;
	  }
> => {
	try {
		const url = `${PROSPECT_API_BASE_URL}/api/list-options`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			// Cache for 5 minutes since list options don't change frequently
			next: { revalidate: 300 },
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				success: false,
				error: `API error: ${response.status} - ${errorText}`,
			};
		}

		const result: { options: string[] } = await response.json();

		return {
			success: true,
			options: result.options,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
