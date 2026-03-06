import { motion } from 'framer-motion';

const skills = [
    {
        category: 'Cloud',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.08)',
        border: 'rgba(59,130,246,0.2)',
        items: ['AWS EC2', 'AWS S3', 'AWS RDS', 'AWS Lambda', 'API Gateway', 'CloudFront', 'Route53', 'Amplify'],
    },
    {
        category: 'DevOps',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.2)',
        items: ['Docker', 'Kubernetes', 'CI/CD', 'AWS CodePipeline', 'GitHub Actions', 'Jenkins'],
    },
    {
        category: 'Backend',
        color: '#f97316',
        bg: 'rgba(249,115,22,0.08)',
        border: 'rgba(249,115,22,0.2)',
        items: ['Node.js', 'Python', 'Express', 'FastAPI', 'REST APIs', 'MySQL', 'PostgreSQL', 'DynamoDB'],
    },
    {
        category: 'Frontend',
        color: '#a78bfa',
        bg: 'rgba(167,139,250,0.08)',
        border: 'rgba(167,139,250,0.2)',
        items: ['React', 'Next.js', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
    },
    {
        category: 'Tools',
        color: '#94a3b8',
        bg: 'rgba(148,163,184,0.06)',
        border: 'rgba(148,163,184,0.15)',
        items: ['Git', 'GitHub', 'Linux', 'Bash', 'VS Code', 'Postman'],
    },
];

const SkillsSection = () => {
    return (
        <section id="skills" className="py-16 px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-400 mb-1">Core Competencies</p>
                <h2 className="text-2xl font-bold text-white">Tech Stack</h2>
                <div className="mt-3 h-px max-w-xs bg-gradient-to-r from-blue-500/40 to-transparent" />
            </motion.div>

            {/* Skills grid */}
            <div className="space-y-6">
                {skills.map((group, gi) => (
                    <motion.div
                        key={group.category}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: gi * 0.07 }}
                        className="flex items-start gap-4"
                    >
                        {/* Category label */}
                        <div
                            className="text-[10px] font-bold uppercase tracking-widest pt-1 w-20 shrink-0"
                            style={{ color: group.color }}
                        >
                            {group.category}
                        </div>
                        {/* Badge row */}
                        <div className="flex flex-wrap gap-2">
                            {group.items.map((skill) => (
                                <motion.span
                                    key={skill}
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    className="px-3 py-1 rounded-full text-xs font-medium cursor-default transition-all duration-150"
                                    style={{
                                        color: group.color,
                                        background: group.bg,
                                        border: `1px solid ${group.border}`,
                                    }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
