import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {ANTON, BODONI} from "./fonts";
import {BG, CREAM, GOLD, GOLD_D, GOLD_L} from "./theme";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const TOTAL = 900;

/* ---------- text styles: outlined vs filled ---------- */
const outline = (color: string = GOLD, w = 3): React.CSSProperties => ({
  color: "transparent",
  WebkitTextStroke: `${w}px ${color}`,
});
const filled = (color: string): React.CSSProperties => ({color});

const T: React.FC<{
  size: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size, style, children}) => (
  <div
    style={{
      fontFamily: ANTON,
      fontSize: size,
      lineHeight: 1.05,
      letterSpacing: 2,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const B: React.FC<{
  size: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size, style, children}) => (
  <div
    style={{
      fontFamily: BODONI,
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.2,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- animation helpers ---------- */
const useIn = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200}});
};

// Text slides up out of a mask
const Reveal: React.FC<{delay: number; children: React.ReactNode}> = ({
  delay,
  children,
}) => {
  const s = useIn(delay);
  return (
    <div style={{overflow: "hidden", padding: "4px 0"}}>
      <div style={{transform: `translateY(${interpolate(s, [0, 1], [115, 0])}%)`}}>
        {children}
      </div>
    </div>
  );
};

const Fade: React.FC<{delay: number; children: React.ReactNode}> = ({
  delay,
  children,
}) => {
  const s = useIn(delay);
  return (
    <div style={{opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`}}>
      {children}
    </div>
  );
};

// Keeps content inside the safe zone (Shorts UI covers the bottom)
const Center: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({
  style,
  children,
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 70,
      paddingRight: 70,
      paddingTop: 170,
      paddingBottom: 290,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---------- persistent layers ---------- */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const cy = 42 + Math.sin(frame / 45) * 8;
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${cy}%, rgba(212,175,55,0.18), transparent 58%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${frame * 0.6}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [800, 815], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity}}>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{fontFamily: ANTON, fontSize: 36, letterSpacing: 8, color: GOLD}}>
          UZU_BUILDZ
        </div>
        <div style={{fontFamily: BODONI, fontStyle: "italic", fontSize: 42, color: CREAM}}>
          agentic ai
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 70,
          right: 70,
          height: 6,
          background: "rgba(212,175,55,0.2)",
        }}
      >
        <div style={{width: `${(frame / TOTAL) * 100}%`, height: "100%", background: GOLD}} />
      </div>
    </AbsoluteFill>
  );
};

// Gold wipe between scenes. Scene changes exactly when the panel covers the screen.
const Wipe: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at - 10 || frame > at + 10) return null;
  const t = interpolate(frame, [at - 10, at + 10], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(t, [0, 1], [-2200, 2200]);
  return (
    <div
      style={{
        position: "absolute",
        top: -60,
        bottom: -60,
        left: -210,
        width: 1500,
        background: `linear-gradient(90deg, ${GOLD_D}, ${GOLD_L}, ${GOLD})`,
        transform: `translateX(${x}px) skewX(-14deg)`,
      }}
    />
  );
};

/* ---------- Scene 1: Hook (0-3s) ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [38, 54], [0, 100], clamp);
  const zoom = interpolate(frame, [0, 90], [1, 1.05]);
  return (
    <Center style={{transform: `scale(${zoom})`}}>
      <Reveal delay={0}>
        <T size={150} style={outline(GOLD, 3)}>AI that</T>
      </Reveal>
      <Reveal delay={6}>
        <T size={150} style={filled(CREAM)}>doesn't just</T>
      </Reveal>
      <Reveal delay={12}>
        <div style={{position: "relative", display: "inline-block"}}>
          <T size={270} style={outline(GOLD, 4)}>answer</T>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 14,
              width: `${strike}%`,
              background: GOLD_L,
            }}
          />
        </div>
      </Reveal>
      <Reveal delay={46}>
        <B size={220} style={{color: GOLD_L}}>it acts.</B>
      </Reveal>
    </Center>
  );
};

/* ---------- Scene 2: Problem (3-9s) ---------- */
const Chip: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: ANTON,
      fontSize: 54,
      letterSpacing: 2,
      color: CREAM,
      border: `3px solid ${CREAM}`,
      padding: "12px 26px",
    }}
  >
    {children}
  </div>
);

const Arrow: React.FC = () => (
  <svg width={60} height={28} viewBox="0 0 60 28">
    <path d="M2 14 H52 M40 4 L54 14 L40 24" fill="none" stroke={GOLD} strokeWidth={5} />
  </svg>
);

const Problem: React.FC = () => (
  <Center>
    <Fade delay={0}>
      <B size={58} style={{color: GOLD_L}}>01 — the problem</B>
    </Fade>
    <Reveal delay={6}>
      <T size={165} style={filled(CREAM)}>You ask.</T>
    </Reveal>
    <Reveal delay={30}>
      <T size={165} style={outline(GOLD, 3)}>It answers.</T>
    </Reveal>
    <Reveal delay={54}>
      <T size={165} style={filled(GOLD_L)}>It stops.</T>
    </Reveal>
    <div style={{display: "flex", alignItems: "center", gap: 22, marginTop: 50}}>
      <Fade delay={80}><Chip>PROMPT</Chip></Fade>
      <Fade delay={88}><Arrow /></Fade>
      <Fade delay={96}><Chip>ANSWER</Chip></Fade>
      <Fade delay={104}><Arrow /></Fade>
      <Fade delay={112}>
        <div
          style={{
            fontFamily: ANTON,
            fontSize: 44,
            letterSpacing: 3,
            background: GOLD,
            color: BG,
            padding: "14px 30px",
          }}
        >
          STOP
        </div>
      </Fade>
    </div>
    <div style={{marginTop: 40}}>
      <Fade delay={130}>
        <B size={62} style={{color: CREAM}}>you do everything else.</B>
      </Fade>
    </div>
  </Center>
);

/* ---------- Scene 3: Explanation (9-21s) ---------- */
const GoalVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cx = 300;
  const cy = 260;
  const sx = 40;
  const sy = 30;
  const p = interpolate(frame, [28, 52], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const tx = sx + (cx - sx) * p;
  const ty = sy + (cy - sy) * p;
  const pulse = frame >= 52 ? (frame - 52) % 36 : -1;
  return (
    <svg width={800} height={693} viewBox="0 0 600 520">
      {[210, 145, 80].map((r, i) => {
        const s = spring({frame: frame - 4 - i * 6, fps, config: {damping: 14}});
        return (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r * s}
            fill={i % 2 === 0 ? "rgba(212,175,55,0.08)" : "none"}
            stroke={i === 1 ? GOLD_L : GOLD}
            strokeWidth={5}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={22} fill={GOLD_L} />
      {p > 0 && (
        <>
          <line x1={sx} y1={sy} x2={tx} y2={ty} stroke={CREAM} strokeWidth={7} strokeLinecap="round" />
          <circle cx={tx} cy={ty} r={11} fill={CREAM} />
        </>
      )}
      {pulse >= 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={22 + pulse * 3}
          fill="none"
          stroke={GOLD_L}
          strokeWidth={4}
          opacity={1 - pulse / 36}
        />
      )}
    </svg>
  );
};

const LoopVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cx = 300;
  const cy = 270;
  const R = 175;
  const nodes = [
    {l: "PLAN", a: -90},
    {l: "ACT", a: 30},
    {l: "CHECK", a: 150},
  ];
  const prog = (Math.max(frame - 10, 0) / 75) % 1;
  const ang = ((-90 + 360 * prog) * Math.PI) / 180;
  const active = Math.round(prog * 3) % 3;
  return (
    <svg width={800} height={693} viewBox="0 0 600 520">
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke={GOLD}
        strokeWidth={3}
        strokeDasharray="10 14"
        strokeDashoffset={-frame * 2}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={BODONI}
        fontStyle="italic"
        fontSize={54}
        fill={GOLD_L}
      >
        repeat
      </text>
      {nodes.map((n, i) => {
        const rad = (n.a * Math.PI) / 180;
        const x = cx + R * Math.cos(rad);
        const y = cy + R * Math.sin(rad);
        const s = spring({frame: frame - 4 - i * 5, fps, config: {damping: 12}});
        const on = i === active;
        return (
          <g key={n.l} transform={`translate(${x} ${y}) scale(${s})`}>
            <circle r={70} fill={on ? GOLD : BG} stroke={GOLD} strokeWidth={5} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={ANTON}
              fontSize={40}
              letterSpacing={2}
              fill={on ? BG : CREAM}
            >
              {n.l}
            </text>
          </g>
        );
      })}
      <circle cx={cx + R * Math.cos(ang)} cy={cy + R * Math.sin(ang)} r={13} fill={GOLD_L} />
    </svg>
  );
};

const OrchVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const xs = [90, 300, 510];
  const labels = ["RESEARCH", "CODE", "REVIEW"];
  const leadS = spring({frame: frame - 4, fps, config: {damping: 12}});
  return (
    <svg width={800} height={693} viewBox="0 0 600 520">
      {xs.map((x, i) => {
        const d = interpolate(frame, [20 + i * 6, 40 + i * 6], [0, 1], clamp);
        const local = frame - 45 - i * 8;
        const tt = local >= 0 ? (local % 36) / 36 : -1;
        return (
          <g key={x}>
            <line
              x1={300}
              y1={160}
              x2={300 + (x - 300) * d}
              y2={160 + (355 - 160) * d}
              stroke={GOLD}
              strokeWidth={4}
              strokeDasharray="2 0"
            />
            {tt >= 0 && (
              <circle
                cx={300 + (x - 300) * tt}
                cy={160 + (355 - 160) * tt}
                r={11}
                fill={GOLD_L}
              />
            )}
          </g>
        );
      })}
      <g transform={`translate(300 100) scale(${leadS})`}>
        <rect x={-110} y={-60} width={220} height={120} fill={GOLD} stroke={CREAM} strokeWidth={5} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={ANTON}
          fontSize={64}
          letterSpacing={3}
          fill={BG}
        >
          LEAD
        </text>
      </g>
      {xs.map((x, i) => {
        const s = spring({frame: frame - 14 - i * 6, fps, config: {damping: 12}});
        return (
          <g key={labels[i]} transform={`translate(${x} 400) scale(${s})`}>
            <rect x={-80} y={-45} width={160} height={90} fill={BG} stroke={GOLD} strokeWidth={5} />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={ANTON}
              fontSize={30}
              letterSpacing={2}
              fill={CREAM}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Step: React.FC<{
  n: string;
  title: string;
  mode: "filled" | "outline" | "gold";
  text: string;
  visual: React.ReactNode;
}> = ({n, title, mode, text, visual}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [106, 120], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const titleStyle =
    mode === "outline" ? outline(GOLD, 3) : mode === "gold" ? filled(GOLD_L) : filled(CREAM);
  return (
    <Center
      style={{
        justifyContent: "flex-start",
        paddingTop: 220,
        opacity: 1 - out,
        transform: `translateX(${-out * 140}px)`,
      }}
    >
      <Reveal delay={0}>
        <B size={200} style={{color: GOLD, lineHeight: 1}}>{n}</B>
      </Reveal>
      <Reveal delay={6}>
        <T size={150} style={titleStyle}>{title}</T>
      </Reveal>
      <div style={{marginTop: 10, maxWidth: 900}}>
        <Fade delay={14}>
          <B size={58} style={{color: CREAM}}>{text}</B>
        </Fade>
      </div>
      <div style={{marginTop: 10}}>
        <Fade delay={16}>{visual}</Fade>
      </div>
    </Center>
  );
};

const Explain: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={120}>
      <Step
        n="01"
        title="Goal"
        mode="filled"
        text="You give it a goal, not a prompt."
        visual={<GoalVisual />}
      />
    </Sequence>
    <Sequence from={120} durationInFrames={120}>
      <Step
        n="02"
        title="Plan + Act"
        mode="outline"
        text="It plans steps, uses tools, and checks its own work."
        visual={<LoopVisual />}
      />
    </Sequence>
    <Sequence from={240} durationInFrames={120}>
      <Step
        n="03"
        title="Orchestrate"
        mode="gold"
        text="A lead agent splits the job across specialist agents."
        visual={<OrchVisual />}
      />
    </Sequence>
  </>
);

/* ---------- Scene 4: Payoff (21-27s) ---------- */
const Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = ["RESEARCH", "BUILD", "TEST", "FIX"];
  return (
    <Center>
      <Reveal delay={0}>
        <T size={190} style={outline(GOLD, 4)}>One goal.</T>
      </Reveal>
      <Reveal delay={8}>
        <T size={140} style={filled(GOLD_L)}>A whole team.</T>
      </Reveal>
      <div
        style={{
          width: "100%",
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {rows.map((r, i) => {
          const start = 34 + i * 24;
          const p = interpolate(frame, [start, start + 16], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          const appear = interpolate(frame, [start - 12, start], [0, 1], clamp);
          const done = p > 0.6;
          return (
            <div
              key={r}
              style={{
                position: "relative",
                height: 104,
                border: `4px solid ${CREAM}`,
                opacity: appear,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${p * 100}%`,
                  background: GOLD,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 32,
                  top: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  fontFamily: ANTON,
                  fontSize: 56,
                  letterSpacing: 4,
                  color: done ? BG : CREAM,
                }}
              >
                {r}
              </div>
              <svg
                width={50}
                height={44}
                viewBox="0 0 50 44"
                style={{position: "absolute", right: 34, top: 24}}
              >
                <path
                  d="M4 24 L18 38 L46 6"
                  fill="none"
                  stroke={BG}
                  strokeWidth={8}
                  strokeDasharray={70}
                  strokeDashoffset={70 * (1 - p)}
                />
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 40}}>
        <Fade delay={130}>
          <B size={62} style={{color: CREAM}}>while you do something else.</B>
        </Fade>
      </div>
    </Center>
  );
};

