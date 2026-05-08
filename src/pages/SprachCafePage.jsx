import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Languages, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '../components/shared/PageHeader';
import FloatingButton from '../components/shared/FloatingButton';
import EmptyState from '../components/shared/EmptyState';

const levelColors = { beginner: 'bg-emerald-100 text-emerald-700', intermediate: 'bg-blue-100 text-blue-700', advanced: 'bg-purple-100 text-purple-700' };

export default function SprachCafePage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', native_language: '', learning_language: '', level: 'beginner', bio: '' });
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['sprachcafe'],
    queryFn: () => base44.entities.SprachCafe.list('-created_date', 50),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SprachCafe.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprachcafe'] });
      setShowForm(false);
      setForm({ name: '', native_language: '', learning_language: '', level: 'beginner', bio: '' });
    },
  });

  return (
    <div>
      <PageHeader title="Sprach Café" />
      <div className="p-4">
        <div className="bg-accent rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Languages className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold">Language Exchange</h3>
          </div>
          <p className="text-xs text-muted-foreground">Find language partners in Marburg. Practice speaking and make friends!</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : profiles.length === 0 ? (
          <EmptyState icon={Languages} title="No profiles yet" subtitle="Be the first to register!" />
        ) : (
          <div className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {p.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold">{p.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <span>{p.native_language}</span>
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>{p.learning_language}</span>
                    </div>
                  </div>
                  <Badge className={`text-[10px] ${levelColors[p.level] || 'bg-muted'}`}>{p.level}</Badge>
                </div>
                {p.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <FloatingButton onClick={() => setShowForm(true)} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Join Sprach Café</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Native language" value={form.native_language} onChange={(e) => setForm({ ...form, native_language: e.target.value })} />
            <Input placeholder="Learning language" value={form.learning_language} onChange={(e) => setForm({ ...form, learning_language: e.target.value })} />
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Short bio (optional)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.native_language || !form.learning_language || createMutation.isPending} className="w-full">
              {createMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}