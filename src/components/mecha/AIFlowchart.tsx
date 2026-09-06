import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Cog, Play, RefreshCw, Workflow } from "lucide-react";
import { Panel, Readout, Led } from "./Parts";
import type { MechModule } from "./ExplodedModules";

/* ============================================================
   AI TECHNICAL BREAKDOWN — generates engineering flowcharts
   ============================================================ */

interface FlowNode {
  id: string;
  label: string;
  sub: string;
  col: 0 | 1 | 2 | 3;
  row: 0 | 1 | 2;
  kind: "input" | "process" | "decision" | "store" | "output";
}

interface Template {
  title: string;
  nodes: FlowNode[];
  edges: [string, string, string?][];
  notes: string[];
}

const TEMPLATES: Template[] = [
  {
    title: "OFFLINE-FIRST RENDER PIPELINE",
    nodes: [
      { id: "in", label: "USER INTENT", sub: "gesture / nav event", col: 0, row: 1, kind: "input" },
      { id: "red", label: "REDUCER", sub: "intent → state", col: 1, row: 0, kind: "process" },
      { id: "cache", label: "CACHE HIT?", sub: "room lookup", col: 1, row: 2, kind: "decision" },
      { id: "net", label: "NETWORK FETCH", sub: "retrofit + retry", col: 2, row: 2, kind: "process" },
      { id: "store", label: "PERSIST", sub: "room / datastore", col: 2, row: 1, kind: "store" },
      { id: "ui", label: "RECOMPOSE", sub: "stable state emit", col: 3, row: 0, kind: "output" },
    ],
    edges: [
      ["in", "red", "dispatch"],
      ["in", "cache", "query"],
      ["cache", "net", "miss"],
      ["cache", "store", "hit"],
      ["net", "store", "write"],
      ["store", "red", "emit"],
      ["red", "ui", "state"],
    ],
    notes: [
      "Cold-start path resolved from local substrate before network I/O.",
      "Reducer isolated from transport — deterministic under replay.",
      "Write-through cache guarantees consistency across process death.",
    ],
  },
  {
    title: "TELEMETRY & AGGREGATION LOOP",
    nodes: [
      { id: "src", label: "EVENT SOURCE", sub: "sensor / api stream", col: 0, row: 1, kind: "input" },
      { id: "buf", label: "BUFFER", sub: "backpressure window", col: 1, row: 1, kind: "process" },
      { id: "valid", label: "SCHEMA OK?", sub: "typed contract", col: 1, row: 0, kind: "decision" },
      { id: "agg", label: "AGGREGATOR", sub: "fold + downsample", col: 2, row: 1, kind: "process" },
      { id: "warm", label: "HOT STORE", sub: "in-memory index", col: 2, row: 0, kind: "store" },
      { id: "vis", label: "CHART CANVAS", sub: "draw-phase only", col: 3, row: 1, kind: "output" },
    ],
    edges: [
      ["src", "buf", "emit"],
      ["buf", "valid", "check"],
      ["valid", "agg", "pass"],
      ["buf", "agg", "flush"],
      ["agg", "warm", "index"],
      ["warm", "vis", "read"],
      ["agg", "vis", "frame"],
    ],
    notes: [
      "Backpressure window prevents UI-thread emission floods.",
      "Aggregation runs off dispatcher; canvas receives immutable frames.",
      "Hot store keeps last-N series for instant re-render on rotation.",
    ],
  },
  {
    title: "SECURE TRANSACTION PATH",
    nodes: [
      { id: "req", label: "TXN REQUEST", sub: "signed payload", col: 0, row: 1, kind: "input" },
      { id: "auth", label: "AUTH VALID?", sub: "token + biometric", col: 1, row: 1, kind: "decision" },
      { id: "vault", label: "KEYSTORE", sub: "AES-GCM envelope", col: 1, row: 0, kind: "store" },
      { id: "proc", label: "LEDGER WRITE", sub: "atomic commit", col: 2, row: 1, kind: "process" },
      { id: "audit", label: "AUDIT TRAIL", sub: "append-only log", col: 2, row: 2, kind: "store" },
      { id: "rcpt", label: "RECEIPT", sub: "idempotent ack", col: 3, row: 1, kind: "output" },
    ],
    edges: [
      ["req", "auth", "verify"],
      ["vault", "auth", "key"],
      ["auth", "proc", "granted"],
      ["proc", "audit", "record"],
      ["proc", "rcpt", "commit"],
      ["audit", "rcpt", "seal"],
    ],
    notes: [
      "Keys never leave hardware-backed Keystore boundary.",
      "Ledger commit is atomic — partial writes roll back cleanly.",
      "Idempotency token prevents duplicate charge on retry.",
    ],
  },
];

