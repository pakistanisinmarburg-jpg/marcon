import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const tagColors = {
  social: 'bg-pink-100 text-pink-700',
  sports: 'bg-emerald-100 text-emerald-700',
  cultural: 'bg-purple-100 text-purple-700',
  academic: 'bg-blue-100 text-blue-700',
  workshop: 'bg-amber-100 text-amber-700',
  party: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

const fallbackEvents = [
  { id: '1', title: 'Sprach Café Meetup', date: '2026-05-08', time: '17:00', location: 'Café Roter Stern', tag: 'social', image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80' },
  { id: '2', title: 'Football at Lahnwiesen', date: '2026-05-10', time: '15:00', location: 'Lahnwiesen', tag: 'sports', image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80' },
  { id: '3', title: 'Cultural Night', date: '2026-05-12', time: '19:00', location: 'KFZ Marburg', tag: 'cultural', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' },
  { id: '4', title: 'Career Workshop', date: '2026-05-15', time: '10:00', location: 'Uni Marburg', tag: 'workshop', image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80' },
];

export default function WeeklyEvents() {
  const { data: events } = useQuery({
    queryKey: ['events-home'],
    queryFn: () => base44.entities.Event.list('-date', 10),
    initialData: [],
  });

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  return (
    <div className="py-5">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-base font-bold">Weekly Events</h2>
        <Link to="/calendar" className="text-xs font-semibold text-primary">See all</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 hide-scrollbar">
        {displayEvents.map((event) => (
          <div key={event.id} className="flex-shrink-0 w-52 bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-28">
              <img src={event.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80'} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-[10px] font-bold text-foreground">
                  {event.date ? format(new Date(event.date), 'MMM d') : ''}
                </span>
              </div>
              {event.tag && (
                <div className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagColors[event.tag] || tagColors.other}`}>
                  {event.tag}
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold line-clamp-1">{event.title}</h3>
              {event.location && (
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs line-clamp-1">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}