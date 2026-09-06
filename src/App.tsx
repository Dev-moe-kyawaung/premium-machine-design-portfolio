import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Boxes,
  Cog,
  Cpu,
  Crosshair,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Power,
  Radar,
  Ruler,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import "./mecha.css";
import { profile, techGroups, socials, certCategories } from "./data";
import { Panel, DimLine, Readout, Led, HazardBar, Gear, DialGauge, Meter, SectionHead, Rivet } from "./components/mecha/Parts";
import ExplodedModules, { MODULES, type MechModule } from "./components/mecha/ExplodedModules";
import AIFlowchart from "./components/mecha/AIFlowchart";

/* ============================================================
   LIVE SYSTEM CLOCK
   ============================================================ */
function SystemClock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Yangon",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[11px] tabular-nums text-sky-300">{t}</span>;
}

/* ============================================================
   TOP CONTROL RAIL
   ============================================================ */
function ControlRail() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--mk-edge)] metal-dark backdrop-blur-xl">
      <div className="hazard h-1 w-full opacity-80" />
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Unit badge */}
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded border border-sky-400/40 bg-black/60">
            <Cog className="gear-cw absolute h-9 w-9 text-slate-700" />
            <span className="relative font-mono text-[11px] font-black text-sky-400">MK</span>
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-black tracking-tight text-slate-100">MOE KYAW AUNG</p>
            <p className="tick-label text-[9px] text-amber-500">UNIT MKA-01 · CONTROL ROOM</p>
          </div>
        </div>

        {/* Status cluster */}
        <div className="hidden flex-wrap items-center gap-x-5 gap-y-2 xl:flex">
          <Led color="emerald" label="POWER" />
          <Led color="sky" label="HYDRAULICS" />
          <Led color="emerald" label="TELEMETRY" />
          <Led color="amber" label="AI CORE" />
        </div>

        <nav className="ml-auto flex flex-wrap items-center gap-2">
          {[
            ["SPEC", "#spec"],
            ["SUBSYS", "#subsystems"],
            ["ASSEMBLY", "#assembly"],
            ["AI LAB", "#ai-lab"],
            ["COMMS", "#comms"],
          ].map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="tick-label rounded border border-[var(--mk-edge)] bg-black/40 px-2.5 py-1.5 text-[9px] text-slate-400 transition-colors hover:border-sky-400/50 hover:text-sky-300"
            >
              {l}
            </a>
          ))}
          <span className="hidden items-center gap-2 rounded border border-[var(--mk-edge)] bg-black/40 px-2.5 py-1.5 sm:inline-flex">
            <Power className="h-3 w-3 text-emerald-400" />
            <SystemClock />
          </span>
        </nav>
      </div>
    </header>
  );
}

/* ============================================================
   HERO BAY
   ============================================================ */
