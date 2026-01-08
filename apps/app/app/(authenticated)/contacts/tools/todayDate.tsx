/**
 * Fetches and returns today's date
 * @param format - Optional format: 'locale' | 'iso' | 'readable' | 'short'
 * @returns Formatted date string
 */

//This usually makes the ide report that there is no ToolResultResponse type, but it work like this and I don't want to mess with it.
import { defineAiTool, ToolResultResponse } from "@repo/collaboration/hooks";

function getTodaysDate(format: 'locale' | 'iso' | 'readable' | 'short' = 'locale'): string {
  const today = new Date();
  
  switch (format) {
    case 'iso':
      // Returns: "2026-01-07T12:34:56.789Z"
      return today.toISOString();
    
    case 'readable':
      // Returns: "Wed Jan 07 2026"
      return today.toDateString();
    
    case 'short':
      // Returns: "2026-01-07"
      return today.toISOString().split('T')[0];
    
    case 'locale':
    default:
      // Returns: "1/7/2026" (or localized based on user's locale)
      return today.toLocaleDateString();
  }
}

/**
 * Returns a detailed date object with separate components
 */
function getTodaysDateDetails() {
  const today = new Date();
  
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1, // Months are 0-indexed, so add 1
    day: today.getDate(),
    dayOfWeek: today.toLocaleDateString('en-US', { weekday: 'long' }),
    formatted: today.toLocaleDateString()
  };
}

// Example usage (you can remove this in production):

/*
if (require.main === module) {
  console.log('Today\'s date (locale):', getTodaysDate());
  console.log('Today\'s date (ISO):', getTodaysDate('iso'));
  console.log('Today\'s date (readable):', getTodaysDate('readable'));
  console.log('Today\'s date (short):', getTodaysDate('short'));
  console.log('Date details:', getTodaysDateDetails());
}
*/

// Define the AI tool using the fetched date functions


export const todayDateTool = defineAiTool()({
  description: "Get today's date in various formats. No parameters needed - simply call this tool to get today's date.",
  parameters: {
    type: "object" as const,
    properties: {},
    required: [],
  },
  execute: async (): Promise<ToolResultResponse> => {
    const date = getTodaysDate('readable');
    const details = getTodaysDateDetails();
    return { data: { date, details } };
  },
});