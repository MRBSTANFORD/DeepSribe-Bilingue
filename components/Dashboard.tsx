
import React from 'react';
import { Upload, Mic, FileText, BrainCircuit, Sparkles, ArrowRight, Clock, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { DocumentData, AppView, AppSettings, AppLanguage } from '../types';
import { translations } from '../translations';
import { BrandedText } from '../App';

interface Props {
  documents: DocumentData[];
  onNavigate: (view: AppView) => void;
  onOpenDoc: (doc: DocumentData) => void;
  settings: AppSettings;
}

export const BANNER_STYLES: Record<string, any> = {
  midnight: { container: "bg-gradient-to-r from-indigo-950 via-slate-950 to-gray-900 border-indigo-900/50", contentClass: "text-white", descriptionClass: "text-slate-300 border-indigo-500/30", iconColor: "text-yellow-500", accentText: "text-yellow-400", button: "bg-white/10 hover:bg-white text-white hover:text-indigo-950 border-white/20", glow: "bg-blue-500/10" },
  sunrise: { container: "bg-gradient-to-r from-orange-500 to-rose-600 border-orange-400/50", contentClass: "text-white", descriptionClass: "text-orange-50 border-white/30", iconColor: "text-yellow-300", accentText: "text-yellow-200", button: "bg-white/20 hover:bg-white text-white hover:text-rose-600 border-white/30", glow: "bg-yellow-500/20" },
  forest: { container: "bg-gradient-to-r from-emerald-900 to-teal-900 border-emerald-800/50", contentClass: "text-white", descriptionClass: "text-emerald-100 border-emerald-500/30", iconColor: "text-emerald-400", accentText: "text-emerald-300", button: "bg-white/10 hover:bg-white text-white hover:text-teal-900 border-white/20", glow: "bg-emerald-500/10" },
  ocean: { container: "bg-gradient-to-r from-blue-900 to-cyan-800 border-blue-800/50", contentClass: "text-white", descriptionClass: "text-blue-100 border-blue-500/30", iconColor: "text-cyan-400", accentText: "text-cyan-300", button: "bg-white/10 hover:bg-white text-white hover:text-blue-900 border-white/20", glow: "bg-cyan-500/10" },
  nebula: { container: "bg-gradient-to-r from-purple-900 via-fuchsia-900 to-indigo-900 border-purple-800/50", contentClass: "text-white", descriptionClass: "text-purple-100 border-purple-500/30", iconColor: "text-fuchsia-400", accentText: "text-fuchsia-300", button: "bg-white/10 hover:bg-white text-white hover:text-purple-900 border-white/20", glow: "bg-purple-500/10" },
  obsidian: { container: "bg-gradient-to-r from-gray-900 to-black border-gray-800", contentClass: "text-white", descriptionClass: "text-gray-400 border-gray-700", iconColor: "text-white", accentText: "text-white", button: "bg-white text-black hover:bg-gray-200 border-transparent", glow: "bg-white/5" },
  royal: { container: "bg-gradient-to-r from-indigo-800 to-purple-800 border-indigo-700", contentClass: "text-white", descriptionClass: "text-indigo-100 border-indigo-400/30", iconColor: "text-amber-400", accentText: "text-amber-300", button: "bg-white/10 hover:bg-white text-white hover:text-indigo-900 border-white/20", glow: "bg-amber-500/10" },
  polar: { container: "bg-gradient-to-r from-white via-slate-50 to-blue-50 border-blue-100", contentClass: "text-slate-900", descriptionClass: "text-slate-600 border-blue-200", iconColor: "text-blue-200", accentText: "text-blue-600", button: "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm", glow: "bg-blue-200/50" },
  classic: { container: "bg-[#FDFBF7] border-stone-200", contentClass: "text-stone-800", descriptionClass: "text-stone-600 border-stone-300", iconColor: "text-stone-200", accentText: "text-stone-600", button: "bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 shadow-sm", glow: "bg-stone-100" },
  mint: { container: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100", contentClass: "text-teal-900", descriptionClass: "text-teal-700 border-teal-200", iconColor: "text-emerald-200", accentText: "text-teal-600", button: "bg-white border border-emerald-200 text-teal-800 hover:bg-emerald-50 shadow-sm", glow: "bg-emerald-100" },
  sky: { container: "bg-gradient-to-r from-sky-50 to-blue-50 border-sky-100", contentClass: "text-sky-900", descriptionClass: "text-sky-700 border-sky-200", iconColor: "text-sky-200", accentText: "text-sky-600", button: "bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 shadow-sm", glow: "bg-sky-100" },
  lavender: { container: "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-100", contentClass: "text-purple-900", descriptionClass: "text-purple-700 border-purple-200", iconColor: "text-purple-200", accentText: "text-purple-600", button: "bg-white border border-purple-200 text-purple-800 hover:bg-purple-50 shadow-sm", glow: "bg-purple-100" },
  blush: { container: "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100", contentClass: "text-rose-900", descriptionClass: "text-rose-700 border-rose-200", iconColor: "text-rose-200", accentText: "text-rose-600", button: "bg-white border border-rose-200 text-rose-800 hover:bg-rose-50 shadow-sm", glow: "bg-rose-100" },
  ivory: { container: "bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-100", contentClass: "text-amber-900", descriptionClass: "text-amber-800/80 border-amber-200", iconColor: "text-amber-200", accentText: "text-amber-700", button: "bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 shadow-sm", glow: "bg-amber-100" }
};

export const Dashboard: React.FC<Props> = ({ documents, onNavigate, onOpenDoc, settings }) => {
  const recentDocs = documents.slice(0, 3);
  const language = settings.appLanguage || AppLanguage.EN;
  const d = translations[language].dashboard;
  const bannerStyle = settings.bannerStyle || 'midnight';
  const style = BANNER_STYLES[bannerStyle] || BANNER_STYLES.midnight;

  return (
    <div className="max-w-6xl mx-auto p-8 pb-20">
      {/* Hero Section */}
      <div className="mb-12 text-center py-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          {d.title} <span className="text-blue-600">{d.subtitle}</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          <BrandedText text={d.desc} />
        </p>
      </div>

      {/* Philosophy / How it Works */}
      <div className="grid md:grid-cols-3 gap-8 mb-12 relative">
        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>
        {d.steps.map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center relative group hover:border-indigo-100 transition-colors">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white">
              {idx === 0 ? <Mic className="w-8 h-8" /> : idx === 1 ? <FileText className="w-8 h-8" /> : <BrainCircuit className="w-8 h-8" />}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Science Teaser Banner */}
      <div 
        onClick={() => {
           onNavigate(AppView.HELP);
           // After a short delay to ensure component render, scroll to science section
           setTimeout(() => {
             const el = document.getElementById('science-methodology');
             if (el) el.scrollIntoView({ behavior: 'smooth' });
           }, 100);
        }}
        className={`mb-16 rounded-xl p-8 shadow-xl cursor-pointer group relative overflow-hidden border ${style.container}`}
      >
        <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform duration-700 ease-out">
           <Lightbulb className={`w-48 h-48 blur-sm ${style.iconColor}`} />
        </div>
        <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl ${style.glow}`}></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
           <div className="flex-1">
              <div className={`flex items-center gap-2 font-bold uppercase tracking-wider text-xs mb-3 ${style.accentText}`}>
                 <Sparkles className="w-4 h-4" /> {d.scienceBanner.tag}
              </div>
              <h3 className={`text-2xl md:text-3xl font-serif font-bold mb-3 ${style.contentClass}`}>
                 {d.scienceBanner.title}
              </h3>
              <p className={`max-w-2xl leading-relaxed text-sm md:text-base border-l-2 pl-4 ${style.descriptionClass}`}>
                 <BrandedText text={d.scienceBanner.desc} deepColorClass={style.contentClass === 'text-white' ? 'text-white' : 'text-gray-900'} />
              </p>
           </div>
           <button className={`whitespace-nowrap px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 backdrop-blur-sm shadow-sm group-hover:shadow-lg ${style.button}`}>
              {d.scienceBanner.cta} <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <button onClick={() => onNavigate(AppView.GENERATOR)} className="group relative overflow-hidden bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Upload className="w-32 h-32 text-blue-600" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600"><Upload className="w-6 h-6" /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{d.actions.upload.title}</h3>
            <p className="text-gray-500 mb-6">{d.actions.upload.desc}</p>
            <span className="inline-flex items-center font-bold text-blue-600 group-hover:translate-x-1 transition-transform">{d.actions.upload.cta} <ArrowRight className="w-4 h-4 ml-2" /></span>
          </div>
        </button>
        <button onClick={() => onNavigate(AppView.LIVE)} className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Mic className="w-32 h-32 text-indigo-600" /></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-100"><Mic className="w-6 h-6" /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{d.actions.live.title}</h3>
            <p className="text-gray-500 mb-6">{d.actions.live.desc}</p>
            <span className="inline-flex items-center font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">{d.actions.live.cta} <ArrowRight className="w-4 h-4 ml-2" /></span>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      {recentDocs.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-500" /> {d.recent}</h2>
            <button onClick={() => onNavigate(AppView.HISTORY)} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">{d.viewAll}</button>
          </div>
          <div className="space-y-3">
            {recentDocs.map(doc => (
              <div key={doc.id} onClick={() => onOpenDoc(doc)} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{doc.topics[0]?.title || "Untitled Document"}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">{new Date(doc.createdAt).toLocaleDateString()} • {doc.summary.substring(0, 80)}...</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
