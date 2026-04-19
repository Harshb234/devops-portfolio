import { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';

const TECHS = [
    { label: 'AWS EC2', color: '#3b82f6' },
    { label: 'AWS S3', color: '#3b82f6' },
    { label: 'RDS', color: '#3b82f6' },
    { label: 'Lambda', color: '#3b82f6' },
    { label: 'CloudFront', color: '#3b82f6' },
    { label: 'Route 53', color: '#3b82f6' },
    { label: 'Amplify', color: '#3b82f6' },
    { label: 'API Gateway', color: '#3b82f6' },
    { label: 'Docker', color: '#10b981' },
    { label: 'Kubernetes', color: '#10b981' },
    { label: 'CI/CD', color: '#10b981' },
    { label: 'CodePipeline', color: '#10b981' },
    { label: 'GitHub Actions', color: '#10b981' },
    { label: 'Node.js', color: '#f97316' },
    { label: 'Python', color: '#f97316' },
    { label: 'Express', color: '#f97316' },
    { label: 'FastAPI', color: '#f97316' },
    { label: 'PostgreSQL', color: '#f97316' },
    { label: 'DynamoDB', color: '#f97316' },
    { label: 'MySQL', color: '#f97316' },
    { label: 'React', color: '#a78bfa' },
    { label: 'Next.js', color: '#a78bfa' },
    { label: 'JavaScript', color: '#a78bfa' },
    { label: 'Tailwind CSS', color: '#a78bfa' },
    { label: 'Git', color: '#94a3b8' },
    { label: 'GitHub', color: '#94a3b8' },
    { label: 'Linux', color: '#94a3b8' },
    { label: 'Bash', color: '#94a3b8' },
    { label: 'Postman', color: '#94a3b8' },
];

function sr(seed, min, max) {
    const x = Math.sin(seed + 1) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
}

const FloatingTechStack = () => {
    const containerRef = useRef(null);
    const badgeRefs = useRef([]);
    const floatTLs = useRef([]);
    const magnetRef = useRef(null); // 🧲 custom cursor
    const isChaos = useRef(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile / touch
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Build stable home positions
    const homes = useMemo(() => TECHS.map((_, i) => ({
        xPct: sr(i * 3 + 1, 3, 87),
        yPct: sr(i * 3 + 2, 5, 80),
    })), []);

    useEffect(() => {
        const container = containerRef.current;
        const magnet = magnetRef.current;
        if (!container) return;

        // Skip interactive chaos on mobile — just gentle float
        if (isMobile) {
            badgeRefs.current.forEach((el, i) => {
                if (!el) return;
                const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: sr(i * 3 + 6, 0, 3) });
                tl.to(el, {
                    x: sr(i * 5 + 7, -10, 10),
                    y: sr(i * 5 + 8, -8, 8),
                    rotation: sr(i * 5 + 9, -3, 3),
                    duration: sr(i * 3 + 3, 5, 10),
                    ease: 'sine.inOut',
                });
                floatTLs.current[i] = tl;
            });

            return () => floatTLs.current.forEach(tl => tl?.kill());
        }

        // Desktop: full interactive mode
        const W = () => container.offsetWidth;
        const H = () => container.offsetHeight;

        // Smooth magnet cursor via GSAP quickTo
        const moveX = gsap.quickTo(magnet, 'x', { duration: 0.18, ease: 'power2.out' });
        const moveY = gsap.quickTo(magnet, 'y', { duration: 0.18, ease: 'power2.out' });

        // ── Start idle float for every badge ─────────────────────────────────
        badgeRefs.current.forEach((el, i) => {
            if (!el) return;
            const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: sr(i * 3 + 6, 0, 3) });
            tl.to(el, {
                x: sr(i * 5 + 7, -18, 18),
                y: sr(i * 5 + 8, -14, 14),
                rotation: sr(i * 5 + 9, -5, 5),
                duration: sr(i * 3 + 3, 4, 9),
                ease: 'sine.inOut',
            });
            floatTLs.current[i] = tl;
        });

        const onMove = (e) => {
            const rect = container.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            // Move 🧲 to cursor position
            moveX(mx);
            moveY(my);

            const cw = rect.width;
            const ch = rect.height;
            isChaos.current = true;

            badgeRefs.current.forEach((el, i) => {
                if (!el) return;

                // Badge centre in px (home pos + current transform)
                const bx = (homes[i].xPct / 100) * cw;
                const by = (homes[i].yPct / 100) * ch;

                const dx = bx - mx;
                const dy = by - my;
                const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
                const RADIUS = 140; // px – influence zone

                if (dist < RADIUS) {
                    // Pause idle float
                    floatTLs.current[i]?.pause();

                    const strength = Math.pow(1 - dist / RADIUS, 1.6) * 120;
                    const nx = (dx / dist) * strength;
                    const ny = (dy / dist) * strength;

                    gsap.to(el, {
                        x: nx,
                        y: ny,
                        rotation: sr(i * 7, -35, 35) * (1 - dist / RADIUS),
                        scale: 0.85 + Math.random() * 0.3,
                        duration: 0.25,
                        ease: 'power3.out',
                        overwrite: 'auto',
                    });
                } else {
                    // Outside radius → drift back to idle
                    gsap.to(el, {
                        x: 0, y: 0, rotation: 0, scale: 1,
                        duration: 0.8,
                        ease: 'elastic.out(1, 0.4)',
                        overwrite: 'auto',
                        onComplete: () => floatTLs.current[i]?.resume(),
                    });
                }
            });
        };

        // ── Mouse leave → hide magnet + snap badges back ──────────────────────
        const onLeave = () => {
            isChaos.current = false;
            gsap.to(magnet, { opacity: 0, scale: 0.5, duration: 0.25 });
            badgeRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.to(el, {
                    x: 0, y: 0, rotation: 0, scale: 1,
                    duration: 0.9,
                    ease: 'elastic.out(1.2, 0.45)',
                    overwrite: 'auto',
                    onComplete: () => floatTLs.current[i]?.resume(),
                });
            });
        };

        // ── Mouse enter → show magnet + burst all badges ──────────────────────
        const onEnter = () => {
            gsap.to(magnet, { opacity: 1, scale: 1, duration: 0.2 });
            badgeRefs.current.forEach((el, i) => {
                if (!el) return;
                floatTLs.current[i]?.pause();
                const angle = sr(i * 13, 0, Math.PI * 2);
                gsap.fromTo(
                    el,
                    { x: 0, y: 0 },
                    {
                        x: Math.cos(angle) * sr(i * 11, 10, 30),
                        y: Math.sin(angle) * sr(i * 11, 10, 25),
                        duration: 0.35,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    }
                );
            });
        };

        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);
        container.addEventListener('mouseenter', onEnter);

        return () => {
            floatTLs.current.forEach(tl => tl?.kill());
            container.removeEventListener('mousemove', onMove);
            container.removeEventListener('mouseleave', onLeave);
            container.removeEventListener('mouseenter', onEnter);
        };
    }, [homes, isMobile]);

    // ── Mobile: render as a scrollable grid of badges ──
    if (isMobile) {
        return (
            <div className="flex flex-col flex-1 min-h-0 gap-3">
                {/* Category legend */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {[['Cloud', '#3b82f6'], ['DevOps', '#10b981'], ['Backend', '#f97316'], ['Frontend', '#a78bfa'], ['Tools', '#94a3b8']].map(([lbl, c]) => (
                        <span key={lbl} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: c }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} /> {lbl}
                        </span>
                    ))}
                </div>

                {/* Mobile: Wrapped badge grid with gentle float */}
                <div
                    ref={containerRef}
                    className="flex flex-wrap gap-2 justify-center items-center py-2"
                >
                    {TECHS.map((tech, i) => (
                        <span
                            key={tech.label}
                            ref={el => { badgeRefs.current[i] = el; }}
                            className="select-none whitespace-nowrap text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded-full"
                            style={{
                                color: tech.color,
                                background: `${tech.color}12`,
                                border: `1px solid ${tech.color}40`,
                                willChange: 'transform',
                                transformOrigin: 'center center',
                            }}
                        >
                            {tech.label}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    // ── Desktop: full floating arena ──
    return (
        <div className="flex flex-col flex-1 min-h-0 gap-2">
            {/* Category legend */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
                {[['Cloud', '#3b82f6'], ['DevOps', '#10b981'], ['Backend', '#f97316'], ['Frontend', '#a78bfa'], ['Tools', '#94a3b8']].map(([lbl, c]) => (
                    <span key={lbl} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: c }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} /> {lbl}
                    </span>
                ))}
                <span className="ml-auto text-[9px] text-gray-600 font-mono hidden sm:block">[ move cursor to chaos ↯ ]</span>
            </div>

            {/* Floating arena */}
            <div
                ref={containerRef}
                className="relative flex-1"
                style={{ minHeight: 190, overflow: 'hidden', cursor: 'none' }}
            >
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.035]" style={{
                    backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />

                {/* 🧲 Magnet cursor */}
                <div
                    ref={magnetRef}
                    className="absolute pointer-events-none z-30"
                    style={{
                        fontSize: '22px',
                        lineHeight: 1,
                        opacity: 0,
                        scale: 0.5,
                        transform: 'translate(-50%, -50%)',
                        filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.8))',
                        userSelect: 'none',
                    }}
                >
                    🧲
                </div>

                {TECHS.map((tech, i) => (
                    <span
                        key={tech.label}
                        ref={el => { badgeRefs.current[i] = el; }}
                        className="absolute select-none whitespace-nowrap text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{
                            left: `${homes[i].xPct}%`,
                            top: `${homes[i].yPct}%`,
                            color: tech.color,
                            background: `${tech.color}12`,
                            border: `1px solid ${tech.color}40`,
                            willChange: 'transform',
                            transformOrigin: 'center center',
                        }}
                    >
                        {tech.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FloatingTechStack;
