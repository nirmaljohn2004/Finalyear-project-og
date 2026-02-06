import { useState, useEffect, useRef } from 'react';

const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synth = useRef(window.speechSynthesis);

    useEffect(() => {
        const handleStart = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);

        // Ideally, we'd add event listeners to the Utterance object, 
        // but since it's created per speak call, we handle state there.
        // However, we can poll for speaking state as a backup
        const interval = setInterval(() => {
            setIsSpeaking(synth.current.speaking);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const speak = (text) => {
        if (!synth.current) return;

        // Cancel any ongoing speech
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Prefer a natural sounding voice if available
        const voices = synth.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.3;
        utterance.pitch = 1.0;

        synth.current.speak(utterance);
    };

    const stop = () => {
        if (synth.current) {
            synth.current.cancel();
            setIsSpeaking(false);
        }
    };

    return {
        isSpeaking,
        speak,
        stop,
        hasSupport: !!synth.current
    };
};

export default useTextToSpeech;
