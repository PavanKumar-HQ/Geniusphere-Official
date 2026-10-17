
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Mail, Send, User, MessageSquare } from 'lucide-react';

const motion = motionBase as any;

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formState;
    
    const bodyContent = `Name: ${name}
Email: ${email}

Message:
${message}`;

    const mailtoLink = `mailto:geniusphereofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
    
    // Use anchor click method for robust mail client triggering
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 relative border-t border-white/5" id="contact">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h2>
           <p className="text-slate-400">Have questions? We'd love to hear from you.</p>
        </motion.div>
        
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit} 
          className="space-y-6 bg-slate-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                 <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-cyan-400 transition-colors">
                    <User size={18} className="text-slate-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name" 
                      className="bg-transparent w-full outline-none text-white placeholder-slate-600"
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                 <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-cyan-400 transition-colors">
                    <Mail size={18} className="text-slate-500" />
                    <input 
                      required
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-transparent w-full outline-none text-white placeholder-slate-600"
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                    />
                 </div>
              </div>
           </div>
           
           <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                 <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 focus-within:border-cyan-400 transition-colors">
                    <MessageSquare size={18} className="text-slate-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="What is this regarding?" 
                      className="bg-transparent w-full outline-none text-white placeholder-slate-600"
                      value={formState.subject}
                      onChange={e => setFormState({...formState, subject: e.target.value})}
                    />
                 </div>
           </div>

           <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                 <textarea 
                    required
                    rows={5}
                    placeholder="Type your message here..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 outline-none focus:border-cyan-400 transition-colors resize-none"
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                 />
           </div>

           <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
           >
              <Send size={18} /> Send Message
           </motion.button>
        </motion.form>
      </div>
    </section>
  );
};
