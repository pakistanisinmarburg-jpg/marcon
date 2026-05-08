import { Plus } from 'lucide-react';

export default function FloatingButton({ onClick, icon: Icon = Plus }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}