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

        // If we are just starting the queue for the first time, or forcing a new speech (not from queue)
        // we might want to cancel. But if we are in a queue loop, we should NOT cancel.
        // Actually, speech synthesis automatically queues if we just call speak() multiple times!
        // But we implemented a manual queue.
        // The issue is `synth.current.cancel()` kills everything.

        // Let's rely on browser queuing for simplicity OR fix the manual queue.
        // Manual queue is better for sentence-by-sentence control.

        // FIX: Only cancel if we are NOT playing from the queue loop, 
        // but `speak` doesn't know if it's called from queue or not easily unless we pass a flag.
        // Ideally, `speak` should just speak. `stop` should cancel.

        // However, if the user interrupts by clicking a button, we want to cancel.
        // Let's remove the global cancel from `speak` and put it in `stop`.
        // If we want to "interrupt and speak", we should call `stop()` then `speak()`.

        // But `speak` was previously designed to "interrupt and speak".
        // Let's change `speak` to NOT cancel by default, relying on the caller to cancel if needed.

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPlayingQueue(false); // Signal that this chunk is done
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPlayingQueue(false);
        };

        // Prefer a natural sounding English voice
        const voices = synth.current.getVoices();
        const preferredVoice = voices.find(v =>
            (v.name.includes("Google") || v.name.includes("Natural")) && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0;

        synth.current.speak(utterance);
    };

    const stop = () => {
        if (synth.current) {
            synth.current.cancel();
            setIsSpeaking(false);
        }
    };

    const [queue, setQueue] = useState([]);
    const [isPlayingQueue, setIsPlayingQueue] = useState(false);

    useEffect(() => {
        // If we have items in queue and not currently processing one
        if (queue.length > 0 && !isPlayingQueue && !isSpeaking) {
            playNextInQueue();
        }
    }, [queue, isPlayingQueue, isSpeaking]);

    const playNextInQueue = () => {
        if (queue.length === 0) return;

        setIsPlayingQueue(true);
        const nextText = queue[0];
        setQueue(prev => prev.slice(1));
        speak(nextText);
    };

    const speakQueue = (text) => {
        setQueue(prev => [...prev, text]);
    };

    const clearQueue = () => {
        setQueue([]);
        setIsPlayingQueue(false);
        stop();
    };

    return {
        isSpeaking,
        speak,
        speakQueue,
        stop: clearQueue,
        hasSupport: !!synth.current
    };
};

export default useTextToSpeech;
