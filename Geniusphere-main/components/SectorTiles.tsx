import React, { useRef } from 'react';
import { Cpu, TrendingUp, Briefcase, ArrowRight } from 'lucide-react';
import { SECTORS } from '../constants';
import { motion as motionBase, useScroll, useTransform } from 'framer-motion';

const motion = motionBase as any;

const iconMap: Record<string, React.FC<any>> = {
  'Cpu': Cpu,
  'TrendingUp': TrendingUp,
  'Briefcase': Briefcase
};

interface SectorTilesProps {
  onExplore: (sectorName: string) => void;
}

export const SectorTiles: React.FC<SectorTilesProps> = ({ onExplore }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax Values
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const lightY = useTransform(scrollYProgress, [0, 1], [50, -100]);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Isometric Grid Background with Parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 iso-grid-bg opacity-60 pointer-events-none" 
      />
      
      {/* Floating Light Source with Parallax */}
      <motion.div 
        style={{ y: lightY }}
        className="absolute top-0 right-20 pointer-events-none" 
      >
        <motion.div
            animate={{ x: [0, 100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-[600px] h-[600px] bg-neonPurple/20 rounded-full blur-[150px] mix-blend-screen"
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="text-cyanGlow text-sm font-bold tracking-widest uppercase mb-2 block">Departments</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyanGlow text-glow">Sectors</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Isometric learning paths designed to give you a multi-dimensional perspective on the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 perspective-1000">
          {SECTORS.map((sector, index) => {
            const Icon = iconMap[sector.iconName];
            return (
              <motion.div 
                key={sector.id}
                onClick={() => onExplore(sector.name)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onExplore(sector.name)}
                role="button"
                tabIndex={0}
                aria-label={`Explore the ${sector.name} sector`}
                initial={{ opacity: 0, rotateX: 20, y: 50 }}
                whileInView={{ opacity: 1, rotateX: 10, y: 0 }} // Isometric resting state (tilted back)
                viewport={{ once: false, margin: "-50px" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 50, 
                  damping: 20, 
                  delay: index * 0.2 
                }}
                whileHover={{ 
                  rotateX: 0, // Straighten up on hover
                  y: -15,
                  scale: 1.05,
                  boxShadow: "0px 30px 60px -10px rgba(0,0,0,0.5)",
                  zIndex: 10
                }}
                className="group relative liquid-glass rounded-[2rem] p-8 h-96 flex flex-col justify-between cursor-pointer transform-gpu transition-all duration-500 overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Internal Glass Reflection (Glossy Sheen) */}
                <div className="absolute -inset-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                
                {/* Sector Color Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${sector.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10`} />

                {/* 3D Floating Icon Bubble */}
                <motion.div 
                  transformTemplate={({ rotateY }) => `translateZ(40px) rotateY(${rotateY})`}
                  className={`w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-xl shadow-black/20 mb-6 group-hover:bg-gradient-to-br ${sector.gradient}`}
                >
                  <Icon size={40} className="text-white drop-shadow-md" />
                </motion.div>

                <div className="transform translate-z-20 relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-cyanGlow transition-colors drop-shadow-sm">{sector.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors font-medium">
                    {sector.overview}
                  </p>
                </div>

                <motion.div 
                  className="flex items-center gap-3 text-white font-semibold mt-auto pt-6 border-t border-white/10 group-hover:border-white/30 transition-colors"
                >
                  <span className="text-sm uppercase tracking-wider">Enter Sector</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight size={18} className="text-cyanGlow" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};