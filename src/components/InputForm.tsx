import React, { useState } from 'react';
import { UserInput, MajorEvent } from '../lib/types';
import { Plus, Trash2, Calendar, MapPin, Loader2, User } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-[#00ff00]/20 shadow-[0_0_60px_rgba(0,255,0,0.08),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden text-left">
      {/* Decorative top glow line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff00]/60 to-transparent"></div>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#00ff00]/10 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#00ff00]/10 to-transparent rounded-tl-full"></div>

      <div className="flex flex-col items-center mb-10 text-center relative">
        <div className="w-20 h-20 bg-gradient-to-br from-[#00ff00]/20 to-[#00ff00]/5 rounded-2xl flex items-center justify-center mb-5 border border-[#00ff00]/30 shadow-[0_0_30px_rgba(0,255,0,0.2)] rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="text-4xl font-black text-[#00ff00] drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">命</span>
        </div>
        <h2 className="text-4xl font-black tracking-tight text-[#00ff00] drop-shadow-[0_0_20px_rgba(0,255,0,0.4)]">
          命理终端 <span className="text-white/90 font-light">OS</span>
        </h2>
        <p className="text-xs text-[#00ff00]/50 mt-3 tracking-widest font-medium">AI 八字命理分析系统</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-[11px] font-semibold text-[#00ff00]/70 tracking-wider">
              <User className="w-3.5 h-3.5 mr-2 text-[#00ff00]" /> 姓名
            </label>
            <input
              type="text"
              className="w-full bg-[#0a0a0a] border border-[#00ff00]/20 rounded-xl px-4 py-3.5 focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/20 outline-none text-white transition-all duration-200 placeholder:text-gray-600 hover:border-[#00ff00]/40"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入姓名..."
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-[11px] font-semibold text-[#00ff00]/70 tracking-wider">
              性别
            </label>
            <div className="flex p-1.5 bg-[#0a0a0a] rounded-xl border border-[#00ff00]/20">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg transition-all duration-200 text-sm font-bold ${formData.gender === 'male' ? 'bg-[#00ff00] text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]' : 'text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#00ff00]/10'}`}
                onClick={() => setFormData({ ...formData, gender: 'male' })}
              >
                男
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg transition-all duration-200 text-sm font-bold ${formData.gender === 'female' ? 'bg-[#00ff00] text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]' : 'text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#00ff00]/10'}`}
                onClick={() => setFormData({ ...formData, gender: 'female' })}
              >
                女
              </button>
            </div>
          </div>
        </div>

        {/* 出生日期时间 */}
        <div className="space-y-5 p-5 bg-gradient-to-br from-[#00ff00]/5 to-transparent rounded-2xl border border-[#00ff00]/10">
          <label className="flex items-center text-[11px] font-semibold text-[#00ff00] tracking-wider">
            <Calendar className="w-3.5 h-3.5 mr-2" /> 出生日期与时辰
          </label>
          <div className="grid grid-cols-3 gap-4">
            <InputGroup label="年" value={formData.birthYear} onChange={val => setFormData({ ...formData, birthYear: val })} />
            <InputGroup label="月" value={formData.birthMonth} onChange={val => setFormData({ ...formData, birthMonth: val })} />
            <InputGroup label="日" value={formData.birthDay} onChange={val => setFormData({ ...formData, birthDay: val })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="时 (0-23)" value={formData.birthHour} onChange={val => setFormData({ ...formData, birthHour: val })} />
            <InputGroup label="分" value={formData.birthMinute} onChange={val => setFormData({ ...formData, birthMinute: val })} />
          </div>
        </div>

        {/* 出生地点 */}
        <div className="space-y-2">
          <label className="flex items-center text-[11px] font-semibold text-[#00ff00]/70 tracking-wider">
            <MapPin className="w-3.5 h-3.5 mr-2 text-[#00ff00]" /> 出生地点
          </label>
          <input
            type="text"
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/20 rounded-xl px-4 py-3.5 focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/20 outline-none text-white transition-all duration-200 placeholder:text-gray-600 hover:border-[#00ff00]/40"
            value={formData.birthLocation}
            onChange={e => setFormData({ ...formData, birthLocation: e.target.value })}
            placeholder="城市, 省份..."
          />
        </div>

        {/* 人生大事件 */}
        <div className="border-t border-[#00ff00]/10 pt-8 space-y-5 text-left">
          <div>
            <h3 className="text-xs font-bold text-[#00ff00] tracking-widest mb-1.5">校准引擎</h3>
            <p className="text-[11px] text-gray-500">添加过去的重大人生事件以提高预测准确度</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="number"
              className="w-28 bg-[#0a0a0a] border border-[#00ff00]/20 rounded-xl px-4 py-3.5 text-white focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/20 outline-none transition-all duration-200 hover:border-[#00ff00]/40"
              placeholder="年份"
              value={newEvent.year}
              onChange={e => setNewEvent({ ...newEvent, year: parseInt(e.target.value) })}
            />
            <input
              type="text"
              className="flex-1 bg-[#0a0a0a] border border-[#00ff00]/20 rounded-xl px-4 py-3.5 text-white focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/20 outline-none transition-all duration-200 placeholder:text-gray-600 hover:border-[#00ff00]/40"
              placeholder="事件 (如: 结婚, 升职, 创业)"
              value={newEvent.event}
              onChange={e => setNewEvent({ ...newEvent, event: e.target.value })}
            />
            <select
              className="bg-[#0a0a0a] border border-[#00ff00]/20 rounded-xl px-4 py-3.5 text-sm text-[#00ff00] font-semibold focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/20 outline-none cursor-pointer transition-all duration-200 hover:border-[#00ff00]/40"
              value={newEvent.sentiment}
              onChange={(e: any) => setNewEvent({ ...newEvent, sentiment: e.target.value })}
            >
              <option value="positive" className="bg-[#0a0a0a] text-[#00ff00]">好事 📈</option>
              <option value="negative" className="bg-[#0a0a0a] text-[#00ff00]">坏事 📉</option>
              <option value="neutral" className="bg-[#0a0a0a] text-[#00ff00]">中性</option>
            </select>
            <button
              type="button"
              onClick={addEvent}
              className="p-3.5 bg-[#00ff00] text-black hover:bg-white rounded-xl transition-all duration-200 font-bold shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.majorEvents.map((ev, i) => (
              <div key={i} className="flex justify-between items-center bg-[#00ff00]/5 p-4 rounded-xl text-sm border border-[#00ff00]/10 group hover:border-[#00ff00]/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[#00ff00] font-bold">{ev.year}</span>
                  <span className="text-white font-medium">{ev.event}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${ev.sentiment === 'positive' ? 'bg-red-500/20 text-red-400' : ev.sentiment === 'negative' ? 'bg-white/10 text-white' : 'bg-[#00ff00]/20 text-[#00ff00]'}`}>
                    {ev.sentiment === 'positive' ? '好事' : ev.sentiment === 'negative' ? '坏事' : '中性'}
                  </span>
                  <button type="button" onClick={() => removeEvent(i)} className="text-gray-600 hover:text-[#00ff00] transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-white hover:to-gray-100 text-black font-black py-5 rounded-2xl transition-all duration-300 flex justify-center items-center shadow-[0_0_40px_rgba(0,255,0,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          {isLoading ? <Loader2 className="animate-spin mr-3 w-5 h-5" /> : null}
          <span className="tracking-widest text-lg relative z-10">{isLoading ? "正在分析命盘..." : "开始算命"}</span>
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-semibold text-[#00ff00]/70 uppercase tracking-wider block">{label}</span>
      <input
        type="number"
        className="w-full bg-[#0a0a0a] border border-[#00ff00]/20 rounded-lg px-4 py-3 text-white text-sm focus:border-[#00ff00] focus:ring-2 focus:ring-[#00ff00]/20 outline-none transition-all duration-200 placeholder:text-gray-600 hover:border-[#00ff00]/40"
        value={value}
        onChange={e => onChange(parseInt(e.target.value) || 0)}
      />
    </div>
  )
}