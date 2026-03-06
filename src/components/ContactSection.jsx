import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
    { icon: Github, href: 'https://github.com/Harsh234', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/harshbambatkar', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:harshbambatkar0502@gmail.com', label: 'Email' },
];

const ContactSection = () => {
    return (
        <section id="contact" className="py-16 px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-400 mb-1">Get In Touch</p>
                <h2 className="text-2xl font-bold text-white">Let's Build Something</h2>
                <div className="mt-3 h-px max-w-xs bg-gradient-to-r from-blue-500/40 to-transparent" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-md p-8"
            >
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                    {/* Left: message */}
                    <div className="flex-1">
                        <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                            I'm currently open to DevOps, SRE, or full-stack engineering roles. Feel free to reach out — I respond fast!
                        </p>
                        <a
                            href="mailto:harshbambatkar0502@gmail.com"
                            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <Mail size={15} />
                            harshbambatkar0502@gmail.com
                        </a>
                    </div>

                    {/* Right: social links + status */}
                    <div className="flex flex-col gap-4 shrink-0">
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/40 text-sm text-gray-400 hover:text-white transition-all group"
                                >
                                    <Icon size={15} className="group-hover:text-blue-400 transition-colors" />
                                    <span className="text-xs font-medium">{label}</span>
                                </a>
                            ))}
                        </div>

                        {/* Availability */}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-green-400">Available for new opportunities</span>
                            <span className="text-gray-700">·</span>
                            <span>Pune, India · Remote OK</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ContactSection;
