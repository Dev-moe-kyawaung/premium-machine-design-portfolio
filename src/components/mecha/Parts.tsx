import type { ReactNode } from "react";

/* ============================================================
   MECHA UI PRIMITIVES — schematic panels, gears, gauges, dims
   ============================================================ */

export function Rivet({ className = "" }: { className?: string }) {
  return <span className={`rivet absolute ${className}`} aria-hidden="true" />;
}

export function CornerRivets() {
  return (
    <>
      <Rivet className="left-2.5 top-2.5" />
      <Rivet className="right-2.5 top-2.5" />
      <Rivet className="left-2.5 bottom-2.5" />
      <Rivet className="right-2.5 bottom-2.5" />
    </>
  );
}

/* ---------- SCHEMATIC PANEL ---------- */
export function Panel({
  label,
  code,
  children,
  className = "",
  tone = "steel",
  dense = false,
}: {
  label: string;
  code?: string;
  children: ReactNode;
  className?: string;
  tone?: "steel" | "dark";
  dense?: boolean;
}) {
  return (
    <section
      className={`relative brackets rounded-lg border border-[var(--mk-edge)] ${
        tone === "dark" ? "metal-dark" : "metal"
      } shadow-[0_18px_50px_rgba(0,0,0,0.55)] ${className}`}
    >
      <CornerRivets />
      <header className="flex items-center justify-between gap-3 border-b border-[var(--mk-edge)] px-5 py-2.5">
        <h3 className="tick-label text-[10px] text-sky-300/90">{label}</h3>
        {code && (
          <span className="tick-label rounded border border-[var(--mk-edge)] bg-black/40 px-2 py-0.5 text-[9px] text-slate-400">
            {code}
          </span>
        )}
      </header>
      <div className={dense ? "p-4" : "p-5 sm:p-6"}>{children}</div>
    </section>
  );
}

/* ---------- DIMENSION LINE ---------- */
export function DimLine({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-2.5 w-px bg-sky-400/70" />
      <span className="flex-1 border-t border-dashed border-sky-400/35" />
      <span className="tick-label text-[9px] text-sky-300/75">{label}</span>
      <span className="flex-1 border-t border-dashed border-sky-400/35" />
      <span className="h-2.5 w-px bg-sky-400/70" />
    </div>
  );
}

/* ---------- READOUT ROW ---------- */
export function Readout({ k, v, hot = false }: { k: string; v: string; hot?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <span className="tick-label shrink-0 text-[9px] text-slate-500">{k}</span>
      <span className="min-w-0 flex-1 border-b border-dotted border-slate-700/80" />
      <span className={`shrink-0 font-mono text-[11px] ${hot ? "text-amber-400" : "text-slate-200"}`}>{v}</span>
    </div>
  );
}

/* ---------- LED ---------- */
export function Led({ color = "emerald", label }: { color?: "emerald" | "amber" | "sky" | "red"; label: string }) {
  const map = {
    emerald: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
    amber: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
    sky: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
    red: "bg-red-500 shadow-[0_0_8px_#ef4444]",
  } as const;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`led h-1.5 w-1.5 rounded-full ${map[color]}`} />
      <span className="tick-label text-[9px] text-slate-400">{label}</span>
    </span>
  );
}

/* ---------- HAZARD BAR ---------- */
export function HazardBar({ className = "" }: { className?: string }) {
  return <div className={`hazard-dim h-1.5 w-full rounded-sm opacity-70 ${className}`} aria-hidden="true" />;
}

/* ---------- GEAR (SVG) ---------- */
export function Gear({
  teeth = 12,
  size = 80,
  className = "",
  color = "#64748b",
  accent = "#38bdf8",
}: {
  teeth?: number;
  size?: number;
  className?: string;
  color?: string;
  accent?: string;
}) {
  const rOut = 48;
  const rIn = 39;
  const pts: string[] = [];
  const steps = teeth * 4;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const phase = i % 4;
    const r = phase === 0 || phase === 1 ? rOut : rIn;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <polygon points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.6" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
      <circle cx="50" cy="50" r="11" fill="none" stroke={accent} strokeWidth="1.6" />
      {[0, 60, 120, 180, 240, 300].map((d) => {
        const a = (d * Math.PI) / 180;
        return (
          <line
            key={d}
            x1={50 + 13 * Math.cos(a)}
            y1={50 + 13 * Math.sin(a)}
            x2={50 + 28 * Math.cos(a)}
            y2={50 + 28 * Math.sin(a)}
            stroke={color}
            strokeWidth="1.1"
            opacity="0.65"
          />
        );
      })}
    </svg>
  );
}

/* ---------- DIAL GAUGE ---------- */
export function DialGauge({
  value,
  label,
  unit = "%",
  size = 118,
}: {
  value: number;
  label: string;
  unit?: string;
  size?: number;
}) {
  const start = -210;
  const sweep = 240;
  const angle = start + (Math.min(Math.max(value, 0), 100) / 100) * sweep;
  const rad = (angle * Math.PI) / 180;
  const arc = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
  };
  const large = sweep > 180 ? 1 : 0;
  const valLarge = angle - start > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" width={size} height={size} aria-label={`${label} ${value}${unit}`}>
        <circle cx="50" cy="50" r="47" className="fill-black/40" stroke="rgba(148,163,184,0.22)" strokeWidth="1" />
        <path d={`M ${arc(start, 38)} A 38 38 0 ${large} 1 ${arc(start + sweep, 38)}`} fill="none" stroke="rgba(148,163,184,0.22)" strokeWidth="5" strokeLinecap="round" />
        <path d={`M ${arc(start, 38)} A 38 38 0 ${valLarge} 1 ${arc(angle, 38)}`} fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        {Array.from({ length: 9 }).map((_, i) => {
          const d = start + (i / 8) * sweep;
          const a = (d * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={50 + 28 * Math.cos(a)}
              y1={50 + 28 * Math.sin(a)}
              x2={50 + 32 * Math.cos(a)}
              y2={50 + 32 * Math.sin(a)}
              stroke="rgba(148,163,184,0.55)"
              strokeWidth="1"
            />
          );
        })}
        <line x1="50" y1="50" x2={50 + 30 * Math.cos(rad)} y2={50 + 30 * Math.sin(rad)} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3.4" fill="#f59e0b" />
        <text x="50" y="72" textAnchor="middle" className="fill-slate-100" fontSize="13" fontFamily="JetBrains Mono, monospace" fontWeight="700">
          {value}
          {unit}
        </text>
      </svg>
      <span className="tick-label mt-1 text-[9px] text-slate-400">{label}</span>
    </div>
  );
}

/* ---------- LINEAR METER ---------- */
export function Meter({ label, value, spec }: { label: string; value: number; spec: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="tick-label text-[9px] text-slate-400">{label}</span>
        <span className="font-mono text-[10px] text-sky-300">{spec}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-sm border border-[var(--mk-edge)] bg-black/50">
        <div
          className="h-full bg-[repeating-linear-gradient(90deg,#38bdf8_0_6px,#0ea5e9_6px_10px)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- SECTION HEADER ---------- */
export function SectionHead({
  index,
  title,
  sub,
  spec,
}: {
  index: string;
  title: ReactNode;
  sub: string;
  spec: string;
}) {
  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="tick-label rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400">
          SEC {index}
        </span>
        <span className="tick-label text-[10px] text-slate-500">{spec}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-sky-500/40 to-transparent" />
      </div>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">{sub}</p>
    </header>
  );
}
