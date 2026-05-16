import { useResearchStore } from '../store/researchStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Search, Edit3, CheckCircle2 } from 'lucide-react';

export const ProgressIndicator = () => {
  const { status, progressUpdates } = useResearchStore();

  if (status === 'idle') return null;

  const getAgentIcon = (agentName?: string) => {
    switch (agentName?.toLowerCase()) {
      case 'planner': return <BrainCircuit className="w-5 h-5 text-primary-400" />;
      case 'searcher': return <Search className="w-5 h-5 text-accent-400" />;
      case 'synthesizer': return <Edit3 className="w-5 h-5 text-emerald-400" />;
      default: return <div className="w-2 h-2 rounded-full bg-slate-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 glass-panel rounded-2xl p-6 relative z-10 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
          initial={{ width: "0%" }}
          animate={{ width: status === 'completed' ? "100%" : "60%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display font-bold text-xl text-slate-100 flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-primary-500" />
          Neural Execution Graph
        </h3>
        {status === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm font-medium border border-emerald-400/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Synthesis Complete
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {progressUpdates.map((update, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex items-start gap-4"
            >
              <div className="relative mt-1">
                <div className="w-10 h-10 rounded-full glass-panel-light flex items-center justify-center z-10 relative border border-white/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                  {getAgentIcon(update.agent)}
                </div>
                {idx !== progressUpdates.length - 1 && (
                  <div className="absolute top-10 left-1/2 w-[2px] h-full bg-gradient-to-b from-white/20 to-transparent -translate-x-1/2 z-0" />
                )}
              </div>
              <div className="pt-2 flex-grow">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-slate-200 tracking-wide text-sm uppercase">
                    {update.agent || 'System'}
                  </p>
                  <span className="text-xs text-slate-500 font-mono">
                    [{new Date().toLocaleTimeString()}]
                  </span>
                </div>
                <p className="text-slate-400 mt-1">{update.message || update.event}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {status === 'processing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4"
          >
             <div className="relative mt-1">
                <div className="w-10 h-10 rounded-full glass-panel-light flex items-center justify-center border border-white/10">
                  <div className="w-4 h-4 border-2 border-primary-500/50 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </div>
              <div className="pt-3">
                <p className="text-slate-500 text-sm italic animate-pulse">Computing...</p>
              </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
