import React, { useState, useRef, useCallback, useEffect } from "react";

const C = {
  bg:"#08090b", surface:"#0d0f13", surfaceHi:"#12151c",
  border:"#1a1d26", cyan:"#00c8d4", cyanDim:"#00c8d418", cyanBorder:"#00c8d440",
  white:"#eef0f4", muted:"#7a8499", mutedHi:"#b8c0d0",
  red:"#ff3a3a", redDim:"#ff3a3a18", redBorder:"#ff3a3a40",
  orange:"#ff8c00", orangeDim:"#ff8c0018", orangeBorder:"#ff8c0040",
  green:"#00c87a", greenDim:"#00c87a18", greenBorder:"#00c87a40",
  critical:"#ff0055", criticalDim:"#ff005518", criticalBorder:"#ff005540",
};

const RISK = {
  LOW:      { color:C.green,    dim:C.greenDim,    border:C.greenBorder,    label:"LOW RISK",      dot:"●" },
  ELEVATED: { color:C.orange,   dim:C.orangeDim,   border:C.orangeBorder,   label:"ELEVATED RISK", dot:"▲" },
  HIGH:     { color:C.red,      dim:C.redDim,      border:C.redBorder,      label:"HIGH RISK",     dot:"■" },
  CRITICAL: { color:C.critical, dim:C.criticalDim, border:C.criticalBorder, label:"CRITICAL RISK", dot:"◆" },
};

const AREA_LABELS = {
  shoulder:"Shoulder / Rotator Cuff", elbow:"Elbow / UCL",
  trunk:"Trunk / Core", hip:"Hip Chain",
};

const LOGO = "data:image/png;base64,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";

function s(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function encodeResults(result) {
  try {
    const json = JSON.stringify(result);
    const compressed = btoa(encodeURIComponent(json));
    return compressed;
  } catch(e) {
    return null;
  }
}

function decodeResults(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch(e) {
    return null;
  }
}

async function shortenUrl(longUrl) {
  try {
    const res = await fetch('https://spinlab-risk-proxy.vercel.app/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl }),
    });
    if (!res.ok) return longUrl;
    const data = await res.json();
    return data.short_url || longUrl;
  } catch(e) {
    return longUrl;
  }
}

function buildPrompt(ctx) {
  const lines = [
    "You are a sports biomechanics and injury risk specialist analyzing a SpinLab AI QB Throw Report.",
    "You are receiving pages 1-4 as images. Pages 1-2 have scored metric cards. Pages 3-4 have graphs.",
    "",
    "PLAYER CONTEXT:",
    "Age: " + ctx.age + " | Season: " + ctx.seasonPhase,
    "Prior shoulder injury: " + ctx.priorShoulder + " | Prior elbow/UCL: " + ctx.priorElbow,
    "Throws this week: " + ctx.throwsThisWeek + " | Typical weekly: " + ctx.typicalWeeklyThrows,
    "Rest days last 2 weeks: " + ctx.restDays + " | Fatigue trend: " + ctx.fatigueTrend + "/5",
    "",
    "CONTEXTUAL RISK RULES:",
    "- Prior injury multiplies risk 2-8x regardless of mechanics",
    "- Throw spike over 120% of baseline = elevated risk. Over 150% = high risk regardless of mechanics",
    "- Fewer than 3 rest days in 2 weeks = insufficient recovery",
    "- Fatigue 4-5 over recent weeks = significant risk multiplier",
    "",
    "VALIDATED THRESHOLDS - use ONLY these:",
    "Arm Speed: Poor below 29 mph | Elite above 35 mph",
    "Peak Hip Rotation: Poor below 700 | Elite above 900 deg/s",
    "Peak Torso Rotation: Poor below 650 | Elite above 750 deg/s",
    "Hip-Shoulder Separation: Poor below 200 | Elite above 300 deg/s",
    "Shoulder ER at MER: Poor below 120 deg | Elite above 135 deg",
    "Acceleration Score: Poor below 80 | Elite above 90",
    "Deceleration Score: Poor below 80 | Elite above 90",
    "Velocity Efficiency: Poor below 80 | Elite above 90",
    "Sequencing: Poor below 80 | Elite = 100",
    "Scores between Poor and Elite = acceptable. Do NOT flag average scores as high risk.",
    "",
    "COMPOUND RISK RULES:",
    "1. LAYBACK: ER above 135 is elite ONLY if deceleration above 90 AND velocity efficiency above 90. Otherwise elevated shoulder risk.",
    "2. ARM SPEED MISMATCH: Arm speed above 35 with hip rotation below 700 OR torso rotation below 650 = HIGH risk.",
    "3. ACCEL/DECEL SPLIT: Acceleration above 90 with deceleration below 80 = elevated risk.",
    "4. LOW SEPARATION: Hip-shoulder separation below 200 = compensation flag.",
    "",
    "GRAPH CONVENTIONS pages 3-4:",
    "Page 3 arm: Shoulder ER rise=external rotation fall=internal rotation. Elbow rise=flexion fall=extension.",
    "Page 3 trunk: Hip-shoulder separation positive=hips ahead. Pelvis/trunk rise=toward target.",
    "Page 4 arm: Shoulder ER negative trough at MER = IR whip = PRIMARY stress event.",
    "Page 4 trunk: All rotation rise=toward target.",
    "",
    "Read number values from metric cards on pages 1-2. Apply thresholds above. Do not read bar positions.",
    "",
    "Return ONLY raw JSON starting with { and ending with }. No markdown. No explanation.",
    "",
    '{"player":"name or Athlete","date":"date or Unknown","overall_risk":"LOW","overall_summary":"3-4 plain English sentences","weighting_note":"1-2 sentences on biomechanical vs contextual weighting","confidence":"HIGH","confidence_note":"","scores":{"sequencing":null,"acceleration":null,"deceleration":null,"velocity_efficiency":null,"overall_throw":null,"arm_speed_mph":null,"release_time_ms":null,"peak_hip_rotation":null,"peak_torso_rotation":null,"hip_shoulder_separation":null,"external_rotation_mer":null,"stride_length_pct":null},"areas":{"shoulder":{"risk":"LOW","plain_summary":"","technical_summary":"","findings":[],"contextual_factors":[],"drills":[],"load_guidance":""},"elbow":{"risk":"LOW","plain_summary":"","technical_summary":"","findings":[],"contextual_factors":[],"drills":[],"load_guidance":""},"trunk":{"risk":"LOW","plain_summary":"","technical_summary":"","findings":[],"contextual_factors":[],"drills":[],"load_guidance":""},"hip":{"risk":"LOW","plain_summary":"","technical_summary":"","findings":[],"contextual_factors":[],"drills":[],"load_guidance":""}},"priority_flags":[],"green_lights":[]}',
  ];
  return lines.join("\n");
}

