import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { GuideModal } from './components/GuideModal';
import { CreativeBot } from './components/CreativeBot';
import { generateItinerary } from './services/geminiService';
import { ItineraryResponse, TravelInput, LocationCard } from './types';
import { Map, Navigation } from './components/Icons';

function App() {
  const [step, setStep] = useState<'input' | 'planning' | 'itinerary'>('input');
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [inputData, setInputData] = useState<TravelInput | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationCard | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'creative'>('timeline');

  const handlePlanTrip = async (data: TravelInput) => {
    setInputData(data);
    setStep('planning');
    try {
      // Pass the entire data object which now contains language, pace, etc.
      const result = await generateItinerary(data);
      setItinerary(result);
      setStep('itinerary');
    } catch (error) {
      alert("Failed to generate itinerary. Please try again.");
      setStep('input');
    }
  };

  const getLoadingText = () => {
    if (!inputData) return "Loading...";
    return inputData.language === 'zh' 
      ? `正在为您规划前往 ${inputData.destination} 的旅程...` 
      : `Crafting your journey to ${inputData.destination}...`;
  };

  const getLoadingSubText = () => {
    if (!inputData) return "";
    return inputData.language === 'zh'
      ? "正在分析天气，计算最佳路线，并根据您的预算寻找最佳景点。"
      : "Analyzing weather patterns, calculating routes, and finding the best hidden gems for your budget.";
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shrink-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('input')}>
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Navigation size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Wanderlust<span className="text-indigo-600">AI</span></span>
        </div>
        
        {step === 'itinerary' && (
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'timeline' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {inputData?.language === 'zh' ? '行程安排' : 'Itinerary'}
            </button>
            <button
              onClick={() => setActiveTab('creative')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'creative' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {inputData?.language === 'zh' ? '旅行工具' : 'Travel Tools'}
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-slate-50">
        
        {step === 'input' && (
          <div className="h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
             <InputForm onSubmit={handlePlanTrip} isLoading={false} />
          </div>
        )}

        {step === 'planning' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-pulse">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Map className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{getLoadingText()}</h2>
            <p className="text-slate-500 max-w-md">
              {getLoadingSubText()}
            </p>
          </div>
        )}

        {step === 'itinerary' && itinerary && inputData && (
          <>
            {activeTab === 'timeline' ? (
              <ItineraryTimeline 
                days={itinerary.days} 
                onLocationClick={setSelectedLocation}
              />
            ) : (
              <div className="h-full overflow-y-auto">
                <CreativeBot destination={inputData.destination} language={inputData.language} />
              </div>
            )}

            {/* Guide Modal Overlay */}
            {selectedLocation && (
              <GuideModal
                location={selectedLocation}
                destination={inputData.destination}
                language={inputData.language}
                onClose={() => setSelectedLocation(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
