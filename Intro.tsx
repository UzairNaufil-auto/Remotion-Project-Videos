import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ---- Edit these ----
const TITLE = "YOUR BRAND";
const SUBTITLE = "Tech  •  AI  •  Automation";
const ACCENT = "#00e0ff";
const BG_A = "#05060f";
const BG_B = "#12163a";
// --------------------

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Slowly moving background gradient
  const angle = interpolate(frame, [0, durationInFrames], [120, 200]);

  // Ring draws itself, then a second ring spins
  const R = 230;
  const C = 2 * Math.PI * R;
  const ringProgress = interpolate(frame, [0, 50], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const spin = interpolate(frame, [0, durationInFrames], [0, 270]);
  const ringOpacity = interpolate(frame, [60, 110], [1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Underline wipe
  const lineSpring = spring({frame: frame - 45, fps, config: {damping: 200}});
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 620]);

  // Subtitle fade/slide
  const subIn = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${BG_A}, ${BG_B})`,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {/* Rings */}
      <svg
        width={700}
        height={700}
        viewBox="0 0 700 700"
        style={{position: "absolute", opacity: ringOpacity}}
      >
        <circle
          cx={350}
          cy={350}
          r={R}
          fill="none"
          stroke={ACCENT}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ringProgress)}
          transform="rotate(-90 350 350)"
        />
        <circle
          cx={350}
          cy={350}
          r={R + 40}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.35}
          strokeWidth={2}
          strokeDasharray="6 22"
          transform={`rotate(${spin} 350 350)`}
        />
      </svg>

      {/* Title letters */}
      <div style={{display: "flex", zIndex: 1}}>
        {TITLE.split("").map((char, i) => {
          const s = spring({
            frame: frame - 20 - i * 3,
            fps,
            config: {damping: 12, stiffness: 120},
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 130,
                fontWeight: 800,
                letterSpacing: 6,
                color: "white",
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [90, 0])}px)`,
                textShadow: `0 0 30px ${ACCENT}66`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* Underline */}
      <div
        style={{
          position: "absolute",
          top: "56%",
          height: 6,
          width: lineWidth,
          borderRadius: 3,
          background: ACCENT,
          boxShadow: `0 0 24px ${ACCENT}`,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "62%",
          fontSize: 44,
          color: "white",
          letterSpacing: 8,
          opacity: subIn,
          transform: `translateY(${interpolate(subIn, [0, 1], [24, 0])}px)`,
        }}
      >
        {SUBTITLE}
      </div>
    </AbsoluteFill>
  );
};
