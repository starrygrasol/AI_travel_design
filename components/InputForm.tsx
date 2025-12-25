import React, { useState } from 'react';
import { TravelInput } from '../types';
import { MapPin, Calendar, Wallet, Sparkles, Clock, Heart, Globe, Plus, X } from './Icons';

interface Props {
  onSubmit: (data: TravelInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [data, setData] = useState<TravelInput>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    language: 'zh',
    pace: 'moderate',
    interests: []
  });
  const [customInterest, setCustomInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !data.interests.includes(customInterest.trim())) {
      setData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
    }
  };

  const handleCustomInterestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  const defaultInterests = [
    { id: 'food', label: data.language === 'zh' ? '美食探店 (必吃榜)' : 'Foodie (Must-Eat List)' },
    { id: 'nature', label: data.language === 'zh' ? '自然风光' : 'Nature' },
    { id: 'culture', label: data.language === 'zh' ? '人文历史' : 'Culture & History' },
    { id: 'shopping', label: data.language === 'zh' ? '购物逛街' : 'Shopping' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100 mb-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <Sparkles size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {data.language === 'zh' ? '开启您的旅程' : 'Start Your Journey'}
        </h1>
        <p className="text-slate-500">
          {data.language === 'zh' ? 'AI 智能规划，量身定制完美假期' : 'Let AI plan your perfect trip in seconds.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setData({ ...data, language: 'zh' })}
            className={`px-4 py-2 rounded-full border flex items-center gap-2 ${data.language === 'zh' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            <Globe size={16} /> 中文
          </button>
          <button
            type="button"
            onClick={() => setData({ ...data, language: 'en' })}
            className={`px-4 py-2 rounded-full border flex items-center gap-2 ${data.language === 'en' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            <Globe size={16} /> English
          </button>
        </div>

        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {data.language === 'zh' ? '目的地' : 'Destination'}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="text"
              placeholder={data.language === 'zh' ? "例如：杭州, 浙江" : "e.g., Hangzhou, China"}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              value={data.destination}
              onChange={(e) => setData({ ...data, destination: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {data.language === 'zh' ? '开始日期' : 'Start Date'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="date"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                value={data.startDate}
                onChange={(e) => setData({ ...data, startDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {data.language === 'zh' ? '结束日期' : 'End Date'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="date"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                value={data.endDate}
                onChange={(e) => setData({ ...data, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {data.language === 'zh' ? '预算 (当地花费)' : 'Local Budget'}
          </label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="text"
              placeholder={data.language === 'zh' ? "例如：5000元 (不含往返大交通)" : "e.g., 5000 CNY (Excl. arrival travel)"}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              value={data.budget}
              onChange={(e) => setData({ ...data, budget: e.target.value })}
            />
          </div>
        </div>

        {/* Pace Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Clock size={16} /> {data.language === 'zh' ? '旅行节奏' : 'Travel Pace'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'busy', label: data.language === 'zh' ? '特种兵 (忙碌)' : 'Busy (6AM Start)' },
              { id: 'moderate', label: data.language === 'zh' ? '标准 (舒适)' : 'Moderate' },
              { id: 'lazy', label: data.language === 'zh' ? '松弛 (慵懒)' : 'Lazy (10AM Start)' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setData({ ...data, pace: option.id as any })}
                className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all ${
                  data.pace === option.id 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {data.pace === 'busy' && (data.language === 'zh' ? '早起晚归，打卡最大化 (6:00 AM 开始)' : 'Maximize sightseeing, start at 6:00 AM.')}
            {data.pace === 'moderate' && (data.language === 'zh' ? '劳逸结合，舒适游玩 (9:00 AM 开始)' : 'Balanced schedule, start at 9:00 AM.')}
            {data.pace === 'lazy' && (data.language === 'zh' ? '睡到自然醒，轻松漫步 (10:00 AM 开始)' : 'Sleep in, relaxed pace, start at 10:00 AM.')}
          </p>
        </div>

        {/* Interest Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Heart size={16} /> {data.language === 'zh' ? '偏好 (多选 & 自定义)' : 'Interests'}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Render Default Options */}
            {defaultInterests.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`py-2 px-4 rounded-full text-sm font-medium border transition-all ${
                  data.interests.includes(interest.id)
                    ? 'bg-rose-50 border-rose-500 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {interest.label}
              </button>
            ))}
            
            {/* Render Custom User Interests */}
            {data.interests.filter(i => !['food', 'nature', 'culture', 'shopping'].includes(i)).map((customInt) => (
               <div
                key={customInt}
                className="py-2 px-4 rounded-full text-sm font-medium border bg-rose-50 border-rose-500 text-rose-700 flex items-center gap-2"
              >
                {customInt}
                <button 
                  type="button"
                  onClick={() => toggleInterest(customInt)}
                  className="hover:text-rose-900"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Custom Interest Input */}
          <div className="flex gap-2">
            <input 
              type="text" 
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={handleCustomInterestKeyDown}
              placeholder={data.language === 'zh' ? "添加自定义偏好 (如: 徒步, 二次元)" : "Add custom interest (e.g. Hiking, Anime)"}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <button 
              type="button"
              onClick={addCustomInterest}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-200 transition-all
            ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}`}
        >
          {isLoading 
            ? (data.language === 'zh' ? '规划生成中...' : 'Generating Plan...') 
            : (data.language === 'zh' ? '开始定制行程' : 'Plan My Trip')}
        </button>
      </form>
    </div>
  );
};