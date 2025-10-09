"use client";

import { motion, type Variants } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  LineChart,
  type LucideIcon,
  Presentation,
  Settings2,
  ShieldCheck,
} from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  BrainCircuit,
  Bot,
  Settings2,
  Presentation,
  ShieldCheck,
  LineChart,
};

interface ServiceCardProps {
  service: {
    iconName: string;
    title: string;
    description: string;
    details: string[];
  };
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName] || Settings2;

  return (
    <motion.div
      key={index}
      className="group bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-cyber-border flex flex-col transition-all duration-200 ease-out hover:shadow-xl dark:hover:shadow-neon-blue/30 hover:scale-[1.03] hover:border-neon-blue/50"
      initial="hidden"
      whileInView="visible"
      variants={cardVariants}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="flex items-start mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center mr-4 transition-transform duration-200 ease-out group-hover:scale-110 flex-shrink-0 shadow-lg shadow-neon-blue/30">
          <IconComponent className="w-6 h-6 text-white transition-transform duration-200 ease-out group-hover:rotate-[-3deg]" />
        </div>
        <h2 className="text-2xl font-black text-neon-blue">{service.title}</h2>
      </div>
      <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
        {service.description}
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {service.details.map((detail) => (
          <li
            key={detail}
            className="flex items-start transition-colors duration-150 ease-out hover:text-neon-blue"
          >
            <span className="text-neon-blue mr-2 group-hover:text-neon-cyan transition-colors duration-150 ease-out">
              &#10003;
            </span>
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
