import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Users, LogOut, Shield, Settings, ChevronRight, Languages, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const menuItems = [
  { icon: Languages, label: 'Sprach Café', path: '/sprach-cafe' },
  { icon: Shield, label: 'Report an Issue', path: '/report' },
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setBio(u?.bio || '');
      setPhone(u?.phone || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ bio, phone });
    const updated = await base44.auth.me();
    setUser(updated);
    setSaving(false);
    setShowEdit(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold">Profile</h1>
      </div>

      <div className="p-4">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border p-5 text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary">
              {user?.full_name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <h2 className="text-lg font-bold">{user?.full_name || 'User'}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{user?.email || ''}</p>
          {user?.role === 'admin' && (
            <Badge className="mt-2 bg-amber-100 text-amber-700 border-amber-200">Admin</Badge>
          )}
          {user?.bio && (
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">{user.bio}</p>
          )}
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowEdit(true)}>
            Edit Profile
          </Button>
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
          {menuItems.map(({ icon: Icon, label, path }, i) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${i < menuItems.length - 1 ? 'border-b border-border' : ''}`}
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium flex-1">{label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => base44.auth.logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={user?.full_name || ''} disabled className="bg-muted" />
              <p className="text-[10px] text-muted-foreground mt-1">Name can't be changed here</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input placeholder="Your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bio</label>
              <Textarea placeholder="Write something about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}