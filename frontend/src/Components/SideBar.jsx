import React, { useState } from "react";
import { MessageSquare, Settings, X } from "lucide-react";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = ({ chats, chatNumber, setNewChatNumber, startNewChat }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (!isOpen) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <MenuIcon onClick={toggleSidebar} className="text-white rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen w-fit z-[999] top-0 absolute bg-[#1f1f1f] text-white flex flex-col justify-between ">
      {/* Top Section */}
      <div style={{ padding: "1rem", marginBottom: "1rem" }}>
        <div
          className="flex justify-between rounded-lg gap-[6vh] items-center bg-[#424242] "
          style={{
            marginBottom: "1vh",
            padding: "1vh",
          }}
        >
          <h1 className="text-3xl font-bold tracking-wide">Menu</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white"
            title="Close"
          >
            <X size={29} />
          </button>
        </div>
        
      </div>
      {/* New Chat */}
      <div className="h-full top-0 bg-[#1f1f1f] "style={{ padding: "2vh" }} >
        <div
          className="flex items-center cursor-pointer bg-[#424242] hover:bg-gray-800 rounded-2xl transition-colors mb-4"
          style={{ padding: "1vh", marginBottom: "1rem" }}
          onClick={startNewChat}
        >
          <MessageSquare className="mr-3" size={22} />
          <span className="text-sm font-medium">New Chat</span>
        </div>

        {/* All Chats */}
        <h2
          className="text-sm uppercase tracking-wide text-gray-400 mb-2"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          All Chats
        </h2>
        <div className="space-y-2 min-h-104  overflow-y-auto pr-2">
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`cursor-pointer ${
                index === chatNumber ? "bg-[#6E6E6E]" : "bg-[#424242]"
              } hover:bg-gray-800 rounded-lg transition-colors text-sm`}
              style={{ padding: "0.6rem 0.75rem", marginBottom: "1rem" }}
              onClick={() => setNewChatNumber(chat.id)}
            >
              {chat.title.length > 30
                ? `${chat.title.substring(0, 30)}...`
                : chat.title || `Chat ${index + 1}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
