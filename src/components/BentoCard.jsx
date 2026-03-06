import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useCoffeeTilt } from '../hooks/useCoffeeAnimations';

export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}

const BentoCard = ({
    children,
    className = '',
    title,
    icon,
    gridCol,
    gridRow,
    span = 'small',
    brewDelay = 0,
}) => {
    // ── 3D tilt ──────────────────────────────────────────────────────────
    const { cardRef, shimmerRef } = useCoffeeTilt(10);

    // ── brew-in entrance ─────────────────────────────────────────────────
    const contentRef = useRef(null);
    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        gsap.fromTo(
            el,
            { y: 30, opacity: 0, filter: 'blur(6px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, delay: brewDelay, ease: 'power3.out' }
        );
    }, [brewDelay]);

    // ── click bounce ─────────────────────────────────────────────────────
    const handleClick = () => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.4, 0.4)' });
    };

    const autoCol =
        span === 'medium' || span === 'large' ? 'span 2' :
            span === 'wide' ? 'span 3' :
                span === 'full' ? '1 / -1' : 'span 1';
    const autoRow = span === 'tall' || span === 'large' ? 'span 2' : 'span 1';
    const minH =
        span === 'large' || span === 'tall' ? '380px' :
            span === 'wide' || span === 'full' ? '160px' : '200px';

    return (
        <div
            ref={cardRef}
            onClick={handleClick}
            className={cn(
                'relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md flex flex-col group cursor-default',
                className
            )}
            style={{
                padding: '1.5rem',
                boxShadow: '0 2px 24px -4px rgba(0,0,0,0.7)',
                minHeight: minH,
                gridColumn: gridCol ?? autoCol,
                gridRow: gridRow ?? autoRow,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
            }}
        >
            {/* ── Shimmer layer (follows cursor) ── */}
            <div
                ref={shimmerRef}
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)',
                }}
            />

            {/* ── Top shimmer line ── */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />

            {/* ── Header ── */}
            {title && (
                <div className="flex items-center gap-2 mb-4 shrink-0">
                    {icon && <span className="opacity-60 text-blue-400">{icon}</span>}
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">{title}</span>
                </div>
            )}

            {/* ── Body ── */}
            <div ref={contentRef} className="relative z-10 flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    );
};

export default BentoCard;
