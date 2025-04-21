import { useState, useEffect } from "react";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Plus, Inbox, Archive } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllConversations, sendMessage, markConversationAsRead, createNewConversation } from "@/services/dataService";
import type { Conversation } from "@/services/dataService";

const MessagesPage = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    
    // Listen for storage changes for real-time updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "case-guardian-messages") {
        loadConversations();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update active conversation when conversations change
  useEffect(() => {
    if (activeConversation && conversations.length > 0) {
      const updatedConversation = conversations.find(c => c.id === activeConversation.id);
      if (updatedConversation) {
        setActiveConversation(updatedConversation);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations]);

  const loadConversations = () => {
    const allConversations = getAllConversations();
    setConversations(allConversations);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
    markConversationAsRead(conversation.id);
    loadConversations(); // Reload to update unread status
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      sendMessage(activeConversation.id, newMessage, "ME");
      loadConversations();
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleNewMessage = () => {
    setShowNewMessageDialog(true);
  };

  const handleStartNewConversation = () => {
    if (!newRecipient.trim()) return;

    try {
      const newConversation = createNewConversation(newRecipient);
      loadConversations();
      setActiveConversation(newConversation);
      setShowNewMessageDialog(false);
      setNewRecipient("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Communicate with team members and clients
            </p>
          </div>
          
          <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
            <DialogTrigger asChild>
              <Button 
                className="self-start flex items-center gap-2"
                onClick={handleNewMessage}
              >
                <Plus className="h-4 w-4" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Recipient name..."
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  onClick={handleStartNewConversation}
                  disabled={!newRecipient.trim()}
                >
                  Start Conversation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          {/* Conversations list */}
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Badge>{conversations.filter(c => c.unread).length}</Badge>
              </div>
              <Input placeholder="Search messages..." className="mt-2" />
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="inbox">
                <TabsList className="grid grid-cols-2 w-full rounded-none border-b border-t">
                  <TabsTrigger value="inbox" className="flex items-center gap-2">
                    <Inbox className="h-4 w-4" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Archived
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                          conversation.unread ? 'bg-muted/30' : ''
                        } ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{conversation.userInitials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.user}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread && (
                              <div className="flex justify-end">
                                <Badge variant="default" className="mt-1">New</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="archived" className="mt-0">
                  <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] p-4 text-center">
                    <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-medium">No archived messages</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Archived conversations will appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Message detail */}
          <Card className="h-[calc(100vh-12rem)]">
            {activeConversation ? (
              <>
                <CardHeader className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{activeConversation.userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{activeConversation.user}</CardTitle>
                      <CardDescription>Last active {activeConversation.time}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(100vh-22rem)]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {activeConversation.messages.map((message) => (
                        <div key={message.id} className={`flex gap-3 ${message.senderId === "ME" ? "justify-end" : ""}`}>
                          {message.senderId !== "ME" && (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{activeConversation.userInitials}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`p-3 rounded-lg max-w-[80%] ${
                            message.senderId === "ME" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === "ME" 
                                ? "text-primary-foreground/80" 
                                : "text-muted-foreground"
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                          {message.senderId === "ME" && (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t mt-auto">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input 
                        placeholder="Type your message..." 
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-medium">No conversation selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a conversation or start a new one
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default MessagesPage;
