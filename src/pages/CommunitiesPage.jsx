import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '../components/shared/PageHeader';

const fallbackCommunities = [
  { id: '1', name: 'International Marburg', description: 'A space for the international community in Marburg', member_count: 342, image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
  { id: '2', name: 'Students', description: 'Uni Marburg students community', member_count: 589, image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80' },
  { id: '3', name: 'Jobs & Accommodation', description: 'Find work and housing in Marburg', member_count: 215, image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80' },
  { id: '4', name: 'Pakistani Community', description: 'Pakistani students and families in Marburg', member_count: 128, image_url: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=600&q=80' },
  { id: '5', name: 'Sports & Fitness', description: 'Sports activities and gym buddies', member_count: 96, image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
  { id: '6', name: 'Language Exchange', description: 'Practice languages with locals and internationals', member_count: 178, image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80' },
];

const emptyForm = { name: '', description: '', category: '', image_url: '' };

export default function CommunitiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: communities } = useQuery({
    queryKey: ['communities'],
    queryFn: () => base44.entities.Community.list('-member_count', 20),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Community.create({ ...data, member_count: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const displayCommunities = communities.length > 0 ? communities : fallbackCommunities;

  return (
    <div>
      <PageHeader
        title="Communities"
        showBack={false}
        rightAction={
          <Button size="sm" onClick={() => setShowForm(true)} className="h-8 px-3 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> Create
          </Button>
        }
      />
      <div className="p-4 space-y-3">
        {displayCommunities.map((community) => (
          <div key={community.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36">
              <img
                src={community.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80'}
                alt={community.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-base font-bold text-white">{community.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-xs text-white/80 font-medium">{community.member_count} members</span>
                </div>
              </div>
            </div>
            {community.description && (
              <div className="p-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex-1">{community.description}</p>
                <Button size="sm" variant="outline" className="h-7 px-3 text-xs ml-2 shrink-0">Join</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Create Community</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Community name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Category (e.g. Sports, Culture)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.name || createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}