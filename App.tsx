
import React, { useState, useEffect } from 'react';
import { Mic2, FileText, Settings as SettingsIcon, Menu, FolderOpen, HelpCircle, AlertTriangle, X, Shield, Home, Share2, BrainCircuit, Brain, Atom, Component, AudioWaveform, Eye, Sparkles, Key, ExternalLink, CheckCircle2, ShieldAlert, Lock, Unlock, Info, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { AppView, AppSettings, DocumentData, AppLanguage } from './types';
import { DocGenerator } from './components/DocGenerator';
import { LiveSession } from './components/LiveSession';
import { SettingsPanel } from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { DocViewer } from './components/DocViewer';
import { HelpPanel } from './components/HelpPanel';
import { LegalPanel } from './components/LegalPanel';
import { Dashboard } from './components/Dashboard';
import { MarketingPanel } from './components/MarketingPanel';
import { saveDocument, getDocuments, deleteDocument, saveAllDocuments } from './utils/storageUtils';
import { initGA, trackEvent, ANALYTICS_EVENTS } from './utils/analyticsUtils';
import { translations } from './translations';

// --- GLOBAL CONFIGURATION ---
const GLOBAL_ANALYTICS_ID = 'G-NRJPREMKPZ'; 
const ADMIN_SECRET_EMAIL = 'm.reynolds@corkbrick.com';
const STORAGE_KEY_AUTH = 'deepscribe_user_apikey';

const DEFAULT_SETTINGS: AppSettings = {
  appLanguage: AppLanguage.EN,
  transcriptionSystemInstruction: `You are an expert transcriber and professional secretary. 
Your goal is to transform audio into a highly structured, professional document.`,
  enrichmentPromptTemplate: `Topic: {{TOPIC}}\nContext: {{CONTEXT}}\nLanguage: {{LANGUAGE}}...`,
  liveSystemInstruction: `You are a helpful, conversational AI assistant. Respond naturally and helpfully.`,
  showAdminTools: false,
  googleAnalyticsId: GLOBAL_ANALYTICS_ID, 
  logoStyle: 'abstract', 
  bannerStyle: 'mint'
};

const LanguageSwitcher = ({ current, onSelect }: { current: AppLanguage, onSelect: (lang: AppLanguage) => void }) => (
  <div className="flex gap-2 p-1 bg-gray-100 rounded-full border border-gray-200">
    <button 
      onClick={() => onSelect(AppLanguage.EN)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${current === AppLanguage.EN ? 'bg-white shadow-sm font-bold' : 'opacity-50 hover:opacity-100'}`}
    >
      <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-4 h-4 rounded-full object-cover" />
      <span className="text-[10px]">EN</span>
    </button>
    <button 
      onClick={() => onSelect(AppLanguage.PT)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${current === AppLanguage.PT ? 'bg-white shadow-sm font-bold' : 'opacity-50 hover:opacity-100'}`}
    >
      <img src="https://flagcdn.com/w40/pt.png" alt="PT" className="w-4 h-4 rounded-full object-cover" />
      <span className="text-[10px]">PT</span>
    </button>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('deepscribe_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // BYOK State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  const [manualKey, setManualKey] = useState("");
  const [hasUserKey, setHasUserKey] = useState(() => !!localStorage.getItem(STORAGE_KEY_AUTH));
  const [isBridgeAvailable, setIsBridgeAvailable] = useState(false);

  const language = settings.appLanguage || AppLanguage.EN;
  const t = translations[language];

  useEffect(() => {
    setDocuments(getDocuments());
    initGA(settings.googleAnalyticsId || GLOBAL_ANALYTICS_ID);
    
    // Check if we are inside AI Studio or on a standard URL
    const checkBridge = () => {
      const available = window.aistudio && typeof window.aistudio.openSelectKey === 'function';
      setIsBridgeAvailable(!!available);
    };
    
    checkBridge();
    // Re-check periodically in case injection is delayed
    const timer = setInterval(checkBridge, 1000);
    return () => clearInterval(timer);
  }, [settings.googleAnalyticsId]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('deepscribe_settings', JSON.stringify(updated));
  };

  const navigateTo = (newView: AppView) => {
    const restrictedViews = [AppView.GENERATOR, AppView.LIVE, AppView.MARKETING];
    const userStoredKey = localStorage.getItem(STORAGE_KEY_AUTH);

    if (restrictedViews.includes(newView) && (!userStoredKey || userStoredKey.length < 10)) {
      setPendingView(newView);
      setShowKeyModal(true);
      return;
    }

    setView(newView);
    setSelectedDoc(null);
    setIsSidebarOpen(false);
    trackEvent(`navigate_to_${newView.toLowerCase()}`);
  };

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualKey.trim().length < 10) return;
    localStorage.setItem(STORAGE_KEY_AUTH, manualKey.trim());
    setHasUserKey(true);
    setShowKeyModal(false);
    if (pendingView) setView(pendingView);
    setPendingView(null);
    setManualKey("");
  };

  const handleBridgeSelect = async () => {
    if (isBridgeAvailable) {
      await window.aistudio.openSelectKey();
      setHasUserKey(true);
      setShowKeyModal(false);
      if (pendingView) setView(pendingView);
      setPendingView(null);
    }
  };

  const NavItem = ({ target, icon: Icon, label, color = "text-gray-500" }: { target: AppView, icon: any, label: string, color?: string }) => (
    <button
      onClick={() => navigateTo(target)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        view === target 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
          : `hover:bg-gray-50 ${color}`
      }`}
    >
      <Icon className={`w-5 h-5 ${view === target ? 'text-indigo-600' : ''}`} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* AUTH MODAL - On-Demand Request for API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
             <div className="bg-slate-900 p-8 text-white relative">
                <button onClick={() => setShowKeyModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                <div className="flex justify-center mb-6"><div className="p-3 bg-white/10 rounded-2xl"><Key className="w-8 h-8 text-indigo-400" /></div></div>
                <h2 className="text-2xl font-serif font-bold text-center mb-2 tracking-tight">{t.onboarding.title}</h2>
                <p className="text-center text-slate-400 text-[10px] uppercase tracking-widest font-black opacity-80">{t.onboarding.subtitle}</p>
             </div>
             
             <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <p className="text-sm text-gray-600 leading-relaxed text-center font-medium">
                  {language === AppLanguage.PT 
                    ? "Para proteger a sua privacidade e evitar custos ao programador, o DeepScribe utiliza a sua própria chave API do Google Gemini."
                    : "To protect your privacy and prevent developer costs, DeepScribe uses your own Google Gemini API key."}
                </p>
                
                <div className="space-y-4">
                   {isBridgeAvailable ? (
                     <>
                        <button onClick={handleBridgeSelect} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs transition-all active:scale-[0.98]">
                           <Shield className="w-5 h-5" /> {t.onboarding.cta}
                        </button>
                        <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div><div className="relative flex justify-center"><span className="bg-white px-3 text-[10px] uppercase font-black text-gray-300 tracking-widest">or enter manually</span></div></div>
                     </>
                   ) : (
                     <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-start gap-4 mb-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                           <div className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">{language === AppLanguage.PT ? "Ligação Direta Não Disponível" : "Direct Link Not Available"}</div>
                           <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                              {language === AppLanguage.PT 
                                ? "Está a aceder ao DeepScribe fora do AI Studio. Por favor, utilize o formulário abaixo para inserir a sua chave manualmente." 
                                : "You are accessing DeepScribe outside of AI Studio. Please use the form below to enter your key manually."}
                           </p>
                        </div>
                     </div>
                   )}
                   
                   <form onSubmit={handleManualKeySubmit} className="space-y-3">
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"><Lock className="w-4 h-4" /></div>
                        <input 
                          type="password" 
                          value={manualKey} 
                          onChange={(e) => setManualKey(e.target.value)} 
                          placeholder={language === AppLanguage.PT ? "Cole aqui a sua Chave API Gemini..." : "Paste your Gemini API Key here..."}
                          className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-mono"
                        />
                      </div>
                      <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs">Apply Key</button>
                   </form>
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                   <h4 className="text-[11px] font-black text-indigo-800 uppercase tracking-widest mb-3 flex items-center gap-2"><Info className="w-4 h-4"/> {language === AppLanguage.PT ? "Como obter uma chave (Grátis):" : "How to get a key (Free):"}</h4>
                   <div className="space-y-3 text-[12px] text-indigo-900">
                      <div className="flex gap-3">
                         <span className="flex items-center justify-center w-5 h-5 bg-indigo-200 text-indigo-800 rounded-full text-[10px] font-black shrink-0 mt-0.5">1</span>
                         <span>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="font-bold underline text-indigo-700 hover:text-indigo-900 transition-colors">Google AI Studio</a>.</span>
                      </div>
                      <div className="flex gap-3">
                         <span className="flex items-center justify-center w-5 h-5 bg-indigo-200 text-indigo-800 rounded-full text-[10px] font-black shrink-0 mt-0.5">2</span>
                         <span>Sign in with any Google account (it's free).</span>
                      </div>
                      <div className="flex gap-3">
                         <span className="flex items-center justify-center w-5 h-5 bg-indigo-200 text-indigo-800 rounded-full text-[10px] font-black shrink-0 mt-0.5">3</span>
                         <span>Click "Create API Key" and copy the code.</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center gap-3">
           <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100"><BrainCircuit className="w-6 h-6" /></div>
           <h1 className="text-xl font-serif font-black text-gray-900 tracking-tighter uppercase">DEEPSCRIBE</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <NavItem target={AppView.DASHBOARD} icon={Home} label={t.nav.home} />
          <NavItem target={AppView.GENERATOR} icon={Mic2} label={t.nav.newTranscription} />
          <NavItem target={AppView.HISTORY} icon={FolderOpen} label={t.nav.myDocuments} />
          <NavItem target={AppView.LIVE} icon={Sparkles} label={t.nav.liveConversation} color="text-indigo-600" />
          <div className="pt-6 pb-2 px-4"><div className="h-px bg-gray-100 w-full"></div></div>
          <NavItem target={AppView.SETTINGS} icon={SettingsIcon} label={t.nav.configuration} />
          <NavItem target={AppView.HELP} icon={HelpCircle} label={t.nav.helpGuide} />
          <NavItem target={AppView.LEGAL} icon={Shield} label={t.nav.legalPrivacy} />
        </nav>

        <div className="p-6 border-t border-gray-50 space-y-4">
           <LanguageSwitcher current={language} onSelect={(l) => handleUpdateSettings({ ...settings, appLanguage: l })} />
           <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-center">v2.1.2 Environment Secure</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30 overflow-hidden relative">
        {/* Header - Mobile Only */}
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6 text-gray-600" /></button>
          <div className="flex items-center gap-2">
             <BrainCircuit className="w-5 h-5 text-indigo-600" />
             <span className="font-serif font-black text-lg">DEEPSCRIBE</span>
          </div>
          <LanguageSwitcher current={language} onSelect={(l) => handleUpdateSettings({ ...settings, appLanguage: l })} />
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {view === AppView.DASHBOARD && <Dashboard documents={documents} onNavigate={navigateTo} onOpenDoc={(doc) => { setSelectedDoc(doc); setView(AppView.VIEWER); }} settings={settings} />}
          {view === AppView.GENERATOR && <DocGenerator settings={settings} onSave={(doc) => setDocuments(saveDocument(doc))} />}
          {view === AppView.HISTORY && <HistoryPanel documents={documents} onSelect={(doc) => { setSelectedDoc(doc); setView(AppView.VIEWER); }} onDelete={(id) => setDocuments(deleteDocument(id))} onRestore={(docs) => { saveAllDocuments(docs); setDocuments(docs); }} language={settings.appLanguage} />}
          {view === AppView.LIVE && <LiveSession systemInstruction={settings.liveSystemInstruction} onSave={(doc) => setDocuments(saveDocument(doc))} onOpenDoc={(doc) => { setSelectedDoc(doc); setView(AppView.VIEWER); }} language={settings.appLanguage} />}
          {view === AppView.SETTINGS && <SettingsPanel settings={settings} onUpdate={handleUpdateSettings} adminEmail={ADMIN_SECRET_EMAIL} />}
          {view === AppView.VIEWER && selectedDoc && <DocViewer docData={selectedDoc} onBack={() => setView(AppView.HISTORY)} language={settings.appLanguage} />}
          {view === AppView.HELP && <HelpPanel language={settings.appLanguage} />}
          {view === AppView.LEGAL && <LegalPanel language={settings.appLanguage} />}
          {view === AppView.MARKETING && <MarketingPanel settings={settings} onUpdate={handleUpdateSettings} />}
        </div>
      </main>
    </div>
  );
};

export default App;
