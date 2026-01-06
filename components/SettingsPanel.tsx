
import React, { useState, useEffect } from 'react';
import { AppSettings, AppLanguage } from '../types';
import { Settings, Save, ShieldCheck, Key, Trash2, ShieldAlert } from 'lucide-react';
import { translations } from '../translations';

interface Props {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  adminEmail: string; 
}

export const SettingsPanel: React.FC<Props> = ({ settings, onUpdate, adminEmail }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [hasUserKey, setHasUserKey] = useState(!!localStorage.getItem('deepscribe_user_apikey'));

  const language = settings.appLanguage || AppLanguage.EN;
  const t = translations[language].settings;

  const handleSave = () => {
    onUpdate(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearKey = () => {
    if (confirm("Clear your API key? This will disable AI features until you re-authorize.")) {
      localStorage.removeItem('deepscribe_user_apikey');
      setHasUserKey(false);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pb-20 space-y-8">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <Settings className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-serif font-bold tracking-tight">System Configuration</h2>
      </div>

      {/* API Key Management */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <Key className="w-5 h-5 text-indigo-600" />
               <h3 className="font-bold">Privacy & API Access</h3>
            </div>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hasUserKey ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
               {hasUserKey ? 'Secured by BYOK' : 'Authorization Required'}
            </span>
         </div>
         <p className="text-sm text-gray-500 mb-6">DeepScribe is designed for maximum privacy. Your API key is stored locally in this browser and never sent to our servers. All billing is handled by your personal Google Cloud project.</p>
         <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border">
            <div className="text-xs font-medium text-slate-500">{hasUserKey ? "Your private key is active." : "No active user key found."}</div>
            {hasUserKey && <button onClick={handleClearKey} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-2"><Trash2 className="w-4 h-4"/> Remove Key</button>}
         </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t.labelTranscription}</label>
          <textarea className="w-full h-32 p-4 text-sm bg-slate-50 border rounded-2xl outline-none" value={localSettings.transcriptionSystemInstruction} onChange={(e) => setLocalSettings(p => ({...p, transcriptionSystemInstruction: e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t.labelLive}</label>
          <textarea className="w-full h-32 p-4 text-sm bg-slate-50 border rounded-2xl outline-none" value={localSettings.liveSystemInstruction} onChange={(e) => setLocalSettings(p => ({...p, liveSystemInstruction: e.target.value}))} />
        </div>
        <div className="flex justify-end"><button onClick={handleSave} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-500 transition-all">{saved ? t.btnSaved : t.btnSave}</button></div>
      </div>
    </div>
  );
};
