import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HelpCircle, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '../components/shared/PageHeader';
import FloatingButton from '../components/shared/FloatingButton';
import EmptyState from '../components/shared/EmptyState';

const catLabels = { visa: 'Visa', housing: 'Housing', university: 'University', daily_life: 'Daily Life', transport: 'Transport', health: 'Health', other: 'Other' };
const catColors = { visa: 'bg-blue-100 text-blue-700', housing: 'bg-emerald-100 text-emerald-700', university: 'bg-purple-100 text-purple-700', daily_life: 'bg-amber-100 text-amber-700', transport: 'bg-pink-100 text-pink-700', health: 'bg-red-100 text-red-700', other: 'bg-gray-100 text-gray-700' };

export default function QuestionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [form, setForm] = useState({ title: '', body: '', category: 'other' });
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => base44.entities.Question.list('-created_date', 50),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Question.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setShowForm(false);
      setForm({ title: '', body: '', category: 'other' });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, replies, newReply }) => {
      const updated = [...(replies || []), newReply];
      return base44.entities.Question.update(id, { replies: updated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setReplyText('');
    },
  });

  const handleReply = async () => {
    if (!replyText.trim() || !selectedQ) return;
    const user = await base44.auth.me();
    replyMutation.mutate({
      id: selectedQ.id,
      replies: selectedQ.replies,
      newReply: { author: user.full_name || 'Anonymous', author_email: user.email, body: replyText, date: new Date().toISOString() },
    });
  };

  return (
    <div>
      <PageHeader title="Q&A" />
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : questions.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No questions yet" subtitle="Ask the community!" />
      ) : (
        <div className="p-4 space-y-3">
          {questions.map((q) => (
            <div key={q.id} onClick={() => setSelectedQ(q)} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className={`text-[10px] ${catColors[q.category] || catColors.other}`}>{catLabels[q.category] || q.category}</Badge>
                {q.is_resolved && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
              </div>
              <h3 className="text-sm font-bold">{q.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{q.body}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                {q.replies?.length || 0} replies
              </div>
            </div>
          ))}
        </div>
      )}

      <FloatingButton onClick={() => setShowForm(true)} />

      {/* New Question */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Ask a Question</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Question title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Details..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(catLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.title || !form.body || createMutation.isPending} className="w-full">
              {createMutation.isPending ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thread View */}
      <Dialog open={!!selectedQ} onOpenChange={(o) => { if (!o) setSelectedQ(null); }}>
        <DialogContent className="max-w-[90vw] rounded-2xl max-h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle className="text-base">{selectedQ?.title}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedQ?.body}</p>
          <div className="flex-1 overflow-y-auto space-y-3 mt-3">
            {selectedQ?.replies?.map((r, i) => (
              <div key={i} className="bg-muted rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{r.author}</span>
                  <span className="text-[10px] text-muted-foreground">{r.date ? new Date(r.date).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-sm">{r.body}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Input placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1" />
            <Button size="icon" onClick={handleReply} disabled={!replyText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}