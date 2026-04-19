// scenes.jsx — Dasitrade security boot sequence

const MONO = "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

// ── Subtle film grain via animated SVG noise ────────────────────────────────
function GrainOverlay() {
  return (
    <svg
      width="1920" height="1080"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08, mixBlendMode: 'overlay' }}
    >
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 0.5
                                0 0 0 0 0.5
                                0 0 0 0 0.5
                                0 0 0 2 0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>
  );
}

// ── Vignette ────────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
    }}/>
  );
}

// ── Corner brackets (subtle framing UI) ─────────────────────────────────────
function CornerBrackets({ opacity = 1 }) {
  const bracketStyle = {
    position: 'absolute',
    width: 40, height: 40,
    borderColor: 'rgba(180,190,200,0.25)',
    borderStyle: 'solid',
  };
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      <div style={{ ...bracketStyle, top: 60, left: 60, borderWidth: '1px 0 0 1px' }}/>
      <div style={{ ...bracketStyle, top: 60, right: 60, borderWidth: '1px 1px 0 0' }}/>
      <div style={{ ...bracketStyle, bottom: 60, left: 60, borderWidth: '0 0 1px 1px' }}/>
      <div style={{ ...bracketStyle, bottom: 60, right: 60, borderWidth: '0 1px 1px 0' }}/>
    </div>
  );
}

// ── Blinking cursor block ───────────────────────────────────────────────────
function Cursor({ size = 22, color = 'rgba(220,225,230,0.9)' }) {
  const t = useTime();
  // 2Hz blink
  const visible = Math.floor(t * 4) % 2 === 0;
  return (
    <span style={{
      display: 'inline-block',
      width: size * 0.55, height: size,
      background: color,
      verticalAlign: '-3px',
      marginLeft: 4,
      opacity: visible ? 1 : 0,
    }}/>
  );
}

// ── Typed line: progressively reveals characters ────────────────────────────
function TypedLine({ text, x, y, start, typeDur, color = 'rgba(200,210,220,0.85)', size = 24, showCursor = true, cursorEnd }) {
  const t = useTime();
  if (t < start) return null;

  const local = t - start;
  const total = text.length;
  const charsShown = Math.min(total, Math.floor((local / typeDur) * total));
  const shown = text.slice(0, charsShown);

  const cursorVisible = showCursor && (cursorEnd == null || t < cursorEnd);

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      fontFamily: MONO,
      fontSize: size,
      fontWeight: 400,
      color,
      letterSpacing: '0.08em',
      whiteSpace: 'pre',
      textShadow: '0 0 8px rgba(180,200,220,0.05)',
    }}>
      {shown}
      {cursorVisible && charsShown >= total && (
        <Cursor size={size * 0.95} color={color}/>
      )}
      {cursorVisible && charsShown < total && (
        <Cursor size={size * 0.95} color={color}/>
      )}
    </div>
  );
}

// ── Status indicator: small pulsing dot ─────────────────────────────────────
function StatusDot({ x, y, color, start }) {
  const t = useTime();
  if (t < start) return null;
  const local = t - start;
  const pulse = 0.6 + 0.4 * Math.sin(local * 12);
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: 8, height: 8,
      borderRadius: 4,
      background: color,
      boxShadow: `0 0 12px ${color}`,
      opacity: pulse,
    }}/>
  );
}

// ── Thin scan line sweep (very subtle) ──────────────────────────────────────
function ScanLine() {
  const t = useTime();
  const y = ((t * 600) % 1200) - 100;
  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0,
      top: y,
      height: 2,
      background: 'linear-gradient(to bottom, transparent, rgba(180,200,220,0.08), transparent)',
      pointerEvents: 'none',
    }}/>
  );
}

// ── Title: "DASITRADE SYSTEM v1.0" ──────────────────────────────────────────
function Title() {
  const t = useTime();
  // Fade in 0.00 -> 0.8 (slow reveal)
  const fadeIn = clamp(t / 0.8, 0, 1);
  const eased = Easing.easeOutCubic(fadeIn);

  // Very subtle glitch at ~0.45s
  const glitchT = t - 0.45;
  let glitchX = 0;
  if (glitchT > 0 && glitchT < 0.2) {
    glitchX = (Math.random() - 0.5) * 4;
  }

  // Fade out slightly at end
  const fadeOut = t > 3.40 ? clamp((t - 3.40) / 0.38, 0, 1) : 0;
  const opacity = eased * (1 - fadeOut * 0.3);

  // Letter-spacing eases in for subtle reveal
  const ls = interpolate([0, 0.8], [0.8, 0.42], Easing.easeOutCubic)(t);

  return (
    <>
      {/* Small label above title */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 340,
        transform: `translate(-50%, ${(1 - eased) * 8}px)`,
        opacity: opacity * 0.6,
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: '0.45em',
        color: 'rgba(160,175,190,0.7)',
        textTransform: 'uppercase',
      }}>
        [ SECURE BOOT ]
      </div>

      {/* Main title */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 400,
        transform: `translate(calc(-50% + ${glitchX}px), ${(1 - eased) * 12}px)`,
        opacity,
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: 64,
        color: 'rgba(230,235,240,0.95)',
        letterSpacing: `${ls}em`,
        whiteSpace: 'pre',
      }}>
        DASITRADE SYSTEM
      </div>

      {/* Version */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 490,
        transform: `translate(-50%, ${(1 - eased) * 6}px)`,
        opacity: opacity * 0.55,
        fontFamily: MONO,
        fontSize: 18,
        color: 'rgba(170,180,195,0.9)',
        letterSpacing: '0.3em',
      }}>
        v1.0
      </div>

      {/* Thin divider line beneath title */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 540,
        transform: 'translateX(-50%)',
        width: eased * 520,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(200,210,220,0.4), transparent)',
        opacity,
      }}/>
    </>
  );
}

