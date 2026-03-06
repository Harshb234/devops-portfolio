import { motion } from 'framer-motion';

const projects = [
    {
        title: 'E-Commerce Web Application',
        status: 'Live',
        year: '2024',
        statusColor: '#3b82f6',
        description:
            'Deployed React frontend on AWS Amplify with CI/CD. Built serverless backend using AWS Lambda and API Gateway. Integrated DynamoDB for data consistency and resolved runtime issues.',
        tags: ['React', 'AWS Amplify', 'Lambda', 'DynamoDB', 'CI/CD'],
    },
    {
        title: 'AWS Hospital Management System',
        status: 'Prod',
        year: '2024',
        statusColor: '#10b981',
        description:
            'Implemented EC2-hosted backend, resolved application downtime issues. Configured IAM roles, debugged permission failures. Monitored RDS MySQL health, backups, and system availability.',
        tags: ['EC2', 'RDS MySQL', 'IAM', 'S3', 'CloudWatch'],
    },
    {
        title: 'Herbs Magic Platform',
        status: 'Active',
        year: '2025',
        statusColor: '#f97316',
        description:
            'Full-stack development of the company live web platform using Next.js. Integrated Python-based ML models for medicine recommendations. Analyzed and optimized APIs for reduced load times.',
        tags: ['Next.js', 'Python', 'ML', 'API Optimization', 'Git'],
    },
];

const ProjectsSection = () => {
    return (
        <section id="projects" className="py-16 px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-400 mb-1">Work</p>
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <div className="mt-3 h-px max-w-xs bg-gradient-to-r from-blue-500/40 to-transparent" />
            </motion.div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((p, i) => (
                    <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="relative flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 transition-all duration-300 overflow-hidden group"
                    >
                        {/* Top gradient line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px opacity-50"
                            style={{ background: `linear-gradient(90deg, transparent, ${p.statusColor}60, transparent)` }}
                        />

                        {/* Status + Year */}
                        <div className="flex items-center justify-between mb-4">
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                style={{
                                    color: p.statusColor,
                                    background: `${p.statusColor}15`,
                                    border: `1px solid ${p.statusColor}30`,
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.statusColor }} />
                                {p.status}
                            </span>
                            <span className="text-[11px] text-gray-600 font-mono">{p.year}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold leading-snug mb-3 text-white">{p.title}</h3>

                        {/* Description */}
                        <p className="text-[12px] text-gray-400 leading-relaxed flex-1">{p.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                            {p.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 text-[10px] font-mono rounded border border-white/8 text-gray-500"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection;
