import { useState } from "react";
import { ArrowUpRight, Cog, Layers3, Minimize2, Maximize2, ScanSearch } from "lucide-react";
import { apps } from "../../data";
import { Panel, DimLine, Readout, HazardBar } from "./Parts";

/* ============================================================
   MECHANICAL MODULES — exploded-view assembly diagrams
   ============================================================ */

export interface MechModule {
  idx: number;
  partNo: string;
  name: string;
  emoji: string;
  tag: string;
  desc: string;
  url: string;
  mass: string;
  cycles: string;
  tolerance: string;
  layers: { name: string; note: string }[];
}

const LAYER_SETS: { name: string; note: string }[][] = [
  [
    { name: "SHELL — UI Composite", note: "Jetpack Compose render surface" },
    { name: "CTRL — State Reducer", note: "MVI intent → state transition" },
    { name: "BUS — Domain Bus", note: "Use-case orchestration layer" },
    { name: "CORE — Data Engine", note: "Repository + cache coordinator" },
    { name: "BASE — Persistence", note: "Room / DataStore substrate" },
  ],
  [
    { name: "SHELL — Dashboard Frame", note: "Adaptive grid + chart canvas" },
    { name: "CTRL — Aggregator", note: "Stream fold + windowing logic" },
    { name: "BUS — Transport", note: "Retrofit / OkHttp interceptors" },
    { name: "CORE — Sync Engine", note: "Delta merge + conflict resolve" },
    { name: "BASE — Secure Store", note: "Keystore-wrapped credentials" },
  ],
  [
    { name: "SHELL — Interaction Deck", note: "Gesture + haptic feedback map" },
    { name: "CTRL — Session Governor", note: "Lifecycle-scoped controllers" },
    { name: "BUS — Event Router", note: "SharedFlow dispatch fabric" },
    { name: "CORE — Compute Unit", note: "Coroutine dispatcher pool" },
    { name: "BASE — Telemetry Rail", note: "Crash + performance probes" },
  ],
];

const buildModules = (): MechModule[] =>
  apps.slice(0, 6).map((a, i) => ({
    idx: i,
    partNo: `MOD-${String(i + 1).padStart(2, "0")}`,
    name: a.name,
    emoji: a.emoji,
    tag: a.tag,
    desc: a.desc,
    url: a.url,
    mass: `${(2.4 + i * 0.37).toFixed(2)} MB`,
    cycles: `${(58 + i * 7).toString()}k ops/s`,
    tolerance: `±0.0${(2 + (i % 4)).toString()} ms`,
    layers: LAYER_SETS[i % LAYER_SETS.length],
  }));

export const MODULES = buildModules();

function ModuleCard({ mod, onAnalyze }: { mod: MechModule; onAnalyze: (m: MechModule) => void }) {
  const [open, setOpen] = useState(mod.idx === 0);
  const [hot, setHot] = useState<number | null>(null);
  const gap = open ? 42 : 11;

  return (
    <Panel label={mod.name} code={mod.partNo} className="group h-full">
      {/* Isometric exploded stage */}
      <div className="iso-stage relative mx-auto h-[248px] w-full overflow-hidden rounded-md border border-[var(--mk-edge)] bg-black/45 blueprint">
        <div className="iso-body absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2">
          {mod.layers.map((layer, i) => {
            const z = (mod.layers.length - 1 - i) * gap;
            const active = hot === i;
            return (
              <div
                key={layer.name}
                onMouseEnter={() => setHot(i)}
                onMouseLeave={() => setHot(null)}
                className={`iso-layer absolute -left-[95px] -top-[58px] flex h-[116px] w-[190px] items-center justify-center rounded-[3px] border ${
                  active ? "border-sky-400 shadow-[0_0_26px_rgba(56,189,248,0.35)]" : "border-slate-500/40"
                } metal-plate`}
                style={{ transform: `translateZ(${z}px)` }}
              >
                <span className="tick-label text-[8px] text-slate-400">{layer.name.split(" — ")[0]}</span>
                <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                <span className="absolute bottom-1.5 right-1.5 font-mono text-[7px] text-sky-300/70">
                  L{mod.layers.length - i}
                </span>
              </div>
            );
          })}
        </div>

        <span className="tick-label absolute left-3 top-2.5 text-[8px] text-sky-300/70">
          {open ? "EXPLODED VIEW" : "ASSEMBLED"}
        </span>
        <span className="tick-label absolute right-3 top-2.5 text-[8px] text-slate-500">ISO / 58°</span>
        <span className="tick-label absolute bottom-2.5 left-3 text-[8px] text-slate-500">SCALE 1:1</span>
      </div>

      <DimLine label={`STACK ${mod.layers.length} LAYERS · GAP ${gap}.0`} className="mt-3" />

      {/* Layer callouts */}
      <ul className="mt-4 space-y-1">
        {mod.layers.map((l, i) => (
          <li
            key={l.name}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            className={`flex items-start gap-2.5 rounded border px-2.5 py-1.5 transition-colors ${
              hot === i ? "border-sky-400/50 bg-sky-400/10" : "border-transparent"
            }`}
          >
            <span className="tick-label mt-0.5 shrink-0 rounded-sm border border-[var(--mk-edge)] bg-black/50 px-1 text-[8px] text-amber-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold text-slate-200">{l.name}</span>
              <span className="block text-[10px] text-slate-500">{l.note}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-[var(--mk-edge)] pt-3">
        <Readout k="MASS" v={mod.mass} />
        <Readout k="THROUGHPUT" v={mod.cycles} hot />
        <Readout k="TOLERANCE" v={mod.tolerance} />
        <Readout k="CLASS" v={mod.tag} />
      </div>

      <HazardBar className="mt-4" />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-sky-400/40 bg-sky-400/10 px-3 py-2 text-[10px] font-black tracking-wider text-sky-300 transition-all hover:bg-sky-400/20 active:scale-95"
        >
          {open ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          {open ? "COLLAPSE" : "EXPLODE"}
        </button>
        <button
          onClick={() => onAnalyze(mod)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[10px] font-black tracking-wider text-amber-400 transition-all hover:bg-amber-500/20 active:scale-95"
        >
          <ScanSearch className="h-3.5 w-3.5" />
          AI BREAKDOWN
        </button>
        <a
          href={mod.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded border border-[var(--mk-edge)] bg-black/40 px-3 py-2 text-[10px] font-black tracking-wider text-slate-300 transition-all hover:border-slate-400"
        >
          SRC
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </Panel>
  );
}

export default function ExplodedModules({ onAnalyze }: { onAnalyze: (m: MechModule) => void }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-[var(--mk-edge)] metal-dark px-5 py-3">
        <span className="inline-flex items-center gap-2 text-[10px] tick-label text-slate-400">
          <Layers3 className="h-4 w-4 text-sky-400" />
          ASSEMBLY BAY
        </span>
        <span className="tick-label text-[10px] text-slate-500">UNITS: {MODULES.length}</span>
        <span className="tick-label text-[10px] text-slate-500">MODE: INTERACTIVE</span>
        <span className="ml-auto inline-flex items-center gap-2 text-[10px] tick-label text-amber-400">
          <Cog className="gear-cw h-4 w-4" />
          SERVO ONLINE
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => (
          <ModuleCard key={m.partNo} mod={m} onAnalyze={onAnalyze} />
        ))}
      </div>
    </div>
  );
}
