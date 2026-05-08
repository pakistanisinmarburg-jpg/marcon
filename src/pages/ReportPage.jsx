import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PageHeader from '../components/shared/PageHeader';

export default function ReportPage() {
  const [form, setForm] = useState({ title: '', description: '', category: 'discrimination', is_anonymous: false });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Report.create(data),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <div>
        <PageHeader title="Report Issue" />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-1">Report Submitted</h2>
          <p className="text-sm text-muted-foreground mb-6">Thank you for reporting. We will review it shortly.</p>
          <Button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: 'discrimination', is_anonymous: false }); }} variant="outline">
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Report Issue" />
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700">Safe Space</span>
          </div>
          <p className="text-xs text-red-600">Your report will be handled confidentially. You can choose to remain anonymous.</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="discrimination">Discrimination</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="safety">Safety Concern</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Title</Label>
            <Input placeholder="Brief title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Description</Label>
            <Textarea placeholder="Describe what happened..." rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex items-center justify-between bg-muted rounded-xl p-3">
            <div>
              <p className="text-sm font-medium">Submit Anonymously</p>
              <p className="text-xs text-muted-foreground">Your identity will be hidden</p>
            </div>
            <Switch checked={form.is_anonymous} onCheckedChange={(v) => setForm({ ...form, is_anonymous: v })} />
          </div>
          <Button onClick={() => mutation.mutate(form)} disabled={!form.title || !form.description || mutation.isPending} className="w-full bg-red-600 hover:bg-red-700 text-white">
            {mutation.isPending ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </div>
    </div>
  );
}