import { Sparkles, Flame, Dumbbell, BookOpen, Moon, Home, Trophy, User, Check, Leaf } from "lucide-react";

// Faithful HabitQuest screen (no real screenshot exists — the RN app can't be
// captured headlessly). Designed at 2× (264×560) and scaled to 0.5 so it renders
// crisp inside the 132×280 phone slot, exactly like a downscaled screenshot.

const C = {
  bg: "#18130E",
  surface: "#221B13",
  surface2: "#2A2117",
  text: "#F4ECDE",
  muted: "#B5A992",
  faint: "#8A7E6B",
  amber: "#F0A55A",
  sage: "#8FBF7F",
  flame: "#E8693F",
  line: "rgba(255,255,255,0.08)",
};

function HabitRow({
  icon,
  name,
  streak,
  done,
}: {
  icon: React.ReactNode;
  name: string;
  streak: number;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-9 w-9 flex-none items-center justify-center rounded-[11px]"
        style={{ background: C.surface2, color: C.amber }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold" style={{ color: C.text }}>
          {name}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: C.faint }}>
          <Flame size={11} style={{ color: C.flame }} />
          {streak}-day streak
        </div>
      </div>
      <div
        className="flex h-6 w-6 flex-none items-center justify-center rounded-full"
        style={
          done
            ? { background: C.amber, color: C.bg }
            : { border: `1.5px solid ${C.line}` }
        }
      >
        {done && <Check size={14} strokeWidth={3} />}
      </div>
    </div>
  );
}

export function HabitQuestScreen() {
  return (
    <div
      className="absolute left-0 top-0 origin-top-left"
      style={{ width: 264, height: 560, transform: "scale(0.5)", background: C.bg, color: C.text }}
      aria-label="HabitQuest app — Dr. Sage AI coach and daily quests"
    >
      <div className="flex h-full flex-col px-[18px] pt-3 pb-2">
        {/* status bar */}
        <div className="flex items-center justify-between text-[12px] font-semibold" style={{ color: C.text }}>
          <span>9:41</span>
          <span className="flex items-center gap-1.5" style={{ color: C.muted }}>
            <span className="flex items-end gap-[2px]">
              <span className="h-[5px] w-[3px] rounded-sm" style={{ background: C.muted }} />
              <span className="h-[7px] w-[3px] rounded-sm" style={{ background: C.muted }} />
              <span className="h-[9px] w-[3px] rounded-sm" style={{ background: C.text }} />
            </span>
            <span
              className="ml-0.5 h-[11px] w-[20px] rounded-[3px] border"
              style={{ borderColor: C.muted, boxShadow: `inset 0 0 0 2px ${C.bg}, inset 12px 0 0 0 ${C.text}` }}
            />
          </span>
        </div>

        {/* header */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] tracking-[0.18em]" style={{ color: C.amber }}>
              YOUR QUEST
            </div>
            <div className="[font-family:var(--font-display)] text-[23px] font-extrabold leading-none tracking-[-0.02em]">
              Today
              <span style={{ color: C.amber }}>.</span>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
            style={{ background: C.surface }}
          >
            <Flame size={14} style={{ color: C.flame }} />
            <span className="text-[13px] font-bold">12</span>
          </div>
        </div>

        {/* XP card */}
        <div className="mt-3 rounded-[14px] p-3" style={{ background: C.surface }}>
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-bold">Level 7</span>
            <span className="font-mono text-[10px]" style={{ color: C.muted }}>
              1,240 / 1,500 XP
            </span>
          </div>
          <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full" style={{ background: C.surface2 }}>
            <div className="h-full rounded-full" style={{ width: "82%", background: C.amber }} />
          </div>
          <div className="mt-1.5 text-[10px]" style={{ color: C.faint }}>
            260 XP to Level 8
          </div>
        </div>

        {/* Dr. Sage coach card */}
        <div
          className="mt-3 rounded-[14px] p-3"
          style={{ background: C.surface, borderLeft: `2px solid ${C.sage}` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: "rgba(143,191,127,0.16)", color: C.sage }}
            >
              <Leaf size={13} />
            </div>
            <span className="text-[13px] font-bold">Dr. Sage</span>
            <span className="font-mono text-[8px] tracking-[0.12em]" style={{ color: C.sage }}>
              AI COACH
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-[1.5]" style={{ color: C.muted }}>
            You crush mornings — let&apos;s protect that{" "}
            <span style={{ color: C.text, fontWeight: 600 }}>7am run</span>. Want a backup plan for
            days work runs late?
          </p>
        </div>

        {/* habits */}
        <div className="mt-3 font-mono text-[9px] tracking-[0.16em]" style={{ color: C.faint }}>
          TODAY&apos;S HABITS
        </div>
        <div className="mt-2 flex flex-col gap-2.5">
          <HabitRow icon={<Dumbbell size={16} />} name="Morning run" streak={7} done />
          <HabitRow icon={<BookOpen size={16} />} name="Read 20 minutes" streak={3} done />
          <HabitRow icon={<Moon size={16} />} name="Lights out by 11" streak={12} done={false} />
        </div>

        {/* AI daily challenge */}
        <div
          className="mt-3 flex items-center gap-2 rounded-[12px] px-3 py-2.5"
          style={{ background: "rgba(240,165,90,0.12)", border: `1px solid rgba(240,165,90,0.22)` }}
        >
          <Sparkles size={15} style={{ color: C.amber }} />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[8px] tracking-[0.14em]" style={{ color: C.amber }}>
              AI DAILY CHALLENGE
            </div>
            <div className="text-[12px] font-semibold">Meditate 5 minutes</div>
          </div>
          <span className="text-[11px] font-bold" style={{ color: C.amber }}>
            +50
          </span>
        </div>

        <div className="flex-1" />

        {/* tab bar */}
        <div
          className="-mx-[18px] mt-2 flex items-center justify-around px-5 pt-2.5"
          style={{ borderTop: `1px solid ${C.line}` }}
        >
          {[
            { icon: <Home size={18} />, on: true },
            { icon: <Trophy size={18} />, on: false },
            { icon: <Sparkles size={18} />, on: false },
            { icon: <User size={18} />, on: false },
          ].map((t, i) => (
            <div key={i} style={{ color: t.on ? C.amber : C.faint }}>
              {t.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
