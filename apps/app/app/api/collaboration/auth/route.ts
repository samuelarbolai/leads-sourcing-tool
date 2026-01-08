import { auth, currentUser } from "@repo/auth/server";
import { authenticate } from "@repo/collaboration/auth";

const COLORS = [
  "var(--color-red-500)",
  "var(--color-orange-500)",
  "var(--color-amber-500)",
  "var(--color-yellow-500)",
  "var(--color-lime-500)",
  "var(--color-green-500)",
  "var(--color-emerald-500)",
  "var(--color-teal-500)",
  "var(--color-cyan-500)",
  "var(--color-sky-500)",
  "var(--color-blue-500)",
  "var(--color-indigo-500)",
  "var(--color-violet-500)",
  "var(--color-purple-500)",
  "var(--color-fuchsia-500)",
  "var(--color-pink-500)",
  "var(--color-rose-500)",
];

export const POST = async () => {
  const startTime = Date.now();
  console.log('🔐 [Liveblocks Auth] POST request received at', new Date().toISOString());

  try {
    console.log('🔐 [Liveblocks Auth] Fetching current user from Clerk...');
    const user = await currentUser();
    console.log('🔐 [Liveblocks Auth] User fetched:', user?.id ? `User ID: ${user.id}` : 'No user');

    console.log('🔐 [Liveblocks Auth] Fetching auth context from Clerk...');
    const { orgId } = await auth();
    console.log('🔐 [Liveblocks Auth] Org ID:', orgId || 'No org');

    if (!(user && orgId)) {
      console.error('🔐 [Liveblocks Auth] Unauthorized - missing user or orgId');
      return new Response("Unauthorized", { status: 401 });
    }

    console.log('🔐 [Liveblocks Auth] Calling authenticate with userId:', user.id, 'orgId:', orgId);
    const response = await authenticate({
      userId: user.id,
      orgId,
      userInfo: {
        name:
          user.fullName ?? user.emailAddresses.at(0)?.emailAddress ?? undefined,
        avatar: user.imageUrl ?? undefined,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    });

    const duration = Date.now() - startTime;
    console.log(`🔐 [Liveblocks Auth] Authentication successful in ${duration}ms`);
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`🔐 [Liveblocks Auth] Error after ${duration}ms:`, error);
    throw error;
  }
};
