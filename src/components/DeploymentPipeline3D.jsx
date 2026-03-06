import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- CONFIG ---
const STAGES = [
    { id: 'clone', label: 'CLONE', x: -2.4 },
    { id: 'test', label: 'TEST', x: -0.8 },
    { id: 'build', label: 'BUILD', x: 0.8 },
    { id: 'deploy', label: 'DEPLOY', x: 2.4 }
];

const COLORS = {
    darkMetal: '#1f2937',
    cyan: '#00d4ff',
    green: '#10b981',
    amber: '#f59e0b',
    inactive: '#374151'
};

const LOGS = [
    { text: "> Cloning repository...", type: 'neutral', stage: 'clone', delay: 0 },
    { text: "> Running tests... PASS", type: 'success', stage: 'test', delay: 1000 },
    { text: "> Building Docker image...", type: 'warning', stage: 'build', delay: 2000 },
    { text: "> Pushing to ECR... DONE", type: 'success', stage: 'build', delay: 2800 },
    { text: "> Deploying to ECS... V2.1.0", type: 'success', stage: 'deploy', delay: 4000 }
];

// --- 3D COMPONENTS ---

const PipelineTube = () => {
    return (
        <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 6, 16]} />
            <meshStandardMaterial color={COLORS.darkMetal} metalness={0.8} roughness={0.2} transparent={true} opacity={0.6} />
        </mesh>
    );
};

const StageNode = ({ position, label, isActive, color }) => {
    const meshRef = useRef();

    // Pulse animation when active
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        if (isActive) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 10) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
            meshRef.current.material.emissiveIntensity = 2 + Math.sin(clock.getElapsedTime() * 5);
        } else {
            meshRef.current.scale.set(1, 1, 1);
            meshRef.current.material.emissiveIntensity = 0;
        }
    });

    const activeColor = color || COLORS.cyan;
    const materialColor = isActive ? activeColor : COLORS.inactive;

    return (
        <group position={position}>
            {/* The Hub */}
            <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.15, 6]} />
                <meshStandardMaterial
                    color={materialColor}
                    emissive={materialColor}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>

            {/* Label */}
            <Text
                position={[0, 0.5, 0]}
                fontSize={0.18}
                color={isActive ? '#ffffff' : '#6b7280'}
                anchorX="center"
                anchorY="middle"
                font="/fonts/kenpixel.ttf"
            >
                {label}
            </Text>

            {/* Glowing Ring (Active) */}
            {isActive && (
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
                    <ringGeometry args={[0.3, 0.35, 32]} />
                    <meshBasicMaterial color={activeColor} transparent={true} opacity={0.6} />
                </mesh>
            )}
        </group>
    );
};

