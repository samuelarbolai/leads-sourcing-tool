"use client";

import { RegisterAiTool } from "@liveblocks/react";
import { AiChat } from "@liveblocks/react-ui";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  useAiChats,
  useCreateAiChat,
  useDeleteAiChat,
} from "@repo/collaboration/hooks";
import { useEffect, useState } from "react";
import "@liveblocks/react-ui/styles.css";
import { findLeadsTool } from "./tools/find-leads-tool";
//import { findLeadsTool } from "./tools/find-leads-tool";
import { testTool } from "./tools/test-tool";
import { todayDateTool } from "./tools/todayDate";

// Install WebSocket interceptor ONCE when module loads
/*
if (typeof window !== "undefined") {
  interceptWebSocket();
}
*/

function ContactsChatContent() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { chats } = useAiChats();
  const createChat = useCreateAiChat();
  const deleteChat = useDeleteAiChat();

  // Automatically select first chat when available
  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  // METHOD 3: Log tool definitions and component rendering
  useEffect(() => {
    console.group("🔧 TOOL REGISTRATION CHECK (Method 3)");
    console.log("testTool definition type:", typeof testTool);
    //console.log("findLeadsTool definition type:", typeof findLeadsTool);
    console.log("testTool object:", testTool);
    //console.log("findLeadsTool object:", findLeadsTool);
    console.log(
      "Current chatId (tools only render if this exists):",
      currentChatId
    );
    console.log("Will AiChat render?", !!currentChatId);
    console.log("Will RegisterAiTool components render?", !!currentChatId);
    console.groupEnd();
  }, [currentChatId]);

  // Check if RegisterAiTool components mount by logging from parent
  useEffect(() => {
    if (currentChatId) {
      console.log(
        "✅ AiChat should now be mounted with chatId:",
        currentChatId
      );
      console.log("📌 RegisterAiTool components should be children of AiChat");
    }
  }, [currentChatId]);

  const handleNewChat = () => {
    const chatId = `contacts-chat-${Date.now()}`;
    createChat({
      id: chatId,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });
    // Wait a bit for the chat to be created before selecting it
    setTimeout(() => {
      setCurrentChatId(chatId);
    }, 100);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0]?.id || null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Chat List Sidebar */}
      {isSidebarOpen ? (
        <div className="flex w-64 flex-col border-gray-200 border-r bg-gray-50">
          <div className="border-gray-200 border-b p-4">
            <button
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
              onClick={handleNewChat}
              type="button"
            >
              + New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                className={`flex w-full items-center justify-between border-gray-200 border-b p-3 transition-colors ${
                  currentChatId === chat.id
                    ? "border-l-4 border-l-blue-600 bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
                key={chat.id}
              >
                <button
                  className="flex-1 cursor-pointer text-left"
                  onClick={() => setCurrentChatId(chat.id)}
                  type="button"
                >
                  <span className="truncate text-gray-900 text-sm">
                    {chat.title || "Untitled Conversation"}
                  </span>
                </button>
                <button
                  aria-label="Delete conversation"
                  className="ml-2 text-gray-400 hover:text-red-600"
                  onClick={() => handleDeleteChat(chat.id)}
                  type="button"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Delete</title>
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Chat Interface */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center border-gray-200 border-b bg-gray-50 p-2">
          <button
            aria-label="Toggle sidebar"
            className="p-1 text-gray-600 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            type="button"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Toggle Sidebar</title>
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {currentChatId ? (
            <div className="flex-1 overflow-hidden">
              <RegisterAiTool name="test-tool" tool={testTool} />
              <RegisterAiTool name="today-date-tool" tool={todayDateTool} />
              <RegisterAiTool name="find-leads-tool" tool={findLeadsTool} />
              <AiChat
                chatId={currentChatId}
                copilotId="co_UZksd4JpAcg544I0NIBV5"
                layout="inset"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-gray-500">
                  Create a new conversation to start finding leads
                </p>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  onClick={handleNewChat}
                  type="button"
                >
                  New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <LiveblocksProvider authEndpoint="/api/collaboration/auth">
      <div className="flex h-screen flex-col">
        {/* Page Header */}
        <div className="border-gray-200 border-b bg-white px-6 py-4">
          <h1 className="font-bold text-2xl text-gray-900">Contacts</h1>
          <p className="mt-1 text-gray-600 text-sm">
            Chat with AI to find and filter leads. Ask for specific job titles,
            industries, or locations.
          </p>
        </div>

        {/* AI Chat Interface with Sessions */}
        <div className="flex-1 overflow-hidden">
          <ClientSideSuspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="text-gray-600">Loading AI assistant...</div>
              </div>
            }
          >
            <ContactsChatContent />
          </ClientSideSuspense>
        </div>

        {/* Future: Data Table Section */}
        {/* <div className="border-t border-gray-200 bg-gray-50 p-6">
          <LeadsDataTable />
        </div> */}
      </div>
    </LiveblocksProvider>
  );
}
