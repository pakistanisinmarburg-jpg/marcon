import { Link } from 'react-router-dom';
import { Home, Briefcase, ShoppingBag, HelpCircle, AlertTriangle, QrCode } from 'lucide-react';

const actions = [
  { icon: Home, label: 'Housing', path: '/housing', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Briefcase, label: 'Jobs & Career', path: '/jobs', color: 'bg-blue-50 text-blue-600' },
  { icon: ShoppingBag, label: 'Market', path: '/market', color: 'bg-purple-50 text-purple-600' },
  { icon: HelpCircle, label: 'Questions', path: '/questions', color: 'bg-amber-50 text-amber-600' },
  { icon: AlertTriangle, label: 'Report Issue', path: '/report', color: 'bg-red-50 text-red-600' },
  { icon: QrCode, label: 'Join via QR', path: '/communities', color: 'bg-teal-50 text-teal-600' },
];

export default function QuickActions() {
  return (
    <div className="px-4 py-5">
      <h2 className="text-base font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ icon: Icon, label, path, color }) => (
          <Link
            key={path + label}
            to={path}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}