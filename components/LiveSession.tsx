
import React, { useState, useEffect, useRef } from 'react';
import { useLiveGemini } from '../hooks/useLiveGemini';
import { Mic, MicOff, AlertCircle, FileText, Loader2, Info, CheckCircle2, ListChecks } from 'lucide-react';
import { generateDocumentFromTranscript } from '../services/geminiService';
import { DocumentData, AppLanguage } from '../types';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analyticsUtils';
import { translations } from '../translations';

interface Props {
  systemInstruction: string;
  onSave: (doc: DocumentData) => void;
  onOpenDoc: (doc: DocumentData) => void;
  language?: AppLanguage;
}

export const LiveSession: React.FC<Props> = ({ systemInstruction, onSave, onOpenDoc, language = AppLanguage.EN }) => {
  const { connect, disconnect, getTranscript, getVolume, isConnected, isSpeaking, error } = useLiveGemini(systemInstruction);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const transcriptTimerRef = useRef<number | null>(null);

  const t = translations[language].live;
  const stageKeys = ['extract', 'analyze', 'structure', 'finalize'] as const;

  useEffect(() => {
    if (isConnected) {
      transcriptTimerRef.current = window.setInterval(() => {
        setLiveTranscript(getTranscript());
      }, 500);
    } else {
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    }
    return () => { if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current); };
  }, [isConnected, getTranscript]);

  const handleConnect = () => {
    setGenError(null);
    trackEvent(ANALYTICS_EVENTS.START_LIVE);
    connect();
  };

  const handleEndAndGenerate = async () => {
    // 1. Snapshot the transcript IMMEDIATELY while still connected
    const finalTranscript = getTranscript();
    console.log("Captured transcript for generation:", finalTranscript.length, "chars");

    // 2. Shut down the live session
    await disconnect();

    if (!finalTranscript || finalTranscript.trim().length < 10) {
      alert(language === AppLanguage.PT ? "Conversa muito curta." : "Conversation too short.");
      return;
    }

    setIsGenerating(true);
    setCurrentStage(0);
    setGenError(null);

    try {
      setCurrentStage(1);
      // Generate the strategic report using the standard text model
      const doc = await generateDocumentFromTranscript(
        finalTranscript,
        systemInstruction,
        "Same as Audio" 
      );
      
      setCurrentStage(2);
      onSave(doc);
      
      setCurrentStage(3);
      await new Promise(r => setTimeout(r, 500));
      onOpenDoc(doc);
      
    } catch (e: any) {
      console.error("Critical Generation Error:", e);
      setIsGenerating(false);
      setGenError(e.message || "Failed to build report. Your dialogue was saved as a fallback.");
      
      // Fallback: Save what we have
      const fallback: DocumentData = {
        id: "fb-" + Date.now().toString(36),
        createdAt: Date.now(),
        summary: "Strategic generation failed. Raw transcript preserved.",
        topics: [{ title: "Transcript Recovery", description: "The AI failed to summarize, but the text was captured." }],
        transcription: finalTranscript,
        language: "Detected"
      };
      onSave(fallback);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-10 px-6 max-w-xl mx-auto">
        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl animate-pulse">
           {currentStage + 1}
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900">{t.stages[stageKeys[currentStage]].label}</h3>
          <p className="text-gray-500 mt-1 italic text-sm">{t.stages[stageKeys[currentStage]].sub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col items-center justify-center overflow-y-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600 text-sm">{t.desc}</p>
      </div>

      <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center transition-all mb-8 shadow-xl ${
        isConnected ? 'bg-white ring-8 ring-indigo-50' : 'bg-gray-100'
      }`}>
        {isConnected ? (
           <div className="text-indigo-600 font-black animate-pulse uppercase tracking-widest">
             {isSpeaking ? "AI Speaking" : "Listening"}
           </div>
        ) : (
           <MicOff className="w-16 h-16 text-gray-300" />
        )}
      </div>

      {(error || genError) && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-100 px-6 py-4 rounded-2xl mb-8 max-w-md">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div className="text-sm font-medium">{error || genError}</div>
        </div>
      )}

      {isConnected && (
         <div className="w-full max-w-lg mb-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-40 flex flex-col">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-50 pb-2">Conversation Feed</div>
            <div className="flex-1 overflow-y-auto text-xs text-gray-500 space-y-1 custom-scrollbar">
               {liveTranscript ? liveTranscript.split('\n').map((l, i) => <p key={i}>{l}</p>) : "Awaiting voice signal..."}
            </div>
         </div>
      )}

      {!isConnected ? (
        <button onClick={handleConnect} className="flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg shadow-2xl transition-all transform hover:scale-105 bg-indigo-600 hover:bg-indigo-500 text-white uppercase tracking-widest">
          <Mic className="w-6 h-6" /> {t.ctaStart}
        </button>
      ) : (
        <button onClick={handleEndAndGenerate} className="flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg shadow-2xl transition-all transform hover:scale-105 bg-gray-900 hover:bg-black text-white uppercase tracking-widest">
          <FileText className="w-6 h-6" /> {t.ctaFinish}
        </button>
      )}
    </div>
  );
};
