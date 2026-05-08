import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Euro, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '../components/shared/PageHeader';
import FloatingButton from '../components/shared/FloatingButton';
import EmptyState from '../components/shared/EmptyState';

const typeLabels = { room: 'Room', apartment: 'Apartment', wg: 'WG', sublet: 'Sublet' };
const typeColors = { room: 'bg-blue-100 text-blue-700', apartment: 'bg-purple-100 text-purple-700', wg: 'bg-emerald-100 text-emerald-700', sublet: 'bg-amber-100 text-amber-700' };

export default function HousingPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'room', price: '', location: '', contact_email: '' });
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['housing'],
    queryFn: () => base44.entities.HousingPost.list('-created_date', 50),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.HousingPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housing'] });
      setShowForm(false);
      setForm({ title: '', description: '', type: 'room', price: '', location: '', contact_email: '' });
    },
  });

  const handleSubmit = () => {
    createMutation.mutate({ ...form, price: Number(form.price) });
  };

  return (
    <div>
      <PageHeader title="Housing" />
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : posts.length === 0 ? (
        <EmptyState title="No housing posts yet" subtitle="Post a room or apartment!" />
      ) : (
        <div className="p-4 space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] px-2 py-0 ${typeColors[post.type] || 'bg-muted text-muted-foreground'}`}>
                      {typeLabels[post.type] || post.type}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold">{post.title}</h3>
                  {post.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.description}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-primary font-bold text-sm">
                      <Euro className="w-3.5 h-3.5" />
                      {post.price}/mo
                    </div>
                    {post.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </div>
                    )}
                  </div>
                  {post.contact_email && (
                    <a href={`mailto:${post.contact_email}`} className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                      <Mail className="w-3 h-3" /> Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FloatingButton onClick={() => setShowForm(true)} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Post Housing</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="wg">WG</SelectItem>
                <SelectItem value="sublet">Sublet</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Monthly rent (€)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Contact email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            <Button onClick={handleSubmit} disabled={!form.title || !form.price || createMutation.isPending} className="w-full">
              {createMutation.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}