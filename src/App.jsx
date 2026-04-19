import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Github, Linkedin, Mail, Cpu, Server, Terminal,
  Download, GraduationCap, Sparkles, Briefcase, Coffee
} from 'lucide-react';

import Navbar from './components/Navbar';
import BentoCard from './components/BentoCard';
import ClusterVisualizer from './components/ClusterVisualizer';
import FloatingTechStack from './components/FloatingTechStack';
import Hero3D from './components/Hero3D';
import DeploymentPipeline3D from './components/DeploymentPipeline3D';

// ── Data ────────────────────────────────────────────────────────────────
const skillGroups = [
  { label: 'Cloud', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)', items: ['AWS EC2', 'AWS S3', 'RDS', 'Lambda', 'API GW', 'CloudFront', 'Route53', 'Amplify'] },
  { label: 'DevOps', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)', items: ['Docker', 'Kubernetes', 'CI/CD', 'CodePipeline', 'GitHub Actions'] },
  { label: 'Backend', color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.25)', items: ['Node.js', 'Python', 'Express', 'FastAPI', 'MySQL', 'PostgreSQL', 'DynamoDB'] },
  { label: 'Frontend', color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.25)', items: ['React', 'Next.js', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'] },
  { label: 'Tools', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', items: ['Git', 'GitHub', 'Linux', 'Bash', 'VS Code', 'Postman'] },
];

const projects = [
  {
    title: 'E-Commerce Web App',
    status: 'Live', statusColor: '#3b82f6',
    description: 'React on AWS Amplify with CI/CD. Serverless Lambda + API Gateway backend. DynamoDB for data consistency, resolved runtime issues and latency.',
    tags: ['React', 'Amplify', 'Lambda', 'DynamoDB', 'CI/CD'],
  },
  {
    title: 'AWS Hospital Mgmt. System',
    status: 'Prod', statusColor: '#10b981',
    description: 'EC2-hosted backend. Configured IAM roles, debugged permission failures. Monitored RDS MySQL health, backups, and availability.',
    tags: ['EC2', 'RDS MySQL', 'IAM', 'S3', 'CloudWatch'],
  },
  {
    title: 'Herbs Magic Platform',
    status: 'Active', statusColor: '#f97316',
    description: 'Full-stack Next.js platform. Integrated Python ML models for recommendations. Analyzed and optimized APIs for reduced load times.',
    tags: ['Next.js', 'Python', 'ML', 'API Opt.', 'Git'],
  },
];

const expBullets = [
  'Maintained and scaled the live platform using Next.js',
  'Integrated Python-based ML models for medicine recommendations',
  'Optimized API workflows to improve system efficiency & reduce latency',
  'Collaborated with teams via Git/GitHub workflows and documented processes',
];

const education = [
  { degree: 'B-Tech CSE', school: 'Vishwakarma University', cgpa: '7.9 / 10', period: 'Sept 2023 – May 2026' },
  { degree: 'Diploma in IT', school: 'Gov Polytechnic Nagpur', cgpa: '8.3 / 10', period: 'Dec 2020 – May 2023' },
];

