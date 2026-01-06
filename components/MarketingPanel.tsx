
import React, { useState, useEffect } from 'react';
import { Copy, Download, Image as ImageIcon, Share2, Loader2, Sparkles, Send, Linkedin, Twitter, Briefcase, Trees, Palette, BrainCircuit, Brain, Atom, Component, AudioWaveform, Eye, FileText, Lightbulb, ArrowRight, Check, BarChart3, Activity, Zap, ExternalLink, MessageCircle, Mail, Mic, ChevronDown, ChevronUp, Database, Wifi, Instagram } from 'lucide-react';
import { generateMarketingImage } from '../services/geminiService';
import { AppSettings, AppLanguage } from '../types';
import { BANNER_STYLES } from './Dashboard';
import { ANALYTICS_EVENTS, getTrackingStatus, trackEvent } from '../utils/analyticsUtils';
import { translations } from '../translations';

// --- EXPANDED IMAGE PRESETS ---
const IMAGE_PROMPTS = [
  {
    category: "Professional / Corporate",
    icon: <Briefcase className="w-4 h-4" />,
    prompts: [
      { title: "Clean Corporate (Woman)", description: "Minimalist workspace, professional woman", prompt: "A high-end, minimalist corporate workspace. A professional woman in a sleek charcoal blazer is sitting at a white marble desk with a slim laptop and a high-end silver condenser microphone. Soft morning light, cinematic bokeh background of a modern city. 8k, professional photography." },
      { title: "Clean Corporate (Man)", description: "Minimalist workspace, professional man", prompt: "A high-end, minimalist corporate workspace. A professional man in a tailored light blue shirt is sitting at a dark oak desk with a modern laptop and a professional digital audio recorder. Clean lines, soft depth of field, sophisticated corporate aesthetic. 8k, cinematic lighting." }
    ]
  },
  {
    category: "Creativity & Mind",
    icon: <BrainCircuit className="w-4 h-4" />,
    prompts: [
      { title: "Neural Abstract (Pulse)", description: "Brain made of electric light", prompt: "An abstract, glowing neural network where intense light pulses move between nodes, forming the shape of a human brain. Vibrant electric blues, neon purples, and deep blacks. Octane render, 3D, digital masterpiece." }
    ]
  }
];

const SOCIAL_POSTS = (language: AppLanguage) => [
  {
    platform: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    color: "bg-[#0077b5]",
    text: language === AppLanguage.PT ? 
      `🚀 Acabei de começar a usar o DeepScribe para potenciar o meu brainstorming. \n\nÉ uma ferramenta "private-first" que transforma as minhas notas de voz desarrumadas em documentos estruturados, resumos executivos e planos de investigação. \n\nO que eu adoro:\n✅ Sem custos de servidor (Bring Your Own Key)\n✅ Os dados ficam no meu navegador\n✅ Enriquecimento web com IA para cada tópico\n\nExperimentem se quiserem transformar o vosso "pensar em voz alta" em ativos estratégicos.\n\n#Produtividade #IA #Gemini #PensamentoEstrategico` :
      `🚀 I've just started using DeepScribe to supercharge my brainstorming. \n\nIt's a "private-first" tool that turns my messy voice notes into structured documents, executive summaries, and research plans. \n\nWhat I love:\n✅ No server costs (Bring Your Own Key)\n✅ Data stays in my browser\n✅ AI-powered web enrichment for every topic\n\nCheck it out if you want to turn your "thinking out loud" into strategic assets.\n\n#Productivity #AI #Gemini #StrategicThinking`
  },
  {
    platform: "Twitter / X",
    icon: <Twitter className="w-5 h-5" />,
    color: "bg-black",
    text: language === AppLanguage.PT ?
      `Cansado de perder as suas melhores ideias no "vazio das notas de voz"? 🎙️\n\nEu uso o DeepScribe para estruturar as minhas ideias usando o Gemini 2.5 Flash. \n\nOrganize o caos. Discuta com os seus docs. Privado e gratuito.\n\n[LINK]` :
      `Tired of losing your best ideas to the "voice memo void"? 🎙️\n\nI use DeepScribe to structure my ideas using Gemini 2.5 Flash. \n\nStructure the chaos. Discuss with your docs. Private and free.\n\n[LINK]`
  }
];

