import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "../../components/chat/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  role: string;
  companyName?: string;
}

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      return {
        id: userId,
        name: searchParams.get("userName") || "User",
        profileImage: searchParams.get("userImage") || undefined,
        role: searchParams.get("type") || "USER",
      };
    }
    return null;
  });

  const initialTab = searchParams.get("type") || "vendors";

  return (
    <div className="container p-4 mx-auto">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Tabs defaultValue={initialTab}>
            <TabsList className="w-full">
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="service-providers">
                Service Providers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendors">
              <ChatList
                role="VENDOR"
                onSelectUser={setSelectedUser}
                selectedUserId={selectedUser?.id}
              />
            </TabsContent>

            <TabsContent value="service-providers">
              <ChatList
                role="SERVICE_PROVIDER"
                onSelectUser={setSelectedUser}
                selectedUserId={selectedUser?.id}
              />
            </TabsContent>
          </Tabs>
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