async function pdfToImages(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load pdf.js"));
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const buf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  const total = Math.min(4, pdf.numPages);
  const images = [];
  for (let p = 1; p <= total; p++) {
    const page = await pdf.getPage(p);
    const vp = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width;
    canvas.height = vp.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
    images.push(canvas.toDataURL("image/jpeg", 0.75).split(",")[1]);
  }
  return images;
}

async function runAnalysis(images, ctx) {
  const res = await fetch("https://spinlab-risk-proxy.vercel.app/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: [
          ...images.map(b64 => ({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } })),
          { type: "text", text: buildPrompt(ctx) },
        ],
      }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error("API " + res.status + ": " + t.slice(0, 300));
  }
  const data = await res.json();
  if (data.type === "error") throw new Error(data.error?.message || "API error");
  const raw = (data.content?.find(b => b.type === "text")?.text) || "";
  if (!raw) throw new Error("Empty response. Stop: " + data.stop_reason);
  const s = raw.indexOf("{");
  const e = raw.lastIndexOf("}");
  if (s === -1 || e === -1) throw new Error("No JSON found: " + raw.slice(0, 200));
  return JSON.parse(raw.slice(s, e + 1));
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { crashed: false, msg: "" }; }
  static getDerivedStateFromError(e) { return { crashed: true, msg: String(e?.message || e) }; }
  componentDidCatch(e, info) { console.error("Crash:", e, info); }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center", background:C.bg, color:C.white }}>
          <img src={LOGO} alt="SpinLab AI" style={{ height:18, marginBottom:20 }} />
          <div style={{ fontSize:16, color:C.red, marginBottom:12, fontWeight:600 }}>Something went wrong</div>
          <div style={{ fontSize:11, color:C.mutedHi, maxWidth:440, background:C.surface, border:"1px solid "+C.redBorder, borderRadius:8, padding:"12px 16px", textAlign:"left", fontFamily:"monospace", wordBreak:"break-all" }}>{this.state.msg}</div>
          <button onClick={() => this.setState({ crashed:false, msg:"" })} style={{ marginTop:16, padding:"10px 22px", borderRadius:8, border:"1px solid "+C.border, background:C.surface, color:C.white, cursor:"pointer", fontSize:13 }}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Logo({ height=28 }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ fontSize:11, letterSpacing:"0.3em", color:C.cyan, fontWeight:700, lineHeight:1, textAlign:"center" }}>SPINLAB<span style={{ fontStyle:"italic", fontWeight:300, opacity:0.6 }}>ai</span></div>;
  return <img src={LOGO} alt="SpinLab AI" style={{ height, width:"auto", display:"block", margin:"0 auto" }} onError={() => setErr(true)} />;
}

