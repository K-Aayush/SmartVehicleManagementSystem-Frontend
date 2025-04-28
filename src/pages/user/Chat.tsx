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
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

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
        name: searchParams.get("userName") || "USER",
        profileImage: searchParams.get("userImage") || undefined,
        role: searchParams.get("type") || "USER",
      };
    }
    return null;
  });

  const initialTab = searchParams.get("type") || "vendors";

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="grid gap-6 lg:grid-cols-3">
        <div
          className={`lg:col-span-1 ${
            selectedUser ? "hidden lg:block" : "block"
          }`}
        >
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

        <div
          className={`lg:col-span-2 ${
            selectedUser ? "block" : "hidden lg:block"
          }`}
        >
          {selectedUser ? (
            <div>
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="mb-4 lg:hidden"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Conversations
              </Button>
              <ChatWindow
                receiverId={selectedUser.id}
                receiverName={selectedUser.name}
                receiverImage={selectedUser.profileImage}
              />
            </div>
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
