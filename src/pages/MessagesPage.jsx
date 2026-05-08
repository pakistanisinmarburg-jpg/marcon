import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, ArrowLeft, MessageCircle, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmptyState from '../components/shared/EmptyState';
import { format } from 'date-fns';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [newChatName, setNewChatName] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch all messages where user is sender or recipient
  const { data: allMessages } = useQuery({
    queryKey: ['messages', user?.email],
    queryFn: () => base44.entities.Message.list('-created_date', 200),
    initialData: [],
    enabled: !!user,
  });

  // Group messages by conversation_id
  const conversations = (() => {
    if (!user) return [];
    const myMessages = allMessages.filter(
      (m) => m.sender_email === user.email || m.recipient_email === user.email
    );
    const convMap = {};
    myMessages.forEach((m) => {
      const cid = m.conversation_id || `${[m.sender_email, m.recipient_email].sort().join('_')}`;
      if (!convMap[cid]) {
        const isMe = m.sender_email === user.email;
        convMap[cid] = {
          id: cid,
          otherName: isMe ? (m.recipient_name || m.recipient_email) : (m.sender_name || m.sender_email),
          otherEmail: isMe ? m.recipient_email : m.sender_email,
          lastMessage: m.content,
          time: m.created_date,
          unread: 0,
        };
      }
      if (!m.is_read && m.recipient_email === user.email) {
        convMap[cid].unread = (convMap[cid].unread || 0) + 1;
      }
      // Keep latest
      if (new Date(m.created_date) > new Date(convMap[cid].time)) {
        convMap[cid].lastMessage = m.content;
        convMap[cid].time = m.created_date;
      }
    });
    return Object.values(convMap).sort((a, b) => new Date(b.time) - new Date(a.time));
  })();

  const convMessages = selectedConv
    ? allMessages.filter(
        (m) =>
          (m.sender_email === selectedConv.otherEmail && m.recipient_email === user?.email) ||
          (m.sender_email === user?.email && m.recipient_email === selectedConv.otherEmail)
      ).sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
    : [];

  const sendMutation = useMutation({
    mutationFn: (data) => base44.entities.Message.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.email] });
      setNewMessage('');
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length]);

  const handleSend = () => {
    if (!newMessage.trim() || !user || !selectedConv) return;
    const convId = [user.email, selectedConv.otherEmail].sort().join('_');
    sendMutation.mutate({
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      recipient_email: selectedConv.otherEmail,
      recipient_name: selectedConv.otherName,
      content: newMessage.trim(),
      conversation_id: convId,
      is_read: false,
    });
  };

  const handleStartNewChat = () => {
    if (!newChatEmail.trim()) return;
    const conv = {
      id: [user.email, newChatEmail].sort().join('_'),
      otherEmail: newChatEmail,
      otherName: newChatName || newChatEmail,
      lastMessage: '',
      time: new Date().toISOString(),
      unread: 0,
    };
    setSelectedConv(conv);
    setShowNewChat(false);
    setNewChatEmail('');
    setNewChatName('');
  };

  if (selectedConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedConv(null)} className="p-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {(selectedConv.otherName?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">{selectedConv.otherName}</h1>
            <p className="text-[10px] text-muted-foreground">{selectedConv.otherEmail}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {convMessages.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">No messages yet. Say hi! 👋</p>
          )}
          {convMessages.map((msg) => {
            const isMe = msg.sender_email === user?.email;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <span className={`text-[10px] mt-1 block ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {msg.created_date ? format(new Date(msg.created_date), 'HH:mm') : ''}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-3 bg-card flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-xl"
          />
          <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || sendMutation.isPending} className="rounded-xl">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Messages</h1>
        <Button size="sm" onClick={() => setShowNewChat(true)} className="h-8 px-3 text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" /> New
        </Button>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <EmptyState icon={MessageCircle} title="No messages yet" subtitle="Start a new conversation!" />
          <Button className="mt-4" onClick={() => setShowNewChat(true)}>
            <Plus className="w-4 h-4 mr-2" /> Start Conversation
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedConv(chat)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                {(chat.otherName?.[0] || '?').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{chat.otherName}</h3>
                  <span className="text-[10px] text-muted-foreground">
                    {chat.time ? format(new Date(chat.time), 'MMM d') : ''}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>New Conversation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Recipient's name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
            <Input
              placeholder="Recipient's email"
              type="email"
              value={newChatEmail}
              onChange={(e) => setNewChatEmail(e.target.value)}
            />
            <Button
              onClick={handleStartNewChat}
              disabled={!newChatEmail.trim()}
              className="w-full"
            >
              Start Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}