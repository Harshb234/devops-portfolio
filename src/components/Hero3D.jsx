import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text, ContactShadows } from '@react-three/drei';
import gsap from 'gsap';

// --- CONFIG ---
const TITLES = [
    "Cloud Architect",
    "DevOps Engineer",
    "Full Stack Developer",
    "Infrastructure Lead"
];

const COLORS = {
    bg: "#08080c", // Slightly deeper background
    cyan: "#00f2ff",
    blue: "#0066ff",
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
};

// --- COMPONENTS ---

const LED = ({ position, color = COLORS.green }) => {
    const meshRef = useRef();
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        const blinkSpeed = color === COLORS.red ? 6 : color === COLORS.amber ? 3 : 1.5;
        const isLit = Math.sin(t * blinkSpeed + position[0] * 5) > -0.1;
        meshRef.current.material.emissiveIntensity = isLit ? 5 : 0;
    });

    return (
        <mesh position={position} ref={meshRef}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
    );
};

const ServerUnit = ({ position }) => {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[1.5, 0.22, 0.8]} />
                <meshStandardMaterial color="#1a1a20" roughness={0.4} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.41]}>
                <boxGeometry args={[1.45, 0.18, 0.02]} />
                <meshStandardMaterial color="#020202" metalness={1} roughness={0.05} />
            </mesh>
            <LED position={[-0.6, 0.04, 0.43]} color={COLORS.green} />
            <LED position={[-0.55, 0.04, 0.43]} color={Math.random() > 0.8 ? COLORS.amber : COLORS.green} />
            <LED position={[-0.5, 0.04, 0.43]} color={Math.random() > 0.95 ? COLORS.red : COLORS.green} />
            <mesh position={[0.4, 0, 0.42]}>
                <planeGeometry args={[0.4, 0.08]} />
                <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={3} transparent opacity={0.4} />
            </mesh>
            <mesh position={[0, 0.1, 0.41]}>
                <boxGeometry args={[1.4, 0.005, 0.01]} />
                <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
};

const ServerRack = () => {
    const rackRef = useRef();
    useFrame(({ clock }) => {
        if (rackRef.current) {
            rackRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.08 + 0.35;
        }
    });

    return (
        <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.6} floatingRange={[-0.15, 0.15]}>
            <group ref={rackRef}>
                <mesh position={[0, 0.15, 0]}>
                    <boxGeometry args={[1.63, 1.88, 0.83]} />
                    <meshStandardMaterial color={COLORS.cyan} wireframe={true} transparent opacity={0.1} />
                </mesh>
                {[...Array(6)].map((_, i) => (
                    <ServerUnit key={i} position={[0, -0.6 + i * 0.28, 0]} />
                ))}
            </group>
        </Float>
    );
};

const SplitFlapTile = ({ char, index, isFlipping }) => {
    const groupRef = useRef();
    useEffect(() => {
        if (isFlipping && groupRef.current) {
            gsap.to(groupRef.current.rotation, {
                x: groupRef.current.rotation.x + Math.PI * 2,
                duration: 0.5,
                delay: index * 0.035,
                ease: "power2.inOut"
            });
        }
    }, [char, isFlipping, index]);

    return (
        <group ref={groupRef} position={[index * 0.36, 0, 0]}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.33, 0.46, 0.08]} />
                <meshStandardMaterial color="#030305" metalness={0.9} roughness={0.1} />
            </mesh>
            <Text position={[0, 0, 0.06]} fontSize={0.25} font="/fonts/kenpixel.ttf" color={COLORS.cyan} anchorX="center" anchorY="middle">
                {char}
            </Text>
            <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[0.33, 0.01, 0.01]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </group>
    );
};

const SplitFlapFlipper = () => {
    const [index, setIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsFlipping(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % TITLES.length);
                setIsFlipping(false);
            }, 550);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    const currentText = TITLES[index].padEnd(20, " ");
    return (
        <group position={[-3.6, 0, 0]}>
            {currentText.split("").map((char, i) => (
                <SplitFlapTile key={i} char={char} index={i} isFlipping={isFlipping} />
            ))}
        </group>
    );
};

