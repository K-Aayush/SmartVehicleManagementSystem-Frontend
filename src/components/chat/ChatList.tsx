import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  role: string;
  companyName?: string;
  lastMessage?: {
    message: string;
    createdAt: string;
  };
}

interface ChatListProps {
  role?: string;
  onSelectUser: (user: ChatUser) => void;
  selectedUserId?: string;
}

const ChatList = ({ role, onSelectUser, selectedUserId }: ChatListProps) => {
  const { token, backendUrl } = useContext(AppContext);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchChatUsers();
    }
  }, [token, role]);

  const fetchChatUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/chat/role/${role}`, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        console.log(response.data.conversations);
        // Transform the conversations data to match the expected format
        const formattedUsers = response.data.conversations.map((conv: any) => ({
          id: conv.otherUser.id,
          name: conv.otherUser.name,
          profileImage: conv.otherUser.profileImage,
          role: conv.otherUser.role,
          companyName: conv.otherUser.companyName,
          lastMessage: {
            message: conv.message,
            createdAt: conv.createdAt,
          },
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
      toast.error("Failed to load chat users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id}>
              <button
                className={`max-w-[70%] p-3 text-left transition-colors rounded-lg hover:bg-muted ${
                  selectedUserId === user.id ? "bg-muted" : ""
                }`}
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.role === "SERVICE_PROVIDER"
                        ? "Service Provider"
                        : user.role === "VENDOR"
                        ? "Vendor"
                        : "User"}
                    </p>
                    {user.companyName && (
                      <p className="text-sm truncate text-muted-foreground">
                        {user.companyName}
                      </p>
                    )}
                    {user.lastMessage && (
                      <p className="text-sm truncate text-muted-foreground">
                        {user.lastMessage.message}
                      </p>
                    )}
                  </div>
                  {user.lastMessage && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        user.lastMessage.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </button>
              <Separator className="my-2" />
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-muted-foreground">
              No conversations found. Start a conversation by purchasing a
              product or requesting emergency assistance.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatList;