function Badge({ risk, large }) {
  const r = RISK[risk] || RISK.LOW;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:r.dim, border:"1px solid "+r.border, borderRadius:5, padding:large?"7px 16px":"3px 10px", fontSize:large?11:9, letterSpacing:"0.16em", color:r.color, fontWeight:700, textTransform:"uppercase", whiteSpace:"nowrap" }}>
      <span style={{ fontSize:large?7:5 }}>{r.dot}</span>{r.label}
    </span>
  );
}

function Lbl({ children, color }) {
  return <div style={{ fontSize:9, letterSpacing:"0.18em", color:color||C.muted, textTransform:"uppercase", marginBottom:9 }}>{children}</div>;
}

function Upload({ onFile }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <Logo height={18} />
        <div style={{ fontSize:30, fontWeight:800, color:C.white, letterSpacing:"-0.03em", lineHeight:1.1, marginTop:20 }}>
          QB Injury Risk<br /><span style={{ color:C.cyan }}>Analyzer</span>
        </div>
        <div style={{ fontSize:13, color:C.mutedHi, marginTop:12, maxWidth:320, lineHeight:1.75 }}>
          Upload a SpinLab throw report. We read the graphs, factor in player context, and deliver a full injury risk profile.
        </div>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f?.type==="application/pdf") onFile(f); }}
        onClick={() => ref.current.click()}
        style={{ width:"100%", maxWidth:440, border:"2px dashed "+(drag?C.cyan:C.border), borderRadius:14, padding:"52px 32px", textAlign:"center", cursor:"pointer", background:drag?C.cyanDim:C.surface, transition:"all 0.2s" }}>
        <div style={{ fontSize:40, opacity:0.35, marginBottom:16 }}>⬆</div>
        <div style={{ fontSize:14, color:C.white, fontWeight:600, marginBottom:5 }}>Drop your SpinLab report here</div>
        <div style={{ fontSize:12, color:C.muted }}>or click to browse · PDF only · pages 1–4 analyzed</div>
        <input ref={ref} type="file" accept="application/pdf" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) onFile(e.target.files[0]); }} />
      </div>
      <div style={{ display:"flex", gap:8, marginTop:24, flexWrap:"wrap", justifyContent:"center" }}>
        {["Graph-first analysis","Biomechanical + contextual risk","4 body areas","Drills & load guidance"].map(t => (
          <div key={t} style={{ fontSize:10, color:C.muted, background:C.surface, border:"1px solid "+C.border, borderRadius:20, padding:"4px 12px" }}>{t}</div>
        ))}
      </div>
      <div style={{ marginTop:28, background:C.cyanDim, border:"1px solid "+C.cyanBorder, borderRadius:12, padding:"16px 24px", maxWidth:440, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:12, color:C.mutedHi, lineHeight:1.6 }}>
          Don't have a report yet?{" "}
          <a href="https://www.spinlabai.com" target="_blank" rel="noopener noreferrer" style={{ color:C.cyan, fontWeight:600, textDecoration:"none" }}>
            Join SpinLab to see your injury risk →
          </a>
        </div>
      </div>
    </div>
  );
}

