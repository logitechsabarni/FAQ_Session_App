import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Volume2 } from 'lucide-react';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  isProcessing?: boolean;
}

export function VoiceAssistant({ onTranscript, isProcessing = false }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for SpeechRecognition support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcriptResult = event.results[current][0].transcript;
      setTranscript(transcriptResult);

      if (event.results[current].isFinal) {
        onTranscript(transcriptResult);
        setTranscript('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [onTranscript]);

  const startListening = () => {
    setError(null);
    setTranscript('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
        <p className="text-slate-400 text-sm">
          Voice recognition is not supported in your browser. Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Voice Button */}
      <div className="relative">
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-cyan-500/30"
          />
        )}
        {isListening && (
          <motion.div
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-cyan-500/20"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="stop"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Square className="w-8 h-8 text-white fill-white" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status */}
      <div className="text-center">
        <p className={`text-sm font-medium ${isListening ? 'text-cyan-400' : 'text-slate-400'}`}>
          {isListening ? 'Listening...' : 'Tap to speak'}
        </p>
        {isProcessing && (
          <p className="text-xs text-slate-500 mt-1">Processing your voice...</p>
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-xl bg-slate-800/50 border border-cyan-500/30"
        >
          <p className="text-slate-300 text-sm">{transcript}</p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}

      {/* Supported commands hint */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          Try: "Search for internship FAQs", "Show my profile", "How do I submit NOC?"
        </p>
      </div>
    </div>
  );
}
