import { useState, useEffect } from 'react';

export default function useCountUp(target, { duration = 1200, delay = 0 } = {}) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let animationFrame;
        let startTime;

        const startTimeout = setTimeout(() => {
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setValue(Math.round(eased * target));

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(step);
                }
            };
            animationFrame = requestAnimationFrame(step);
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            cancelAnimationFrame(animationFrame);
        };
    }, [target, duration, delay]);

    return value;
}