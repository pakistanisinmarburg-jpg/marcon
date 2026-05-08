import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, Search, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '../components/shared/PageHeader';
import FloatingButton from '../components/shared/FloatingButton';
import EmptyState from '../components/shared/EmptyState';

const conditionLabels = { new: 'New', like_new: 'Like New', good: 'Good', fair: 'Fair' };
const categoryLabels = { electronics: 'Electronics', furniture: 'Furniture', clothing: 'Clothing', books: 'Books', kitchen: 'Kitchen', sports: 'Sports', other: 'Other' };

export default function MarketPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'other', condition: 'good' });
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['market'],
    queryFn: () => base44.entities.MarketItem.list('-created_date', 50),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MarketItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market'] });
      setShowForm(false);
      setForm({ title: '', description: '', price: '', category: 'other', condition: 'good' });
    },
  });

  const filtered = items.filter((i) => !search || i.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Market" />
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No items yet" subtitle="List something to sell!" />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-muted flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-bold text-primary flex items-center gap-0.5">
                      <Euro className="w-3.5 h-3.5" />{item.price}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{conditionLabels[item.condition] || 'Used'}</Badge>
                  </div>
                  {item.is_sold && <Badge className="mt-1.5 bg-red-100 text-red-700 text-[10px]">Sold</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FloatingButton onClick={() => setShowForm(true)} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Sell an Item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Item name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input type="number" placeholder="Price (€)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(conditionLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => createMutation.mutate({ ...form, price: Number(form.price) })} disabled={!form.title || !form.price || createMutation.isPending} className="w-full">
              {createMutation.isPending ? 'Listing...' : 'List Item'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}