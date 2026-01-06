
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, RefreshCw, Trash2, ArrowLeft, MessageSquare, Send, X, Bot, Volume2, Play, Square, Pause, Edit2, Save, Sparkles, Loader2, Mic, FileCode, Clipboard, ChevronDown, Check, Globe } from 'lucide-react';
import { DocumentData, ChatMessage, AppLanguage } from '../types';
import { chatWithDocument } from '../services/geminiService';
import { useTTS } from '../hooks/useTTS';
import { saveDocument } from '../utils/storageUtils';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analyticsUtils';
import { translations } from '../translations';

interface Props {
  docData: DocumentData;
  onBack?: () => void;
  onDelete?: () => void;
  onUpdate?: (doc: DocumentData) => void;
  language?: AppLanguage;
}

const RECOGNITION_LANGS = [
  { label: 'Auto (Doc)', value: 'auto' },
  { label: 'English', value: 'en-US' },
  { label: 'Portuguese', value: 'pt-BR' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
  { label: 'Italian', value: 'it-IT' },
];

const LANG_MAP: Record<string, string> = {
  'English': 'en-US',
  'Portuguese': 'pt-BR',
  'Spanish': 'es-ES',
  'French': 'fr-FR',
  'German': 'de-DE',
  'Italian': 'it-IT',
  'Japanese': 'ja-JP',
  'Chinese': 'zh-CN',
};

// Visualizer for Dictation (Real Voice Waves)
const MiniVoiceVisualizer = ({ isListening }: { isListening: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isListening) {
      const startVisualizer = async () => {
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 64;
          source.connect(analyserRef.current);

          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const draw = () => {
            if (!isListening || !ctx || !analyserRef.current) return;
            animationRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const bars = 6;
            const spacing = 4;

            for (let i = 0; i < bars; i++) {
              const val = dataArray[i * 2] / 255.0;
              const h = Math.max(4, val * canvas.height * 0.9);
              const x = centerX + (i - (bars-1)/2) * spacing;
              ctx.fillStyle = '#ef4444'; 
              ctx.beginPath();
              ctx.roundRect(x - 1.5, centerY - h / 2, 3, h, 1.5);
              ctx.fill();
            }
          };
          draw();
        } catch (e) { console.error("Visualizer error", e); }
      };
      startVisualizer();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [isListening]);

  return <canvas ref={canvasRef} width={30} height={24} className="w-8 h-6" />;
};

const FormattedText: React.FC<{ text: string, onTextClick?: (text: string) => void }> = ({ text, onTextClick }) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('###')) elements.push(<h4 key={index} className="font-bold text-indigo-900 mt-6 mb-2 uppercase text-xs tracking-wider border-b border-indigo-100 pb-1">{trimmed.replace(/^###\s*/, '')}</h4>);
    else if (trimmed.startsWith('##')) elements.push(<h3 key={index} className="font-bold text-gray-800 mt-6 mb-3 text-lg border-b border-gray-100 pb-1">{trimmed.replace(/^##\s*/, '')}</h3>);
    else if (trimmed.startsWith('#')) elements.push(<h2 key={index} className="font-bold text-gray-900 mt-8 mb-4 text-xl">{trimmed.replace(/^#\s*/, '')}</h2>);
    else if (trimmed.length > 0) {
      const parts = trimmed.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/);
      const content = parts.map((part, i) => {
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2,-2)}</strong>;
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
            const linkText = linkMatch[1].toLowerCase() === 'link' ? linkMatch[2] : linkMatch[1];
            return <a key={i} href={linkMatch[2]} target="_blank" className="text-blue-600 hover:underline break-all">{linkText}</a>;
        }
        return <span key={i}>{part}</span>;
      });
      elements.push(<p key={index} className="text-gray-700 leading-relaxed mb-3 text-sm cursor-pointer hover:bg-yellow-50/50 transition-colors" onClick={() => onTextClick?.(trimmed)}>{content}</p>);
    }
  });
  return <div>{elements}</div>;
};

const ChatMarkdown: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('###')) return <h4 key={i} className="font-bold underline mb-1 text-sm">{trimmed.replace(/^###\s*/, '')}</h4>;
        const parts = trimmed.split(/(\*\*.*?\*\*)/).map((p, j) => p.startsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p);
        return <p key={i} className="leading-relaxed whitespace-pre-wrap">{parts}</p>;
      })}
    </div>
  );
};

