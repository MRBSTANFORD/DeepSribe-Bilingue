
import React, { useState, useEffect } from 'react';
import { Upload, FileAudio, Loader2, Globe, CheckCircle2 } from 'lucide-react';
import { fileToBase64 } from '../utils/audioUtils';
import { generateDocumentFromAudio, enrichTopicWithSearch } from '../services/geminiService';
import { DocumentData, AppSettings, AppLanguage } from '../types';
import { DocViewer } from './DocViewer';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analyticsUtils';
import { translations } from '../translations';

interface Props {
  settings: AppSettings;
  onSave: (doc: DocumentData) => void;
}

const LANGUAGES = [
  "Same as Audio",
  "English",
  "Portuguese",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Chinese",
  "Hindi",
  "Arabic"
];

export const DocGenerator: React.FC<Props> = ({ settings, onSave }) => {
  const [docData, setDocData] = useState<DocumentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState<string>("Same as Audio");

  const language = settings.appLanguage || AppLanguage.EN;
  const t = translations[language].generator;
  
  const stageKeys = ['read', 'analyze', 'structure', 'enrich'] as const;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    trackEvent(ANALYTICS_EVENTS.UPLOAD_AUDIO, { 
      file_type: file.type,
      file_size_mb: (file.size / (1024 * 1024)).toFixed(2)
    });

    setIsProcessing(true);
    setCurrentStage(0);
    setDocData(null);

    try {
      const base64 = await fileToBase64(file);
      
      setCurrentStage(1);
      await new Promise(r => setTimeout(r, 800));
      
      setCurrentStage(2);
      const result = await generateDocumentFromAudio(
        base64, 
        file.type, 
        settings.transcriptionSystemInstruction,
        targetLanguage
      );

      onSave(result);
      setDocData(result);
      
      trackEvent(ANALYTICS_EVENTS.GENERATE_DOC, { 
        method: 'upload', 
        language: targetLanguage 
      });

      await handleEnrichment(result);

    } catch (error) {
      console.error(error);
      alert(language === AppLanguage.PT ? "Erro ao processar áudio. Verifique a sua chave API e o formato do ficheiro." : "Failed to process audio. Please check the API key and file format.");
      setIsProcessing(false);
    }
  };

  const handleEnrichment = async (data: DocumentData) => {
    if (!data.topics || data.topics.length === 0) {
      setIsProcessing(false);
      return;
    }

    setCurrentStage(3);
    
    const newTopics = [...data.topics];
    const topicsToEnrich = newTopics.slice(0, 3);
    
    const effectiveLanguage = targetLanguage === "Same as Audio" 
      ? (data.language || 'English') 
      : targetLanguage;
    
    await Promise.all(topicsToEnrich.map(async (topic, index) => {
       const enrichment = await enrichTopicWithSearch(
         topic.title, 
         topic.description, 
         effectiveLanguage,
         settings.enrichmentPromptTemplate
       );
       newTopics[index].enrichedContent = enrichment.text;
       newTopics[index].sources = enrichment.sources;
    }));

    const finalDoc = { ...data, topics: newTopics };
    setDocData(finalDoc);
    onSave(finalDoc); 
    setIsProcessing(false);
  };

  const handleReset = () => {
    setDocData(null);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-10 px-6 max-w-xl mx-auto">
        <div className="relative">
          <Loader2 className="w-20 h-20 text-indigo-600 animate-spin opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse">
                {currentStage + 1}
             </div>
          </div>
        </div>
        
        <div className="w-full space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900">{t.stages[stageKeys[currentStage]].label}</h3>
            <p className="text-gray-500 mt-1 italic">{t.stages[stageKeys[currentStage]].sub}</p>
          </div>

          <div className="space-y-3">
             {stageKeys.map((key, i) => (
               <div key={key} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${i === currentStage ? 'bg-indigo-50 border border-indigo-100 shadow-sm scale-105' : 'opacity-40'}`}>
                  {i < currentStage ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : i === currentStage ? (
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm font-bold uppercase tracking-wider ${i === currentStage ? 'text-indigo-900' : 'text-gray-400'}`}>{key}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  if (docData) {
    return <DocViewer docData={docData} onBack={handleReset} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white p-12 rounded-2xl shadow-xl text-center border-2 border-dashed border-gray-200 hover:border-doc-accent transition-colors max-w-2xl w-full relative">
        
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Upload className="w-10 h-10 text-doc-accent" />
        </div>
        
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">{t.title}</h2>
        <p className="text-gray-500 mb-8 text-lg">{t.desc}</p>

        {/* Language Selector */}
        <div className="mb-8 flex items-center justify-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-600">{t.outputLang}</label>
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
        </div>

        <label className="inline-flex items-center justify-center px-8 py-4 bg-doc-accent text-white rounded-lg font-medium cursor-pointer hover:bg-blue-600 transition-all shadow-md text-lg">
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <FileAudio className="w-5 h-5 mr-2" />
          {t.cta}
        </label>
      </div>
    </div>
  );
};
