import React from "react";
import avatarImg from "../assets/images/ai_pandit_avatar_1789398498431.jpg";

// Clearly replaceable placeholder image reference as requested
export const AI_PANDIT_AVATAR_IMAGE_SRC = avatarImg;
export const AI_PANDIT_AVATAR = "AI_PANDIT_AVATAR";

export type AIPanditState = "idle" | "thinking" | "responding";

export interface AIPanditAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  state?: AIPanditState;
  showRing?: boolean;
  showStatusDot?: boolean;
  statusText?: string;
  className?: string;
  lang?: "en" | "hi";
}

export const AIPanditAvatar: React.FC<AIPanditAvatarProps> = ({
  size = "md",
  state = "idle",
  showRing = true,
  showStatusDot = false,
  statusText,
  className = "",
  lang = "en",
}) => {
  // Dimensions map
  const sizeConfig = {
    xs: { px: 28, ringOffset: "p-0.5", dotSize: "w-2 h-2" },
    sm: { px: 36, ringOffset: "p-0.5", dotSize: "w-2.5 h-2.5" },
    md: { px: 48, ringOffset: "p-1", dotSize: "w-3 h-3" },
    lg: { px: 68, ringOffset: "p-1.5", dotSize: "w-3.5 h-3.5" },
    xl: { px: 88, ringOffset: "p-1.5", dotSize: "w-4 h-4" },
  }[size];

  const isThinking = state === "thinking";
  const isResponding = state === "responding";

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      id="ai-pandit-avatar-container"
    >
      {/* Outer Cosmic Aura Glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none -z-10 ${
          isThinking
            ? "bg-gradient-to-r from-amber-500/40 via-purple-600/40 to-amber-400/40 blur-lg scale-125 animate-pulse"
            : isResponding
            ? "bg-gradient-to-r from-amber-400/40 via-rose-500/30 to-amber-300/40 blur-lg scale-125"
            : "bg-amber-500/20 blur-md scale-110"
        }`}
      />

      {/* Rotating Cosmic Orbit Ring (Active when thinking or responding, or subtle in idle) */}
      {showRing && (
        <div
          className={`absolute -inset-1 rounded-full border border-transparent transition-all pointer-events-none ${
            isThinking
              ? "border-t-amber-400 border-r-purple-500 border-b-amber-300/30 border-l-transparent animate-[spin_3s_linear_infinite]"
              : isResponding
              ? "border-t-amber-300 border-r-amber-500 border-b-purple-400/40 border-l-transparent animate-[spin_5s_linear_infinite]"
              : "border-amber-400/30 animate-[spin_20s_linear_infinite]"
          }`}
        />
      )}

      {/* Second Orbit Layer with Cosmic Particle Node for Thinking State */}
      {isThinking && (
        <div className="absolute -inset-2 rounded-full border border-purple-400/20 animate-[spin_6s_linear_infinite_reverse] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b]" />
        </div>
      )}

      {/* The Circular Avatar Housing with Subtle Breathing Animation when Idle */}
      <div
        className={`relative rounded-full overflow-hidden border-2 transition-all duration-500 flex items-center justify-center ${
          sizeConfig.ringOffset
        } ${
          isThinking
            ? "border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105"
            : isResponding
            ? "border-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.4)]"
            : "border-amber-400/60 shadow-[0_0_14px_rgba(217,119,6,0.25)] hover:border-amber-400 hover:shadow-[0_0_18px_rgba(245,158,11,0.4)]"
        }`}
        style={{
          width: sizeConfig.px,
          height: sizeConfig.px,
        }}
      >
        {/* Subtle breathing animation container */}
        <div
          className={`w-full h-full rounded-full overflow-hidden relative ${
            state === "idle" ? "animate-ai-idle" : ""
          }`}
        >
          {/* Avatar Image: High Quality Vedic Pandit Portrait */}
          <img
            src={AI_PANDIT_AVATAR_IMAGE_SRC}
            alt="Vedic Acharya Avatar"
            className="w-full h-full object-cover object-center transform transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="eager"
          />

          {/* Holographic light sweep overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-transparent to-amber-200/20 pointer-events-none" />

          {/* Responding active sheen */}
          {isResponding && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent animate-shimmer pointer-events-none" />
          )}
        </div>
      </div>

      {/* Small Status Indicator Dot (Online / Thinking) */}
      {showStatusDot && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-[#090812] transition-colors ${
            sizeConfig.dotSize
          } ${
            isThinking
              ? "bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping"
              : isResponding
              ? "bg-amber-300 shadow-[0_0_8px_#fcd34d]"
              : "bg-emerald-500 shadow-[0_0_6px_#10b981]"
          }`}
          title={
            isThinking
              ? lang === "hi"
                ? "पूज्य आचार्य जी विचार कर रहे हैं..."
                : "Acharya Ji is analyzing..."
              : lang === "hi"
              ? "पूज्य आचार्य जी ऑनलाइन"
              : "Acharya Ji Online"
          }
        />
      )}
    </div>
  );
};
