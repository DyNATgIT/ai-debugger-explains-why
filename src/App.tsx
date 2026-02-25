import { useState, useEffect, useCallback, useRef } from "react";
import { scenarios, type Scenario, type TraceStep } from "./data/scenarios";

// ═══════════════════════════════════════════════════════════════════════════
// TECHNO ANIMATED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Animated Particles Background ───
function ParticlesBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Techno grid */}
      <div className="absolute inset-0 techno-grid opacity-60" />
      <div className="absolute inset-0 circuit-grid opacity-40" />

      {/* Gradient orbs - Techno colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl animate-float" />
      <div className="absolute top-[40%] right-[-15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/15 to-transparent blur-3xl animate-float delay-200" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-400/10 to-transparent blur-3xl animate-float delay-500" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[20%] left-[60%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl animate-float delay-300" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[60%] left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-teal-500/10 to-transparent blur-3xl animate-float delay-600" style={{ animationDuration: '11s' }} />

      {/* Hexagonal decorations */}
      <div className="hex-decoration top-20 right-20 opacity-30" />
      <div className="hex-decoration bottom-40 left-20 opacity-20" style={{ animationDirection: 'reverse', animationDuration: '40s' }} />
      <div className="hex-decoration top-1/2 right-1/3 opacity-10 w-[100px] h-[100px]" style={{ animationDuration: '25s' }} />

      {/* Data stream lines */}
      <div className="data-stream-line" style={{ left: '10%', animationDelay: '0s' }} />
      <div className="data-stream-line" style={{ left: '25%', animationDelay: '1s' }} />
      <div className="data-stream-line" style={{ left: '75%', animationDelay: '2s' }} />
      <div className="data-stream-line" style={{ left: '90%', animationDelay: '0.5s' }} />

      {/* Floating particles - Techno colors */}
      <div className="particle particle-1" style={{ top: '15%', left: '10%' }} />
      <div className="particle particle-2" style={{ top: '25%', left: '85%' }} />
      <div className="particle particle-3" style={{ top: '60%', left: '20%' }} />
      <div className="particle particle-4" style={{ top: '70%', left: '75%' }} />
      <div className="particle particle-1" style={{ top: '40%', left: '50%' }} />
      <div className="particle particle-2" style={{ top: '80%', left: '40%' }} />
      <div className="particle particle-3" style={{ top: '10%', left: '60%' }} />
      <div className="particle particle-4" style={{ top: '50%', left: '5%' }} />
      <div className="particle particle-1" style={{ top: '90%', left: '90%' }} />
      <div className="particle particle-2" style={{ top: '35%', left: '30%' }} />

      {/* Circuit lines */}
      <div className="circuit-line" style={{ top: '30%', left: '0', width: '100%' }} />
      <div className="circuit-line" style={{ top: '70%', left: '0', width: '100%', animationDelay: '1s' }} />
    </div>
  );
}

// ─── Animated typing text with cursor ───
function TypeWriter({ text, speed = 18, onDone, className = "" }: { text: string; speed?: number; onDone?: () => void; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-cursor text-cyan-400 font-bold">▌</span>
    </span>
  );
}