// ── App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [load, setLoad] = useState(82.4);

  useEffect(() => {
    const id = setInterval(() => setLoad(p => parseFloat((parseFloat(p) + (Math.random() - 0.5) * 3).toFixed(1))), 2500);
    return () => clearInterval(id);
  }, []);

  const gridRef = useRef(null);
  // ── Page-load stagger: cards brew in one by one ──
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(':scope > div');
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.96, filter: 'blur(8px)' },
      { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  const healthy = parseFloat(load) < 90;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <Hero3D />

      <section id="work" className="py-8 sm:py-12">
        <main className="bento-grid" ref={gridRef}>

          {/* ━━━━━━━━━━ ROW 1: Health & Pipeline ━━━━━━━━━━ */}

          {/* SYSTEM HEALTH – col 1, row 1 */}
          <BentoCard gridCol="1 / 2" gridRow="1 / 2" title="System Health" icon={<Cpu size={12} />}>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <div className="text-center">
                <div className={`text-3xl sm:text-4xl font-mono font-bold tabular-nums ${healthy ? 'text-green-400' : 'text-red-400'}`}>{load}%</div>
                <div className="text-[10px] text-gray-500 mt-0.5 font-mono">{healthy ? '▲ Optimal' : '⚠ Warning'}</div>
              </div>
              <div className="space-y-2">
                {['CPU', 'Memory', 'I/O'].map((lbl, i) => {
                  const v = Math.min(99, Math.max(30, parseFloat(load) + i * 4 - 4));
                  return (
                    <div key={lbl} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-mono w-10 shrink-0">{lbl}</span>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" animate={{ width: `${v}%` }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono w-7 text-right">{v.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </BentoCard>

          {/* DEPLOYMENT PIPELINE – col 2-4, row 1 */}
          <BentoCard gridCol="2 / 5" gridRow="1 / 2" title="Deployment Pipeline" icon={<Server size={12} />} wide>
            <DeploymentPipeline3D />
          </BentoCard>

          {/* EXPERIENCE – col 1-2, row 2 */}
          <BentoCard gridCol="1 / 3" gridRow="2 / 3" title="Experience" icon={<Briefcase size={12} />} wide>
            <div id="experience" className="flex flex-col gap-3 flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold leading-snug">Web Development Intern</h3>
                  <span className="text-blue-400 text-xs font-semibold">Herbs Magic</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 text-[10px] font-bold border border-blue-500/30 text-blue-400 rounded-full bg-blue-500/8">Internship</span>
                  <span className="text-[10px] text-gray-500 font-mono">Mar–Dec 2025</span>
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <ul className="space-y-1.5 sm:space-y-2 flex-1">
                {expBullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-[11px] sm:text-[12px] text-gray-400 leading-relaxed">
                    <span className="text-blue-500 shrink-0 mt-0.5 text-[10px]">▸</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </BentoCard>

          {/* TECH SUMMARY – col 3-5, row 2 */}
          <BentoCard gridCol="3 / 5" gridRow="2 / 3" title="Quick Stack" icon={<Cpu size={12} />} wide>
            <div className="grid grid-cols-3 gap-3 sm:gap-5 flex-1">
              {[
                { lbl: 'Cloud', color: '#3b82f6', items: ['AWS EC2 · S3 · RDS', 'Lambda · Amplify', 'Route53 · CloudFront'] },
                { lbl: 'DevOps', color: '#10b981', items: ['Docker · Kubernetes', 'CI/CD Pipelines', 'GitHub Actions'] },
                { lbl: 'Code', color: '#f97316', items: ['Python · JavaScript', 'Node.js · Next.js', 'React · SQL'] },
              ].map(({ lbl, color, items }) => (
                <div key={lbl}>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-2.5" style={{ color }}>{lbl}</div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {items.map(it => <div key={it} className="text-[10px] sm:text-[11px] text-gray-400 leading-snug">{it}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* ━━━━━━━━━━ ROW 3: Projects ━━━━━━━━━━ */}

          {/* PROJECT 1 – col 3, row 3 */}
          <BentoCard gridCol="3 / 4" gridRow="3 / 4">
            <ProjectCard {...projects[0]} />
          </BentoCard>

          {/* PROJECT 2 – col 4, row 3 */}
          <BentoCard gridCol="4 / 5" gridRow="3 / 4">
            <ProjectCard {...projects[1]} />
          </BentoCard>

          {/* ━━━━━━━━━━ ROW 4: About / Project3 / Education / Fun ━━━━━━━━━━ */}

          {/* ABOUT ME – col 1, row 4-5 */}
          <BentoCard gridCol="1 / 2" gridRow="4 / 6" title="About Me" icon={<Sparkles size={12} />}>
            <div id="about" className="flex flex-col gap-3 sm:gap-4 flex-1">
              <p className="text-[11px] sm:text-[12px] text-gray-400 leading-relaxed">
                Passionate software & DevOps engineer from Pune, India. I love building and scaling cloud-native
                applications on AWS and automating everything with CI/CD pipelines.
              </p>
              <div className="space-y-2 sm:space-y-2.5">
                {[['📍', 'Pune, India'], ['📞', '+91 7185 181 593'], ['✉️', 'harshbambatkar0502@gmail.com'], ['🔗', 'github.com/Harsh234']].map(([ico, val]) => (
                  <div key={val} className="flex items-center gap-2 sm:gap-2.5">
                    <span className="text-sm shrink-0 w-5 text-center">{ico}</span>
                    <span className="font-mono text-[10px] text-gray-400 break-all">{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative h-2 w-2 rounded-full bg-green-500 inline-flex" /></span>
                  <span className="text-[10px] sm:text-[11px] text-green-400 font-medium">Available for opportunities</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* PROJECT 3 – col 2, row 4 */}
          <BentoCard gridCol="2 / 3" gridRow="4 / 5" id="projects">
            <ProjectCard {...projects[2]} />
          </BentoCard>

          {/* EDUCATION – col 3, row 4 */}
          <BentoCard gridCol="3 / 4" gridRow="4 / 5" title="Education" icon={<GraduationCap size={12} />}>
            <div className="flex flex-col gap-3 sm:gap-4 flex-1">
              {education.map((edu, i) => (
                <div key={edu.degree} className={`flex flex-col gap-1 ${i > 0 ? 'pt-3 border-t border-white/5' : ''}`}>
                  <h4 className="text-xs sm:text-sm font-bold leading-snug">{edu.degree}</h4>
                  <span className="text-[10px] sm:text-[11px] text-gray-500">{edu.school}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-green-400 font-mono text-xs sm:text-sm font-bold">{edu.cgpa}</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-600 font-mono">{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* ── COFFEE BREAK (fun fact) ── */}
          <BentoCard gridCol="4 / 5" gridRow="4 / 5" className="bg-amber-900/10 border-amber-700/25 overflow-visible">
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-2 sm:gap-3 relative">
              {/* Animated SVG steam */}
              <svg
                width="60" height="40" viewBox="0 0 60 40"
                className="absolute -top-5 left-1/2 -translate-x-1/2"
                style={{ overflow: 'visible' }}
              >
                {[12, 30, 48].map((cx, i) => (
                  <path
                    key={i}
                    d={`M${cx} 38 Q${cx - 6} 28 ${cx} 18 Q${cx + 6} 8 ${cx} 0`}
                    fill="none"
                    stroke="rgba(251,191,36,0.35)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      animation: `steamRise 2.4s ease-in-out ${i * 0.6}s infinite`,
                    }}
                  />
                ))}
              </svg>

              {/* Cup */}
              <div className="text-amber-400 mt-4">
                <Coffee size={32} strokeWidth={1.5} />
              </div>

              {/* 404 */}
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 leading-none">404</div>
              <p className="text-[10px] sm:text-xs text-amber-200/50 font-mono">sleep not found</p>

              {/* Quote */}
              <div className="mt-1 px-2 py-1 rounded-lg bg-amber-500/8 border border-amber-500/15">
                <p className="text-[9px] sm:text-[10px] text-amber-300/60 font-mono leading-relaxed">
                  &ldquo;Fueled by caffeine,<br />deployed to prod.&rdquo;
                </p>
              </div>
            </div>
          </BentoCard>

          {/* ━━━━━━━━━━ ROW 5: Skills (wide) alongside About (tall) ━━━━━━━━━━ */}

          {/* SKILLS (floating) – col 2-5, row 5 */}
          <BentoCard gridCol="2 / 5" gridRow="5 / 6" title="Tech Stack" icon={<Cpu size={12} />} wide id="skills">
            <FloatingTechStack />
          </BentoCard>

          {/* ━━━━━━━━━━ ROW 6: Get In Touch (full width) ━━━━━━━━━━ */}

          {/* CONTACT – full width row */}
          <BentoCard gridCol="1 / -1" gridRow="auto" title="Get In Touch" icon={<Mail size={12} />}
            className="bg-gradient-to-br from-blue-500/5 via-transparent to-transparent border-blue-500/15"
            wide
          >
            <div id="contact" className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 flex-1">
              {/* Left: headline + email */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Let's Build Something.</h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto md:mx-0 mb-4">
                  I'm open to DevOps, SRE, or full-stack engineering roles. I respond fast!
                </p>
                <a
                  href="mailto:harshbambatkar0502@gmail.com"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
                >
                  <Mail size={14} />
                  <span className="break-all">harshbambatkar0502@gmail.com</span>
                </a>
              </div>

              {/* Center divider (desktop only) */}
              <div className="hidden md:block w-px h-24 bg-white/8" />

              {/* Right: social buttons + location + status */}
              <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                  {[
                    { icon: Github, href: 'https://github.com/Harsh234', label: 'GitHub' },
                    { icon: Linkedin, href: 'https://linkedin.com/in/harshbambatkar', label: 'LinkedIn' },
                    { icon: Mail, href: 'mailto:harshbambatkar0502@gmail.com', label: 'Email' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/40 text-xs text-gray-400 hover:text-white transition-all group min-h-[44px]"
                    >
                      <Icon size={13} className="group-hover:text-blue-400 transition-colors" />
                      {label}
                    </a>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5 text-[10px] sm:text-[11px] text-gray-500 items-center md:items-end">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative h-2 w-2 rounded-full bg-green-500 inline-flex" />
                    </span>
                    <span className="text-green-400">Available for new opportunities</span>
                  </div>
                  <span className="font-mono">📍 Pune, India · Remote OK</span>
                </div>
              </div>
            </div>
          </BentoCard>

        </main>
      </section>

      <footer className="text-center py-4 sm:py-6 text-gray-600 text-[10px] sm:text-[11px] border-t border-white/5 bg-black/60 backdrop-blur-md font-mono px-4">
        © 2026 Harsh Bambatkar · All systems nominal ✓
      </footer>
    </div>
  );
}

// ── Reusable Project Card inner layout ──────────────────────────────────
function ProjectCard({ title, status, statusColor, description, tags }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 flex-1">
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${statusColor}60, transparent)` }}
      />
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ color: statusColor, background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
          {status}
        </span>
      </div>
      <h3 className="text-xs sm:text-sm font-bold leading-snug text-white">{title}</h3>
      <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed flex-1">{description}</p>
      <div className="flex flex-wrap gap-1 pt-2 sm:pt-3 border-t border-white/5">
        {tags.map(t => (
          <span key={t} className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono rounded border border-white/8 text-gray-500">{t}</span>
        ))}
      </div>
    </div>
  );
}
