
import React from 'react';
import { HelpCircle, Mic, BrainCircuit, Sparkles, MousePointerClick, Zap, Activity, MessageSquare, Hand, ListChecks, Search, Globe, Mail, Coins, BookOpen, Move } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../translations';
import { BrandedText } from '../App';

interface Props {
  language?: AppLanguage;
}

export const HelpPanel: React.FC<Props> = ({ language = AppLanguage.EN }) => {
  const h = translations[language].help;
  const contactUrl = translations[language].contactUrl;

  return (
    <div className="max-w-4xl mx-auto p-8 pb-32 overflow-y-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200">
        <div className="bg-blue-100 p-3 rounded-full"><HelpCircle className="w-8 h-8 text-blue-600" /></div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-800">
            <BrandedText text={h.title} />
          </h1>
          <p className="text-gray-500 mt-1">{h.subtitle}</p>
        </div>
      </div>

      {/* Science & Methodology Section */}
      <section id="science-methodology" className="mb-16 scroll-mt-10">
        <div className="bg-white border border-gray-200 rounded-[40px] shadow-sm overflow-hidden p-10 md:p-16 relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
             <BrainCircuit className="w-64 h-64" />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-600 p-2 rounded-lg text-white"><BookOpen className="w-5 h-5" /></div>
                <h2 className="text-2xl font-serif font-black text-gray-900 uppercase tracking-tight">
                  <BrandedText text={h.science.title} />
                </h2>
             </div>
             <p className="text-lg text-gray-500 font-medium italic mb-10 border-l-4 border-indigo-100 pl-6 leading-relaxed text-justify">
               <BrandedText text={h.science.intro} />
             </p>

             <div className="grid gap-10">
                {/* Point 1 */}
                <div className="flex gap-6 items-start">
                   <div className="bg-indigo-50 p-4 rounded-2xl shrink-0"><Move className="w-6 h-6 text-indigo-600" /></div>
                   <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-xl">{h.science.p1.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm text-justify">{h.science.p1.text}</p>
                   </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-6 items-start">
                   <div className="bg-blue-50 p-4 rounded-2xl shrink-0"><Zap className="w-6 h-6 text-blue-600" /></div>
                   <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-xl">{h.science.p2.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm text-justify">{h.science.p2.text}</p>
                   </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-6 items-start">
                   <div className="bg-purple-50 p-4 rounded-2xl shrink-0"><Activity className="w-6 h-6 text-purple-600" /></div>
                   <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-xl">{h.science.p3.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm text-justify">
                        <BrandedText text={h.science.p3.text} />
                      </p>
                   </div>
                </div>
             </div>

             <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <p className="text-slate-700 font-serif italic text-lg">
                  <BrandedText text={h.science.conclusion} />
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Start Checklist */}
      <section className="mb-12">
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border-2 border-blue-500/30">
          <div className="absolute top-0 right-0 p-6 opacity-5"><ListChecks className="w-32 h-32" /></div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-300 uppercase tracking-widest text-xs">
            <Zap className="w-4 h-4" /> {h.goldenPath.tag}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 relative z-10">
            {h.goldenPath.steps.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="text-blue-400 font-black mb-1 text-sm tracking-tighter">0{idx + 1}</div>
                <div className="font-bold mb-1 text-blue-50">{item.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  <BrandedText text={item.text} deepColorClass="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Costs & Limits Section */}
      <section className="mb-12">
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600" /> {h.costs.title}
          </h2>
          <p className="text-sm text-emerald-800 leading-relaxed font-medium">
            <BrandedText text={h.costs.text} />
          </p>
        </div>
      </section>

      {/* Strategic Intelligence Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-purple-600" /> {h.strategic.title}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3"><Search className="w-5 h-5" /> {h.strategic.enrichment.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{h.strategic.enrichment.text}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3"><Globe className="w-5 h-5" /> {h.strategic.multilingual.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{h.strategic.multilingual.text}</p>
          </div>
        </div>
      </section>

      {/* Mastering Live Conversations */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> {h.live.title}</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex gap-4">
             <div className="bg-blue-50 p-3 rounded-xl h-fit"><MessageSquare className="w-6 h-6 text-blue-600" /></div>
             <div>
               <h3 className="font-bold text-gray-900 mb-1">{h.live.directing.title}</h3>
               <p className="text-sm text-gray-600 leading-relaxed">{h.live.directing.text}</p>
             </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-red-50 p-3 rounded-xl h-fit"><Hand className="w-6 h-6 text-red-500" /></div>
             <div>
               <h3 className="font-bold text-gray-900 mb-1">{h.live.interruptions.title}</h3>
               <p className="text-sm text-gray-600 leading-relaxed">{h.live.interruptions.text}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Power User Tools */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> {h.powerUser.title}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><MousePointerClick className="w-5 h-5 text-blue-600" /> {h.powerUser.selection.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{h.powerUser.selection.text}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-200 transition-colors">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><Mic className="w-5 h-5 text-red-500" /> {h.powerUser.dictation.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{h.powerUser.dictation.text}</p>
          </div>
        </div>
      </section>

      {/* Contact Footnote */}
      <section className="text-center p-8 bg-slate-900 text-white rounded-[40px] border border-blue-500/20">
        <h2 className="text-2xl font-serif font-bold mb-3">
          <BrandedText text={h.moreHelp} deepColorClass="text-white" />
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          <BrandedText text={h.moreHelpDesc} deepColorClass="text-white" />
        </p>
        <div className="flex justify-center gap-3">
          <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-500 transition-all shadow-lg active:scale-95"><Mail className="w-4 h-4"/> {h.btnFeedback}</a>
        </div>
      </section>
    </div>
  );
};
