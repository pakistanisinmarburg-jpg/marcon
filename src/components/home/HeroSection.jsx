export default function HeroSection() {
  return (
    <div className="relative h-56 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80"
        alt="Marburg city"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">MarburgConnect</h1>
        <p className="text-white/85 text-sm font-medium mt-0.5">Connect. Belong. Thrive.</p>
      </div>
    </div>
  );
}