// ─── Animated Confidence bar with glow ───
function ConfidenceBar({ value, delay, color }: { value: number; delay: number; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const gradients: Record<string, string> = {
    amber: "linear-gradient(90deg, #ff8800, #ffcc00)",
    cyan: "linear-gradient(90deg, #00f0ff, #00d4ff)",
    green: "linear-gradient(90deg, #00ff88, #00e676)",
    blue: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    teal: "linear-gradient(90deg, #14b8a6, #2dd4bf)",
  };

  const glows: Record<string, string> = {
    amber: "0 0 20px rgba(255, 136, 0, 0.6)",
    cyan: "0 0 20px rgba(0, 240, 255, 0.6)",
    green: "0 0 20px rgba(0, 255, 136, 0.6)",
    blue: "0 0 20px rgba(59, 130, 246, 0.6)",
    teal: "0 0 20px rgba(20, 184, 166, 0.6)",
  };

  return (
    <div className="h-3 w-full rounded-full bg-slate-900/80 overflow-hidden backdrop-blur-sm border border-cyan-500/10">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${width}%`,
          background: gradients[color] || gradients.cyan,
          boxShadow: glows[color] || glows.cyan,
        }}
      />
    </div>
  );
}

// ─── Premium Code viewer with enhanced highlighting ───
function CodeViewer({
  code,
  highlightLines,
  errorLine,
  activeTraceLine,
}: {
  code: string;
  highlightLines: number[];
  errorLine: number;
  activeTraceLine: number | null;
}) {
  const lines = code.split("\n");

  return (
    <div className="font-mono text-sm leading-7 overflow-x-auto relative">
      {lines.map((line, i) => {
        const lineNum = i + 1;
        const isError = lineNum === errorLine;
        const isHighlight = highlightLines.includes(lineNum);
        const isActive = lineNum === activeTraceLine;

        return (
          <div
            key={i}
            className={`flex transition-all duration-300 relative ${isActive
                ? "code-line-active"
                : isError
                  ? "code-line-error"
                  : isHighlight
                    ? "code-line-highlight"
                    : "border-l-2 border-transparent"
              }`}
          >
            <span className="w-12 shrink-0 text-right pr-4 select-none text-slate-600 text-xs leading-7 font-medium font-mono">
              {lineNum}
            </span>
            <pre className="flex-1 pr-6">
              <code className={`${isActive ? "text-emerald-300" : isError ? "text-amber-300" : isHighlight ? "text-cyan-200" : "text-slate-300"
                }`}>
                {line || " "}
              </code>
            </pre>
            {isActive && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-400 text-xs font-semibold font-ui uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
                <span className="hidden sm:inline">TRACING</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Phase indicator dots ───
type Phase = "idle" | "tracing" | "matching" | "explaining" | "done";

const phaseConfig: Record<Phase, { label: string; color: string; icon: string }> = {
  idle: { label: "STANDBY", color: "text-slate-400", icon: "○" },
  tracing: { label: "TRACING", color: "text-emerald-400", icon: "◉" },
  matching: { label: "MATCHING", color: "text-cyan-400", icon: "◉" },
  explaining: { label: "ANALYZING", color: "text-amber-400", icon: "◉" },
  done: { label: "COMPLETE", color: "text-teal-400", icon: "✓" },
};

function PhaseIndicator({ phase }: { phase: Phase }) {
  const phases: Phase[] = ["tracing", "matching", "explaining", "done"];
  const currentIndex = phases.indexOf(phase);

  return (
    <div className="flex items-center gap-2">
      {phases.map((p, i) => {
        const isActive = p === phase;
        const isComplete = currentIndex > i;
        const config = phaseConfig[p];

        return (
          <div key={p} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`w-8 h-0.5 rounded transition-all duration-500 ${isComplete ? "bg-gradient-to-r from-emerald-500 to-cyan-400" : "bg-slate-800"
                }`} />
            )}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 font-ui ${isActive
                ? "glass border-cyan-500/30"
                : isComplete
                  ? "bg-emerald-500/10"
                  : "bg-transparent"
              }`}>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isComplete
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                  : isActive
                    ? `bg-current ${config.color} animate-pulse shadow-[0_0_10px_currentColor]`
                    : "bg-slate-700"
                }`} />
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isComplete ? "text-emerald-400" : isActive ? config.color : "text-slate-600"
                }`}>
                {config.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Trace step row with animations ───
function TraceStepRow({ step, index }: { step: TraceStep; index: number }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-mono transition-all duration-300 animate-fade-in-left ${step.isError
          ? "bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/20"
          : "glass-subtle hover:bg-slate-800/60"
        }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 ${step.isError
          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          : "bg-slate-900/80 text-cyan-400 border border-cyan-500/20"
        }`}>
        L{step.line}
      </span>
      <div className="flex-1 min-w-0 pt-1">
        {step.variable && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold ${step.isError ? "text-amber-300" : "text-cyan-300"}`}>
              {step.variable}
            </span>
            {step.value && (
              <>
                <span className="text-slate-600">=</span>
                <span className={`px-2 py-0.5 rounded-md text-xs ${step.isError
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                  }`}>
                  {step.value}
                </span>
              </>
            )}
          </div>
        )}
        {step.note && (
          <div className={`mt-1.5 text-xs leading-relaxed font-ui ${step.isError ? "text-amber-400/80" : "text-slate-400"
            }`}>
            {step.note}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleTraceSteps, setVisibleTraceSteps] = useState<number>(0);
  const [activeTraceLine, setActiveTraceLine] = useState<number | null>(null);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const traceRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const scenario = selectedId ? scenarios.find((s) => s.id === selectedId) ?? null : null;

  const reset = useCallback(() => {
    setPhase("idle");
    setVisibleTraceSteps(0);
    setActiveTraceLine(null);
    setShowPatterns(false);
    setShowTests(false);
    setShowExplanation(false);
    setShowFix(false);
  }, []);

  const runDebugger = useCallback(
    (sc: Scenario) => {
      reset();
      setPhase("tracing");

      let step = 0;
      const traceInterval = setInterval(() => {
        step++;
        setVisibleTraceSteps(step);
        if (sc.trace[step - 1]) {
          setActiveTraceLine(sc.trace[step - 1].line);
        }
        if (traceRef.current) {
          traceRef.current.scrollTop = traceRef.current.scrollHeight;
        }
        if (step >= sc.trace.length) {
          clearInterval(traceInterval);
          setTimeout(() => {
            setPhase("matching");
            setShowPatterns(true);
            setShowTests(true);
            setActiveTraceLine(null);
            setTimeout(() => {
              setPhase("explaining");
              setShowExplanation(true);
              setTimeout(() => {
                setPhase("done");
                if (explanationRef.current) {
                  explanationRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }, 2500);
            }, 1800);
          }, 1000);
        }
      }, 400);

      return () => clearInterval(traceInterval);
    },
    [reset]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    reset();
  };

  return (
    <div className="min-h-screen text-white relative mesh-gradient noise-overlay">
      <ParticlesBackground />

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 glass-strong border-b border-cyan-500/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg animate-pulse-glow corner-brackets">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider font-display">
                <span className="text-gradient">DEBUGGER</span>
              </h1>
              <p className="text-[10px] text-cyan-400/60 font-ui uppercase tracking-[0.2em] hidden sm:block">Core Debug Engine v2.0</p>
            </div>
          </div>

          {/* Phase indicator */}
          {scenario && phase !== "idle" && (
            <div className="hidden lg:block">
              <PhaseIndicator phase={phase} />
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg glass text-xs font-ui uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
              <span className="text-emerald-400 font-semibold">System Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto relative z-10">
        {/* ─── Sidebar: Scenario Picker ─── */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-cyan-500/10 bg-slate-950/30 backdrop-blur-xl">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center border border-cyan-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-white tracking-widest font-display uppercase">Bug Scenarios</h2>
            </div>

            <div className="space-y-2">
              {scenarios.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => handleSelect(sc.id)}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden cursor-pointer ${selectedId === sc.id
                      ? "glass techno-border shadow-lg glow-cyan"
                      : "hover:bg-slate-800/40 border border-transparent hover:border-cyan-500/20"
                    }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {selectedId === sc.id && (
                    <div className="absolute inset-0 circuit-effect opacity-50" />
                  )}
                  <div className="relative flex items-center gap-3">
                    <span className={`text-2xl transition-transform duration-300 ${selectedId === sc.id ? "scale-110" : "group-hover:scale-110"
                      }`}>
                      {sc.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-bold truncate transition-colors font-ui tracking-wide ${selectedId === sc.id ? "text-gradient" : "text-slate-200 group-hover:text-white"
                        }`}>
                        {sc.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${selectedId === sc.id
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-slate-900/80 text-slate-400"
                          }`}>
                          {sc.category}
                        </span>
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-all duration-300 ${selectedId === sc.id
                          ? "text-cyan-400 opacity-100"
                          : "text-slate-600 opacity-0 group-hover:opacity-100"
                        }`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="flex-1 overflow-y-auto min-h-screen">
          {!scenario ? (
            <LandingView onSelect={handleSelect} />
          ) : (
            <div className="p-5 sm:p-8 space-y-8">
              {/* Title & Run button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{scenario.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white font-display tracking-wide">{scenario.title}</h2>
                      <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] px-3 py-1 rounded-md glass text-cyan-300 font-ui font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {scenario.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => runDebugger(scenario)}
                  disabled={phase !== "idle" && phase !== "done"}
                  className={`group px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-3 font-ui uppercase tracking-widest ${phase === "idle" || phase === "done"
                      ? "btn-primary text-slate-900 cursor-pointer"
                      : "bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50"
                    }`}
                >
                  {phase === "idle" ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                      Initialize Debug
                    </>
                  ) : phase === "done" ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-[-360deg] transition-transform duration-500">
                        <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                      Reinitialize
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-cyan-400 rounded-full animate-spin" />
                      Processing...
                    </>
                  )}
                </button>
              </div>

              {/* Two column: Code + Trace */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Code panel */}
                <div className="rounded-2xl code-block overflow-hidden animate-fade-in-up delay-100 card-hover relative">
                  {/* Scan line effect */}
                  {phase === "tracing" && <div className="scan-line" />}

                  <div className="px-5 py-4 border-b border-cyan-500/10 flex items-center justify-between bg-gradient-to-r from-slate-900/80 to-slate-800/40">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(255,136,0,0.6)]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(0,255,136,0.6)]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.6)]" />
                      </div>
                      <span className="text-xs text-cyan-400/60 font-mono">source.js</span>
                    </div>
                    <span className="text-[10px] text-cyan-400/40 uppercase tracking-[0.2em] font-display font-bold">Source Code</span>
                  </div>
                  <div className="p-4 max-h-[480px] overflow-y-auto relative">
                    <CodeViewer
                      code={scenario.code}
                      highlightLines={scenario.highlightLines}
                      errorLine={scenario.errorLine}
                      activeTraceLine={activeTraceLine}
                    />
                  </div>
                </div>

                {/* Trace panel */}
                <div className="rounded-2xl glass overflow-hidden flex flex-col animate-fade-in-up delay-200 border border-cyan-500/10">
                  <div className="px-5 py-4 border-b border-cyan-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${phase === "tracing"
                          ? "bg-emerald-500/20 border border-emerald-500/30"
                          : visibleTraceSteps > 0
                            ? "bg-cyan-500/20 border border-cyan-500/30"
                            : "bg-slate-900/60 border border-slate-700/50"
                        }`}>
                        <div className={`w-3 h-3 rounded-full ${phase === "tracing"
                            ? "bg-emerald-400 animate-pulse shadow-[0_0_15px_rgba(0,255,136,0.8)]"
                            : visibleTraceSteps > 0
                              ? "bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                              : "bg-slate-600"
                          }`} />
                      </div>
                      <div>
                        <span className="text-sm text-white font-bold font-display tracking-wide">DYNAMIC TRACE</span>
                        <div className="text-[10px] text-cyan-400/60 font-ui font-semibold uppercase tracking-wider mt-0.5">
                          {visibleTraceSteps}/{scenario.trace.length} steps captured
                        </div>
                      </div>
                    </div>
                  </div>
                  <div ref={traceRef} className="p-4 flex-1 max-h-[420px] overflow-y-auto space-y-2">
                    {visibleTraceSteps === 0 && phase === "idle" && (
                      <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-3">
                        <div className="w-16 h-16 rounded-xl glass flex items-center justify-center border border-cyan-500/20">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-500/50">
                            <polygon points="5 3 19 12 5 21" />
                          </svg>
                        </div>
                        <span className="text-sm font-ui font-semibold uppercase tracking-widest">Awaiting Input</span>
                      </div>
                    )}
                    {scenario.trace.slice(0, visibleTraceSteps).map((step, i) => (
                      <TraceStepRow key={i} step={step} index={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Pattern matches + Tests */}
              {showPatterns && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in-up">
                  {/* Patterns */}
                  <div className="rounded-2xl glass overflow-hidden border border-cyan-500/10">
                    <div className="px-5 py-4 border-b border-cyan-500/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm text-white font-bold font-display tracking-wide">PATTERN MATCH</span>
                        <div className="text-[10px] text-blue-400/60 font-ui font-semibold uppercase tracking-wider mt-0.5">
                          {scenario.patterns.length} patterns identified
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-5">
                      {scenario.patterns.map((p, i) => (
                        <div key={i} className="space-y-3 animate-scale-in" style={{ animationDelay: `${i * 150}ms` }}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white font-ui tracking-wide">{p.name}</span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-md font-display ${p.confidence > 95
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : p.confidence > 90
                                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                  : "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                              }`}>
                              {p.confidence}%
                            </span>
                          </div>
                          <ConfidenceBar
                            value={p.confidence}
                            delay={i * 200 + 300}
                            color={p.confidence > 95 ? "amber" : p.confidence > 90 ? "cyan" : "teal"}
                          />
                          <p className="text-xs text-slate-400 leading-relaxed font-ui">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tests */}
                  <div className="rounded-2xl glass overflow-hidden border border-teal-500/10">
                    <div className="px-5 py-4 border-b border-teal-500/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center border border-teal-500/20">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
                          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm text-white font-bold font-display tracking-wide">INTENT TESTS</span>
                        <div className="text-[10px] text-teal-400/60 font-ui font-semibold uppercase tracking-wider mt-0.5">
                          Expected vs. actual behavior
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {showTests && scenario.tests.map((t, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl text-sm transition-all duration-300 animate-slide-in-right ${t.passed
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-amber-500/10 border border-amber-500/20"
                            }`}
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-bold flex items-center gap-2 font-ui tracking-wide ${t.passed ? "text-emerald-300" : "text-amber-300"}`}>
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-display ${t.passed ? "bg-emerald-500/20" : "bg-amber-500/20"
                                }`}>
                                {t.passed ? "✓" : "✗"}
                              </span>
                              {t.name}
                            </span>
                            <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest font-display ${t.passed
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}>
                              {t.passed ? "Pass" : "Fail"}
                            </span>
                          </div>
                          <div className="flex gap-6 text-xs mt-3 pl-8 font-mono">
                            <div className="space-y-1">
                              <span className="text-slate-500 font-ui font-semibold uppercase tracking-wider text-[10px]">Expected</span>
                              <code className="block text-emerald-300/80 bg-slate-900/50 px-2 py-1 rounded">{t.expected}</code>
                            </div>
                            <div className="space-y-1">
                              <span className="text-slate-500 font-ui font-semibold uppercase tracking-wider text-[10px]">Actual</span>
                              <code className={`block px-2 py-1 rounded ${t.passed ? "text-emerald-300/80 bg-slate-900/50" : "text-amber-400 bg-amber-500/10"
                                }`}>{t.actual}</code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Root Cause Explanation */}
              {showExplanation && (
                <div ref={explanationRef} className="animate-scale-in">
                  <div className="rounded-2xl overflow-hidden relative">
                    {/* Animated gradient border - Techno colors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-400 animate-gradient rounded-2xl" />
                    <div className="absolute inset-[2px] bg-slate-950 rounded-[14px]" />

                    <div className="relative">
                      <div className="px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-emerald-500/5 to-transparent flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-amber-400 flex items-center justify-center shadow-lg animate-pulse-glow">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gradient font-display tracking-wide">ROOT CAUSE ANALYSIS</h3>
                          <p className="text-[10px] text-cyan-400/60 font-ui font-bold uppercase tracking-widest">Deep Analysis Result</p>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* False assumption callout */}
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-2 font-display">False Assumption Detected</div>
                            <p className="text-amber-200 text-base font-semibold italic leading-relaxed font-ui">
                              "{scenario.assumption}"
                            </p>
                          </div>
                        </div>

                        {/* Full explanation */}
                        <div className="text-slate-300 text-base leading-relaxed pl-2 font-ui">
                          <TypeWriter text={scenario.rootCause} speed={12} onDone={() => setShowFix(true)} />
                        </div>

                        {/* Fix */}
                        {showFix && (
                          <div className="space-y-4 animate-fade-in-up pt-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-base font-bold text-emerald-400 font-display tracking-wide">SUGGESTED FIX</span>
                                <p className="text-[10px] text-emerald-500/60 font-ui font-bold uppercase tracking-widest">Corrected implementation</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 pl-[52px] leading-relaxed font-ui">{scenario.fix}</p>
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden ml-[52px]">
                              <div className="px-4 py-2.5 border-b border-emerald-500/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
                                <span className="text-[10px] text-emerald-400/80 uppercase tracking-[0.2em] font-display font-bold">Fixed Code</span>
                              </div>
                              <pre className="p-4 text-sm text-emerald-200/90 overflow-x-auto font-mono leading-relaxed">
                                <code>{scenario.fixCode}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LANDING VIEW — TECHNO
// ═══════════════════════════════════════════════════════════════════════════

function LandingView({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex items-center justify-center min-h-[90vh] p-6 sm:p-10">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg glass border-cyan-500/20 text-cyan-300 text-sm font-ui font-bold uppercase tracking-widest">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
            </span>
            Advanced Debug Engine
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none font-display">
            <span className="text-gradient animate-techno-flicker">DEBUG THE WHY</span>
            <br />
            <span className="text-white">NOT JUST THE WHAT</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-ui">
            Combines <span className="text-emerald-400 font-bold">lightweight dynamic tracing</span> with
            <span className="text-cyan-400 font-bold"> program-intent inference</span> to generate
            plain-English explanations of root causes.
          </p>
        </div>

        {/* Feature cards - Techno colors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: "🔍",
              title: "Dynamic Tracing",
              desc: "Step-by-step execution trace revealing exact variable states at each point in time",
              borderColor: "border-emerald-500/20",
              iconBg: "bg-emerald-500/20",
              glowColor: "hover:shadow-[0_0_40px_rgba(0,255,136,0.15)]",
            },
            {
              icon: "🧩",
              title: "Pattern Matching",
              desc: "Identifies known bug patterns like off-by-one errors, stale closures, and type coercion issues",
              borderColor: "border-cyan-500/20",
              iconBg: "bg-cyan-500/20",
              glowColor: "hover:shadow-[0_0_40px_rgba(0,240,255,0.15)]",
            },
            {
              icon: "💡",
              title: "Root Cause Analysis",
              desc: '"This failed because your assumption about X is false" — explained in plain English',
              borderColor: "border-amber-500/20",
              iconBg: "bg-amber-500/20",
              glowColor: "hover:shadow-[0_0_40px_rgba(255,136,0,0.15)]",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`group p-6 rounded-2xl glass border ${f.borderColor} ${f.glowColor} hover:border-opacity-50 transition-all duration-500 card-hover animate-fade-in-up`}
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${f.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{f.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display tracking-wide">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-ui">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick start */}
        <div className="space-y-5 text-center animate-fade-in-up delay-500">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-display font-bold">Select a bug scenario to analyze</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {scenarios.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => onSelect(sc.id)}
                className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass hover:bg-slate-800/60 border border-white/5 hover:border-cyan-500/30 text-sm text-slate-300 hover:text-white transition-all duration-300 cursor-pointer font-ui font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]"
                style={{ animationDelay: `${600 + i * 50}ms` }}
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-300">{sc.icon}</span>
                <span>{sc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-3 text-[10px] text-slate-600 font-display uppercase tracking-[0.2em]">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <span className="font-bold">Advanced Analysis Engine</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
