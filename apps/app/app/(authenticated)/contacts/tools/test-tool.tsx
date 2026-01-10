import { defineAiTool } from "@repo/collaboration/hooks";

export const testTool: ReturnType<ReturnType<typeof defineAiTool>> =
  defineAiTool()({
    description:
      "A simple test tool that returns a greeting. Use this when the user asks to test the tool system. If the output of the tool is the name, report success.",
    parameters: {
      type: "object" as const,
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
    execute: async ({ name }) => {
      await console.log("🧪 TEST TOOL: Execute function called!");
      await console.log("🧪 TEST TOOL: Received name:", name);
      await console.log("🧪 TEST TOOL: Returning greeting");

      return { data: { name } };
    },
  });
