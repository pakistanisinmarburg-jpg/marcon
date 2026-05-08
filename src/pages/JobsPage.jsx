import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, MapPin, Search, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '../components/shared/PageHeader';
import FloatingButton from '../components/shared/FloatingButton';
import EmptyState from '../components/shared/EmptyState';

const typeLabels = { full_time: 'Full-time', part_time: 'Part-time', internship: 'Internship', mini_job: 'Mini Job', freelance: 'Freelance' };
const typeColors = { full_time: 'bg-emerald-100 text-emerald-700', part_time: 'bg-blue-100 text-blue-700', internship: 'bg-purple-100 text-purple-700', mini_job: 'bg-amber-100 text-amber-700', freelance: 'bg-pink-100 text-pink-700' };

export default function JobsPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ title: '', company: '', description: '', type: 'full_time', location: '', salary_range: '', contact_email: '' });
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.JobPost.list('-created_date', 50),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JobPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowForm(false);
      setForm({ title: '', company: '', description: '', type: 'full_time', location: '', salary_range: '', contact_email: '' });
    },
  });

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || j.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      <PageHeader title="Jobs & Career" />
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['all', 'full_time', 'part_time', 'mini_job', 'internship', 'freelance'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {t === 'all' ? 'All' : typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" subtitle="Post a job opportunity!" />
      ) : (
        <div className="px-4 space-y-3 pb-4">
          {filtered.map((job) => (
            <div key={job.id} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{job.title}</h3>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                </div>
                <Badge className={`text-[10px] ${typeColors[job.type] || 'bg-muted'}`}>{typeLabels[job.type] || job.type}</Badge>
              </div>
              {job.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{job.description}</p>}
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                {job.salary_range && <span className="font-medium text-primary">{job.salary_range}</span>}
                {job.contact_email && (
                  <a href={`mailto:${job.contact_email}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Mail className="w-3 h-3" /> Apply
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <FloatingButton onClick={() => setShowForm(true)} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Post a Job</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <Input placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Salary range" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} />
            <Input placeholder="Contact email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.title || !form.company || createMutation.isPending} className="w-full">
              {createMutation.isPending ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}