function Intake({ fileName, onSubmit, onBack }) {
  const [form, setForm] = useState({ age:20, seasonPhase:"in-season", priorShoulder:"none", priorElbow:"none", throwsThisWeek:150, typicalWeeklyThrows:150, restDays:4, fatigueTrend:2 });
  const set = (k, v) => setForm(p => ({ ...p, [k]:v }));
  const fatColor = form.fatigueTrend>=4?C.red:form.fatigueTrend>=3?C.orange:C.cyan;
  const fatLabel = ["","Fresh","Slightly Tired","Moderate Fatigue","Very Fatigued","Exhausted"][form.fatigueTrend];
  const spike = form.typicalWeeklyThrows>0 ? Math.round((form.throwsThisWeek/form.typicalWeeklyThrows)*100) : 0;
  const spikeColor = spike>150?C.red:spike>120?C.orange:C.green;

  function Sel({ label, k, opts }) {
    return (
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:12, color:C.mutedHi, marginBottom:7 }}>{label}</div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          {opts.map(([v,l]) => (
            <button key={v} onClick={() => set(k,v)} style={{ padding:"6px 14px", borderRadius:6, fontSize:11, cursor:"pointer", border:"1px solid "+(form[k]===v?C.cyan:C.border), background:form[k]===v?C.cyanDim:C.surfaceHi, color:form[k]===v?C.cyan:C.muted, transition:"all 0.15s", fontFamily:"inherit" }}>{l}</button>
          ))}
        </div>
      </div>
    );
  }

  function Slide({ label, k, min, max, step=1, fmt, subs }) {
    return (
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
          <span style={{ fontSize:12, color:C.mutedHi }}>{label}</span>
          <span style={{ fontSize:13, color:C.cyan, fontWeight:700 }}>{fmt(form[k])}</span>
        </div>
        <input type="range" min={min} max={max} step={step} value={form[k]} onChange={e => set(k, Number(e.target.value))} style={{ width:"100%", cursor:"pointer" }} />
        {subs && <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>{subs.map(s => <span key={s} style={{ fontSize:9, color:C.muted }}>{s}</span>)}</div>}
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"36px 24px" }}>
      <div style={{ width:"100%", maxWidth:500 }}>
        <Logo height={20} />
        <div style={{ marginTop:22, marginBottom:5 }}>
          <div style={{ fontSize:22, fontWeight:700, color:C.white, letterSpacing:"-0.02em" }}>Player Context</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4, lineHeight:1.65 }}>Combines with your report to build a complete risk picture.</div>
        </div>
        <div style={{ fontSize:10, color:C.cyan, background:C.cyanDim, border:"1px solid "+C.cyanBorder, borderRadius:6, padding:"7px 11px", margin:"12px 0 20px" }}>
          Report loaded: <span style={{ color:C.white, fontWeight:500 }}>{fileName}</span>
        </div>
        <div style={{ background:C.surface, border:"1px solid "+C.border, borderRadius:12, padding:"22px" }}>
          <Lbl>Player Profile</Lbl>
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <span style={{ fontSize:12, color:C.mutedHi }}>Age</span>
            </div>
            <input
              type="number" min={12} max={65} value={form.age}
              onChange={e => set("age", Number(e.target.value))}
              style={{ background:C.surfaceHi, border:"1px solid "+C.border, borderRadius:8, padding:"10px 14px", color:C.white, fontSize:16, fontWeight:600, width:120, outline:"none", fontFamily:"inherit" }}
            />
          </div>
          <Sel label="Season Phase" k="seasonPhase" opts={[["preseason","Preseason"],["in-season","In-Season"],["off-season","Off-Season"]]} />
          <div style={{ height:1, background:C.border, margin:"16px 0" }} />
          <Lbl>Injury History</Lbl>
          <Sel label="Prior Shoulder Injury" k="priorShoulder" opts={[["none","None"],["minor","Minor"],["surgery","Surgery"],["current","Ongoing"]]} />
          <Sel label="Prior Elbow / UCL" k="priorElbow" opts={[["none","None"],["minor","Minor"],["surgery","Tommy John"],["current","Ongoing"]]} />
          <div style={{ height:1, background:C.border, margin:"16px 0" }} />
          <Lbl>Workload</Lbl>
          <Slide label="Throws this week" k="throwsThisWeek" min={0} max={600} step={10} fmt={v => String(v)} subs={["0","150","300","450","600"]} />
          <Slide label="Typical weekly throws" k="typicalWeeklyThrows" min={0} max={600} step={10} fmt={v => String(v)} subs={["0","150","300","450","600"]} />
          {form.typicalWeeklyThrows>0 && <div style={{ marginTop:-10, marginBottom:16, fontSize:11, color:spikeColor }}>{spike}% of baseline{spike>150?" — significant spike":spike>120?" — moderate spike":" — normal range"}</div>}
          <Slide label="Rest days in last 2 weeks" k="restDays" min={0} max={14} fmt={v => v+" days"} subs={["0","3","7","10","14"]} />
          <div style={{ marginBottom:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
              <span style={{ fontSize:12, color:C.mutedHi }}>Fatigue trend — past several weeks</span>
              <span style={{ fontSize:13, color:fatColor, fontWeight:700 }}>{fatLabel}</span>
            </div>
            <input type="range" min={1} max={5} value={form.fatigueTrend} onChange={e => set("fatigueTrend", Number(e.target.value))} style={{ width:"100%", cursor:"pointer" }} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
              {["Fresh","Slight","Moderate","Very fatigued","Exhausted"].map(s => <span key={s} style={{ fontSize:9, color:C.muted }}>{s}</span>)}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button onClick={onBack} style={{ padding:"12px 18px", borderRadius:8, border:"1px solid "+C.border, background:"none", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>← Back</button>
          <button onClick={() => onSubmit(form)} style={{ flex:1, padding:"13px", borderRadius:8, border:"none", background:C.cyan, color:C.bg, cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"inherit" }}>Analyze Report →</button>
        </div>
      </div>
    </div>
  );
}

function Processing() {
  const steps = ["Loading PDF renderer...","Rendering page 1...","Rendering page 2...","Rendering page 3...","Rendering page 4...","Sending to analysis engine...","Reading biomechanical data...","Computing risk profile..."];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(s => Math.min(s+1, steps.length-1)), 1800); return () => clearInterval(t); }, []);
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <style>{"@keyframes sp{to{transform:rotate(360deg)}}"}</style>
      <Logo height={20} />
      <div style={{ margin:"36px 0 28px" }}>
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ animation:"sp 1.3s linear infinite" }}>
          <circle cx="28" cy="28" r="23" fill="none" stroke={C.border} strokeWidth="3" />
          <circle cx="28" cy="28" r="23" fill="none" stroke={C.cyan} strokeWidth="3" strokeDasharray="40 105" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ fontSize:15, color:C.white, fontWeight:600, marginBottom:8 }}>Analyzing Report</div>
      <div style={{ fontSize:12, color:C.cyan, minHeight:20 }}>{steps[i]}</div>
      <div style={{ display:"flex", gap:6, marginTop:22 }}>
        {steps.map((_,j) => <div key={j} style={{ width:j===i?20:6, height:4, borderRadius:2, background:j<=i?C.cyan:C.border, transition:"all 0.4s" }} />)}
      </div>
    </div>
  );
}

