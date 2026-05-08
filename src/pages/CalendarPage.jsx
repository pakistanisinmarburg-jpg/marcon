import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, Clock, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const tagColors = {
  social: 'bg-pink-100 text-pink-700',
  sports: 'bg-emerald-100 text-emerald-700',
  cultural: 'bg-purple-100 text-purple-700',
  academic: 'bg-blue-100 text-blue-700',
  workshop: 'bg-amber-100 text-amber-700',
  party: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

const emptyForm = { title: '', description: '', date: '', time: '', location: '', tag: 'social', organizer: '' };

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: events } = useQuery({
    queryKey: ['events-calendar'],
    queryFn: () => base44.entities.Event.list('-date', 100),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Event.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-calendar'] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();
  const blanks = Array(startDay).fill(null);

  const hasEvent = (date) => events.some((e) => e.date && isSameDay(new Date(e.date), date));
  const dayEvents = events.filter((e) => e.date && isSameDay(new Date(e.date), selectedDate));

  return (
    <div>
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold">{format(currentMonth, 'MMMM yyyy')}</h1>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-muted">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="p-2 rounded-full hover:bg-muted text-primary"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`b-${i}`} />)}
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrent = isToday(day);
            const has = hasEvent(day);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-bold'
                    : isCurrent
                      ? 'bg-accent font-semibold'
                      : isSameMonth(day, currentMonth)
                        ? 'hover:bg-muted'
                        : 'text-muted-foreground/40'
                }`}
              >
                {format(day, 'd')}
                {has && !isSelected && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Events on {format(selectedDate, 'MMM d, yyyy')}</h2>
            <Button size="sm" variant="outline" onClick={() => setShowForm(true)} className="text-xs h-7 px-3">
              <Plus className="w-3 h-3 mr-1" /> Add Event
            </Button>
          </div>
          {dayEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No events on this day</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <div key={event.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {event.tag && <Badge className={`text-[10px] ${tagColors[event.tag]}`}>{event.tag}</Badge>}
                  </div>
                  <h3 className="text-sm font-bold">{event.title}</h3>
                  {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>}
                    {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                  </div>
                  {event.organizer && <p className="text-[10px] text-muted-foreground mt-1">by {event.organizer}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-[90vw] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Time</label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="Organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
            <Select value={form.tag} onValueChange={(v) => setForm({ ...form, tag: v })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.title || !form.date || createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}