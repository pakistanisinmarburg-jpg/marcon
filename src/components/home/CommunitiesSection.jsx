import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const fallbackCommunities = [
  { id: '1', name: 'International Marburg', member_count: 342, image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80' },
  { id: '2', name: 'Students', member_count: 589, image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80' },
  { id: '3', name: 'Jobs & Accommodation', member_count: 215, image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80' },
  { id: '4', name: 'Pakistani Community', member_count: 128, image_url: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=400&q=80' },
];

export default function CommunitiesSection() {
  const { data: communities } = useQuery({
    queryKey: ['communities-home'],
    queryFn: () => base44.entities.Community.list('-member_count', 6),
    initialData: [],
  });

  const displayCommunities = communities.length > 0 ? communities : fallbackCommunities;

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Communities</h2>
        <Link to="/communities" className="text-xs font-semibold text-primary">See all</Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {displayCommunities.map((community) => (
          <Link
            key={community.id}
            to="/communities"
            className="relative h-32 rounded-2xl overflow-hidden group"
          >
            <img
              src={community.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80'}
              alt={community.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm font-bold text-white line-clamp-1">{community.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-white/80" />
                <span className="text-[10px] text-white/80 font-medium">{community.member_count} members</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}