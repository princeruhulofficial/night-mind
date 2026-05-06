import { useCallback, useEffect, useRef, useState } from "react";

type SR = any;

export function useVoiceInput(opts?: { lang?: string; onResult?: (text: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = opts?.lang ?? (navigator.language || "en-US");
    r.continuous = false;
    r.interimResults = true;
    r.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        final += e.results[i][0].transcript;
      }
      setTranscript(final);
      if (e.results[e.results.length - 1].isFinal) {
        opts?.onResult?.(final);
      }
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
    setTranscript("");
    setListening(true);
    r.start();
  }, [opts]);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  }, []);

  return { supported, listening, transcript, start, stop };
}