const SignalVerifier = ({ language }: { language: AppLanguage }) => {
  const [pulseLog, setPulseLog] = useState<{name: string, time: string}[]>([]);
  const [diagnostics, setDiagnostics] = useState({
    mic: 'checking',
    key: 'checking',
    storage: 'checking'
  });
  const t = translations[language].marketing.analytics;

  useEffect(() => {
    const update = () => {
       const rawLog = localStorage.getItem('ga_session_pulse') || '[]';
       setPulseLog(JSON.parse(rawLog).slice(0, 5));
       
       const storageSize = JSON.stringify(localStorage).length;
       setDiagnostics({
         mic: (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? 'active' : 'unsupported',
         key: process.env.API_KEY ? 'active' : 'missing',
         storage: storageSize > 0 ? 'healthy' : 'empty'
       });
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className={`p-2 rounded-xl ${diagnostics.mic === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}><Mic className="w-5 h-5" /></div>
            <div>
               <div className="text-[10px] font-black text-slate-500 uppercase">{t.diagnosticMic}</div>
               <div className="text-sm font-bold text-white">{diagnostics.mic === 'active' ? 'READY' : 'BLOCKED'}</div>
            </div>
         </div>
         <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className={`p-2 rounded-xl ${diagnostics.key === 'active' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-red-500/20 text-red-400'}`}><Brain className="w-5 h-5" /></div>
            <div>
               <div className="text-[10px] font-black text-slate-500 uppercase">{t.diagnosticKey}</div>
               <div className="text-sm font-bold text-white">{diagnostics.key === 'active' ? 'ACTIVE' : 'MISSING'}</div>
            </div>
         </div>
         <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className={`p-2 rounded-xl ${diagnostics.storage === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-emerald-400'}`}><Database className="w-5 h-5" /></div>
            <div>
               <div className="text-[10px] font-black text-slate-500 uppercase">{t.diagnosticStorage}</div>
               <div className="text-sm font-bold text-white">{diagnostics.storage.toUpperCase()}</div>
            </div>
         </div>
      </div>

      <div className="bg-black/40 p-8 rounded-[40px] border border-white/5">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-indigo-400" />
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.pulseLabel}</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full"><Wifi className="w-3 h-3"/> CONNECTED</span>
         </div>
         <div className="space-y-3 font-mono text-[11px]">
            {pulseLog.length === 0 ? (
              <div className="text-slate-600 italic py-4">Waiting for signals...</div>
            ) : (
              pulseLog.map((log, i) => (
                <div key={i} className="flex gap-4 text-green-400 border-b border-white/5 pb-2 last:border-0 animate-in slide-in-from-left">
                   <span className="text-slate-500">[{log.time}]</span>
                   <span className="font-bold">GA4_SIGNAL:</span>
                   <span className="truncate">{log.name}</span>
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );
};

const BannerPreview: React.FC<{ styleId: string; label: string; isSelected: boolean; onClick: () => void }> = ({ styleId, label, isSelected, onClick }) => {
  const style = BANNER_STYLES[styleId] || BANNER_STYLES.midnight;
  return (
    <button onClick={onClick} className={`w-full text-left group transition-all duration-300 p-1 rounded-3xl border-2 ${isSelected ? 'border-purple-600 ring-8 ring-purple-100' : 'border-transparent hover:border-gray-300 hover:scale-[1.02]'}`}>
      <div className="mb-2 px-1 text-[11px] font-black text-gray-400 uppercase tracking-widest flex justify-between items-center">
        <span>{label}</span>
        {isSelected && <span className="text-purple-600 flex items-center gap-1 font-bold animate-pulse"><Check className="w-3 h-3"/> ACTIVE</span>}
      </div>
      <div className={`rounded-2xl p-6 relative overflow-hidden shadow-md border h-48 ${style.container}`}>
          <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none transform scale-100 origin-top-right">
             <Lightbulb className={`w-28 h-28 blur-[1px] ${style.iconColor}`} />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
             <div>
                <div className={`flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] mb-2 ${style.accentText}`}>
                   <Sparkles className="w-3 h-3" /> Thinking Science
                </div>
                <h3 className={`text-xl font-serif font-bold mb-2 leading-tight ${style.contentClass}`}>Walking increases creative output by 60%.</h3>
             </div>
             <div className={`text-[11px] px-4 py-2 rounded-xl font-black w-fit flex items-center gap-2 backdrop-blur-sm shadow-sm ${style.button}`}>VIEW RESEARCH <ArrowRight className="w-3 h-3" /></div>
          </div>
      </div>
    </button>
  );
};

const LogoOption = ({ id, label, icon, current, onSelect }: any) => (
  <button onClick={() => onSelect(id)} className={`p-8 rounded-3xl border-2 flex flex-col items-center gap-5 transition-all ${current === id ? 'border-purple-600 bg-purple-50 shadow-xl scale-110 z-10' : 'border-gray-100 hover:border-gray-200 bg-white hover:shadow-lg'}`}>
    <div className="transform scale-[2.2]">{icon}</div>
    <div className="text-[12px] font-black text-gray-400 uppercase tracking-widest mt-2">{label}</div>
  </button>
);

export const MarketingPanel: React.FC<{ settings: AppSettings, onUpdate: (s: AppSettings) => void }> = ({ settings, onUpdate }) => {
  const language = settings.appLanguage || AppLanguage.EN;
  const t = translations[language].marketing;
  
  const [activeTab, setActiveTab] = useState<'social' | 'images' | 'branding' | 'analytics'>('analytics');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<'active' | 'blocked' | 'missing' | 'initializing'>('missing');
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  useEffect(() => {
    const check = () => setTrackingStatus(getTrackingStatus(settings.googleAnalyticsId) as any);
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [settings.googleAnalyticsId]);

  const updateLogo = (logoStyle: any) => onUpdate({ ...settings, logoStyle });
  const updateBanner = (bannerStyle: any) => onUpdate({ ...settings, bannerStyle });
  
  const handleSendTestEvent = () => {
    trackEvent(ANALYTICS_EVENTS.TEST_EVENT, { admin_check: true, force: true });
  };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); alert(language === AppLanguage.PT ? "Copiado!" : "Copied!"); };

  const handleGenerateImage = async () => {
    if (!currentPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const img = await generateMarketingImage(currentPrompt);
      setGeneratedImage(img);
    } catch (e) { alert("Failed."); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 pb-32">
      <div className="flex items-center gap-6 mb-12 pb-10 border-b border-gray-200">
        <div className="bg-purple-100 p-5 rounded-3xl shadow-inner"><Share2 className="w-12 h-12 text-purple-600" /></div>
        <div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight">{t.title}</h1>
          <p className="text-gray-500 mt-2 text-xl italic font-medium">{t.adminVerified} <span className="text-purple-600">m.reynolds@corkbrick.com</span></p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        <button onClick={() => setActiveTab('analytics')} className={`px-10 py-4 rounded-full font-black transition-all flex items-center gap-3 text-sm tracking-widest uppercase ${activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><BarChart3 className="w-5 h-5" /> {t.tabs.analytics}</button>
        <button onClick={() => setActiveTab('social')} className={`px-10 py-4 rounded-full font-black transition-all flex items-center gap-3 text-sm tracking-widest uppercase ${activeTab === 'social' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Send className="w-5 h-5" /> {t.tabs.social}</button>
        <button onClick={() => setActiveTab('images')} className={`px-10 py-4 rounded-full font-black transition-all flex items-center gap-3 text-sm tracking-widest uppercase ${activeTab === 'images' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><ImageIcon className="w-5 h-5" /> {t.tabs.images}</button>
        <button onClick={() => setActiveTab('branding')} className={`px-10 py-4 rounded-full font-black transition-all flex items-center gap-3 text-sm tracking-widest uppercase ${activeTab === 'branding' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Palette className="w-5 h-5" /> {t.tabs.branding}</button>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="bg-slate-950 text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden border border-white/5">
              <div className="relative z-10">
                 <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <button onClick={handleSendTestEvent} className="flex-1 flex items-center justify-center gap-4 px-10 py-7 rounded-[32px] font-black text-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]"><Zap className="w-7 h-7" /> {t.analytics.btnTest}</button>
                    <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 px-10 py-7 rounded-[32px] bg-white/10 hover:bg-white/20 text-white font-black text-lg transition-all border border-white/10 uppercase tracking-[0.2em]">{t.analytics.btnControl} <ExternalLink className="w-7 h-7" /></a>
                 </div>

                 <SignalVerifier language={language} />

                 <div className="mt-12 flex items-center justify-center gap-3 border-t border-white/5 pt-8">
                    <div className={`w-2 h-2 rounded-full ${trackingStatus === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       {t.analytics.title} {settings.googleAnalyticsId} — {trackingStatus.toUpperCase()}
                    </span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="grid md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-12 duration-700">
          {SOCIAL_POSTS(language).map((post, idx) => (
            <div key={idx} className="bg-white rounded-[40px] shadow-md border border-gray-200 overflow-hidden group hover:shadow-2xl transition-all">
              <div className={`${post.color} p-8 text-white flex items-center justify-between font-black text-2xl`}>
                 <div className="flex items-center gap-4">{post.icon} {post.platform}</div>
                 <button onClick={() => handleCopy(post.text)} className="p-4 bg-white/10 hover:bg-white/30 rounded-3xl transition-all"><Copy className="w-6 h-6" /></button>
              </div>
              <div className="p-10">
                 <div className="bg-gray-50 p-8 rounded-3xl font-sans text-lg text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100 max-h-96 overflow-y-auto custom-scrollbar font-medium">
                    {post.text}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="space-y-16 animate-in slide-in-from-bottom-12 duration-700">
           <div className="bg-white p-12 rounded-[40px] border border-gray-200 shadow-sm">
             <div className="flex items-center justify-between mb-12">
                <h3 className="font-bold text-gray-900 flex items-center gap-5 text-4xl font-serif">Brand Identity Library</h3>
                <span className="text-sm font-black text-purple-600 bg-purple-50 px-6 py-2 rounded-full uppercase tracking-widest border border-purple-100">Premium Variations</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <LogoOption id="minimal" label="The Original" icon={<div className="relative w-10 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700 shadow-xl"><div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div></div>} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="abstract" label="Neural Hub" icon={<BrainCircuit className="w-12 h-12 text-indigo-600" />} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="brain" label="Cognition" icon={<Brain className="w-12 h-12 text-purple-600" />} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="cosmic" label="Deep Core" icon={<Atom className="w-12 h-12 text-blue-600" />} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="nexus" label="Strategic Nexus" icon={<Component className="w-12 h-12 text-emerald-600" />} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="waveform" label="Sonic Mind" icon={<AudioWaveform className="w-12 h-12 text-gray-800" />} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="eye" label="Insight Vision" icon={<Eye className="w-12 h-12 text-amber-600" />} current={settings.logoStyle} onSelect={updateLogo} />
                <LogoOption id="classic" label="The Document" icon={<FileText className="w-12 h-12 text-blue-500" />} current={settings.logoStyle} onSelect={updateLogo} />
             </div>
           </div>
           <div className="bg-white p-12 rounded-[40px] border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                 <h3 className="font-bold text-gray-900 flex items-center gap-5 text-4xl font-serif">Marketing Banners</h3>
                 <span className="text-sm font-black text-blue-600 bg-blue-50 px-6 py-2 rounded-full uppercase tracking-widest border border-blue-100">14 Visual Styles</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {Object.keys(BANNER_STYLES).map(styleId => (
                   <BannerPreview key={styleId} styleId={styleId} label={styleId} isSelected={settings.bannerStyle === styleId} onClick={() => updateBanner(styleId)} />
                 ))}
              </div>
        </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="grid lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-12 duration-700">
          <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-gray-200 h-fit space-y-6 shadow-sm overflow-hidden">
            <h3 className="font-bold text-gray-900 flex items-center gap-4 font-serif text-3xl mb-4">{t.images.accordionTitle}</h3>
            
            <div className="space-y-3">
              {IMAGE_PROMPTS.map((cat, idx) => {
                const isOpen = expandedCategory === idx;
                return (
                  <div key={idx} className={`border rounded-3xl transition-all ${isOpen ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-50'}`}>
                    <button 
                      onClick={() => setExpandedCategory(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left group"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{cat.icon}</div>
                          <span className={`text-xs font-black uppercase tracking-widest ${isOpen ? 'text-indigo-950' : 'text-gray-500'}`}>{cat.category}</span>
                       </div>
                       {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                    </button>
                    
                    {isOpen && (
                      <div className="p-4 pt-0 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2">
                        {cat.prompts.map((p, pIdx) => (
                           <button 
                             key={pIdx} 
                             onClick={() => setCurrentPrompt(p.prompt)} 
                             className="w-full text-left p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-400 hover:shadow-md transition-all group flex justify-between items-center"
                           >
                              <div>
                                <div className="text-xs font-black text-slate-800">{p.title}</div>
                                {p.description && <div className="text-[10px] text-slate-400 font-medium italic">{p.description}</div>}
                              </div>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-500" />
                           </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-12 rounded-[40px] border border-gray-200 shadow-2xl">
               <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Creation Prompt</span>
                  <button onClick={() => setCurrentPrompt("")} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase transition-colors tracking-widest">{t.images.clearBtn}</button>
               </div>
               <textarea value={currentPrompt} onChange={(e) => setCurrentPrompt(e.target.value)} className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-3xl mb-8 font-mono text-base focus:ring-[12px] focus:ring-purple-100 focus:border-purple-400 outline-none transition-all resize-none shadow-none" placeholder="Enter custom prompt or select from presets..." />
               <button onClick={handleGenerateImage} disabled={isGenerating} className="w-full bg-slate-900 hover:bg-black text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 disabled:opacity-50 text-xl tracking-[0.2em] uppercase"><Sparkles className="w-8 h-8 text-yellow-400" /> {isGenerating ? t.images.statusGenerating : t.images.btnGenerate}</button>
            </div>
            <div className="bg-slate-900 rounded-[48px] aspect-video flex items-center justify-center overflow-hidden border-[16px] border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] group relative group">
               {generatedImage ? (
                  <>
                    <img src={generatedImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 backdrop-blur-sm">
                       <button onClick={() => handleCopy(generatedImage || '')} className="bg-white p-6 rounded-full text-slate-900 shadow-2xl hover:scale-125 transition-transform"><Copy className="w-8 h-8" /></button>
                       <a href={generatedImage} download="deepscribe-marketing-asset.png" className="bg-white p-6 rounded-full text-slate-900 shadow-2xl hover:scale-125 transition-transform"><Download className="w-8 h-8" /></a>
                    </div>
                  </>
               ) : (
                  <div className="text-center">
                    <div className="relative mb-10">
                       <ImageIcon className="w-32 h-32 text-slate-800 mx-auto" />
                       {isGenerating && <Loader2 className="w-32 h-32 text-indigo-500 absolute inset-0 animate-spin opacity-40" />}
                    </div>
                    <p className="text-slate-500 font-black text-3xl uppercase tracking-[0.3em]">{isGenerating ? t.images.statusGenerating : t.images.previewTitle}</p>
                    <p className="text-slate-600 text-lg mt-4 font-medium italic">{t.images.previewDesc}</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