const Packet = ({ activeStageIndex, onHitNode }) => {
    const packetRef = useRef();

    useFrame(({ clock }) => {
        if (!packetRef.current) return;

        // Packet moves from left to right (-3 to 3 over ~4 seconds)
        // With slight pauses at each node
        const t = clock.getElapsedTime();

        // Complex movement logic synced to stage index
        // Simplify for smooth flow: 
        const speed = 1.5;
        const rawX = -3.5 + (t * speed) % 7; // Wraps around every ~4.6s

        // Determine current stage based on X position to trigger activations
        let newStage = -1;
        if (rawX > STAGES[0].x - 0.2 && rawX < STAGES[1].x) newStage = 0;
        else if (rawX > STAGES[1].x - 0.2 && rawX < STAGES[2].x) newStage = 1;
        else if (rawX > STAGES[2].x - 0.2 && rawX < STAGES[3].x) newStage = 2;
        else if (rawX > STAGES[3].x - 0.2) newStage = 3;

        packetRef.current.position.x = rawX;

        if (newStage !== activeStageIndex && newStage !== -1) {
            onHitNode(newStage);
        }
    });

    return (
        <mesh ref={packetRef} position={[-3.5, 0, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshBasicMaterial color={COLORS.cyan} />
            <pointLight distance={1} intensity={2} color={COLORS.cyan} />
        </mesh>
    );
};

const PipelineScene = ({ activeStageIndex, onHitNode }) => {
    const { viewport } = useThree();
    // Dynamically scale based on canvas aspect ratio to fill the empty width
    const dynamicScale = Math.min(1.8, Math.max(1.0, viewport.aspect * 0.3));

    return (
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
            {/* Isometric tilt */}
            <group rotation={[0.4, -0.1, 0]} scale={dynamicScale}>
                <PipelineTube />

                {STAGES.map((stage, i) => {
                    let color = COLORS.cyan;
                    if (stage.id === 'test') color = COLORS.green;
                    if (stage.id === 'build') color = COLORS.amber;
                    if (stage.id === 'deploy') color = COLORS.green;

                    return (
                        <StageNode
                            key={stage.id}
                            position={[stage.x, 0, 0]}
                            label={stage.label}
                            isActive={activeStageIndex >= i}
                            color={color}
                        />
                    );
                })}

                <Packet activeStageIndex={activeStageIndex} onHitNode={onHitNode} />
            </group>
        </Float>
    );
};

// --- MAIN ENCAPSULATED COMPONENT ---
export default function DeploymentPipeline3D() {
    const [activeStageIndex, setActiveStageIndex] = useState(-1);
    const [visibleLogs, setVisibleLogs] = useState([]);
    const [isLive, setIsLive] = useState(false);

    // Sync HTML logs with 3D packet progress
    useEffect(() => {
        let timeouts = [];

        // Reset sequence
        const runSequence = () => {
            setActiveStageIndex(-1);
            setVisibleLogs([]);
            setIsLive(false);

            LOGS.forEach((log, index) => {
                timeouts.push(setTimeout(() => {
                    setVisibleLogs(prev => [...prev, log].slice(-4)); // Keep max 4 lines
                }, log.delay));
            });

            // Final 'live' state
            timeouts.push(setTimeout(() => {
                setIsLive(true);
            }, 4500));
        };

        runSequence();
        const loop = setInterval(runSequence, 6000); // Sequence takes ~5s, loop every 6s

        return () => {
            timeouts.forEach(clearTimeout);
            clearInterval(loop);
        };
    }, []);

    const handleHitNode = (index) => {
        setActiveStageIndex(index);
    };

    return (
        <div className="relative w-full h-full flex flex-col flex-1 min-h-[140px]">

            {/* GRID BACKGROUND PATTERN */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-xl"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            {/* CRT SCANLINE OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-5 rounded-xl bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

            {/* HEADER LABEL */}
            <div className="absolute top-0 right-0 z-10 pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-green-400">
                    CD_WORKFLOW: STABLE ✓
                </span>
            </div>

            {/* 3D CANVAS PORTION */}
            <div className="flex-1 min-h-[140px] relative z-0">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[0, 2, 2]} intensity={2} color="#ffffff" />
                        <pointLight position={[0, -2, 2]} intensity={1} color={COLORS.cyan} />
                        <PipelineScene activeStageIndex={activeStageIndex} onHitNode={handleHitNode} />
                    </Suspense>
                </Canvas>
            </div>

            {/* TERMINAL LOGS OVERLAY */}
            <div className="h-[75px] bg-black/30 rounded-lg px-4 py-2 mt-2 border border-white/5 z-10 font-mono text-[10px] flex flex-col justify-end shrink-0 relative overflow-hidden">
                {/* Glow from the pipe above */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-cyan-500/20 blur-xl pointer-events-none" />

                <div className="flex flex-col gap-1 justify-end h-full">
                    {visibleLogs.map((log, i) => (
                        <div key={i} className={`animate-fade-in-up leading-tight ${log.type === 'success' ? 'text-green-400' :
                            log.type === 'warning' ? 'text-amber-400' :
                                'text-white/70'
                            }`}>
                            {log.text}
                        </div>
                    ))}
                    {isLive && (
                        <div className="flex items-center gap-1.5 mt-1 animate-fade-in">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative h-1.5 w-1.5 rounded-full bg-green-500 inline-flex" />
                            </span>
                            <span className="text-green-400">Production Live</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