function Results({ result, onReset }) {
  const [openArea, setOpenArea] = useState(null);
  const [tech, setTech] = useState(false);
  const [tab, setTab] = useState("scores");
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [shortening, setShortening] = useState(false);
  const cfg = RISK[result.overall_risk] || RISK.LOW;
  const areas = result.areas || {};
  const KEYS = ["shoulder","elbow","trunk","hip"];
  const S = result.scores || {};

  const defs = [
    { k:"overall_throw",           l:"Overall Throw",     u:"/100", inv:false, w:80,  g:90  },
    { k:"sequencing",              l:"Sequencing",        u:"/100", inv:false, w:80,  g:95  },
    { k:"acceleration",            l:"Acceleration",      u:"/100", inv:false, w:80,  g:90  },
    { k:"deceleration",            l:"Deceleration",      u:"/100", inv:false, w:80,  g:90  },
    { k:"velocity_efficiency",     l:"Vel. Efficiency",   u:"/100", inv:false, w:80,  g:90  },
    { k:"arm_speed_mph",           l:"Arm Speed",         u:" mph", inv:false, w:29,  g:35  },
    { k:"release_time_ms",         l:"Release Time",      u:" ms",  inv:true,  w:500, g:430 },
    { k:"peak_hip_rotation",       l:"Peak Hip Rot.",     u:"°/s",  inv:false, w:700, g:900 },
    { k:"peak_torso_rotation",     l:"Peak Torso Rot.",   u:"°/s",  inv:false, w:650, g:750 },
    { k:"hip_shoulder_separation", l:"Hip-Shoulder Sep.", u:"°/s",  inv:false, w:200, g:300 },
    { k:"external_rotation_mer",   l:"ER @ MER",          u:"°",    inv:false, w:120, g:135 },
    { k:"stride_length_pct",       l:"Stride Length",     u:"% ht", inv:false, w:48,  g:52  },
  ].filter(d => S[d.k] != null && S[d.k] !== 0);

  const sc = () => C.white;

  return (
    <div style={{ minHeight:"100vh" }}>
      <div style={{ position:"sticky", top:0, zIndex:20, background:C.bg, borderBottom:"1px solid "+C.border, padding:"13px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Logo height={18} />
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setTech(m=>!m)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid "+(tech?C.cyanBorder:C.border), background:tech?C.cyanDim:"none", color:tech?C.cyan:C.muted, cursor:"pointer", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"inherit" }}>{tech?"Plain":"Technical"}</button>
          <button onClick={async () => {
            if (shortening) return;
            let url = shortUrl;
            if (!url) {
              setShortening(true);
              const long = window.location.href.split("#")[0] + window.location.hash;
              url = await shortenUrl(long);
              setShortUrl(url);
              setShortening(false);
            }
            navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => {});
            setTimeout(() => setCopied(false), 2000);
          }} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid "+(copied?C.cyanBorder:C.border), background:copied?C.cyanDim:"none", color:copied?C.cyan:C.muted, cursor:"pointer", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"inherit" }}>
            {shortening ? "..." : copied ? "Copied ✓" : "Share"}
          </button>
          <button onClick={onReset} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid "+C.border, background:"none", color:C.muted, cursor:"pointer", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"inherit" }}>New report</button>
        </div>
      </div>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"24px 20px" }}>

        <div style={{ background:C.surface, border:"1px solid "+cfg.border, borderRadius:14, padding:"26px", marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:cfg.color }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ marginBottom:10 }}><Badge risk={result.overall_risk} large /></div>
              <div style={{ fontSize:13, color:C.mutedHi, lineHeight:1.8, maxWidth:440 }}>{s(result.overall_summary)}</div>
              {result.weighting_note && <div style={{ marginTop:8, fontSize:11, color:C.muted, fontStyle:"italic", lineHeight:1.6 }}>{s(result.weighting_note)}</div>}
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              {result.player && result.player !== "Athlete" && result.player !== "Unknown" && (
                <div style={{ fontSize:11, color:C.white, fontWeight:600 }}>{s(result.player)}</div>
              )}
              {result.date && result.date !== "Unknown" && (
                <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s(result.date)}</div>
              )}
              {result.confidence!=="HIGH" && <div style={{ marginTop:8, fontSize:10, color:C.orange, background:C.orangeDim, border:"1px solid "+C.orangeBorder, borderRadius:5, padding:"4px 8px", maxWidth:180, lineHeight:1.5 }}>⚠ {s(result.confidence_note)}</div>}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginTop:20 }}>
            {KEYS.map(k => {
              const a=areas[k]; if(!a) return null;
              const ac=RISK[a.risk]||RISK.LOW;
              return (
                <button key={k} onClick={() => { setOpenArea(openArea===k?null:k); setTab("areas"); }} style={{ background:ac.dim, border:"1px solid "+(openArea===k&&tab==="areas"?ac.color:ac.border), borderRadius:8, padding:"9px 5px", cursor:"pointer", textAlign:"center", transition:"all 0.15s", fontFamily:"inherit" }}>
                  <div style={{ fontSize:9, color:ac.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:3 }}>{k==="shoulder"?"Shoulder":k==="elbow"?"Elbow":k==="trunk"?"Trunk":"Hip"}</div>
                  <div style={{ fontSize:9, color:ac.color, fontWeight:700 }}>{a.risk}</div>
                </button>
              );
            })}
          </div>
        </div>

        {result.priority_flags?.length>0 && (
          <div style={{ marginBottom:20 }}>
            <Lbl>Priority Actions</Lbl>
            {result.priority_flags.map((f,i) => (
              <div key={i} style={{ display:"flex", gap:11, alignItems:"flex-start", background:C.surface, border:"1px solid "+(i===0?cfg.border:C.border), borderLeft:"3px solid "+(i===0?cfg.color:i===1?C.orange:C.muted), borderRadius:8, padding:"11px 15px", marginBottom:6 }}>
                <div style={{ width:19, height:19, borderRadius:"50%", flexShrink:0, background:i===0?cfg.dim:C.surfaceHi, border:"1px solid "+(i===0?cfg.border:C.border), display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:i===0?cfg.color:C.muted, fontWeight:700 }}>{i+1}</div>
                <span style={{ fontSize:12, color:C.mutedHi, lineHeight:1.65 }}>{s(f)}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:"flex", borderBottom:"1px solid "+C.border, marginBottom:20 }}>
          {[["scores","Scores"],["areas","Body Areas"],["plan","Full Plan"]].map(([id,lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding:"9px 18px", background:"none", border:"none", borderBottom:"2px solid "+(tab===id?C.cyan:"transparent"), color:tab===id?C.white:C.muted, cursor:"pointer", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.15s", marginBottom:-1, fontFamily:"inherit" }}>{lbl}</button>
          ))}
        </div>

        {tab==="scores" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
              {defs.map(d => {
                const v=S[d.k]; const color=sc(d);
                return (
                  <div key={d.k} style={{ background:C.surface, border:"1px solid "+C.border, borderRadius:10, padding:"13px 15px" }}>
                    <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.13em", textTransform:"uppercase", marginBottom:6 }}>{d.l}</div>
                    <div style={{ fontSize:26, fontWeight:800, color, lineHeight:1, letterSpacing:"-0.02em" }}>{v}<span style={{ fontSize:9, color:C.muted, fontWeight:400 }}>{d.u}</span></div>
                    {d.u==="/100" && <div style={{ height:3, background:C.border, borderRadius:2, marginTop:7, overflow:"hidden" }}><div style={{ width:v+"%", height:"100%", background:C.cyan, borderRadius:2 }} /></div>}
                  </div>
                );
              })}
            </div>
            {result.green_lights?.length>0 && (
              <div style={{ marginTop:16, background:C.greenDim, border:"1px solid "+C.greenBorder, borderRadius:10, padding:"15px 18px" }}>
                <Lbl color={C.green}>What's Working</Lbl>
                {result.green_lights.map((g,i) => (
                  <div key={i} style={{ display:"flex", gap:9, marginBottom:6 }}>
                    <span style={{ color:C.green, flexShrink:0 }}>✓</span>
                    <span style={{ fontSize:12, color:C.mutedHi, lineHeight:1.65 }}>{s(g)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="areas" && (
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {KEYS.map(k => {
              const a=areas[k]; if(!a) return null;
              const ac=RISK[a.risk]||RISK.LOW;
              const open=openArea===k;
              return (
                <div key={k} style={{ background:C.surface, border:"1px solid "+(open?ac.border:C.border), borderRadius:12, overflow:"hidden", transition:"border-color 0.2s" }}>
                  <button onClick={() => setOpenArea(open?null:k)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"17px 19px", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:C.white }}>{AREA_LABELS[k]}</span>
                        <Badge risk={a.risk} />
                      </div>
                      <div style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{tech?a.technical_summary:a.plain_summary}</div>
                    </div>
                    <span style={{ color:C.muted, fontSize:13, transform:open?"rotate(180deg)":"none", transition:"transform 0.2s", marginLeft:11, flexShrink:0 }}>▾</span>
                  </button>
                  {open && (
                    <div style={{ padding:"0 19px 20px", borderTop:"1px solid "+C.border }}>
                      <div style={{ marginTop:16 }}>
                        <Lbl>Biomechanical Findings</Lbl>
                        {(a.findings||[]).map((f,i) => (
                          <div key={i} style={{ display:"flex", gap:9, marginBottom:7 }}>
                            <span style={{ color:ac.color, fontSize:10, flexShrink:0, marginTop:2 }}>→</span>
                            <span style={{ fontSize:12, color:C.mutedHi, lineHeight:1.7 }}>{s(f)}</span>
                          </div>
                        ))}
                      </div>
                      {(a.contextual_factors||[]).length>0 && (
                        <div style={{ marginTop:12, background:C.orangeDim, border:"1px solid "+C.orangeBorder, borderRadius:7, padding:"11px 13px" }}>
                          <Lbl color={C.orange}>Contextual Risk Factors</Lbl>
                          {a.contextual_factors.map((f,i) => (
                            <div key={i} style={{ display:"flex", gap:7, marginBottom:5 }}>
                              <span style={{ color:C.orange, fontSize:10, flexShrink:0, marginTop:2 }}>!</span>
                              <span style={{ fontSize:11, color:C.mutedHi, lineHeight:1.65 }}>{s(f)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginTop:12 }}>
                        <div style={{ background:C.surfaceHi, border:"1px solid "+C.border, borderRadius:8, padding:"13px 14px" }}>
                          <Lbl color={C.cyan}>Corrective Drills</Lbl>
                          {(a.drills||[]).map((d,i) => (
                            <div key={i} style={{ display:"flex", gap:7, marginBottom:8 }}>
                              <span style={{ color:C.cyan, fontWeight:700, fontSize:11, flexShrink:0 }}>{i+1}.</span>
                              <span style={{ fontSize:11, color:C.mutedHi, lineHeight:1.65 }}>{s(d)}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ background:C.surfaceHi, border:"1px solid "+C.border, borderRadius:8, padding:"13px 14px" }}>
                          <Lbl color={C.orange}>Load Guidance — 7 Days</Lbl>
                          <span style={{ fontSize:11, color:C.mutedHi, lineHeight:1.75 }}>{s(a.load_guidance)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab==="plan" && (
          <div>
            <Lbl>Full Drill Plan — By Area</Lbl>
            {KEYS.map(k => {
              const a=areas[k]; if(!a) return null;
              const ac=RISK[a.risk]||RISK.LOW;
              return (
                <div key={k} style={{ background:C.surface, border:"1px solid "+C.border, borderLeft:"3px solid "+ac.color, borderRadius:10, padding:"16px 18px", marginBottom:9 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.white }}>{AREA_LABELS[k]}</span>
                    <Badge risk={a.risk} />
                  </div>
                  {(a.drills||[]).map((d,i) => (
                    <div key={i} style={{ display:"flex", gap:9, marginBottom:8 }}>
                      <span style={{ color:ac.color, fontWeight:700, fontSize:11, flexShrink:0 }}>{i+1}.</span>
                      <span style={{ fontSize:12, color:C.mutedHi, lineHeight:1.65 }}>{s(d)}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:11, paddingTop:11, borderTop:"1px solid "+C.border, fontSize:11, color:C.muted, lineHeight:1.7 }}>
                    <span style={{ color:C.orange, fontWeight:600 }}>Load: </span>{s(a.load_guidance)}
                  </div>
                </div>
              );
            })}
            {result.green_lights?.length>0 && (
              <div style={{ marginTop:9, background:C.greenDim, border:"1px solid "+C.greenBorder, borderRadius:10, padding:"15px 18px" }}>
                <Lbl color={C.green}>Keep Doing — What's Working</Lbl>
                {result.green_lights.map((g,i) => (
                  <div key={i} style={{ display:"flex", gap:9, marginBottom:6 }}>
                    <span style={{ color:C.green }}>✓</span>
                    <span style={{ fontSize:12, color:C.mutedHi, lineHeight:1.65 }}>{s(g)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Check for shared result in URL hash on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decodeResults(hash);
      if (decoded && decoded.overall_risk) {
        setResult(decoded);
        setStep("results");
      }
    }
  }, []);

  const handleFile = useCallback(f => { setFile(f); setStep("intake"); }, []);

  const handleIntake = useCallback(async ctx => {
    setStep("processing");
    try {
      const images = await pdfToImages(file);
      const data = await runAnalysis(images, ctx);
      if (!data || typeof data !== "object") throw new Error("Invalid response: not an object");
      if (!data.overall_risk) throw new Error("Invalid response: missing overall_risk");
      if (!data.areas) throw new Error("Invalid response: missing areas");
      // Normalize priority_flags and green_lights to plain strings
      if (data.priority_flags) {
        data.priority_flags = data.priority_flags.map(f =>
          typeof f === "object" && f !== null
            ? (f.flag ? f.flag + (f.detail ? " — " + f.detail : "") : JSON.stringify(f))
            : String(f)
        );
      }
      if (data.green_lights) {
        data.green_lights = data.green_lights.map(g => {
          if (typeof g === "string") return g;
          if (typeof g === "object" && g !== null) {
            if (g.metric && g.note) return g.metric + (g.value ? " (" + g.value + ")" : "") + " — " + g.note;
            if (g.metric) return g.metric + (g.value ? ": " + g.value : "");
            if (g.flag && g.detail) return g.flag + " — " + g.detail;
            if (g.flag) return g.flag;
            if (g.text) return g.text;
            if (g.note) return g.note;
            return JSON.stringify(g);
          }
          return String(g);
        });
      }
      if (data.priority_flags) {
        data.priority_flags = data.priority_flags.map(f => {
          if (typeof f === "string") return f;
          if (typeof f === "object" && f !== null) {
            if (f.flag && f.detail) return f.flag + " — " + f.detail;
            if (f.flag) return f.flag;
            if (f.metric && f.note) return f.metric + " — " + f.note;
            if (f.text) return f.text;
            return JSON.stringify(f);
          }
          return String(f);
        });
      }
      setResult(data);
      setStep("results");
      // Encode results into URL for sharing
      const encoded = encodeResults(data);
      if (encoded) window.location.hash = encoded;
    } catch(e) {
      console.error("Error:", e);
      setError(String(e?.message || e));
      setStep("error");
    }
  }, [file]);

  const reset = () => { setStep("upload"); setFile(null); setResult(null); setError(""); window.location.hash = ""; };

  return (
    <ErrorBoundary>
      <div style={{ background:C.bg, minHeight:"100vh", color:C.white, fontFamily:"'DM Sans','Helvetica Neue',sans-serif" }}>
        <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap');*{box-sizing:border-box;margin:0;padding:0}button{font-family:inherit}input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:#1a1d26;outline:none;cursor:pointer;margin:0}input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:#1a1d26}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#00c8d4;cursor:pointer;border:2px solid #08090b;box-shadow:0 0 10px #00c8d440;margin-top:-7px}input[type=range]::-moz-range-track{height:4px;border-radius:2px;background:#1a1d26;border:none}input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#00c8d4;cursor:pointer;border:2px solid #08090b}input[type=number]{-moz-appearance:textfield}input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#08090b}::-webkit-scrollbar-thumb{background:#252a38;border-radius:2px}"}</style>

        {step==="upload"     && <Upload onFile={handleFile} />}
        {step==="intake"     && <Intake fileName={file?.name} onSubmit={handleIntake} onBack={() => setStep("upload")} />}
        {step==="processing" && <Processing />}
        {step==="results"    && result && <Results result={result} onReset={reset} />}
        {step==="error" && (
          <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
            <Logo height={20} />
            <div style={{ marginTop:22, fontSize:16, color:C.red, marginBottom:12, fontWeight:600 }}>Analysis failed</div>
            <div style={{ fontSize:11, color:C.mutedHi, maxWidth:480, marginBottom:8, lineHeight:1.7, background:C.surface, border:"1px solid "+C.redBorder, borderRadius:8, padding:"12px 16px", textAlign:"left", fontFamily:"monospace", wordBreak:"break-all" }}>{error||"Unknown error"}</div>
            <div style={{ fontSize:11, color:C.muted, maxWidth:360, marginBottom:22, lineHeight:1.6, marginTop:8 }}>Try opening this in Chrome or Safari if you are not already.</div>
            <button onClick={reset} style={{ padding:"10px 22px", borderRadius:8, border:"1px solid "+C.border, background:C.surface, color:C.white, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Try again</button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
