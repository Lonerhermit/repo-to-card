import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  Github,
  Linkedin,
  Download,
  ArrowRight,
  Command,
  Share2,
  Twitter,
  Sun,
  Moon,
  Coffee,
  Layers,
  Instagram,
  X,
} from 'lucide-react';

const THEMES = {
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    bg: '#0a0a0b',
    card: 'rgba(20, 20, 22, 0.75)',
    text: '#fff',
    accent: '#6366f1',
    border: 'rgba(255, 255, 255, 0.15)',
  },
  snow: {
    id: 'snow',
    label: 'Snow',
    bg: '#f9fafb',
    card: 'rgba(255, 255, 255, 0.7)',
    text: '#000',
    accent: '#2563eb',
    border: 'rgba(0, 0, 0, 0.1)',
  },
  solar: {
    id: 'solar',
    label: 'Solar',
    bg: '#fdfaf3',
    card: 'rgba(255, 252, 245, 0.8)',
    text: '#433422',
    accent: '#d97706',
    border: 'rgba(217, 119, 6, 0.2)',
  },
};

const Modal = ({ isOpen, onClose, title, children, theme }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[32px] p-6 md:p-12 shadow-2xl border"
          style={{
            backgroundColor: theme.bg,
            color: theme.text,
            borderColor: theme.border,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 opacity-50 hover:opacity-100"
          >
            <X size={24} />
          </button>
          <h2
            className="text-2xl md:text-3xl font-black mb-6"
            style={{ color: theme.accent }}
          >
            {title}
          </h2>
          <div className="opacity-70 text-sm space-y-4">{children}</div>
          <button
            onClick={onClose}
            className="mt-8 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]"
            style={{ backgroundColor: theme.accent, color: '#fff' }}
          >
            Acknowledge
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [theme, setTheme] = useState(THEMES.midnight);
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const cardRef = useRef(null);

  const fetchRepo = async (e) => {
    e.preventDefault();
    try {
      const path = url
        .replace('https://github.com/', '')
        .split('/')
        .filter(Boolean);
      const res = await fetch(
        `https://api.github.com/repos/${path[0]}/${path[1]}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error();
      setData(json);
      setStep(1);
    } catch (err) {
      alert('Repository link unrecognized.');
    }
  };

  const handleDownload = async () => {
    setExporting(true);
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });
    const link = document.createElement('a');
    link.download = `${data.name}-artifact.png`;
    link.href = dataUrl;
    link.click();
    setExporting(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center transition-colors duration-500"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <nav className="w-full max-w-6xl py-6 md:py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setStep(0)}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
            style={{ backgroundColor: theme.accent, color: '#fff' }}
          >
            <Command size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight">GitSnap</span>
        </div>

        <div className="flex bg-gray-500/10 p-1 rounded-2xl backdrop-blur-md">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all ${
                theme.id === t.id
                  ? 'bg-white shadow-sm text-black'
                  : 'opacity-40 hover:opacity-100'
              }`}
            >
              {t.id === 'midnight' && <Moon size={14} />}
              {t.id === 'snow' && <Sun size={14} />}
              {t.id === 'solar' && <Coffee size={14} />}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-6xl flex flex-col justify-center px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="h"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto md:mx-0"
            >
              <div className="flex items-center gap-2 mb-6">
                <Layers size={16} style={{ color: theme.accent }} />
                <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-50">
                  Identity Studio v3.0
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                Your GitHub work is <br />
                <span style={{ color: theme.accent }}>worth seeing.</span>
              </h1>
              <p className="text-base md:text-lg opacity-60 mb-10 max-w-lg leading-relaxed">
                Transform your GitHub repositories into beautiful, professional
                artifacts for portfolios.
              </p>
              <form onSubmit={fetchRepo} className="flex flex-col gap-6">
                <input
                  className="bg-transparent border-b border-current opacity-80 py-4 text-xl md:text-3xl outline-none focus:opacity-100 transition-all placeholder:opacity-20 font-medium"
                  placeholder="github.com/user/repo"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  className="w-full md:w-fit flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  style={{ backgroundColor: theme.accent, color: '#fff' }}
                >
                  Generate Artifact <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="st"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              {/* MOBILE RESPONSIVE WRAPPER */}
              <div className="w-full flex justify-center items-start overflow-hidden pt-4 pb-12">
                <div className="scale-[0.32] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.85] origin-top">
                  <div
                    ref={cardRef}
                    className="w-[1000px] h-[600px] rounded-[60px] p-24 flex flex-col justify-between relative border glass-effect"
                    style={{
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor: theme.border,
                    }}
                  >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-8">
                        <img
                          src={data.owner.avatar_url}
                          className="w-24 h-24 rounded-3xl object-cover shadow-lg"
                        />
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-40 mb-1">
                            Developer
                          </p>
                          <h2
                            className="text-4xl font-extrabold tracking-tight underline decoration-2 underline-offset-8"
                            style={{ textDecorationColor: theme.accent }}
                          >
                            {data.owner.login}
                          </h2>
                        </div>
                      </div>
                      <Github size={48} className="opacity-10" />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-[80px] font-extrabold tracking-tight leading-none mb-6">
                        {data.name}
                      </h2>
                      <p className="text-3xl opacity-60 font-medium max-w-[700px] leading-relaxed">
                        {data.description ||
                          'Architecting digital solutions at scale.'}
                      </p>
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                      <div className="flex gap-16">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30">
                            Stars
                          </span>
                          <span className="text-5xl font-extrabold tabular-nums">
                            {data.stargazers_count.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30">
                            Forks
                          </span>
                          <span className="text-5xl font-extrabold tabular-nums opacity-60">
                            {data.forks_count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-6">
                        <div
                          className="px-10 py-4 rounded-full text-xl font-bold uppercase tracking-widest shadow-inner"
                          style={{
                            backgroundColor: theme.accent + '20',
                            color: theme.accent,
                          }}
                        >
                          {data.language || 'Software'}
                        </div>
                        <span className="text-xs font-bold opacity-20 uppercase tracking-[0.4em]">
                          Issued 2026 // GS_PRO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 bg-gray-500/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20">
                <button
                  onClick={() => setStep(0)}
                  className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
                >
                  New Synthesis
                </button>
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95"
                  style={{ backgroundColor: theme.accent, color: '#fff' }}
                >
                  {exporting ? (
                    'Rendering...'
                  ) : (
                    <>
                      <Download size={18} /> Export Image
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-6xl py-8 md:py-12 px-8 flex flex-col md:flex-row justify-between items-center border-t border-current gap-8">
        <div className="flex gap-10">
          <a
            href="https://github.com/Lonerhermit"
            target="_blank"
            className="hover:opacity-50 transition-opacity"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/arefin-al-mahi-4ba524307"
            target="_blank"
            className="hover:opacity-50 transition-opacity"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/lone_rhermit"
            target="_blank"
            className="hover:opacity-50 transition-opacity"
          >
            <Instagram size={20} />
          </a>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <button
            onClick={() => setActiveModal('tos')}
            className="hover:opacity-70"
          >
            Terms
          </button>
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:opacity-60"
          >
            Privacy
          </button>
          <span className="opacity-40">© 2026 GITSNAP STUDIO</span>
        </div>
      </footer>

      <Modal
        isOpen={activeModal === 'tos'}
        onClose={() => setActiveModal(null)}
        title="Terms of Service"
        theme={theme}
      >
        <p>
          1. Usage: Generate artifacts for public repos. 2. Ownership: Images
          are yours. 3. API: Powered by GitHub Public API.
        </p>
      </Modal>
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
        theme={theme}
      >
        <p>
          No data storage. No tracking cookies. Only public data accessed via
          client-side calls.
        </p>
      </Modal>
    </div>
  );
}
