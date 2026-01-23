"use server";

import { convertProspectsToCSV } from "./utils";

const PROSPECT_API_BASE_URL =
  process.env.PROSPECT_API_URL ||
  "https://prospect-api-633098049477.us-central1.run.app";

export type ProspectSearchParams = {
  pageSize?: number;
  pageToken?: string;
  listIds?: string[];
  priorities?: string[];
  statuses?: string[];
  search?: string;
};

export type EnrichmentStatus = {
  status: "pending" | "queued" | "in_progress" | "completed" | "failed";
  linkedin_status?: string;
  domain_status?: string;
  linkedin_run_id?: string;
  domain_run_id?: string;
  linkedin_queue_timestamp?: string;
  domain_queue_timestamp?: string;
  linkedin_updated_at?: string;
  domain_updated_at?: string;
};

export type OutreachStatus = {
  ready: boolean;
  ready_at?: string;
  updated_at?: string;
};

export type Prospect = {
  id: string;
  name: string;
  organization: string;
  role_title: string;
  priority_bucket?: string;
  list_ids?: string[];
  batch_id?: string;
  enrichment?: EnrichmentStatus;
  outreach?: OutreachStatus;
  created_at?: string;
  updated_at?: string;
};

export type ProspectSearchResponse = {
  data: Prospect[];
  nextPageToken?: string;
};

/**
 * Search prospects using the Prospect Pipeline API
 * @param params Search parameters including filters and pagination
 * @returns Prospects matching the search criteria or error
 */
export const searchProspects = async (
  params: ProspectSearchParams = {}
): Promise<
  | {
      success: true;
      data: Prospect[];
      nextPageToken?: string;
      totalFetched: number;
    }
  | {
      success: false;
      error: string;
    }
> => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();

    if (params.pageSize) {
      queryParams.append("pageSize", params.pageSize.toString());
    }

    if (params.pageToken) {
      queryParams.append("pageToken", params.pageToken);
    }

    if (params.listIds && params.listIds.length > 0) {
      queryParams.append("listIds", params.listIds.join(","));
    }

    if (params.priorities && params.priorities.length > 0) {
      queryParams.append("priorities", params.priorities.join(","));
    }

    if (params.statuses && params.statuses.length > 0) {
      queryParams.append("statuses", params.statuses.join(","));
    }

    if (params.search) {
      queryParams.append("search", params.search);
    }

    const url = `${PROSPECT_API_BASE_URL}/api/prospects?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache prospect data
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    const result: ProspectSearchResponse = await response.json();

    return {
      success: true,
      data: result.data,
      nextPageToken: result.nextPageToken,
      totalFetched: result.data.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Search prospects and return as CSV
 * @param params Search parameters
 * @param maxResults Maximum number of results to fetch (uses pagination)
 * @returns CSV string or error
 */
export const searchProspectsAsCSV = async (
  params: ProspectSearchParams = {},
  maxResults = 100
): Promise<
  | {
      success: true;
      csv: string;
      totalFetched: number;
    }
  | {
      success: false;
      error: string;
    }
> => {
  try {
    const allProspects: Prospect[] = [];
    let pageToken: string | undefined;
    const pageSize = Math.min(params.pageSize || 50, 1000);

    // Fetch pages until we have enough results or no more pages
    while (allProspects.length < maxResults) {
      const result = await searchProspects({
        ...params,
        pageSize,
        pageToken,
      });

      if (!result.success) {
        return result;
      }

      allProspects.push(...result.data);

      // Check if there's a next page
      if (!result.nextPageToken || result.data.length === 0) {
        break;
      }

      pageToken = result.nextPageToken;

      // Stop if we've exceeded maxResults
      if (allProspects.length >= maxResults) {
        break;
      }
    }

    // Trim to maxResults if needed
    const prospects = allProspects.slice(0, maxResults);

    // Convert to CSV
    const csv = convertProspectsToCSV(prospects);

    return {
      success: true,
      csv,
      totalFetched: prospects.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
