import { Icon } from "@blueprintjs/core";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

// Helper to generate a random color in HSL format (muted)
function getRandomHSL() {
  const h = Math.floor(Math.random() * 360);
  const s = 40 + Math.random() * 20; // 40-60%
  const l = 45 + Math.random() * 10; // 45-55%
  return { h, s, l };
}

const COLOR_CHANGE_INTERVAL = 9000; // ms

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const LandingIntro = () => {
  // Start with a pleasant muted blue-ish color
  const h = useMotionValue(210); // Hue: 210 (blue)
  const s = useMotionValue(50); // Saturation: 50%
  const l = useMotionValue(50); // Lightness: 50%

  // const bgHSL = useTransform([h, s, l], ([h, s, l]) => `hsl(${h}, ${s}%, ${l}%)`);
  const textHSL = useTransform([h, s, l], (values) => {
    const [hue, sat, light] = values as [number, number, number];
    const compH = (hue + 180) % 360;
    return `hsl(${compH}, ${sat}%, ${light}%)`;
  });

  useEffect(() => {
    let target = getRandomHSL();
    let animationFrame: number;
    const duration = COLOR_CHANGE_INTERVAL;
    let start: number | null = null;
    let initial = { h: h.get(), s: s.get(), l: l.get() };

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function animateColor(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeInOutQuad(t);

      let dh = target.h - initial.h;
      if (Math.abs(dh) > 180) {
        dh -= Math.sign(dh) * 360;
      }
      const currentH = (initial.h + dh * easedT + 360) % 360;
      const currentS = lerp(initial.s, target.s, easedT);
      const currentL = lerp(initial.l, target.l, easedT);

      h.set(currentH);
      s.set(currentS);
      l.set(currentL);

      if (t < 1) {
        animationFrame = requestAnimationFrame(animateColor);
      } else {
        initial = { h: currentH, s: currentS, l: currentL };
        target = getRandomHSL();
        start = null;
        animationFrame = requestAnimationFrame(animateColor);
      }
    }

    animationFrame = requestAnimationFrame(animateColor);
    return () => cancelAnimationFrame(animationFrame);
  }, [h, s, l]);

  return (
    <div className="relative h-screen snap-always snap-start flex flex-col items-center justify-center mr-0 sm:mr-4 px-2">
      <AnimatePresence>
        <motion.div
          className="relative flex flex-col items-start px-4 py-8 sm:px-16 sm:py-12 w-full max-w-md sm:min-w-[480px] sm:min-h-[260px]"
          style={{
            color: textHSL,
            zIndex: 1,
            background: "transparent",
          }}
        >
          {/* Animated background */}
          <div className="relative z-10 rounded-full w-full">
            <h1 className="font-DM_Mono mb-4 text-4xl sm:text-7xl break-words">hello,</h1>
            <div className="text-lg sm:text-2xl tracking-wide font-DM_Mono">
              welcome to my personal page, or blog... thing?
            </div>
            <span className="text-sm font-DM_Mono">
              Yes I was fucking around with the colors. lol
            </span>{" "}
            <span className="mt-16 text-blue-600 animate-bounce flex flex-col items-center">
              {" "}
              <motion.span style={{ color: textHSL }}>
                Go on, scroll!
                <Icon className="inline-block" size={22} icon="caret-down" />
              </motion.span>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LandingIntro;
