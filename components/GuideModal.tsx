import React, { useEffect, useState } from 'react';
import { SubSpot, LocationCard } from '../types';
import { generateSpotDetails } from '../services/geminiService';
import { X, Headphones, Camera, Sparkles, MapPin } from './Icons';

interface Props {
  location: LocationCard;
  destination: string;
  language?: 'zh' | 'en'; // Added language prop
  onClose: () => void;
}

export const GuideModal: React.FC<Props> = ({ location, destination, language = 'en', onClose }) => {
  const [subSpots, setSubSpots] = useState<SubSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubSpot, setActiveSubSpot] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      const details = await generateSpotDetails(location.name, destination, language);
      if (isMounted) {
        setSubSpots(details);
        setLoading(false);
      }
    };
    fetchDetails();
    return () => { isMounted = false; };
  }, [location.name, destination, language]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Navigation */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="p-6 bg-indigo-600 text-white pt-10 md:pt-6">
            <h2 className="text-2xl font-bold leading-tight mb-2">{location.name}</h2>
            <div className="flex items-center gap-2 opacity-90 text-sm">
              <span className="bg-white/20 px-2 py-0.5 rounded">{location.type}</span>
              {location.cost && <span>{location.cost}</span>}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              subSpots.map((spot, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSubSpot(idx)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    activeSubSpot === idx 
                      ? 'bg-white border-indigo-500 shadow-md' 
                      : 'bg-white border-transparent hover:bg-indigo-50'
                  }`}
                >
                  <h3 className={`font-semibold ${activeSubSpot === idx ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {spot.name}
                  </h3>
                </button>
              ))
            )}
            {!loading && subSpots.length === 0 && (
              <div className="text-center p-8 text-slate-400">
                <Sparkles className="mx-auto mb-2 opacity-50" />
                <p>
                  {language === 'zh' ? '暂无详细导览。' : 'No specific sub-spots found.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 bg-white overflow-y-auto relative">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Sparkles className="animate-spin mb-4 text-indigo-400" size={32} />
                <p>{language === 'zh' ? '正在为您定制专属导游词...' : 'Curating your personal tour...'}</p>
             </div>
          ) : subSpots.length > 0 ? (
            <div className="p-8 pb-20">
              
              {/* Header without image */}
              <div className="mb-8 pb-4 border-b border-slate-100">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">{subSpots[activeSubSpot].name}</h2>
                 <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin size={16} />
                    <span>{location.name}</span>
                 </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="bg-indigo-50 p-6 rounded-xl mb-8 border border-indigo-100">
                  <div className="flex items-center gap-3 text-indigo-800 font-semibold mb-3">
                    <Headphones size={20} />
                    <span>{language === 'zh' ? '语音导览' : 'Audio Guide Script'}</span>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed text-lg">
                    "{subSpots[activeSubSpot].description}"
                  </p>
                </div>

                {subSpots[activeSubSpot].bestPhotoSpot && (
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mt-1">
                       <Camera size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900">
                        {language === 'zh' ? '最佳拍照点' : 'Best Photo Spot'}
                      </h4>
                      <p className="text-emerald-800 text-sm">{subSpots[activeSubSpot].bestPhotoSpot}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8">
               <h3 className="text-xl font-bold mb-4">{language === 'zh' ? '关于' : 'About'} {location.name}</h3>
               <p className="text-slate-600 leading-relaxed">{location.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
