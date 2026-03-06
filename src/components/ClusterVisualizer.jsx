import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Star field ────────────────────────────────────────────────────────────
const StarField = () => {
    const ref = useRef();
    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const N = 2000;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 200;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return g;
    }, []);

    const mat = useMemo(() => new THREE.PointsMaterial({ color: '#ffffff', size: 0.3, transparent: true, opacity: 0.6 }), []);

    useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01; });
    return <points ref={ref} geometry={geo} material={mat} />;
};

// ── Galaxy particles ──────────────────────────────────────────────────────
const Galaxy = () => {
    const ref = useRef();

    const { geo, mat } = useMemo(() => {
        const N = 2500;
        const pos = new Float32Array(N * 3);
        const col = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            const arm = i % 3;
            const t = i / N;
            const r = Math.pow(t, 0.5) * 10 + 0.5;
            const angle = t * Math.PI * 8 + (arm / 3) * Math.PI * 2;
            const jx = (Math.random() - 0.5) * r * 0.25;
            const jz = (Math.random() - 0.5) * r * 0.25;
            pos[i * 3] = Math.cos(angle) * r + jx;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            pos[i * 3 + 2] = Math.sin(angle) * r + jz;
            const nt = r / 10;
            col[i * 3] = 0.1 + nt * 0.2;
            col[i * 3 + 1] = 0.5 + nt * 0.35;
            col[i * 3 + 2] = 1.0 - nt * 0.5;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const m = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false });
        return { geo: g, mat: m };
    }, []);

    useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05; });
    return <points ref={ref} geometry={geo} material={mat} />;
};

// ── Pulsing core ──────────────────────────────────────────────────────────
const Core = () => {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (ref.current) {
            const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
            ref.current.scale.setScalar(s);
        }
    });
    const geo = useMemo(() => new THREE.SphereGeometry(0.35, 24, 24), []);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#60a5fa' }), []);
    return <mesh ref={ref} geometry={geo} material={mat} />;
};

// ── Orbit ring ────────────────────────────────────────────────────────────
const Ring = ({ r, tiltX, speed, color }) => {
    const ref = useRef();
    const geo = useMemo(() => new THREE.TorusGeometry(r, 0.018, 8, 80), [r]);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.65 }), [color]);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed;
    });
    return <mesh ref={ref} geometry={geo} material={mat} rotation={[Math.PI / 2 + tiltX, 0, 0]} />;
};

// ── Orbiting node ─────────────────────────────────────────────────────────
const OrbNode = ({ r, speed, phase, color }) => {
    const ref = useRef();
    const geo = useMemo(() => new THREE.OctahedronGeometry(0.15, 0), []);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, wireframe: true }), [color]);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.getElapsedTime() * speed + phase;
        ref.current.position.set(Math.cos(t) * r, Math.sin(t * 0.6) * 0.8, Math.sin(t) * r);
        ref.current.rotation.x += 0.03;
        ref.current.rotation.y += 0.02;
    });
    return <mesh ref={ref} geometry={geo} material={mat} />;
};

// ── Scene ─────────────────────────────────────────────────────────────────
const Scene = () => (
    <>
        <ambientLight intensity={1} />
        <StarField />
        <Galaxy />
        <Core />
        <Ring r={2.6} tiltX={0} speed={0.28} color="#3b82f6" />
        <Ring r={4.0} tiltX={0.9} speed={-0.18} color="#10b981" />
        <Ring r={5.5} tiltX={1.7} speed={0.13} color="#8b5cf6" />
        <OrbNode r={2.6} speed={1.0} phase={0} color="#93c5fd" />
        <OrbNode r={2.6} speed={1.0} phase={2.1} color="#60a5fa" />
        <OrbNode r={4.0} speed={0.7} phase={1.05} color="#34d399" />
        <OrbNode r={4.0} speed={0.7} phase={3.2} color="#6ee7b7" />
        <OrbNode r={5.5} speed={0.5} phase={0.7} color="#a78bfa" />
    </>
);

// ── Main export ───────────────────────────────────────────────────────────
const ClusterVisualizer = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -10, background: '#000000' }}>
        <Canvas
            camera={{ position: [0, 6, 14], fov: 52 }}
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => { gl.setClearColor('#000000', 1); }}
        >
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
        </Canvas>
        {/* Vignette */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(0,0,0,0.82) 100%)',
            pointerEvents: 'none',
        }} />
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, rgba(0,0,0,0.92) 100%)',
            pointerEvents: 'none',
        }} />
    </div>
);

export default ClusterVisualizer;
