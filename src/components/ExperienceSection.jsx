import { motion } from 'framer-motion';
import { Briefcase, CalendarDays } from 'lucide-react';

const experiences = [
    {
        role: 'Web Development Intern',
        company: 'Herbs Magic',
        period: 'Mar 2025 – Dec 2025',
        type: 'Internship',
        bullets: [
            'Maintained and scaled the company\'s live web platform using Next.js',
            'Integrated Python-based ML models for medicine recommendations',
            'Analyzed API workflows and improved system efficiency to reduce latency',
            'Documented processes and collaborated with teams using Git/GitHub workflows',
        ],
    },
];

const ExperienceSection = () => {
    return (
        <section id="experience" className="py-16 px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-400 mb-1">History</p>
                <h2 className="text-2xl font-bold text-white">Experience</h2>
                <div className="mt-3 h-px max-w-xs bg-gradient-to-r from-blue-500/40 to-transparent" />
            </motion.div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-3 bottom-0 w-px bg-white/8" />

                <div className="space-y-8">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={exp.role}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className="relative pl-12"
                        >
                            {/* Dot */}
                            <div className="absolute left-[13px] top-[18px] h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-blue-500/30" />

                            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 transition-colors">
                                {/* Top row */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-base font-bold leading-tight">{exp.role}</h3>
                                        <div className="flex items-center gap-1.5 mt-1 text-blue-400 text-sm font-medium">
                                            <Briefcase size={12} />
                                            {exp.company}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-blue-500/40 text-blue-400 bg-blue-500/8">
                                            {exp.type}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-500 text-[11px] font-mono">
                                            <CalendarDays size={10} />
                                            {exp.period}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/5 mb-4" />

                                {/* Bullets */}
                                <ul className="space-y-2">
                                    {exp.bullets.map((b) => (
                                        <li key={b} className="flex items-start gap-2.5 text-[13px] text-gray-400 leading-relaxed">
                                            <span className="text-blue-500 shrink-0 mt-0.5">▸</span>
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
