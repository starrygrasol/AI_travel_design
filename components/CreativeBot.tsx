import React, { useState } from 'react';
import { generateCreativeSolution } from '../services/geminiService';
import { Sparkles, ArrowRight } from './Icons';

interface Props {
  destination: string;
  language?: 'zh' | 'en';
}

export const CreativeBot: React.FC<Props> = ({ destination, language = 'en' }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await generateCreativeSolution(query, destination, language);
    setResult(res);
    setLoading(false);
  };

  const suggestions = language === 'zh' ? [
    "这个季节穿什么衣服合适？",
    "有什么值得买的纪念品？",
    "当地有什么餐桌礼仪？",
    "独自旅行的安全建议？"
  ] : [
    "What should I pack for this season?",
    "Best unique souvenirs to buy?",
    "Local dining etiquette tips?",
    "Safety advice for solo travelers?"
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{language === 'zh' ? '旅行小助手' : 'Travel Genius'}</h2>
        <p className="text-slate-500">
          {language === 'zh' ? `关于${destination}的任何问题都可以问我` : `Ask anything else about your trip to ${destination}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-2 mb-8">
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-4 rounded-xl outline-none text-slate-900 placeholder:text-slate-400 bg-white"
            placeholder={language === 'zh' ? "例如：自来水能直接喝吗？" : "e.g., Is tap water safe to drink?"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Sparkles className="animate-spin" /> : <ArrowRight />}
          </button>
        </form>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setQuery(s); }}
              className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-sm text-slate-600"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
          <div className="bg-indigo-50 p-6 border-b border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900">{result.title}</h3>
          </div>
          <div className="p-8 prose prose-slate max-w-none text-slate-700 whitespace-pre-line">
            {result.content}
          </div>
          <button 
             onClick={() => setResult(null)}
             className="w-full py-4 text-center text-sm font-semibold text-slate-500 hover:bg-slate-50 border-t border-slate-100"
          >
            {language === 'zh' ? '再问一个' : 'Ask Another Question'}
          </button>
        </div>
      )}
    </div>
  );
};