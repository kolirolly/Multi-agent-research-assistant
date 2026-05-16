import { ResearchForm } from './components/ResearchForm';
import { ProgressIndicator } from './components/ProgressIndicator';
import { ReportDisplay } from './components/ReportDisplay';
import { ParticleBackground } from './components/ParticleBackground';
import { useResearchStore } from './store/researchStore';
import { useWebSocket } from './hooks/useWebSocket';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { Toaster } from 'sonner';

function App() {
  const { jobId, setJobId, status } = useResearchStore();
  
  // Initialize websocket hook
  useWebSocket(jobId);

  const handleStart = (id: string) => {
    setJobId(id);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      <Toaster theme="dark" position="top-right" richColors />
      <ParticleBackground />

      {/* Decorative gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-600/20 blur-[120px] pointer-events-none mix-blend-screen" />

      <main className="relative z-10 container mx-auto px-4 py-16 sm:py-24 max-w-4xl min-h-screen flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center w-full mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
              <Network className="w-8 h-8 text-primary-400" />
            </div>
            <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                System Online
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tighter text-white mb-6">
            Multi-Agent <br className="hidden sm:block" />
            <span className="text-gradient">Intelligence</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Harness the power of coordinated neural networks. Let specialized AI agents plan, search, and synthesize comprehensive intelligence reports in real-time.
          </p>
        </motion.div>

        {/* Input Form */}
        <div className="w-full max-w-3xl mx-auto">
          {status === 'idle' || status === 'completed' || status === 'failed' ? (
             <ResearchForm onStart={handleStart} />
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-16 h-16 border-4 border-white/10 border-t-primary-400 rounded-full animate-spin relative z-10" />
                <Network className="w-6 h-6 text-primary-400 absolute z-20 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-100">Synthesizing Intelligence</h3>
                <p className="text-slate-400 mt-2">Agents are cross-referencing global data streams...</p>
              </div>
              
              {/* Skeleton loading bars */}
              <div className="w-full max-w-md space-y-3 mt-4 opacity-50">
                <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-primary-500/50 to-transparent w-[50%] animate-[shimmer_1.5s_infinite]"></div>
                </div>
                <div className="h-2 w-3/4 bg-slate-700/50 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-primary-500/50 to-transparent w-[50%] animate-[shimmer_1.5s_infinite_0.3s]"></div>
                </div>
              </div>
            </motion.div>
          )}

          <ProgressIndicator />
        </div>
        
        {/* Render below everything to allow natural scrolling */}
        <div className="w-full max-w-4xl mx-auto">
          <ReportDisplay />
        </div>

      </main>
    </div>
  );
}

export default App;
