import { useState } from 'react';
import toast from 'react-hot-toast';

export const useVoiceGuide = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text, rate = 1, onSpeechEnd = null, language = 'en') => {
    console.log('🎙️ useVoiceGuide.speak() called with language:', language);
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Set language code
      const languageCode = language === 'te' ? 'te-IN' : 'en-US';
      console.log('🎙️ Setting utterance.lang to:', languageCode);
      utterance.lang = languageCode;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        console.log('🎙️ Speech ended');
        setIsSpeaking(false);
        if (onSpeechEnd) {
          console.log('🎙️ Calling onSpeechEnd callback');
          onSpeechEnd();
        }
      };
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Voice guidance not supported');
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = (onResult) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in your browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Voice input error');
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return {
    speak,
    stop,
    startListening,
    isSpeaking,
    isListening,
  };
};