function HeroBay() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
      <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT — identification block */}
        <div className="boot">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tick-label rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400">
              DWG No. MKA-2026-A
            </span>
            <span className="tick-label rounded border border-[var(--mk-edge)] bg-black/40 px-2.5 py-1 text-[10px] text-slate-400">
              REV 2.6
            </span>
            <span className="tick-label text-[10px] text-slate-500">SHEET 1 OF 6</span>
          </div>

          <h1 className="mt-6 text-[2.6rem] font-black leading-[0.95] tracking-tight text-slate-50 sm:text-6xl lg:text-[4.4rem]">
            HARD-TECH
            <span className="block bg-gradient-to-r from-sky-300 via-slate-200 to-amber-300 bg-clip-text text-transparent">
              ENGINEERING UNIT
            </span>
          </h1>

          <DimLine label="OVERALL WIDTH — 1440.00 PX ±0.50" className="mt-5 max-w-xl" />

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Senior Android systems engineer <span className="font-semibold text-slate-200">{profile.name}</span> ·{" "}
            {profile.nameMM}. This control room documents the machinery behind production mobile software — load-bearing
            architecture, servo-tight state control, hardened security rails, and telemetry you can actually read off a gauge.
          </p>

          <div className="mt-7 grid max-w-2xl gap-x-8 sm:grid-cols-2">
            <div>
              <Readout k="DESIGNATION" v="SR. ANDROID ENGINEER" />
              <Readout k="OPERATING BASE" v="TACHILEIK ↔ BANGKOK" />
              <Readout k="PRIMARY ALLOY" v="KOTLIN / COMPOSE" hot />
            </div>
            <div>
              <Readout k="CERTIFICATIONS" v="82+ VERIFIED" />
              <Readout k="BUILD UNITS" v="40+ SHIPPED" />
              <Readout k="STATUS" v="OPEN TO WORK" hot />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#assembly"
              className="inline-flex items-center gap-2 rounded border border-sky-400/50 bg-sky-400/15 px-6 py-3 text-[11px] font-black tracking-widest text-sky-200 transition-all hover:bg-sky-400/25 active:scale-95"
            >
              <Boxes className="h-4 w-4" />
              OPEN ASSEMBLY BAY
            </a>
            <a
              href="#ai-lab"
              className="inline-flex items-center gap-2 rounded border border-amber-500/50 bg-amber-500/10 px-6 py-3 text-[11px] font-black tracking-widest text-amber-300 transition-all hover:bg-amber-500/20 active:scale-95"
            >
              <Radar className="h-4 w-4" />
              RUN AI BREAKDOWN
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded border border-[var(--mk-edge)] bg-black/40 px-6 py-3 text-[11px] font-black tracking-widest text-slate-300 transition-all hover:border-slate-400"
            >
              SOURCE REPO
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <HazardBar className="mt-8 max-w-2xl" />
        </div>

        {/* RIGHT — frame assembly schematic */}
        <Panel label="FRAME ASSEMBLY — DRIVE TRAIN" code="ASM-00" className="boot">
          <div className="relative grid place-items-center overflow-hidden rounded-md border border-[var(--mk-edge)] bg-black/50 blueprint p-6">
            {/* crosshair guides */}
            <span className="absolute left-1/2 top-0 h-full w-px bg-sky-400/15" />
            <span className="absolute left-0 top-1/2 h-px w-full bg-sky-400/15" />

            <div className="relative flex items-center gap-1">
              <Gear teeth={14} size={130} className="gear-cw" />
              <Gear teeth={10} size={92} className="gear-ccw gear-fast -ml-5" color="#7c8899" accent="#f59e0b" />
              <Gear teeth={8} size={64} className="gear-cw -ml-4" color="#5b6675" />
            </div>

            <span className="tick-label absolute left-3 top-3 text-[8px] text-sky-300/70">TORQUE PATH A→C</span>
            <span className="tick-label absolute right-3 top-3 text-[8px] text-slate-500">RATIO 14:10:8</span>
            <span className="tick-label absolute bottom-3 left-3 text-[8px] text-slate-500">MAT: TITANIUM-CLASS</span>
            <span className="tick-label absolute bottom-3 right-3 text-[8px] text-amber-400">⌀ 130.0 MM</span>
          </div>

          <DimLine label="DRIVE SPAN — 286.00 ±0.05" className="mt-3" />

          <div className="mt-5 grid grid-cols-3 gap-2">
            <DialGauge value={96} label="ARCHITECTURE" size={104} />
            <DialGauge value={92} label="PERFORMANCE" size={104} />
            <DialGauge value={88} label="SECURITY" size={104} />
          </div>

          <div className="mt-5 space-y-3 border-t border-[var(--mk-edge)] pt-4">
            <Meter label="BUILD PIPELINE" value={94} spec="94 / 100" />
            <Meter label="TEST COVERAGE" value={87} spec="87 / 100" />
            <Meter label="CRASH-FREE SESSIONS" value={99} spec="99.4%" />
          </div>
        </Panel>
      </div>
    </section>
  );
}

/* ============================================================
   OPERATOR SPEC SHEET
   ============================================================ */
