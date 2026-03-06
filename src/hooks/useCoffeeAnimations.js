import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * useCoffeeTilt – adds a 3D tilt + "steam" shimmer on hover.
 * Returns { cardRef, shimmerRef } to attach to elements.
 */
export function useCoffeeTilt(strength = 12) {
    const cardRef = useRef(null);
    const shimmerRef = useRef(null);

    useEffect(() => {
        const el = cardRef.current;
        const shimmer = shimmerRef.current;
        if (!el) return;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            gsap.to(el, {
                rotateX: -dy * strength,
                rotateY: dx * strength,
                transformPerspective: 800,
                ease: 'power2.out',
                duration: 0.35,
            });

            if (shimmer) {
                gsap.to(shimmer, {
                    opacity: 0.18,
                    x: dx * 20,
                    y: dy * 20,
                    duration: 0.3,
                    ease: 'power1.out',
                });
            }
        };

        const onLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
            if (shimmer) gsap.to(shimmer, { opacity: 0, x: 0, y: 0, duration: 0.4 });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);

    return { cardRef, shimmerRef };
}

/**
 * useCoffeeBrewIn – staggers child elements up with opacity (like espresso brewing drop by drop).
 */
export function useCoffeeBrewIn(delay = 0) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const children = Array.from(el.children);
        gsap.fromTo(
            children,
            { y: 24, opacity: 0, filter: 'blur(4px)' },
            {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.08,
                delay,
                duration: 0.65,
                ease: 'power3.out',
            }
        );
    }, [delay]);

    return ref;
}

/**
 * useSteamPulse – makes an element gently oscillate like steam rising.
 */
export function useSteamPulse() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(el, { y: -6, opacity: 0.5, duration: 1.4, ease: 'sine.inOut' })
            .to(el, { y: 0, opacity: 1.0, duration: 1.4, ease: 'sine.inOut' });

        return () => tl.kill();
    }, []);

    return ref;
}

/**
 * useCoffeeClick – ripple-splash on click (like a coffee cup being set down).
 */
export function useCoffeeClick() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onClick = () => {
            gsap.fromTo(
                el,
                { scale: 0.96 },
                { scale: 1, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' }
            );
        };

        el.addEventListener('click', onClick);
        return () => el.removeEventListener('click', onClick);
    }, []);

    return ref;
}
