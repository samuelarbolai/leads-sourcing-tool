"use server";

import { database, Prisma } from "@repo/database";
import type { Prospect } from "./types";
import { convertProspectsToCSV } from "./utils";

export type SearchFilters = {
  name?: string;
  company?: string;
  role?: string;
  limit?: number | 40000;
};

export const queryProspects = async (
  filters: SearchFilters = {}
): Promise<{
  data: { success: boolean; csv: string; totalMatches: number };
}> => {
  const { name, company, role, limit } = filters;
  const safetyLimit = Math.floor(Number(limit || 40000));
  const offset = 0;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Build conditions array
    const conditions: Prisma.Sql[] = [];
    
    if (name) {
      conditions.push(Prisma.sql`name ~* ${name}`);
    }
    if (company) {
      conditions.push(Prisma.sql`organization ~* ${company}`);
    }
    if (role) {
      conditions.push(Prisma.sql`role_title ~* ${role}`);
    }

    // Build WHERE clause
    const whereCondition = conditions.length > 0
      ? Prisma.join(conditions, ' AND ')
      : Prisma.sql`1=1`;

    // Build complete queries
    const selectQuery = Prisma.sql`
      SELECT * FROM "prospects"
      WHERE ${whereCondition}
      ORDER BY created_at DESC
      LIMIT ${safetyLimit}
      OFFSET ${offset}
    `;

    const countQuery = Prisma.sql`
      SELECT COUNT(*) FROM "prospects"
      WHERE ${whereCondition}
    `;

    // Execute both queries (no tagged templates, pass Prisma.Sql directly)
    const [matches, totalCountResult] = await Promise.all([
      database.$queryRaw<Prospect[]>(selectQuery),
      database.$queryRaw<{ count: bigint }[]>(countQuery),
    ]);

    const totalMatches = Number(totalCountResult[0].count);
    const csv = convertProspectsToCSV(matches);

    return {
      data: {
        success: true,
        csv,
        totalMatches,
      },
    };
  } catch (error) {
    console.error("Database Search Error:", error);
    throw new Error("Failed to query prospects database.");
  }
};