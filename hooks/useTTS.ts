import { useState, useEffect, useCallback, useRef } from 'react';

interface TTSState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
  rate: number;
  pitch: number;
  selectedVoice: SpeechSynthesisVoice | null;
}

export const useTTS = () => {
  const [state, setState] = useState<TTSState>({
    isSupported: 'speechSynthesis' in window,
    isPlaying: false,
    isPaused: false,
    voices: [],
    rate: 1,
    pitch: 1,
    selectedVoice: null,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load Voices
  useEffect(() => {
    if (!state.isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setState(prev => ({ ...prev, voices }));
      }
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [state.isSupported]);

  // Play Function
  const speak = useCallback((text: string) => {
    if (!state.isSupported) return;

    // Cancel current
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (state.selectedVoice) {
      utterance.voice = state.selectedVoice;
    }
    
    utterance.rate = state.rate;
    utterance.pitch = state.pitch;

    utterance.onstart = () => setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    utterance.onend = () => setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    utterance.onpause = () => setState(prev => ({ ...prev, isPaused: true }));
    utterance.onresume = () => setState(prev => ({ ...prev, isPaused: false }));
    utterance.onerror = () => setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [state.isSupported, state.selectedVoice, state.rate, state.pitch]);

  const cancel = useCallback(() => {
    if (!state.isSupported) return;
    window.speechSynthesis.cancel();
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
  }, [state.isSupported]);

  const pause = useCallback(() => {
    if (!state.isSupported) return;
    window.speechSynthesis.pause();
  }, [state.isSupported]);

  const resume = useCallback(() => {
    if (!state.isSupported) return;
    window.speechSynthesis.resume();
  }, [state.isSupported]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setState(prev => ({ ...prev, selectedVoice: voice }));
  }, []);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate }));
    // If playing, we need to restart to apply rate change in most browsers
    if (window.speechSynthesis.speaking && utteranceRef.current) {
        // Note: Dynamic rate change while playing is tricky in Web Speech API. 
        // Often requires cancelling and restarting from current position, 
        // but tracking character index is complex. 
        // For simplicity, we update state so next sentence uses new rate.
        // Or user must stop/start.
    }
  }, []);

  return {
    ...state,
    speak,
    cancel,
    pause,
    resume,
    setVoice,
    setRate
  };
};