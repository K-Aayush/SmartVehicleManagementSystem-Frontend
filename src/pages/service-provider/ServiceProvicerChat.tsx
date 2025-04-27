import { useState } from "react";
import ChatList from "../../components/chat/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  role: string;
}

const ServiceProviderChat = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  return (
    <div className="container p-4 mx-auto">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ChatList
            role="USER"
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

export default ServiceProviderChat;
