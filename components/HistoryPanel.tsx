
import React, { useRef, useState, useMemo } from 'react';
import { DocumentData, AppLanguage } from '../types';
import { FileText, Clock, Trash2, ArrowRight, DownloadCloud, UploadCloud, Search, X } from 'lucide-react';
import { translations } from '../translations';

interface Props {
  documents: DocumentData[];
  onSelect: (doc: DocumentData) => void;
  onDelete: (id: string) => void;
  onRestore: (docs: DocumentData[]) => void;
  language?: AppLanguage;
}

export const HistoryPanel: React.FC<Props> = ({ documents, onSelect, onDelete, onRestore, language = AppLanguage.EN }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const t = translations[language].history;

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const lowerQuery = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.topics[0]?.title?.toLowerCase().includes(lowerQuery) || 
      doc.summary?.toLowerCase().includes(lowerQuery) ||
      doc.language?.toLowerCase().includes(lowerQuery)
    );
  }, [documents, searchQuery]);

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "DeepScribe_backup_" + new Date().toISOString().slice(0,10) + ".json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) onRestore(json);
        else alert(t.restoreInvalid);
      } catch (err) {
        alert(t.restoreError);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (documents.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-8 h-full flex flex-col">
         <div className="flex justify-end mb-4">
            <input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={handleFileChange} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-doc-accent transition-colors border border-gray-200 rounded-lg px-4 py-2 bg-white shadow-sm">
              <UploadCloud className="w-4 h-4" /> {t.btnRestoreBackup}
            </button>
         </div>
         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">{t.emptyState}</p>
            <p className="text-sm">{t.emptyStateDesc}</p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <h2 className="text-3xl font-serif font-bold text-gray-800">{t.title}</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-3 h-3 text-gray-400" /></button>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleBackup} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition-all">
              <DownloadCloud className="w-4 h-4" /> {t.btnBackup}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={handleFileChange} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm font-medium text-white bg-doc-accent hover:bg-blue-600 px-4 py-2 rounded-lg shadow-sm transition-all">
              <UploadCloud className="w-4 h-4" /> {t.btnRestore}
            </button>
          </div>
        </div>
      </div>
      {filteredDocuments.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
           <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p className="font-medium text-lg">{t.noMatches} "{searchQuery}"</p>
           <button onClick={() => setSearchQuery("")} className="text-indigo-600 font-bold hover:underline mt-2">{t.clearSearch}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col min-h-[260px] overflow-hidden group animate-in fade-in slide-in-from-bottom-2">
              <div onClick={() => onSelect(doc)} className="p-6 flex-1 flex flex-col cursor-pointer hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-2 pointer-events-none">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">{doc.language || '---'}</span>
                  <span className="flex items-center text-xs text-gray-400"><Clock className="w-3 h-3 mr-1" />{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] pointer-events-none">{doc.topics[0]?.title || (language === AppLanguage.PT ? "Sem Título" : "Untitled")}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 pointer-events-none">{doc.summary}</p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100 mt-auto">
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(doc.id); }} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50 text-xs font-medium border border-transparent hover:border-red-100">
                  <Trash2 className="w-4 h-4" /> <span>{t.cardDelete}</span>
                </button>
                <button onClick={() => onSelect(doc)} className="flex items-center text-sm font-medium text-doc-accent hover:text-blue-700 transition-colors group hover:underline">
                  {t.cardOpen} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