// ── Terminal log lines ──────────────────────────────────────────────────────
function TerminalLogs() {
  const t = useTime();
  // Terminal lines appear after title has established
  const line1Start = 0.88;
  const line1TypeDur = 0.7;
  const line1Done = line1Start + line1TypeDur;   // 1.58

  const line2Start = 1.75;
  const line2TypeDur = 0.75;
  const line2Done = line2Start + line2TypeDur;   // 2.50

  const grantStart = 2.70;

  const containerOpacity = clamp((t - 0.8) / 0.38, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: containerOpacity }}>
      {/* Line 1 */}
      <TypedLine
        text="> INITIALIZING SYSTEM..."
        x={640}
        y={620}
        start={line1Start}
        typeDur={line1TypeDur}
        size={22}
        cursorEnd={line2Start}
      />
      {/* [OK] marker after line 1 completes */}
      {t >= line1Done + 0.05 && (
        <div style={{
          position: 'absolute',
          left: 1180, top: 620,
          fontFamily: MONO,
          fontSize: 22,
          color: 'rgba(160,180,170,0.75)',
          letterSpacing: '0.08em',
          opacity: clamp((t - (line1Done + 0.05)) / 0.2, 0, 1),
        }}>
          [ OK ]
        </div>
      )}

      {/* Line 2 */}
      <TypedLine
        text="> CHECKING SECURITY PROTOCOLS..."
        x={640}
        y={665}
        start={line2Start}
        typeDur={line2TypeDur}
        size={22}
        cursorEnd={grantStart}
      />
      {t >= line2Done + 0.05 && (
        <div style={{
          position: 'absolute',
          left: 1180, top: 665,
          fontFamily: MONO,
          fontSize: 22,
          color: 'rgba(160,180,170,0.75)',
          letterSpacing: '0.08em',
          opacity: clamp((t - (line2Done + 0.05)) / 0.2, 0, 1),
        }}>
          [ OK ]
        </div>
      )}

      {/* Status dots in left gutter */}
      <StatusDot x={610} y={631} color="rgba(140,200,180,0.9)" start={line1Done}/>
      <StatusDot x={610} y={676} color="rgba(140,200,180,0.9)" start={line2Done}/>
    </div>
  );
}

// ── ACCESS GRANTED final line ───────────────────────────────────────────────
function AccessGranted() {
  const t = useTime();
  const start = 2.70;
  if (t < start) return null;
  const local = t - start;

  // Entry: fade + scale
  const entry = Easing.easeOutCubic(clamp(local / 0.45, 0, 1));
  // Subtle pulse after appearance
  const pulse = 0.85 + 0.15 * Math.sin(local * 10);

  const green = 'oklch(78% 0.1 155)';
  const greenSoft = 'oklch(78% 0.1 155 / 0.35)';

  return (
    <>
      {/* Horizontal accent lines flanking the text */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 745,
        transform: 'translateX(-50%)',
        width: entry * 720,
        height: 1,
        background: `linear-gradient(to right, transparent, ${greenSoft}, transparent)`,
      }}/>

      <div style={{
        position: 'absolute',
        left: '50%', top: 770,
        transform: `translate(-50%, ${(1 - entry) * 8}px)`,
        opacity: entry,
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: 38,
        color: green,
        letterSpacing: '0.45em',
        textShadow: `0 0 ${12 * pulse}px ${greenSoft}, 0 0 ${28 * pulse}px ${greenSoft}`,
      }}>
        ACCESS GRANTED
      </div>

      <div style={{
        position: 'absolute',
        left: '50%', top: 835,
        transform: 'translateX(-50%)',
        width: entry * 720,
        height: 1,
        background: `linear-gradient(to right, transparent, ${greenSoft}, transparent)`,
      }}/>
    </>
  );
}

// ── Root scene ──────────────────────────────────────────────────────────────
function BootScene() {
  const t = useTime();

  React.useEffect(() => {
    const root = document.getElementById('video-root');
    if (root) root.setAttribute('data-screen-label', `t=${t.toFixed(2)}s`);
  }, [Math.floor(t * 10)]);

  // Overall fade in at very start
  const bootFade = clamp(t / 0.2, 0, 1);
  // Final fade to black at very end
  const endFade = t > 3.55 ? clamp((t - 3.55) / 0.2, 0, 1) : 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#000',
      opacity: bootFade * (1 - endFade * 0.4),
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(15,20,28,1) 0%, rgba(0,0,0,1) 70%)',
      }}/>

      <CornerBrackets opacity={clamp((t - 0.38) / 0.5, 0, 1) * 0.9}/>
      <ScanLine/>
      <Title/>
      <TerminalLogs/>
      <AccessGranted/>
      <Vignette/>
      <GrainOverlay/>
    </div>
  );
}

window.BootScene = BootScene;
