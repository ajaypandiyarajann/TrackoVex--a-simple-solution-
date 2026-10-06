import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Wifi, MapPin, Bell, Search, ShieldAlert, Trash2, ChevronLeft, Edit2 } from 'lucide-react';

const mockTags = [
  { id: 1, name: "Keys", emoji: "🔑", battery: 85, status: "Nearby", location: "Living Room" },
  { id: 2, name: "Backpack", emoji: "🎒", battery: 42, status: "Disconnected", location: "Last seen 2h ago" },
];

export default function TrackoVexApp() {
  const [isBooting, setIsBooting] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showPairing, setShowPairing] = useState(false);

  useEffect(() => {
    // Simulate boot time
    const timer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white font-sans overflow-hidden relative">
      <AnimatePresence>
        {isBooting ? (
          <BootScreen key="boot" />
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex flex-col p-6 max-w-md mx-auto relative"
          >
            {!selectedTag ? (
              <Dashboard 
                tags={mockTags} 
                onSelect={setSelectedTag} 
                onAdd={() => setShowPairing(true)} 
              />
            ) : (
              <TagDetail tag={selectedTag} onBack={() => setSelectedTag(null)} />
            )}
            
            <AnimatePresence>
              {showPairing && <PairingPopup onClose={() => setShowPairing(false)} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- BOOT SCREEN ---
function BootScreen() {
  return (
    <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-background"
      exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Replace src with your uploaded image path */}
        <img src="/your-logo.png" alt="TrackoVex Logo" className="w-32 h-32 mb-4" />
        <h1 className="text-3xl font-bold tracking-widest text-accent drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
          TrackoVex
        </h1>
      </motion.div>
    </motion.div>
  );
}

// --- DASHBOARD ---
function Dashboard({ tags, onSelect, onAdd }) {
  return (
    <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
      <div className="flex justify-between items-center mb-8 pt-4">
        <h2 className="text-2xl font-bold tracking-wide">My Items</h2>
        <button 
          onClick={onAdd}
          className="w-10 h-10 rounded-full bg-glass border border-glassBorder shadow-glass-glow flex items-center justify-center text-accent hover:bg-accent/10 transition-colors"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tags.map((tag) => (
          <motion.div
            key={tag.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(tag)}
            className="p-4 rounded-3xl bg-glass border border-glassBorder backdrop-blur-xl shadow-[0_4px_30px_rgba(0,240,255,0.05)] cursor-pointer flex flex-col justify-between aspect-square"
          >
            <div className="flex justify-between items-start">
              <span className="text-4xl">{tag.emoji}</span>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Battery size={14} className={tag.battery > 20 ? "text-accent" : "text-red-500"} />
                <span>{tag.battery}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{tag.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{tag.status}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- TAG DETAIL PAGE ---
function TagDetail({ tag, onBack }) {
  const [isLocating, setIsLocating] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [lostMode, setLostMode] = useState(false);

  return (
    <motion.div 
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex-1 overflow-y-auto no-scrollbar pb-10"
    >
      {/* Header */}
      <button onClick={onBack} className="flex items-center text-accent mb-6 pt-4">
        <ChevronLeft size={20} /> <span className="ml-1">Back</span>
      </button>

      {/* Hero Icon */}
      <div className="flex flex-col items-center justify-center mb-8 relative">
        <div className="text-7xl mb-4 relative z-10">{tag.emoji}</div>
        
        {/* Radar Pulse Animation */}
        {isLocating && (
          <motion.div
            animate={{ scale: [1, 3], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-24 h-24 bg-accent/30 rounded-full z-0"
          />
        )}

        <div className="flex items-center space-x-3 group cursor-pointer">
          <h2 className="text-3xl font-bold tracking-wide">{tag.name}</h2>
          <Edit2 size={16} className="text-gray-500 group-hover:text-accent transition-colors" />
        </div>
        <p className="text-gray-400 text-sm mt-2">{tag.location}</p>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around mb-6 p-4 rounded-3xl bg-glass border border-glassBorder backdrop-blur-md">
        <div className="flex flex-col items-center">
          <Battery size={24} className="text-accent mb-1" />
          <span className="text-xs text-gray-400">{tag.battery}% Battery</span>
        </div>
        <div className="w-px bg-white/10" />
        <div className="flex flex-col items-center">
          <Wifi size={24} className="text-accent mb-1" />
          <span className="text-xs text-gray-400">Excellent Signal</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => setIsLocating(!isLocating)}
          className={`py-4 rounded-3xl flex flex-col items-center justify-center transition-all ${isLocating ? 'bg-accent text-background font-bold shadow-[0_0_20px_rgba(0,240,255,0.5)]' : 'bg-glass border border-glassBorder text-accent'}`}
        >
          <Search size={24} className="mb-2" />
          {isLocating ? 'Finding...' : 'Locate'}
        </button>
        <button 
          onClick={() => setIsAlerting(!isAlerting)}
          className={`py-4 rounded-3xl flex flex-col items-center justify-center transition-all relative overflow-hidden ${isAlerting ? 'bg-white text-background font-bold' : 'bg-glass border border-glassBorder text-white'}`}
        >
          <Bell size={24} className={`mb-2 ${isAlerting ? 'animate-bounce text-accent' : ''}`} />
          {isAlerting ? 'Playing...' : 'Play Sound'}
        </button>
      </div>

      {/* Map Snippet */}
      <div className="mb-6 rounded-3xl overflow-hidden h-40 bg-zinc-900 border border-glassBorder relative shadow-glass-inset flex items-center justify-center">
        <MapPin size={32} className="text-accent opacity-50 absolute" />
        <div className="absolute bottom-3 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/5 text-xs">
          Last seen: 123 Neon Avenue, CyberCity • 10 mins ago
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {/* Lost Mode */}
        <div className="flex justify-between items-center p-4 rounded-2xl bg-glass border border-glassBorder">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="text-orange-400" size={20} />
            <div>
              <p className="font-semibold text-sm">Lost Mode</p>
              <p className="text-xs text-gray-400">Lock and track item</p>
            </div>
          </div>
          <div 
            onClick={() => setLostMode(!lostMode)}
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${lostMode ? 'bg-accent' : 'bg-white/10'}`}
          >
            <motion.div 
              animate={{ x: lostMode ? 24 : 0 }} 
              className="w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </div>
        </div>

        {/* About Card */}
        <div className="p-4 rounded-2xl bg-glass border border-glassBorder text-xs text-gray-400 space-y-2">
          <p className="font-semibold text-white mb-2">About TrackoVex</p>
          <div className="flex justify-between"><span className="text-gray-500">Serial Number</span><span>TVX-894-22X</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Firmware</span><span>v2.1.0 (Liquid)</span></div>
        </div>

        {/* Unpair */}
        <button className="w-full mt-4 p-4 rounded-2xl border border-red-500/30 text-red-400 text-sm font-semibold flex items-center justify-center space-x-2 hover:bg-red-500/10 transition-colors">
          <Trash2 size={16} /> <span>Remove TrackoVex</span>
        </button>
      </div>
    </motion.div>
  );
}

// --- PAIRING MODAL ---
function PairingPopup({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0a0a0c] border-t border-glassBorder rounded-t-[40px] p-8 z-50 shadow-[0_-10px_40px_rgba(0,240,255,0.1)]"
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />
        
        {/* 3D Spinning TrackoVex Mockup */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          <motion.div 
            animate={{ rotateY: 360, y: [0, -10, 0] }}
            transition={{ rotateY: { duration: 4, repeat: Infinity, ease: "linear" }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-gray-700 shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-16 h-16 rounded-full border border-accentGlow shadow-glass-inset bg-glass flex items-center justify-center">
              <span className="text-accent font-bold text-xl drop-shadow-[0_0_10px_rgba(0,240,255,1)]">TV</span>
            </div>
          </motion.div>
          {/* Ambient Ground Glow */}
          <div className="absolute bottom-0 w-32 h-4 bg-accent/20 blur-xl rounded-full" />
        </div>

        <h3 className="text-2xl font-bold text-center mb-2">TrackoVex Found</h3>
        <p className="text-center text-gray-400 mb-8 text-sm">Bring your tag closer to pair it securely with your network.</p>
        
        <button 
          onClick={onClose}
          className="w-full py-4 rounded-full bg-accent text-background font-bold text-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-shadow"
        >
          Connect
        </button>
      </motion.div>
    </>
  );
}
