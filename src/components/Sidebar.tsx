import React from "react";

interface SidebarProps {
  chats: { id: string; title: string }[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, currentChatId, onSelectChat, onNewChat }) => {
  return (
    <aside className="w-64 bg-black/80 border-r border-cyan-700 h-full flex flex-col">
      <div className="p-4 border-b border-cyan-700 flex items-center justify-between">
        <span className="text-cyan-300 font-bold text-lg">Chats</span>
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition"
          onClick={onNewChat}
        >
          + New
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="text-cyan-400 p-4 text-center">No chats yet</div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              className={`w-full text-left px-4 py-3 border-b border-cyan-900 transition-colors duration-150 focus:outline-none ${
                chat.id === currentChatId ? "bg-cyan-900 text-cyan-200" : "hover:bg-cyan-950 text-cyan-400"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </button>
          ))
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
