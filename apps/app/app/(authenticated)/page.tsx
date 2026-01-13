import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat");
}

/*
import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { AvatarStack } from "./components/avatar-stack";
import { Cursors } from "./components/cursors";
import { Header } from "./components/header";
*/

/*

const title = "Acme Inc";
const description = "My application.";

// ✅ Dynamically import the AI popup (Client Component)
const AiPopup = dynamic(() =>
  import("./components/ai-popup").then((mod) => mod.AiPopup)
);

const CollaborationProvider = dynamic(() =>
  import("./components/collaboration-provider").then(
    (mod) => mod.CollaborationProvider
  )
);

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const pages = await database.page.findMany();
  const { orgId, userId } = await auth();

  if (!(orgId && userId)) {
    notFound();
  }

  return (
    <>
      <Header page="Data Fetching" pages={["Building Your Application"]}>
        {env.LIVEBLOCKS_SECRET_KEY && (
          <CollaborationProvider orgId={orgId}>
            <AvatarStack />
            <Cursors />
          </CollaborationProvider>
        )}
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {pages.map((page) => (
            <div className="aspect-video rounded-xl bg-muted/50" key={page.id}>
              {page.name}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
      {env.LIVEBLOCKS_SECRET_KEY && <AiPopup userId={userId} />}
    </>
  );
};

export default App;

*/
