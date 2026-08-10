import { useEffect, useRef, useState } from 'react';

export default function useScrollRepeat(intervalMs = 9000, threshold = 0.35) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [playKey, setPlayKey] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    setPlayKey((k) => k + 1);
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    useEffect(() => {
        if (!isVisible) return;
        const id = setInterval(() => setPlayKey((k) => k + 1), intervalMs);
        return () => clearInterval(id);
    }, [isVisible, intervalMs]);

    return { ref, isVisible, playKey };
}