/* ---------- Scene 5: Outro (27-30s) ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12}});
  const ripple = (offset: number) => {
    const t = ((frame + offset) % 60) / 60;
    return {size: 280 + t * 260, opacity: 0.6 * (1 - t)};
  };
  const r1 = ripple(0);
  const r2 = ripple(30);
  const bob = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <Center>
      <div
        style={{
          position: "relative",
          width: 540,
          height: 540,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {[r1, r2].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: r.size,
              height: r.size,
              borderRadius: "50%",
              border: `4px solid ${GOLD}`,
              opacity: r.opacity,
            }}
          />
        ))}
        <Img
          src={staticFile("pfp.png")}
          style={{
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: `8px solid ${GOLD}`,
            transform: `scale(${s})`,
            boxShadow: "0 0 80px rgba(212,175,55,0.5)",
          }}
        />
      </div>
      <Reveal delay={10}>
        <T size={170} style={filled(GOLD)}>uzu_buildz</T>
      </Reveal>
      <Fade delay={22}>
        <B size={66} style={{color: CREAM}}>Agentic AI, simplified.</B>
      </Fade>
      <div style={{marginTop: 40, transform: `scale(${bob})`}}>
        <Fade delay={36}>
          <div
            style={{
              fontFamily: ANTON,
              fontSize: 72,
              letterSpacing: 6,
              background: GOLD,
              color: BG,
              padding: "14px 64px",
            }}
          >
            FOLLOW
          </div>
        </Fade>
      </div>
    </Center>
  );
};

/* ---------- Main composition ---------- */
export const Explainer: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Background />
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
    <Sequence from={90} durationInFrames={180}><Problem /></Sequence>
    <Sequence from={270} durationInFrames={360}><Explain /></Sequence>
    <Sequence from={630} durationInFrames={180}><Payoff /></Sequence>
    <Sequence from={810} durationInFrames={90}><Outro /></Sequence>
    <Chrome />
    {[90, 270, 630, 810].map((f) => (
      <Wipe key={f} at={f} />
    ))}
  </AbsoluteFill>
);