// --- Mobile-aware 3D Scene ---
const MobileAwareScene = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const rackPos = isMobile ? [0, 0.2, -0.5] : [3.2, 0.4, -0.5];
    const rackScale = isMobile ? 0.7 : 1;
    const showFlipper = !isMobile; // Hide split-flap on mobile (too small to read)

    return (
        <group position={rackPos} scale={rackScale}>
            <ServerRack />
            {showFlipper && (
                <group position={[0, -1.5, 0]}>
                    <SplitFlapFlipper />
                </group>
            )}
        </group>
    );
};

const Hero3D = () => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden flex flex-col" style={{
            background: `radial-gradient(circle at 70% 40%, #1a1a25 0%, ${COLORS.bg} 60%)`,
        }}>
            {/* Cinematic Backdrop Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[60%] w-[50vw] h-[50vw] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* ── MOBILE LAYOUT: flex column with text on top, 3D below ── */}
            {/* ── DESKTOP LAYOUT: text absolutely positioned over full-screen 3D ── */}

            {/* Text Content */}
            <div className="
                relative z-10
                pt-24 sm:pt-28 md:pt-0
                px-5 sm:px-8 md:px-0
                md:absolute md:top-[18%] md:left-[8%]
                max-w-[900px]
                pointer-events-none
                flex-shrink-0
            ">
                <div className="flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-6">
                    <div>
                        <span className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4.5 py-1 sm:py-1.5 w-fit text-[9px] sm:text-[11px] font-bold tracking-[0.25em] text-cyan-400 uppercase border border-cyan-500/20 rounded-full bg-cyan-950/20 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,255,0.05)]">
                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-cyan-400" />
                            </span>
                            Infrastructure & Devops
                        </span>
                    </div>

                    <h1 className="
                        text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[6.5rem]
                        font-display font-black text-white
                        tracking-tighter leading-[1.05]
                        drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]
                    ">
                        Harsh<br />Bambatkar
                    </h1>

                    <p className="
                        text-sm sm:text-base md:text-lg lg:text-xl
                        text-gray-400 font-medium
                        max-w-[85vw] sm:max-w-md md:max-w-xl
                        leading-relaxed tracking-tight
                    ">
                        Architecting high-availability cloud systems<br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>and automating the future of deployment.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2 sm:mt-4 pointer-events-auto">
                        <a href="mailto:harshbambatkar0502@gmail.com"
                            className="group relative px-6 sm:px-10 py-3 sm:py-4 overflow-hidden bg-white text-black font-bold rounded-xl transition-all duration-500 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 text-center text-sm sm:text-base">
                            <span className="relative z-10">Deploy Message</span>
                            <div className="absolute inset-0 bg-cyan-500 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
                        </a>
                        <a href="#work"
                            className="group px-6 sm:px-10 py-3 sm:py-4 border border-white/10 text-white/70 font-bold rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95 text-center text-sm sm:text-base">
                            System.resume()
                        </a>
                    </div>
                </div>
            </div>

            {/* 3D Canvas — fills remaining space on mobile, full area on desktop */}
            <div className="relative flex-1 min-h-[35vh] md:absolute md:inset-0">
                <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 9], fov: 42 }} style={{ width: '100%', height: '100%' }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.4} />
                        <spotLight position={[12, 12, 12]} angle={0.25} penumbra={1} intensity={3} color={COLORS.cyan} />
                        <pointLight position={[-12, 6, 12]} intensity={2.5} color={COLORS.blue} />

                        {/* Targeted Highlights for Server Rack */}
                        <pointLight position={[4, 1, 4]} intensity={5} color={COLORS.cyan} distance={12} />
                        <pointLight position={[2, -2, 3]} intensity={4} color={COLORS.blue} distance={10} />

                        <MobileAwareScene />

                        <ContactShadows opacity={0.4} scale={10} blur={2.4} far={4.5} />
                    </Suspense>
                </Canvas>

                {/* Gradient fade at top of canvas on mobile (text-to-3D transition) */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#08080c] to-transparent pointer-events-none md:hidden" />
            </div>

            {/* ── Scroll indicator (mobile only) ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce md:hidden">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Scroll</span>
                <div className="w-5 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
                    <div className="w-1 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default Hero3D;
