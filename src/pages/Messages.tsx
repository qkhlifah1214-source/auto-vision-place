import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isRTL, setIsRTL] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchMessages(session.user.id);
      }
    });
  }, [navigate]);

  const fetchMessages = async (userId: string) => {
    const { data } = await supabase
      .from("messages")
      .select(`
        *,
        cars (title, images),
        sender:sender_id (full_name),
        receiver:receiver_id (full_name)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const { error } = await supabase.from("messages").insert({
      car_id: selectedConversation.car_id,
      sender_id: user.id,
      receiver_id: selectedConversation.receiver_id,
      message: newMessage,
    });

    if (error) {
      toast.error("فشل إرسال الرسالة");
    } else {
      setNewMessage("");
      fetchMessages(user.id);
      toast.success("تم إرسال الرسالة");
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", messageId);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header
        isRTL={isRTL}
        toggleLanguage={() => setIsRTL(!isRTL)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">الرسائل</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <h2 className="font-bold mb-4">المحادثات</h2>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">لا توجد رسائل</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedConversation?.id === msg.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => {
                        setSelectedConversation(msg);
                        if (!msg.read && msg.receiver_id === user?.id) {
                          markAsRead(msg.id);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-sm">
                          {msg.sender_id === user?.id ? msg.receiver?.full_name : msg.sender?.full_name}
                        </p>
                        {!msg.read && msg.receiver_id === user?.id && (
                          <Badge variant="default" className="text-xs">جديد</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {msg.cars?.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-4">
              {selectedConversation ? (
                <>
                  <div className="border-b pb-4 mb-4">
                    <h2 className="font-bold">{selectedConversation.cars?.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      مع {selectedConversation.sender_id === user?.id 
                        ? selectedConversation.receiver?.full_name 
                        : selectedConversation.sender?.full_name}
                    </p>
                  </div>

                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedConversation.sender_id === user?.id
                          ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                          : "bg-muted max-w-[80%]"
                      }`}
                    >
                      <p className="text-sm">{selectedConversation.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(selectedConversation.created_at).toLocaleString("ar")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="اكتب رسالتك..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">اختر محادثة لعرض الرسائل</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default Messages;