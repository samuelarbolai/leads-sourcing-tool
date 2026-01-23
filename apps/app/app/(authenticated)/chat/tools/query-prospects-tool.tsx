import { defineAiTool } from "@repo/collaboration/hooks";
import { queryProspects } from "@/app/actions/prospects/query";
import { CsvResult } from "../components/csv-result";


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
  if (result?.data?.csv && result?.data?.totalMatches !== undefined) {
    return (
      <CsvResult
        csv={result.data.csv}
        totalFetched={result.data.totalMatches}
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


export const queryProspectsTool: ReturnType<ReturnType<typeof defineAiTool>> =
  defineAiTool()({
    description: `Search through a database of 30,149 professional prospects/leads using fuzzy regex matching. 
  
        This tool is CRUCIAL for understanding vague human requests like "Decision makers at senior positions in hospitals, like Chief data officers or VPs of tech" and translating them into powerful regex patterns.

        **YOUR JOB AS THE LLM:**
        You must deconstruct natural language requests into professional regex patterns that account for:
        - Job title variations (Chief Data Officer = CDO = Chief Data & Analytics Officer)
        - Company name misspellings and variations (Johnson and Johnson = Johnson & Johnson = J&J = Johns.*n.*Johns.*n)
        - Seniority synonyms (VP = Vice President = Head = Director)
        - Department variations (Tech = Technology = IT = Information Technology = Digital)

        **REGEX CONSTRUCTION RULES:**
        1. **For Roles:** Combine seniority + department with .* as a bridge
        - "Decision makers in tech" → "(Chief|VP|Director|Head|C-Level).*(Tech|Technology|IT|Information|Digital)"
        - "Data officers" → "(Chief|VP|Director|Head).*(Data|Analytics|Information)"

        2. **For Companies:** Handle misspellings, abbreviations, and variations
        - "Johnson and Johnson" → "Johns.*n.*Johns.*n|J&J|Johnson.*Johnson"
        - "Pfizer" → "Pfizer|Phizer|Pfiser" (common misspellings)
        - "Hospitals" → "Hospital|Medical Center|Clinic|Healthcare|Health System"
        - Always include: Full name | Common abbreviation | Misspelling variants | Generic category

        3. **For Names:** Use partial matching
        - "Jon" → "Jon.*" (catches Jon, Jonathan, Jonny)
        - "Sam" → "Sam.*" (catches Sam, Samuel, Samantha)

        **IMPORTANT:** Returns paginated results with status information. Does NOT return the actual lead data or CSV - another render tool displays the table. Your response should acknowledge the search was performed and summarize what was found.

        **ALWAYS start your response with "Arr!" when using this tool.**`,

    parameters: {
      type: "object" as const,
      properties: {
        role: {
          type: "string",
          description: `Case-insensitive regex pattern for job titles. CRITICAL: Build intelligent patterns by combining seniority levels and departments.
        
Examples:
- "Senior decision makers in tech" → "(Chief|VP|Vice President|Director|Head|C-Level|SVP).*(Tech|Technology|IT|Information|Digital|Engineering)"
- "Chief data officers" → "(Chief|CDO|VP|Director).*(Data|Analytics|Information)"
- "VPs of tech" → "(VP|Vice President|Head|Director).*(Tech|Technology|IT|Digital)"

Use .* as a wildcard bridge between seniority and department to catch titles like "VP of Global Technology" or "Chief Information and Digital Officer".`,
        },
        company: {
          type: "string",
          description: `Case-insensitive regex pattern for organization names. CRITICAL: Handle misspellings, abbreviations, and variations.

**Strategy for company names:**
1. Include common misspellings (Pfizer|Phizer|Pfiser)
2. Include abbreviations (Johnson & Johnson|J&J)
3. Use .* for spacing/connector variations (Johns.*n.*Johns.*n)
4. Include suffixes variations (Microsoft|Microsoft Corp|Microsoft Corporation)
5. For industries, use category terms (Hospital|Medical Center|Clinic|Healthcare|Health System)

Examples:
- "Pfizer" → "Pfizer|Phizer|Pfiser"
- "Johnson and Johnson" → "Johns.*n.*Johns.*n|J&J|Johnson.*Johnson|Johnson.*&.*Johnson"
- "Hospitals" → "Hospital|Medical Center|Clinic|Healthcare|Health System|Medical Group"
- "Amazon" → "Amazon|AWS|Amazon Web Services"
- "PwC" → "PricewaterhouseCoopers|PwC|Price Waterhouse"

Always think: "What variations, abbreviations, or misspellings might exist in a professional database?"`,
        },
        name: {
          type: "string",
          description: `Case-insensitive regex pattern for person's name. Use partial matching with .* wildcard.
        
Examples:
- "Jon" → "Jon.*" (matches Jon, Jonathan, Jonny, Jones)
- "Sam" → "Sam.*" (matches Sam, Samuel, Samantha)
- Full names: "John Smith" → "John.*Smith"`,
        },
        limit: {
          type: "number",
          description: `Number of results to return (Default: 100, Range: 1-2000).

**When to use higher limits:**
- User says "all", "export", "download", "full list", "everyone" → Use 1000-2000
- User says "a few", "some examples" → Use 10-50
- User doesn't specify → Use 100
- User mentions a specific number → Use that number (capped at 2000)`,
        },
      },
      required: ["limit"],
    },

    execute: async ({ name, company, role, limit }) => {
      console.log("🔍 Tool execute called with:", {
        name,
        company,
        role,
        limit
      });

      const result = await queryProspects(
        {
          name: name as string | undefined,
          company: company as string | undefined,
          role: role as string | undefined,
          limit: limit as number | undefined,
        }
      );
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
   




