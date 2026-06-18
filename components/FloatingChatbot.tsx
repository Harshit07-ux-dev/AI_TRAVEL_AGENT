import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, X, Send, Sparkles, Compass, AlertCircle, 
  Headphones, Mic, MicOff, Volume2, VolumeX, Settings, Play, Square, Radio
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Voice Assistant state configurations
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePlaybackEnabled, setVoicePlaybackEnabled] = useState(true);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I'm your AI Travel Concierge. I am now fully supercharged with high-fidelity speech recognition and speakback! Ask me anything by clicking the microphone button.",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(
    typeof window !== "undefined" ? window.speechSynthesis : null
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll message pane
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Load browser voice list dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Capture standard English family for pristine speech accents matching user locales
        const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith("en"));
        setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices);
        
        if (englishVoices.length > 0 && !selectedVoiceName) {
          // Default to high fidelity premium accents if detected
          const premium = englishVoices.find(v => 
            v.name.includes("Google") || 
            v.name.includes("Natural") || 
            v.name.includes("UK") || 
            v.name.includes("Samantha")
          );
          setSelectedVoiceName(premium ? premium.name : englishVoices[0].name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Handle Speech recognition startup
  const startSpeechRecognition = () => {
    setVoiceError(null);
    const SpeechRecog = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecog) {
      setVoiceError("Your browser context does not support voice recognition. Please try modern Chrome/Safari!");
      return;
    }

    // Stop speaking immediately to prevent the microphone from capturing the synthesized reply
    stopVoiceSynthesis();

    try {
      const recognition = new SpeechRecog();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const resultString = event.results[event.results.length - 1][0].transcript;
        if (resultString) {
          setInput(resultString);
          handleSendMessage(resultString);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setVoiceError("Microphone access blocked. If running inside an iframe, open app in a new tab to permit access!");
        } else {
          setVoiceError(`Voice detection bypassed: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("SpeechRecognition instantiation error:", err);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Convert rich response text to plain readable words (cleaning markup syntax)
  const cleanMarkupForSynthesis = (markupText: string): string => {
    return markupText
      .replace(/[*#_\-~`[\]()]+/g, " ") // Clean standard markdown blocks
      .replace(/https?:\/\/\S+/g, "link coordinates") // Skip URL spelling
      .trim();
  };

  // Speaks response out loud
  const triggerVoiceSynthesis = (textToSpeak: string) => {
    if (!voicePlaybackEnabled || !synthesisRef.current) return;

    stopVoiceSynthesis();

    const plainPhrase = cleanMarkupForSynthesis(textToSpeak);
    if (!plainPhrase) return;

    try {
      const utterance = new SpeechSynthesisUtterance(plainPhrase);

      if (selectedVoiceName) {
        const matchingVoice = availableVoices.find(v => v.name === selectedVoiceName);
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      synthesisRef.current.speak(utterance);
    } catch (err) {
      console.error("Speech Synthesis failure:", err);
      setIsSpeaking(false);
    }
  };

  const stopVoiceSynthesis = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  // Main message delivery routine
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Halt any ongoing voice outlays
    stopVoiceSynthesis();

    const userMsg: ChatMessage = { role: "user", text: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({ role: m.role, text: m.text }))
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: data.reply, timestamp: new Date() }
        ]);
        
        // Auto dictate speaking
        if (voicePlaybackEnabled) {
          triggerVoiceSynthesis(data.reply);
        }
      } else {
        throw new Error(data.error || "Bad payloads");
      }
    } catch (error) {
      console.error("Voice chat fetch failed:", error);
      const fallbackTip = "I might be offline or undergoing brief routine maintenance, but here is my live tip: To keep your travel dynamic, try exploring nearby historical alleys early in the morning. It helps avoid standard crowd congestion, and you get spectacular morning light!";
      setMessages((prev) => [
        ...prev,
        { role: "model", text: fallbackTip, timestamp: new Date() }
      ]);
      if (voicePlaybackEnabled) {
        triggerVoiceSynthesis(fallbackTip);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  const quickPrompts = [
    "What are essential items for rainy weather?",
    "Suggest budget savings for Tokyo.",
    "Tell me an emergency safety guideline."
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            id="btn-chatbot-open"
            title="Explore with AI Voice Guide"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#5A5A40] hover:bg-[#4a4a35] text-white shadow-xl border border-brand-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-sage group relative"
          >
            <Headphones className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-sage border border-white"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-[360px] sm:w-[410px] h-[580px] rounded-3xl bg-white border border-brand-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header block with Voice Indicator wave */}
            <div className="bg-[#fcfcfa] px-4 py-3.5 border-b border-brand-border flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-brand-sage flex items-center justify-center text-white border border-brand-border shadow-sm">
                  {isSpeaking ? (
                    <Radio className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  )}
                  {isSpeaking && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-ink flex items-center gap-1.5 leading-none">
                    AI Travel Companion
                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${isSpeaking ? "bg-emerald-600 animate-ping" : "bg-zinc-400"}`} />
                  </h4>
                  <span className="text-[10px] text-brand-charcoal/80 font-mono tracking-widest uppercase flex items-center gap-1">
                    🎙️ Voice Assistant Active
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                {/* Voice preference toggle */}
                <button
                  onClick={() => {
                    const nextVal = !voicePlaybackEnabled;
                    setVoicePlaybackEnabled(nextVal);
                    if (!nextVal) stopVoiceSynthesis();
                  }}
                  title={voicePlaybackEnabled ? "Mute voice readout" : "Unmute voice readout"}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    voicePlaybackEnabled 
                      ? "text-[#5A5A40] bg-brand-border/40 border-[#5A5A40]/30" 
                      : "text-zinc-400 bg-zinc-50 border-zinc-200"
                  }`}
                >
                  {voicePlaybackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Accent customization settings gears toggle */}
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  title="Customize voice accents"
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    showVoiceSettings 
                      ? "text-brand-sage bg-white border-brand-sage" 
                      : "text-zinc-500 hover:text-brand-ink hover:bg-brand-border/30 border-transparent"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Close chatbot representation */}
                <button
                  onClick={() => {
                    stopVoiceSynthesis();
                    stopSpeechRecognition();
                    setIsOpen(false);
                  }}
                  className="text-brand-charcoal hover:text-brand-ink p-1.5 rounded-lg hover:bg-brand-border/40 transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Accent selection panel display (Slide menu style) */}
            <AnimatePresence>
              {showVoiceSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#fcfcfa] border-b border-brand-border px-4 py-2.5 space-y-2 text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-brand-ink uppercase font-mono">Accent Synthesizer Config</span>
                    <span className="text-[9px] text-zinc-400">Speech Rate: Normal</span>
                  </div>
                  {availableVoices.length > 0 ? (
                    <select
                      value={selectedVoiceName}
                      onChange={(e) => {
                        setSelectedVoiceName(e.target.value);
                        // Trigger preview voice readout
                        setTimeout(() => triggerVoiceSynthesis("Accent configured! Ready for exploration."), 200);
                      }}
                      className="w-full text-xs bg-white border border-brand-border text-brand-ink rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-brand-sage"
                    >
                      {availableVoices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-[10px] text-zinc-400">Loading fine speech accents from your local device browser engine...</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error notifications or browser iframe warnings */}
            {voiceError && (
              <div className="bg-amber-50 border-b border-amber-100 p-2 text-left flex items-start gap-2 text-[11px] text-amber-800 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1 leading-tight">
                  <p>{voiceError}</p>
                  <button 
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.open(window.location.href, "_blank");
                      }
                    }}
                    className="underline text-brand-ink mt-1 block font-bold cursor-pointer"
                  >
                    🚀 Open app in native Tab to bypass limit
                  </button>
                </div>
                <button onClick={() => setVoiceError(null)} className="text-amber-500 hover:text-amber-800 font-bold px-1 rounded">×</button>
              </div>
            )}

            {/* Speaking equalizer overlay wave (Sleek overlay shown while speaking) */}
            {isSpeaking && (
              <div className="bg-brand-sage/5 border-b border-brand-border px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 items-end h-3 w-5">
                    <span className="w-0.5 h-full bg-brand-sage rounded-full animate-bounce [animation-duration:0.6s]" />
                    <span className="w-0.5 h-2/3 bg-[#5A5A40] rounded-full animate-bounce [animation-duration:0.7s]" />
                    <span className="w-0.5 h-full bg-brand-sage rounded-full animate-bounce [animation-duration:0.5s]" />
                    <span className="w-0.5 h-1/2 bg-[#5A5A40] rounded-full animate-bounce [animation-duration:0.8s]" />
                  </div>
                  <span className="text-[11px] font-mono text-brand-sage font-bold tracking-wide">Speaking out loud...</span>
                </div>
                <button 
                  onClick={stopVoiceSynthesis}
                  className="text-[9px] hover:text-rose-600 border border-rose-200 bg-rose-50/50 hover:bg-rose-50 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Square className="w-2.5 h-2.5 fill-current" /> Stop Audio
                </button>
              </div>
            )}

            {/* Listening Wave Overlay (Sleek full block shown while record mode is active) */}
            {isListening && (
              <div className="bg-amber-500/10 border-b border-brand-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  <div className="flex gap-1 items-end h-4 w-7">
                    <span className="w-1 bg-rose-600 rounded-full animate-bounce [animation-duration:0.6s] h-full" style={{ animationDelay: "100ms" }} />
                    <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-duration:0.4s] h-1/2" style={{ animationDelay: "200ms" }} />
                    <span className="w-1 bg-red-600 rounded-full animate-bounce [animation-duration:0.8s] h-3/4" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-duration:0.5s] h-1/3" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs font-semibold text-brand-ink">Listening to your voice... Speak now!</span>
                </div>
                <button 
                  onClick={stopSpeechRecognition}
                  className="text-[9px] text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 px-2 py-1 rounded-md font-mono flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <MicOff className="w-3 h-3" /> Stop Mic
                </button>
              </div>
            )}

            {/* Chat Dialog Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%] flex flex-col gap-1.5">
                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative group ${
                        m.role === "user"
                          ? "bg-[#5A5A40] text-white rounded-tr-none px-4"
                          : "bg-[#f5f5f0] text-brand-ink rounded-tl-none border border-brand-border"
                      }`}
                    >
                      <p className="font-sans font-semibold whitespace-pre-wrap">{m.text}</p>
                      
                      {/* Individual speak play button for reading any specific model response */}
                      {m.role === "model" && (
                        <button
                          onClick={() => triggerVoiceSynthesis(m.text)}
                          title="Read this message out loud"
                          className="absolute -right-3 -bottom-3 bg-white hover:bg-[#5A5A40] border border-brand-border text-brand-ink hover:text-white p-1 rounded-full shadow-md hover:scale-105 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      )}
                    </div>
                    <span className="text-[8px] opacity-60 text-right px-1">
                      {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f0] border border-brand-border flex items-center justify-center text-[#5A5A40]">
                    <Compass className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-[#f5f5f0] text-brand-charcoal rounded-2xl p-3 rounded-tl-none text-xs flex gap-1 items-center border border-brand-border shadow-sm">
                    <span className="w-1.5 h-1.5 bg-brand-sage rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-brand-sage rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions block */}
            {messages.length < 5 && (
              <div className="px-4 py-2.5 bg-[#fcfcfa] border-t border-brand-border shrink-0">
                <span className="text-[9px] font-mono text-brand-charcoal uppercase tracking-wider block mb-1">Suggested Questions</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((q, qidx) => (
                    <button
                      key={qidx}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-[10px] text-brand-ink bg-[#f5f5f0] hover:bg-brand-border/60 border border-brand-border transition-all rounded-md px-2 py-1 select-none focus:outline-none cursor-pointer font-sans font-semibold"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Form with Mic keys */}
            <div className="p-3 bg-[#fcfcfa] border-t border-brand-border shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Mic Trigger Key */}
                <button
                  type="button"
                  onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
                  className={`w-10.5 h-10.5 flex items-center justify-center rounded-xl transition-all shadow-sm shrink-0 cursor-pointer focus:outline-none ${
                    isListening 
                      ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse" 
                      : "bg-[#f5f5f0] hover:bg-brand-border/60 border border-brand-border text-brand-ink"
                  }`}
                  title={isListening ? "Listening... click to STOP" : "Dictate message with Mic"}
                >
                  <Mic className={`w-4.5 h-4.5 ${isListening ? "animate-wiggle" : ""}`} />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening out loud..." : "Ask packing tips, weather forecast..."}
                  className="flex-1 bg-white border border-brand-border focus:border-brand-sage focus:outline-none text-brand-ink text-xs rounded-xl px-4 py-2.5 font-medium min-w-0"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10.5 h-10.5 flex items-center justify-center rounded-xl bg-[#5A5A40] hover:bg-[#4a4a35] text-white disabled:opacity-40 transition-colors cursor-pointer shrink-0 focus:outline-none shadow-sm"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
