import React, { useState } from 'react';
import { UserInput, MajorEvent } from '../lib/types';
import { Plus, Trash2, Calendar, MapPin, Loader2, User, Clock } from 'lucide-react';

interface Props {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: 'male',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    birthLocation: 'China',
    majorEvents: []
  });

  const [newEvent, setNewEvent] = useState<MajorEvent>({
    year: 2000,
    event: '',
    sentiment: 'neutral'
  });

  const addEvent = () => {
    if (!newEvent.event) return;
    setFormData(prev => ({
      ...prev,
      majorEvents: [...prev.majorEvents, newEvent]
    }));
    setNewEvent({ ...newEvent, event: '' });
  };

  const removeEvent = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      majorEvents: prev.majorEvents.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass p-8 rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(0,255,0,0.1)] animate-fade-in relative overflow-hidden group/form">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl pointer-events-none group-hover/form:border-primary transition-colors duration-500"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl pointer-events-none group-hover/form:border-primary transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl pointer-events-none group-hover/form:border-primary transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-2xl pointer-events-none group-hover/form:border-primary transition-colors duration-500"></div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="flex flex-col items-center mb-10 relative">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/30 glow-green relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="text-3xl font-bold text-primary relative z-10">C</span>
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-primary text-glow italic">
          CHARTLIFE <span className="text-white not-italic">OS</span>
        </h2>
        <div className="flex items-center space-x-2 mt-2">
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
          <p className="text-[10px] text-primary/60 tracking-[0.3em] uppercase font-mono">Quantum Destiny Engine v2.0</p>
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-muted uppercase tracking-widest ml-1">
              <User className="w-3 h-3 mr-2 text-primary" /> Name
            </label>
            <input
              type="text"
              className="w-full bg-black/50 border border-primary/20 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none text-white transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name..."
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold text-muted uppercase tracking-widest ml-1">
              Gender
            </label>
            <div className="flex p-1 bg-black/50 rounded-lg border border-primary/20">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md transition-all text-sm font-bold ${formData.gender === 'male' ? 'bg-primary text-black' : 'text-primary/60 hover:text-primary'}`}
                onClick={() => setFormData({ ...formData, gender: 'male' })}
              >
                MALE
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md transition-all text-sm font-bold ${formData.gender === 'female' ? 'bg-primary text-black' : 'text-primary/60 hover:text-primary'}`}
                onClick={() => setFormData({ ...formData, gender: 'female' })}
              >
                FEMALE
              </button>
            </div>
          </div>
        </div>

        {/* Date Time Section */}
        <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <label className="flex items-center text-xs font-bold text-primary uppercase tracking-widest">
            <Calendar className="w-3 h-3 mr-2" /> Birth Date & Time
          </label>
          <div className="grid grid-cols-3 gap-3">
            <InputGroup label="Year" value={formData.birthYear} onChange={val => setFormData({ ...formData, birthYear: val })} />
            <InputGroup label="Month" value={formData.birthMonth} onChange={val => setFormData({ ...formData, birthMonth: val })} />
            <InputGroup label="Day" value={formData.birthDay} onChange={val => setFormData({ ...formData, birthDay: val })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputGroup label="Hour (0-23)" value={formData.birthHour} onChange={val => setFormData({ ...formData, birthHour: val })} />
            <InputGroup label="Minute" value={formData.birthMinute} onChange={val => setFormData({ ...formData, birthMinute: val })} />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center text-xs font-bold text-muted uppercase tracking-widest ml-1">
            <MapPin className="w-3 h-3 mr-2 text-primary" /> Location
          </label>
          <input
            type="text"
            className="w-full bg-black/50 border border-primary/20 rounded-lg p-3 focus:border-primary outline-none text-white transition-all shadow-inner"
            value={formData.birthLocation}
            onChange={e => setFormData({ ...formData, birthLocation: e.target.value })}
            placeholder="City, Country..."
          />
        </div>

        {/* Major Events */}
        <div className="border-t border-primary/10 pt-6 space-y-4 text-left">
          <div>
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Calibration Engine</h3>
            <p className="text-[10px] text-muted uppercase">Sync current timeline with past major milestones</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="number"
              className="w-24 bg-black/50 border border-primary/20 rounded-lg p-3 text-white focus:border-primary outline-none"
              placeholder="Year"
              value={newEvent.year}
              onChange={e => setNewEvent({ ...newEvent, year: parseInt(e.target.value) })}
            />
            <input
              type="text"
              className="flex-1 bg-black/50 border border-primary/20 rounded-lg p-3 text-white focus:border-primary outline-none"
              placeholder="Event (e.g. IPO, Marriage)"
              value={newEvent.event}
              onChange={e => setNewEvent({ ...newEvent, event: e.target.value })}
            />
            <select
              className="bg-black/50 border border-primary/20 rounded-lg p-3 text-xs text-primary font-bold focus:border-primary outline-none appearance-none"
              value={newEvent.sentiment}
              onChange={(e: any) => setNewEvent({ ...newEvent, sentiment: e.target.value })}
            >
              <option value="positive" className="bg-black text-primary">BULLISH 📈</option>
              <option value="negative" className="bg-black text-primary">BEARISH 📉</option>
              <option value="neutral" className="bg-black text-primary">NEUTRAL</option>
            </select>
            <button
              type="button"
              onClick={addEvent}
              className="p-3 bg-primary text-black hover:bg-white rounded-lg transition-colors font-bold shadow-[0_0_15px_rgba(0,255,0,0.3)]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {formData.majorEvents.map((ev, i) => (
              <div key={i} className="flex justify-between items-center bg-primary/5 p-3 rounded-lg text-xs border border-primary/10 group hover:border-primary/30 transition-all">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-primary font-bold">{ev.year}</span>
                  <span className="text-white font-medium">{ev.event}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${ev.sentiment === 'positive' ? 'bg-bullish/20 text-bullish' : ev.sentiment === 'negative' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                    {ev.sentiment}
                  </span>
                  <button type="button" onClick={() => removeEvent(i)} className="text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-white text-black font-black py-5 rounded-xl transition-all flex justify-center items-center shadow-[0_0_30px_rgba(0,255,0,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] group overflow-hidden relative"
        >
          {/* Button scan animation */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[45deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none"></div>

          {isLoading ? <Loader2 className="animate-spin mr-3" /> : null}
          <span className="tracking-[0.4em] uppercase font-mono text-lg">{isLoading ? "Decrypting..." : "ACCESS TERMINAL"}</span>
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-muted uppercase tracking-tighter ml-1">{label}</span>
      <input
        type="number"
        className="w-full bg-black/60 border border-primary/10 rounded-md p-2 text-white text-sm focus:border-primary outline-none transition-all"
        value={value}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
      />
    </div>
  )
}