export const DocViewer: React.FC<Props> = ({ docData: initialDocData, onBack, onDelete, onUpdate, language = AppLanguage.EN }) => {
  const [docData, setDocData] = useState<DocumentData>(initialDocData);
  const t = translations[language].viewer;
  const labels = t.labels;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(docData.summary);
  const [editTranscript, setEditTranscript] = useState(docData.transcription);
  const [editTopics, setEditTopics] = useState(docData.topics);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(docData.chatHistory || [{ role: 'model', text: t.chatInitial, timestamp: Date.now() }]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [dictationLang, setDictationLang] = useState('auto');
  const recognitionRef = useRef<any>(null);

  const [playerVisible, setPlayerVisible] = useState(false);
  const tts = useTTS();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectionText, setSelectionText] = useState("");
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 5 && selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPosition({ top: rect.top + window.scrollY - 50, left: rect.left + window.scrollX + (rect.width / 2) });
        setSelectionText(text);
      } else { setSelectionText(""); setMenuPosition(null); }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const handleSaveChanges = () => {
    const updated = { ...docData, summary: editSummary, transcription: editTranscript, topics: editTopics, chatHistory };
    setDocData(updated);
    setIsEditing(false);
    onUpdate?.(updated);
  };

  const handleChatSubmit = async (e?: React.FormEvent, overrideMsg?: string) => {
    e?.preventDefault();
    const msg = overrideMsg || chatInput;
    if (!msg.trim() || isChatLoading) return;
    setChatInput("");
    if (!showChat) setShowChat(true);
    const updatedHistory = [...chatHistory, { role: 'user', text: msg, timestamp: Date.now() }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);
    const response = await chatWithDocument(`Title: ${docData.topics[0]?.title}\nContext: ${docData.summary}\nDoc: ${docData.transcription}`, updatedHistory, msg, true);
    const finalHistory = [...updatedHistory, { role: 'model', text: response, timestamp: Date.now() }];
    setChatHistory(finalHistory);
    setIsChatLoading(false);
    const finalDoc = { ...docData, chatHistory: finalHistory };
    setDocData(finalDoc);
    onUpdate?.(finalDoc);
  };

  const runDeepAnalysis = (type: string) => {
    const prompt = type === 'analysis' ? `Analyze this selection: "${selectionText}"` : type === 'explain' ? `Explain simply: "${selectionText}"` : `Summarize this: "${selectionText}"`;
    handleChatSubmit(undefined, prompt);
    setSelectionText("");
    setMenuPosition(null);
  };

  const toggleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return alert(language === AppLanguage.PT ? "Navegador não suportado" : "Browser not supported");
    
    if (isListening) { 
      recognitionRef.current?.stop(); 
      setIsListening(false); 
      return; 
    }

    const recognition = new SpeechRec();
    let langCode = 'en-US';
    if (dictationLang === 'auto') {
      langCode = LANG_MAP[docData.language] || 'en-US';
    } else {
      langCode = dictationLang;
    }
    
    recognition.lang = langCode;
    recognition.continuous = true; 
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => { 
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          setChatInput(prev => prev + e.results[i][0].transcript);
        }
      }
    };
    recognition.onend = () => { setIsListening(false); };
    recognition.onerror = (e: any) => {
      console.error("Speech Recognition Error", e.error);
      setIsListening(false);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  const generateFullHTML = () => {
    const md = (t: string) => {
        if (!t) return "";
        let result = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        result = result.replace(/^### (.*$)/gm, '<h4>$1</h4>');
        result = result.replace(/^## (.*$)/gm, '<h3>$1</h3>');
        result = result.replace(/^# (.*$)/gm, '<h2>$1</h2>');
        result = result.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        result = result.replace(/\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
            const display = p1.toLowerCase() === 'link' ? p2 : p1;
            return `<a href="${p2}" target="_blank">${display}</a>`;
        });
        result = result.replace(/\n/g, '<br>');
        return result;
    };

    const topicsHtml = docData.topics.map(t => `<div class="topic"><h2>${t.title}</h2><p><i>${t.description}</i></p>${t.enrichedContent ? `<div class="research">${md(t.enrichedContent)}</div>` : ''}</div>`).join('<hr/>');
    const chatHtml = chatHistory.length > 1 ? `<div class="chat-history"><h2>${labels.dialogue}</h2>${chatHistory.slice(1).map(m => `<div class="msg"><b>${m.role === 'user' ? 'User' : 'Assistant'}:</b> ${md(m.text)}</div>`).join('')}</div>` : '';
    
    return `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>${docData.topics[0]?.title}</title>
      <style>
        body{font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.6; color:#333; max-width:800px; margin:40px auto; padding:20px; background:#f4f7f6;}
        .paper{background:white; padding:60px; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.05); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;}
        h1{color:#1a365d; border-bottom:2px solid #e2e8f0; padding-bottom:10px; font-size:2.5em; word-break: keep-all;}
        h2{color:#2d3748; margin-top:40px; border-bottom:1px solid #edf2f7;}
        .summary{background:#f8fafc; padding:20px; border-left:4px solid #4299e1; font-style:italic;}
        .topic{margin:30px 0;}
        .research{background:#ebf8ff; padding:15px; border-radius:8px; font-size:0.9em; margin-top:10px;}
        .chat-history{margin-top:50px; background:#f0f4f8; padding:20px; border-radius:10px;}
        .msg{margin-bottom:15px; border-bottom:1px solid #d1d5db; padding-bottom:5px;}
        hr{border:0; border-top:1px solid #e2e8f0; margin:40px 0;}
        a { color: #3182ce; text-decoration: underline; word-break: break-all; }
      </style></head><body><div class="paper">
        <h1>${docData.topics[0]?.title}</h1>
        <p>${labels.generated} • ${new Date(docData.createdAt).toLocaleDateString()}</p>
        <div class="summary"><h2>${labels.summary}</h2>${md(docData.summary)}</div>
        ${topicsHtml}
        <h2>${labels.transcription}</h2>
        <div class="transcription">${md(docData.transcription)}</div>
        ${chatHtml}
      </div></body></html>`;
  };

  const handleDownloadHTML = () => {
    const html = generateFullHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docData.topics[0]?.title.replace(/\s+/g, '_')}_DeepScribe.html`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleCopyRichText = async () => {
    const html = generateFullHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([docData.transcription], { type: 'text/plain' });
    const item = new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob });
    await navigator.clipboard.write([item]);
    alert(language === AppLanguage.PT ? "Documento completo (incluindo Chat) copiado para o Google Docs!" : "Full document (including Chat) copied for Google Docs!");
    setShowExportMenu(false);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, showChat]);

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden relative print:block">
      {menuPosition && selectionText && (
        <div className="fixed z-50 flex items-center bg-slate-900 text-white rounded-full shadow-2xl p-1.5 animate-in zoom-in duration-200" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px`, transform: 'translateX(-50%)' }}>
          <button onClick={() => runDeepAnalysis('analysis')} className="px-4 py-1.5 hover:bg-white/10 rounded-full text-xs font-black uppercase flex items-center gap-2"><Sparkles className="w-3 h-3 text-yellow-400" /> {language === AppLanguage.PT ? 'Analisar' : 'Analyze'}</button>
          <div className="w-px h-4 bg-white/20 mx-1"></div>
          <button onClick={() => runDeepAnalysis('explain')} className="px-4 py-1.5 hover:bg-white/10 rounded-full text-xs font-bold">{language === AppLanguage.PT ? 'Explicar' : 'Explain'}</button>
          <button onClick={() => runDeepAnalysis('summarize')} className="px-4 py-1.5 hover:bg-white/10 rounded-full text-xs font-bold">{language === AppLanguage.PT ? 'Resumir' : 'Summarize'}</button>
        </div>
      )}

      <div className={`flex-1 overflow-auto transition-all duration-300 ${showChat ? 'md:w-2/3' : 'w-full'}`}>
        <div className="max-w-[850px] mx-auto py-8 px-4 no-print">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {onBack && <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-500"><ArrowLeft className="w-4 h-4"/> {t.btnBack}</button>}
              <button onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium border ${isEditing ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                {isEditing ? <Save className="w-4 h-4"/> : <Edit2 className="w-4 h-4"/>} {isEditing ? t.btnSave : t.btnEdit}
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 shadow-sm text-sm font-medium">
                  <Download className="w-4 h-4"/> {t.btnExport} <ChevronDown className="w-3 h-3"/>
                </button>
                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2">
                    <button onClick={handleCopyRichText} className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 text-blue-700 font-bold border-b border-gray-100"><Clipboard className="w-4 h-4"/> {t.exportGoogleDocs}</button>
                    <button onClick={handleDownloadHTML} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-3"><FileCode className="w-4 h-4"/> {t.exportHtml}</button>
                    <button onClick={() => { navigator.clipboard.writeText(chatHistory.map(m => `${m.role}: ${m.text}`).join('\n\n')); alert(language === AppLanguage.PT ? "Diálogo copiado!" : "Dialogue copied!"); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-3"><MessageSquare className="w-4 h-4"/> {t.exportDialogue}</button>
                  </div>
                )}
              </div>
              <button onClick={() => setPlayerVisible(!playerVisible)} className={`p-2 rounded border ${playerVisible ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200'}`}><Volume2 className="w-5 h-5"/></button>
              <button onClick={() => setShowChat(!showChat)} className={`p-2 rounded border ${showChat ? 'bg-indigo-50 text-indigo-700' : 'bg-white border-gray-200'}`}><MessageSquare className="w-5 h-5"/></button>
            </div>
          </div>

          {playerVisible && (
            <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-lg mb-6 flex items-center gap-4">
              <button onClick={() => tts.isPlaying ? tts.pause() : tts.speak(docData.summary + docData.transcription)} className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">{tts.isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 ml-1"/>}</button>
              <select className="flex-1 text-sm bg-gray-50 p-2 rounded border" value={tts.selectedVoice?.name} onChange={(e) => tts.setVoice(tts.voices.find(v => v.name === e.target.value))}>
                {tts.voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="max-w-[850px] mx-auto bg-white shadow-xl min-h-[1100px] p-12 md:p-24 print:shadow-none print:p-0">
          <header className="mb-12 border-b pb-8">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{docData.topics[0]?.title}</h1>
            <div className="text-sm text-gray-500 flex gap-4"><span>{labels.generated}</span> • <span>{new Date(docData.createdAt).toLocaleDateString()}</span></div>
          </header>

          <section className="mb-12 bg-gray-50 p-8 rounded-xl border-l-4 border-indigo-500 italic">
            <h2 className="text-xs font-black uppercase text-indigo-600 mb-4 flex items-center gap-2"><RefreshCw className="w-3 h-3"/> {labels.summary}</h2>
            {isEditing ? <textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)} className="w-full h-40 p-4 border rounded font-serif"/> : <FormattedText text={docData.summary} />}
          </section>

          <section className="mb-12">
            <h2 className="text-xs font-black uppercase text-gray-400 mb-6">{labels.topics}</h2>
            {editTopics.map((t, i) => (
              <div key={i} className="mb-8">
                {isEditing ? (
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <input value={t.title} onChange={(e) => { const n = [...editTopics]; n[i].title = e.target.value; setEditTopics(n); }} className="w-full p-2 border rounded font-bold" />
                    <textarea value={t.description} onChange={(e) => { const n = [...editTopics]; n[i].description = e.target.value; setEditTopics(n); }} className="w-full p-2 border rounded text-sm h-20" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{i+1}. {t.title}</h3>
                    <p className="text-gray-600 mb-4">{t.description}</p>
                    {t.enrichedContent && <div className="bg-indigo-50/30 p-6 rounded-xl border border-indigo-100"><FormattedText text={t.enrichedContent} /></div>}
                  </>
                )}
              </div>
            ))}
          </section>

          <section className="mb-12">
            <h2 className="text-xs font-black uppercase text-gray-400 mb-6 border-t pt-8">{labels.transcription}</h2>
            {isEditing ? <textarea value={editTranscript} onChange={(e) => setEditTranscript(e.target.value)} className="w-full h-[800px] p-8 border rounded text-lg leading-relaxed font-serif"/> : <div className="font-serif text-lg leading-relaxed text-gray-800"><FormattedText text={docData.transcription} /></div>}
          </section>
        </div>
      </div>

      {showChat && (
        <div className="fixed inset-0 z-40 md:static md:w-1/3 bg-white border-l border-gray-200 flex flex-col shadow-2xl no-print">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2 text-indigo-700 font-bold"><Bot className="w-5 h-5"/> Assistant</div>
            <button onClick={() => setShowChat(false)} className="p-2 hover:bg-gray-200 rounded-full"><X className="w-5 h-5"/></button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {chatHistory.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'}`}>
                  <ChatMarkdown text={m.text} />
                </div>
              </div>
            ))}
            {isChatLoading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mx-auto"/>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t bg-white space-y-2">
            <div className="flex justify-start px-1">
               <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                  <Globe className="w-3 h-3 text-gray-500" />
                  <select 
                    value={dictationLang} 
                    onChange={(e) => setDictationLang(e.target.value)}
                    className="bg-transparent text-[10px] font-bold text-gray-600 outline-none uppercase tracking-wider cursor-pointer"
                  >
                    {RECOGNITION_LANGS.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
               </div>
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2 items-center">
              <button 
                type="button" 
                onClick={toggleVoiceInput} 
                className={`p-2 h-11 w-11 rounded-lg flex items-center justify-center transition-all ${isListening ? 'bg-red-50 ring-2 ring-red-200' : 'bg-gray-100 text-gray-500'}`}
                title={isListening ? "Stop Listening" : "Start Voice Dictation"}
              >
                {isListening ? <MiniVoiceVisualizer isListening={isListening} /> : <Mic className="w-5 h-5"/>}
              </button>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t.chatPlaceholder} className="flex-1 h-11 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <button type="submit" disabled={!chatInput.trim() || isChatLoading} className="h-11 w-11 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50"><Send className="w-4 h-4"/></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
