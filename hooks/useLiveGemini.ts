
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export const useLiveGemini = (systemInstruction: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<string>("");
  const startTimeRef = useRef<number>(0);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const getTranscript = useCallback(() => transcriptRef.current, []);
  const getVolume = useCallback(() => 0, []); 

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
  };

  const disconnect = useCallback(async () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    audioSourcesRef.current.forEach(source => { try { source.stop(); } catch(e) {} });
    audioSourcesRef.current.clear();
    if (inputAudioContextRef.current) await inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) await outputAudioContextRef.current.close();
    if (sessionPromiseRef.current) sessionPromiseRef.current.then(session => session.close());
    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  const connect = useCallback(async () => {
    try {
      if (isConnected) return;
      setError(null);
      transcriptRef.current = "";

      // STRICT USER KEY CHECK
      const userKey = localStorage.getItem('deepscribe_user_apikey');
      const bridgeKey = process.env.API_KEY;
      const apiKey = (userKey && userKey.length > 10) ? userKey : (window.aistudio ? bridgeKey : null);

      if (!apiKey) {
        setError("User API key required for billing safety.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (inputAudioContextRef.current.state === 'suspended') await inputAudioContextRef.current.resume();
      if (outputAudioContextRef.current.state === 'suspended') await outputAudioContextRef.current.resume();

      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            startTimeRef.current = Date.now();
            inputSourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            processorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            processorRef.current.onaudioprocess = (e) => {
              const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            inputSourceRef.current.connect(processorRef.current);
            processorRef.current.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const ts = formatTime(Date.now() - startTimeRef.current);
            if (message.serverContent?.outputTranscription) transcriptRef.current += `\n${ts} AI: ${message.serverContent.outputTranscription.text}`;
            if (message.serverContent?.inputTranscription) transcriptRef.current += `\n${ts} User: ${message.serverContent.inputTranscription.text}`;
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              setIsSpeaking(true);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.start(Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime));
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime) + audioBuffer.duration;
              audioSourcesRef.current.add(source);
              source.onended = () => { audioSourcesRef.current.delete(source); if (audioSourcesRef.current.size === 0) setIsSpeaking(false); };
            }
          },
          onclose: () => setIsConnected(false),
          onerror: (err) => { console.error(err); disconnect(); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: systemInstruction
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err: any) { setError(err.message); setIsConnected(false); }
  }, [isConnected, systemInstruction, disconnect]);

  return { connect, disconnect, getTranscript, getVolume, isConnected, isSpeaking, error };
};
