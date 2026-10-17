
import React from 'react';
import { Clock, BarChart, ArrowRight, BookOpen, PlayCircle } from 'lucide-react';
import { Course } from '../types';
import { motion as motionBase } from 'framer-motion';

const motion = motionBase as any;

interface CourseCardProps {
  course: Course;
  onStartSim?: (id: string) => void;
  onClick?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onStartSim, onClick }) => {
  const isTech = course.sector === 'Technology';
  const isFin = course.sector === 'Finance';
  const accentColor = isTech ? 'text-blue-400' : isFin ? 'text-emerald-400' : 'text-purple-400';
  const badgeBg = isTech ? 'bg-blue-500/20' : isFin ? 'bg-emerald-500/20' : 'bg-purple-500/20';

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onClick?.(course)}
      className="group relative bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-cyanGlow/30 transition-colors flex flex-col h-full cursor-pointer"
    >
      {/* Selection Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyanGlow to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border border-white/5 ${badgeBg} ${accentColor}`}>
            {course.sector}
          </span>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.2 }}
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <BookOpen className="text-slate-400 group-hover:text-cyanGlow" size={16} />
            </div>
          </motion.div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyanGlow transition-colors line-clamp-1">{course.title}</h3>
        <p className="text-slate-400 text-sm mb-5 line-clamp-2 leading-relaxed flex-grow">{course.short_description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {course.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full border border-white/5">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <div className="flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{course.duration}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {course.simulationId && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onStartSim?.(course.simulationId!);
                    }}
                    className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                    title="Launch Interactive Lab"
                >
                    <PlayCircle size={18} />
                </motion.button>
            )}
            <motion.div 
                whileHover={{ x: 5 }}
                className="text-cyanGlow p-2"
            >
                <ArrowRight size={18} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
    