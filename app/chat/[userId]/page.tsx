'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useParams } from 'next/navigation';
import { Send, MoreVertical, Phone, Video, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { connectSocket, getSocket } from '@/lib/socket';
import { io } from 'socket.io-client';

// Define proper types for your message structure
interface Message {
  id: string | number;
  content: string;
  senderId: string;
  createdAt: string;
  pending?: boolean;
}

export default function ChatPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const senderId = user?.id;
  const params = useParams();
  const receiverId = params?.userId as string;

  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

useEffect(() => {
  const socket = io("http://localhost:3000"); // or wherever your server is

  socket.on("connect", () => {
    console.log("✅ Socket connected!", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket disconnected:", reason);
  });

  return () => {
    socket.disconnect();
  };
}, []);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOrCreateConversation = useCallback(async () => {
    if (!senderId || !receiverId) return;

    try {
      const res = await fetch(
        `/api/conversation/find/${receiverId}`,{
          method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setConversationId(data.conversationId);
      } else {
        console.error(data.error || 'Failed to fetch/create conversation');
      }
    } catch (error) {
      console.error('Error fetching/creating conversation:', error);
    }
  }, [senderId, receiverId, token]);

  const sendMessage = async () => {
    if (!content.trim() || !senderId || !receiverId) return;

    setSending(true);
    setIsTyping(true);

    // Optimistically add message to UI
    const tempMessage: Message = {
      id: Date.now(),
      content,
      senderId,
      createdAt: new Date().toISOString(),
      pending: true
    };
    setMessages((prev) => [...prev, tempMessage]);
    setContent('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: tempMessage.content, senderId, receiverId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Remove temp message and show error
        setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
        alert(data.error || 'Failed to send message');
      } else {
        // Replace temp message with real message
        const newMessage = data.message;
        setMessages((prev) => prev.map(msg => 
          msg.id === tempMessage.id ? newMessage : msg
        ));
        //   const socket = getSocket();
        //   console.log("socket",socket)
        // socket?.emit('send-message', newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Error sending message');
    }

    setSending(false);
    setIsTyping(false);
  };

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversation/${conversationId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      } else {
        console.error(data.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [token]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Fetch or create conversation when receiverId changes
  useEffect(() => {
    fetchOrCreateConversation();
  }, [fetchOrCreateConversation]);

  // Fetch messages only when conversationId is set
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${receiverId}`} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-slate-900">User {receiverId}</h1>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-500">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <div className="bg-slate-100 rounded-full p-8 mb-4">
                <User className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-center max-w-sm">
                Send a message to begin chatting with this user.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.senderId === senderId;
              const showAvatar = index === messages.length - 1 || 
                messages[index + 1]?.senderId !== msg.senderId;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isOwn && (
                      <Avatar className={`h-8 w-8 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`relative ${isOwn ? 'ml-auto' : ''}`}>
                      <Card className={`${
                        isOwn 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white border-slate-200'
                      } shadow-sm transition-all duration-200 hover:shadow-md`}>
                        <CardContent className="p-3">
                          <p className={`text-sm ${isOwn ? 'text-white' : 'text-slate-900'}`}>
                            {msg.content}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-slate-400">
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.pending && (
                          <Badge variant="secondary" className="text-xs">
                            Sending...
                          </Badge>
                        )}
                        {isOwn && !msg.pending && (
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2 max-w-xs">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${receiverId}`} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white border-slate-200">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="min-h-[44px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              disabled={sending}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={sending || !content.trim()}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 rounded-xl h-[44px] px-4 transition-all duration-200 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Press Enter to send, Shift + Enter for new line</span>
          {content.length > 0 && (
            <span>{content.length}/1000</span>
          )}
        </div>
      </div>
    </div>
  );
}