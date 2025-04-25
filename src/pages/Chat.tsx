import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  role: string;
  companyName?: string;
}

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const userId = searchParams.get("userId");
  const role = searchParams.get("role") || "VENDOR";

  return (
    <div className="container p-4 mx-auto">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ChatList
            role={role}
            onSelectUser={setSelectedUser}
            selectedUserId={selectedUser?.id}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedUser ? (
            <ChatWindow
              receiverId={selectedUser.id}
              receiverName={selectedUser.name}
              receiverImage={selectedUser.profileImage}
            />
          ) : (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
