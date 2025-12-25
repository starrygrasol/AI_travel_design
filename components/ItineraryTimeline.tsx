import React, { useState } from 'react';
import { DayItinerary, LocationCard, TransportLeg } from '../types';
import { Sun, CloudRain, Wind, MapPin, Navigation, ChevronRight, ArrowDown, Wallet, BedDouble, Moon, Clock } from './Icons';

interface Props {
  days: DayItinerary[];
  onLocationClick: (loc: LocationCard) => void;
}

export const ItineraryTimeline: React.FC<Props> = ({ days, onLocationClick }) => {
  const [activeDay, setActiveDay] = useState(0);

  const getWeatherIcon = (weather: string) => {
    const w = weather.toLowerCase();
    if (w.includes('rain') || w.includes('shower') || w.includes('雨')) return <CloudRain size={16} className="text-blue-500" />;
    if (w.includes('wind') || w.includes('风')) return <Wind size={16} className="text-slate-500" />;
    return <Sun size={16} className="text-amber-500" />;
  };

  const currentDay = days[activeDay];

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Day Selector (Sidebar on desktop, Top bar on mobile) */}
      <div className="md:w-64 bg-white border-r border-slate-200 md:h-full overflow-y-auto flex md:flex-col shrink-0">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDay(idx)}
            className={`flex-1 md:flex-none text-left p-4 border-b border-slate-100 transition-colors
              ${activeDay === idx ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}
            `}
          >
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Day {day.dayNumber}</div>
            <div className="font-bold text-slate-800 mb-1">{day.date}</div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white inline-block px-2 py-1 rounded-full shadow-sm border border-slate-100">
               {getWeatherIcon(day.weatherForecast)}
               <span className="truncate max-w-[100px]">{day.weatherForecast}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Timeline Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50">
        <div className="max-w-2xl mx-auto">
          {/* Day Header Advice */}
          <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-10 shadow-lg shadow-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Day {currentDay.dayNumber} Plan</h2>
              <div className="flex items-center gap-2 bg-indigo-500/50 px-3 py-1 rounded-lg">
                {getWeatherIcon(currentDay.weatherForecast)}
                <span className="text-sm font-medium">{currentDay.weatherForecast}</span>
              </div>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
              💡 Tip: {currentDay.weatherAdvice}
            </p>
          </div>

          {/* Activity Cards with Connectors */}
          <div className="relative pb-10">
            {currentDay.activities.map((activity, idx) => (
              <div key={activity.id} className="relative pl-8 md:pl-0">
                
                {/* Connector Line */}
                {/* We extend the line if there is a next activity OR if we have accommodation at the end */}
                <div className={`absolute left-8 md:left-1/2 top-24 bottom-[-24px] w-0.5 bg-slate-300 md:-ml-[1px] hidden md:block z-0 ${(idx === currentDay.activities.length - 1 && !currentDay.accommodation) ? 'hidden' : ''}`}></div>
                <div className={`absolute left-[19px] top-20 bottom-[-20px] w-0.5 bg-slate-300 block md:hidden z-0 ${(idx === currentDay.activities.length - 1 && !currentDay.accommodation) ? 'hidden' : ''}`}></div>

                <div className="md:flex items-center justify-between gap-8 mb-8 relative z-10 group">
                  
                  {/* Time / Transport Info (Left Side on Desktop) */}
                  <div className="md:w-1/2 md:text-right md:pr-8 mb-2 md:mb-0">
                    <div className="hidden md:flex flex-col items-end">
                       {activity.timeSlot && (
                         <div className="text-sm font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-100 shadow-sm mb-1">
                           {activity.timeSlot}
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-0 md:left-1/2 md:-ml-4 top-6 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white border-4 border-indigo-600 shadow-md flex items-center justify-center z-20">
                    <span className="font-bold text-xs text-indigo-800">{idx + 1}</span>
                  </div>

                  {/* Card (Right Side on Desktop) */}
                  <div className="md:w-1/2 md:pl-8 pl-6">
                    <div 
                      onClick={() => onLocationClick(activity)}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group-hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-wide w-fit">
                            {activity.type}
                          </span>
                          {/* Mobile Time Slot */}
                          {activity.timeSlot && (
                            <span className="md:hidden text-xs font-semibold text-slate-600 flex items-center gap-1">
                              <Clock size={12} /> {activity.timeSlot}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                           <span className="text-xs text-slate-400">
                             {activity.recommendedDuration}
                           </span>
                           {activity.cost && (
                             <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                               <Wallet size={12} /> {activity.cost}
                             </span>
                           )}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                        {activity.name}
                        <ChevronRight size={16} className="text-indigo-400" />
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{activity.description}</p>
                    </div>

                    {/* Transport to NEXT */}
                    {activity.transportToNext && (
                      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-3 text-sm text-slate-500 bg-slate-100/50 p-3 rounded-lg border border-slate-100 w-fit">
                        <div className="flex items-center gap-2">
                          <Navigation size={16} className="text-indigo-500" />
                          <span className="font-semibold text-slate-700">{activity.transportToNext.type}</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></div>
                        <span>{activity.transportToNext.duration}</span>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className="text-emerald-600 font-medium">{activity.transportToNext.cost}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Accommodation Section */}
            {currentDay.accommodation && (
              <div className="relative pl-8 md:pl-0 animate-fade-in-up">
                 <div className="md:flex items-center justify-between gap-8 relative z-10 group">
                  
                  <div className="md:w-1/2 md:text-right md:pr-8 mb-2 md:mb-0">
                     <span className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium justify-end w-full">
                       <Moon size={16} /> End of Day
                     </span>
                  </div>

                  <div className="absolute left-0 md:left-1/2 md:-ml-4 top-6 md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-slate-800 shadow-md flex items-center justify-center z-20">
                    <BedDouble size={18} className="text-white" />
                  </div>

                  <div className="md:w-1/2 md:pl-8 pl-6">
                    <div className="bg-slate-800 p-5 rounded-2xl shadow-lg border border-slate-700 text-white">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-slate-700 text-slate-300 uppercase tracking-wide">
                          Stay
                        </span>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-semibold text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-800">
                               <Wallet size={12} /> {currentDay.accommodation.cost}
                           </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {currentDay.accommodation.name}
                      </h3>
                      <p className="text-sm text-slate-300 mb-2">{currentDay.accommodation.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={12} />
                        {currentDay.accommodation.locationContext}
                      </div>
                    </div>
                  </div>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};