const BOOT_LOG = [
  "> mounting analyzer core ....... OK",
  "> parsing module manifest ...... OK",
  "> tracing dependency graph ..... OK",
  "> resolving data contracts ..... OK",
  "> rendering flowchart ......... DONE",
];

const COL_X = [22, 258, 494, 730];
const ROW_Y = [26, 132, 238];
const NW = 172;
const NH = 66;

const KIND_STYLE: Record<FlowNode["kind"], { stroke: string; fill: string; tag: string }> = {
  input: { stroke: "#38bdf8", fill: "rgba(56,189,248,0.10)", tag: "IN" },
  process: { stroke: "#94a3b8", fill: "rgba(148,163,184,0.08)", tag: "PROC" },
  decision: { stroke: "#f59e0b", fill: "rgba(245,158,11,0.10)", tag: "DEC" },
  store: { stroke: "#34d399", fill: "rgba(52,211,153,0.10)", tag: "STORE" },
  output: { stroke: "#e2e8f0", fill: "rgba(226,232,240,0.08)", tag: "OUT" },
};

export default function AIFlowchart({ module: mod }: { module: MechModule | null }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [logIdx, setLogIdx] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const tpl = TEMPLATES[(mod?.idx ?? 0) % TEMPLATES.length];

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("running");
    setLogIdx(0);
    BOOT_LOG.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setLogIdx(i + 1);
          if (i === BOOT_LOG.length - 1) setPhase("done");
        }, 240 + i * 210)
      );
    });
  };

  useEffect(() => {
    if (mod) run();
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mod?.idx]);

  const nodeAt = (id: string) => {
    const n = tpl.nodes.find((x) => x.id === id)!;
    return { x: COL_X[n.col], y: ROW_Y[n.row], n };
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* ---------- FLOWCHART CANVAS ---------- */}
      <Panel label="AI GENERATED FLOWCHART" code={mod ? mod.partNo : "MOD-01"} tone="dark">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="tick-label text-[10px] text-sky-300">{tpl.title}</span>
          <span className="tick-label text-[9px] text-slate-500">
            SUBJECT: {mod ? mod.name : "—"}
          </span>
          <button
            onClick={run}
            className="ml-auto inline-flex items-center gap-1.5 rounded border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-sky-300 hover:bg-sky-400/20 active:scale-95"
          >
            {phase === "running" ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            {phase === "running" ? "ANALYZING" : "RE-RUN"}
          </button>
        </div>

        <div className="relative overflow-x-auto rounded-md border border-[var(--mk-edge)] bg-black/50 blueprint p-2">
          <svg viewBox="0 0 924 320" className="min-w-[820px]" role="img" aria-label="Generated architecture flowchart">
            <defs>
              <marker id="mk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(148,163,184,0.85)" />
              </marker>
            </defs>

            {/* wires */}
            {tpl.edges.map(([from, to, lbl], i) => {
              const a = nodeAt(from);
              const b = nodeAt(to);
              const x1 = a.x + NW;
              const y1 = a.y + NH / 2;
              const x2 = b.x;
              const y2 = b.y + NH / 2;
              const midX = x1 + Math.max(22, (x2 - x1) / 2);
              const back = x2 < x1;
              const d = back
                ? `M ${x1} ${y1} H ${x1 + 16} V ${Math.min(y1, y2) - 22} H ${x2 - 16} V ${y2} H ${x2}`
                : `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
              return (
                <g key={i} opacity={phase === "done" ? 1 : 0.25} style={{ transition: "opacity .5s" }}>
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(148,163,184,0.55)"
                    strokeWidth="1.3"
                    strokeDasharray="6 6"
                    className={phase === "done" ? "wire-flow" : ""}
                    markerEnd="url(#mk-arrow)"
                  />
                  {lbl && (
                    <text
                      x={back ? (x1 + x2) / 2 : midX + 4}
                      y={back ? Math.min(y1, y2) - 27 : (y1 + y2) / 2 - 5}
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                      fill="rgba(148,163,184,0.75)"
                      letterSpacing="1"
                    >
                      {lbl.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}

            {/* nodes */}
            {tpl.nodes.map((n, i) => {
              const s = KIND_STYLE[n.kind];
              const x = COL_X[n.col];
              const y = ROW_Y[n.row];
              return (
                <g
                  key={n.id}
                  className={phase === "done" ? "node-in" : ""}
                  style={{ animationDelay: `${i * 70}ms`, opacity: phase === "done" ? 1 : 0.28 }}
                >
                  <rect x={x} y={y} width={NW} height={NH} rx="4" fill={s.fill} stroke={s.stroke} strokeWidth="1.3" />
                  <rect x={x} y={y} width="4" height={NH} fill={s.stroke} opacity="0.8" />
                  <text x={x + 14} y={y + 24} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#e2e8f0" letterSpacing="0.6">
                    {n.label}
                  </text>
                  <text x={x + 14} y={y + 41} fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill="rgba(148,163,184,0.9)">
                    {n.sub}
                  </text>
                  <text x={x + NW - 10} y={y + 56} textAnchor="end" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fill={s.stroke} letterSpacing="1.4">
                    {s.tag}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {Object.entries(KIND_STYLE).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border" style={{ borderColor: v.stroke, background: v.fill }} />
              <span className="tick-label text-[9px] text-slate-500">{k}</span>
            </span>
          ))}
        </div>
      </Panel>

      {/* ---------- ANALYSIS CONSOLE ---------- */}
      <div className="space-y-6">
        <Panel label="ANALYZER CORE" code="AI-01">
          <div className="flex items-center gap-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-sky-400/40 bg-black/50">
              <Cog className="gear-cw absolute h-14 w-14 text-slate-700" />
              <BrainCircuit className="relative h-6 w-6 text-sky-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-100">Technical Breakdown Engine</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                Parses a module manifest and emits an engineering-grade control-flow diagram.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--mk-edge)] pt-3">
            <Led color="emerald" label="CORE ONLINE" />
            <Led color="sky" label="GRAPH SYNC" />
            <Led color={phase === "done" ? "emerald" : "amber"} label={phase === "done" ? "RENDER OK" : "RENDERING"} />
          </div>

          <div className="mt-4 rounded border border-[var(--mk-edge)] bg-black/60 p-3 font-mono text-[10px] leading-6 text-emerald-400">
            {BOOT_LOG.slice(0, logIdx).map((l) => (
              <div key={l}>{l}</div>
            ))}
            {phase === "running" && <div className="text-amber-400">▋</div>}
            {phase === "idle" && <div className="text-slate-600">&gt; awaiting module selection…</div>}
          </div>
        </Panel>

        <Panel label="ENGINEERING NOTES" code="DOC-07" tone="dark">
          <ul className="space-y-3">
            {tpl.notes.map((n, i) => (
              <li key={n} className="flex gap-2.5">
                <span className="tick-label mt-0.5 shrink-0 rounded-sm border border-amber-500/40 bg-amber-500/10 px-1 text-[8px] text-amber-400">
                  N{i + 1}
                </span>
                <span className="text-[11px] leading-relaxed text-slate-300">{n}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-[var(--mk-edge)] pt-3">
            <Readout k="NODES" v={String(tpl.nodes.length)} />
            <Readout k="EDGES" v={String(tpl.edges.length)} hot />
            <Readout k="DEPTH" v="4 STAGES" />
            <Readout k="VERDICT" v="PRODUCTION-READY" />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-[9px] tick-label text-slate-500">
            <Workflow className="h-3.5 w-3.5 text-sky-400" />
            DIAGRAM REV 2.6 · MKA ENGINEERING
          </div>
        </Panel>
      </div>
    </div>
  );
}
