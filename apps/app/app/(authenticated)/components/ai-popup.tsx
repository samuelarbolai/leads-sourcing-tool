"use client";

import {
  useAiChats,
  useCreateAiChat,
  useDeleteAiChat,
} from "@liveblocks/react/suspense";
import { AiChat } from "@liveblocks/react-ui";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@repo/collaboration/hooks";
import { useEffect, useState } from "react";
import "@liveblocks/react-ui/styles.css";

type AiPopupProps = {
  userId: string;
};

function AiChatContent() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { chats } = useAiChats();
  const createChat = useCreateAiChat();
  const deleteChat = useDeleteAiChat();

  // Automatically select first chat when available
  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  const handleNewChat = () => {
    const chatId = `chat-${Date.now()}`;
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
              + New Chat
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
                    {chat.title || "Untitled Chat"}
                  </span>
                </button>
                <button
                  aria-label="Delete chat"
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

        <div className="flex-1">
          {currentChatId ? (
            <AiChat
              chatId={currentChatId}
              copilotId="co_UZksd4JpAcg544I0NIBV5"
              layout="compact"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-gray-500">
                  Create a new chat to get started
                </p>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  onClick={handleNewChat}
                  type="button"
                >
                  New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const AiPopup = (_props: AiPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LiveblocksProvider authEndpoint="/api/collaboration/auth">
      {/* Floating button to toggle chat */}
      <button
        aria-label="Toggle AI Assistant"
        className="fixed right-6 bottom-6 z-50 rounded-full bg-blue-600 p-4 text-white shadow-lg transition-colors hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>AI Chat</title>
          <path
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* AI Chat Popup */}
      {isOpen ? (
        <div className="fixed right-6 bottom-24 z-50 h-[600px] w-[900px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-gray-200 border-b bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <button
              aria-label="Close chat"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
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
                <title>Close</title>
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* AI Chat Component with Suspense */}
          <div className="h-[calc(100%-64px)]">
            <ClientSideSuspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  Loading...
                </div>
              }
            >
              <AiChatContent />
            </ClientSideSuspense>
          </div>
        </div>
      ) : null}
    </LiveblocksProvider>
  );
};
