import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AppContext } from "../../context/AppContext";
import { Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import axios from "axios";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

const ChatWindow = ({
  receiverId,
  receiverName,
  receiverImage,
}: ChatWindowProps) => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!token || !userData) return;

    // Connect to Socket.IO server
    const socketInstance = io(backendUrl);
    setSocket(socketInstance);

    // Authenticate user
    socketInstance.emit("authenticate", userData.id);

    // Load chat history
    fetchChatHistory();

    // Socket event listeners
    socketInstance.on("new_message", (message: Message) => {
      if (message.senderId === receiverId || message.senderId === userData.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    socketInstance.on("user_typing", ({ userId }) => {
      if (userId === receiverId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token, userData, receiverId]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/chat/history/${receiverId}`,
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        setMessages(response.data.chats);
        scrollToBottom();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!socket || !newMessage.trim() || !userData) return;

    socket.emit("private_message", {
      senderId: userData.id,
      receiverId,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleTyping = () => {
    if (!socket || !userData) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("typing", { senderId: userData.id, receiverId });

    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing indicator after delay
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar>
          <AvatarImage src={receiverImage} />
          <AvatarFallback>{receiverName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{receiverName}</h3>
          {isTyping && (
            <p className="text-sm text-muted-foreground">typing...</p>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === userData?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === userData?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.message}</p>
                <p className="text-xs opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2 p-4 border-t">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={handleTyping}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