function SpecSheet() {
  return (
    <section id="spec" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHead
        index="01"
        spec="DOC / OPERATOR-PROFILE"
        title={
          <>
            Operator Spec Sheet —{" "}
            <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">Unit MKA-01</span>
          </>
        }
        sub="Technical identification record for the engineer behind the machine. All measurements verified against shipped production systems."
      />

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Technical portrait */}
        <Panel label="OPERATOR — FRONT ELEVATION" code="ID-01">
          <div className="relative overflow-hidden rounded border border-[var(--mk-edge)] bg-black">
            <img
              src={profile.portrait}
              alt="Moe Kyaw Aung — operator record"
              className="h-[340px] w-full object-cover opacity-80 contrast-125 grayscale"
            />
            <div className="pointer-events-none absolute inset-0 blueprint opacity-70" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            <Crosshair className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-sky-400/50" />
            <span className="tick-label absolute left-3 top-3 text-[8px] text-sky-300/80">SCAN 001</span>
            <span className="tick-label absolute bottom-3 right-3 text-[8px] text-amber-400">H 340.0</span>
          </div>
          <DimLine label="FRAME WIDTH — 400.00" className="mt-3" />
          <div className="mt-4">
            <Readout k="CALL SIGN" v={profile.nameMM} />
            <Readout k="LANGUAGES" v="MY · EN · KOTLIN" />
            <Readout k="CLEARANCE" v="OPEN TO WORK" hot />
          </div>
        </Panel>

        {/* Narrative + focus */}
        <div className="space-y-6">
          <Panel label="FUNCTIONAL DESCRIPTION" code="TXT-02" tone="dark">
            <p className="text-sm leading-relaxed text-slate-300">{profile.summary}</p>
            <div className="mt-5 rounded border-l-2 border-amber-500 bg-black/40 px-4 py-3">
              <span className="tick-label text-[9px] text-amber-500">OPERATING DOCTRINE</span>
              <p className="mt-1 font-mono text-sm font-bold text-slate-100">"{profile.philosophy}"</p>
            </div>
          </Panel>

          <div className="grid gap-6 sm:grid-cols-2">
            <Panel label="LOAD RATING" code="PERF-03" tone="dark">
              <div className="space-y-3">
                <Meter label="CONCURRENCY" value={93} spec="COROUTINE POOL" />
                <Meter label="MEMORY DISCIPLINE" value={91} spec="0 LEAKS" />
                <Meter label="COLD START" value={89} spec="-40% BASELINE" />
                <Meter label="RELEASE CADENCE" value={95} spec="CI/CD AUTO" />
              </div>
            </Panel>

            <Panel label="TOOL RACK" code="TOOL-04" tone="dark">
              <ul className="space-y-2.5">
                {[
                  ["WRENCH", "Android Studio · Gradle KTS"],
                  ["CALIPER", "Perfetto · Macrobenchmark"],
                  ["TORCH", "LeakCanary · Profiler"],
                  ["VAULT", "Keystore · AES-GCM"],
                  ["RIG", "GitHub Actions · Fastlane"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center gap-2.5">
                    <Wrench className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                    <span className="tick-label w-14 shrink-0 text-[9px] text-slate-500">{k}</span>
                    <span className="text-[11px] text-slate-300">{v}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SUBSYSTEMS
   ============================================================ */
const SUB_LOAD = [96, 92, 89, 85, 80, 91];

function Subsystems() {
  return (
    <section id="subsystems" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHead
        index="02"
        spec="SYS / SUBSYSTEM-ARRAY"
        title={
          <>
            Subsystem Array —{" "}
            <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">6 Drive Units</span>
          </>
        }
        sub="Each subsystem is rated, instrumented and load-tested. Gauges reflect operational proficiency under production conditions."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {techGroups.map((g, i) => (
          <Panel key={g.name} label={g.name.replace(/^[^\w]+\s*/, "")} code={`SUB-${String(i + 1).padStart(2, "0")}`} className="group">
            <div className="flex items-center gap-4">
              <DialGauge value={SUB_LOAD[i % SUB_LOAD.length]} label="LOAD RATING" size={106} />
              <div className="min-w-0 flex-1">
                <Cog className="gear-cw gear-hover mb-2 h-6 w-6 text-slate-600" />
                <Readout k="UNITS" v={String(g.items.length)} />
                <Readout k="STATE" v="NOMINAL" hot />
                <Readout k="TOL" v="±0.03" />
              </div>
            </div>

            <DimLine label="COMPONENT MANIFEST" className="my-4" />

            <div className="flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <span
                  key={it.name}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--mk-edge)] bg-black/40 px-2 py-1 font-mono text-[10px] text-slate-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: it.color }} />
                  {it.name}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   DIAGNOSTICS BAY
   ============================================================ */
function Diagnostics() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHead
        index="05"
        spec="QA / DIAGNOSTICS-BAY"
        title={
          <>
            Diagnostics Bay —{" "}
            <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">Certification Log</span>
          </>
        }
        sub="Verified training record issued by Programming Hub in association with Google Developers Launchpad. All units publicly auditable."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Panel label="CERTIFICATION MATRIX" code="QA-01" tone="dark">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {certCategories.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded border border-[var(--mk-edge)] bg-black/40 px-3 py-2.5 transition-colors hover:border-sky-400/40"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="tick-label shrink-0 text-[8px] text-slate-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate text-[11px] text-slate-300">{c.name}</span>
                </span>
                <span className="font-mono text-[11px] font-black text-amber-400">{c.count}</span>
              </div>
            ))}
          </div>
          <DimLine label="TOTAL VERIFIED UNITS — 82" className="mt-5" />
        </Panel>

        <Panel label="OUTPUT TELEMETRY" code="QA-02">
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "82+", l: "CERTIFICATES", Icon: Activity },
              { v: "40+", l: "BUILDS SHIPPED", Icon: Boxes },
              { v: "16", l: "SIGNATURE UNITS", Icon: Cpu },
              { v: "9", l: "DOMAINS", Icon: ShieldCheck },
            ].map(({ v, l, Icon }) => (
              <div key={l} className="rounded border border-[var(--mk-edge)] bg-black/40 p-3 text-center">
                <Icon className="mx-auto mb-1.5 h-4 w-4 text-sky-400" />
                <div className="font-mono text-2xl font-black text-slate-100">{v}</div>
                <div className="tick-label mt-1 text-[8px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-[var(--mk-edge)] pt-4">
            <Meter label="SIGNAL INTEGRITY" value={99} spec="99.4%" />
            <Meter label="DOC COMPLETENESS" value={92} spec="92%" />
          </div>

          <a
            href={profile.gravatar}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded border border-sky-400/40 bg-sky-400/10 px-4 py-2.5 text-[10px] font-black tracking-widest text-sky-300 hover:bg-sky-400/20"
          >
            AUDIT FULL RECORD
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Panel>
      </div>
    </section>
  );
}

/* ============================================================
   COMMS CONSOLE
   ============================================================ */
function Comms() {
  return (
    <section id="comms" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHead
        index="06"
        spec="NET / COMMS-CONSOLE"
        title={
          <>
            Comms Console —{" "}
            <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">Open Channel</span>
          </>
        }
        sub="Direct uplink to the operator. Response window under 24 hours on all primary channels."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel label="PRIMARY CHANNELS" code="NET-01">
          <div className="space-y-3">
            {profile.phones.map((p, i) => (
              <a
                key={p}
                href={`tel:${p.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-4 rounded border border-[var(--mk-edge)] bg-black/40 px-4 py-3 transition-colors hover:border-sky-400/50"
              >
                <Phone className="h-4 w-4 shrink-0 text-sky-400" />
                <span className="tick-label w-16 shrink-0 text-[9px] text-slate-500">LINE-{i + 1}</span>
                <span className="font-mono text-[12px] text-slate-200">{p}</span>
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-4 rounded border border-[var(--mk-edge)] bg-black/40 px-4 py-3 transition-colors hover:border-sky-400/50"
            >
              <Mail className="h-4 w-4 shrink-0 text-sky-400" />
              <span className="tick-label w-16 shrink-0 text-[9px] text-slate-500">MAIL</span>
              <span className="truncate font-mono text-[12px] text-slate-200">{profile.email}</span>
            </a>
            <div className="flex items-center gap-4 rounded border border-[var(--mk-edge)] bg-black/40 px-4 py-3">
              <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
              <span className="tick-label w-16 shrink-0 text-[9px] text-slate-500">BASE</span>
              <span className="font-mono text-[11px] text-slate-300">{profile.location}</span>
            </div>
          </div>

          <HazardBar className="mt-5" />
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Led color="emerald" label="CHANNEL OPEN" />
            <Led color="sky" label="ENCRYPTED" />
            <Led color="amber" label="AWAITING SIGNAL" />
          </div>
        </Panel>

        <Panel label="NETWORK RELAYS" code="NET-02" tone="dark">
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {socials.slice(0, 12).map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.handle}
                className="group flex flex-col items-center gap-1.5 rounded border border-[var(--mk-edge)] bg-black/40 px-2 py-3 transition-all hover:-translate-y-0.5 hover:border-sky-400/50"
              >
                <span className="text-lg transition-transform group-hover:scale-110">{s.emoji}</span>
                <span className="tick-label text-[8px] text-slate-400">{s.name}</span>
              </a>
            ))}
          </div>
          <DimLine label={`RELAY COUNT — ${socials.length} VERIFIED`} className="mt-5" />
          <div className="mt-4">
            <Readout k="GITHUB" v="Dev-moe-kyawaung" />
            <Readout k="GRAVATAR" v="VERIFIED" hot />
            <Readout k="UPTIME" v="99.97%" />
          </div>
        </Panel>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER PLATE
   ============================================================ */
function FooterPlate() {
  return (
    <footer className="relative border-t border-[var(--mk-edge)] metal-plate">
      <div className="hazard h-1 w-full opacity-70" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <Rivet className="left-4 top-4" />
        <Rivet className="right-4 top-4" />
        <Rivet className="left-4 bottom-4" />
        <Rivet className="right-4 bottom-4" />

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="tick-label text-[9px] text-slate-500">DRAWN BY</p>
            <p className="mt-1 text-sm font-black text-slate-200">MOE KYAW AUNG</p>
            <p className="font-mono text-[11px] text-slate-500">{profile.nameMM}</p>
          </div>
          <div>
            <p className="tick-label text-[9px] text-slate-500">DRAWING NUMBER</p>
            <p className="mt-1 font-mono text-sm text-sky-300">MKA-2026-A · REV 2.6</p>
            <p className="font-mono text-[11px] text-slate-500">SCALE 1:1 · UNITS MM</p>
          </div>
          <div>
            <p className="tick-label text-[9px] text-slate-500">APPROVAL</p>
            <p className="mt-1 font-mono text-sm text-emerald-400">RELEASED FOR PRODUCTION</p>
            <p className="font-mono text-[11px] text-slate-500">© 2026 · ALL RIGHTS RESERVED</p>
          </div>
        </div>

        <p className="mt-8 border-t border-[var(--mk-edge)] pt-5 text-center font-mono text-[10px] leading-relaxed text-slate-600">
          Android, Kotlin and Google Developers Launchpad are trademarks of Google LLC. This schematic interface is an
          independent engineering portfolio · TOLERANCES UNLESS OTHERWISE STATED ±0.05
        </p>
      </div>
    </footer>
  );
}

/* ============================================================
   APP — ROBOTICS CONTROL ROOM
   ============================================================ */
export default function App() {
  const [selected, setSelected] = useState<MechModule>(MODULES[0]);
  const labRef = useRef<HTMLDivElement>(null);

  const analyze = (m: MechModule) => {
    setSelected(m);
    labRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--mk-void)]">
      {/* Ambient layers */}
      <div className="pointer-events-none fixed inset-0 z-0 blueprint opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 18% 8%, rgba(56,189,248,0.09), transparent 34%), radial-gradient(circle at 84% 22%, rgba(245,158,11,0.06), transparent 32%), radial-gradient(circle at 50% 92%, rgba(56,189,248,0.05), transparent 38%)",
        }}
        aria-hidden="true"
      />
      <div className="scanline z-0" aria-hidden="true" />

      <div className="relative z-10">
        <ControlRail />
        <HeroBay />
        <SpecSheet />
        <Subsystems />

        {/* ASSEMBLY BAY */}
        <section id="assembly" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHead
            index="03"
            spec="MECH / ASSEMBLY-BAY"
            title={
              <>
                Mechanical Modules —{" "}
                <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">
                  Exploded Views
                </span>
              </>
            }
            sub="Every shipped product is documented as a layered assembly. Trigger EXPLODE to separate the stack, or send a unit to the AI analyzer for a full control-flow breakdown."
          />
          <ExplodedModules onAnalyze={analyze} />
        </section>

        {/* AI LAB */}
        <section id="ai-lab" ref={labRef} className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHead
            index="04"
            spec="AI / TECHNICAL-BREAKDOWN"
            title={
              <>
                AI Technical Breakdown —{" "}
                <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">
                  Flowchart Generator
                </span>
              </>
            }
            sub="The analyzer core reads the selected module manifest and renders an engineering-style control-flow diagram with typed nodes, signal wires and design notes."
          />
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--mk-edge)] metal-dark px-5 py-3">
            <Terminal className="h-4 w-4 text-sky-400" />
            <span className="tick-label text-[10px] text-slate-400">SUBJECT LOADED:</span>
            <span className="font-mono text-[11px] font-black text-amber-400">
              {selected.partNo} · {selected.name}
            </span>
            <span className="ml-auto inline-flex items-center gap-2">
              <Ruler className="h-3.5 w-3.5 text-slate-500" />
              <span className="tick-label text-[9px] text-slate-500">DIAGRAM 924 × 320</span>
            </span>
          </div>
          <AIFlowchart module={selected} />
        </section>

        <Diagnostics />
        <Comms />
        <FooterPlate />
      </div>
    </div>
  );
}
