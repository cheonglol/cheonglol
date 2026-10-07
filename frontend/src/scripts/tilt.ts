/**
 * Phone-tilt parallax.
 *
 * Off by default. The user turns it on with the "Enable tilt" button, and the
 * choice is remembered in localStorage. When on, one sensor publishes two
 * custom properties on <html>:
 *   --tilt-x   -1 (left)  .. 1 (right)
 *   --tilt-y   -1 (up)    .. 1 (down)
 *
 * Elements with class "tilt" lean with them and show a sheen. The loop runs
 * only while a .tilt element is on screen. Reduced motion disables the whole
 * thing and the button is not offered.
 */

const docEl = document.documentElement;

const STORAGE_KEY = "tilt";
const EASE = 0.12; // smoothing per frame; higher follows the sensor faster
const RANGE = 18; // degrees of device tilt that map to full travel
const SETTLE = 0.001; // snap threshold, stops the values chasing tiny deltas

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

let targetX = 0;
let targetY = 0;
let x = 0;
let y = 0;
let raf = 0;
let hasSensor = false;
let reduced = false;
let active = false;

const onScreen = new Set<Element>();
const observed = new WeakSet<Element>();

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    }
    sync();
  },
  { rootMargin: "120px" },
);

function onOrient(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;
  hasSensor = true;

  let gx = e.gamma;
  let gy = e.beta - 45; // 45 degrees is roughly how you hold a phone to read
  const angle = ((screen.orientation?.angle ?? 0) + 360) % 360;
  if (angle === 90) [gx, gy] = [-gy, gx];
  else if (angle === 180) [gx, gy] = [-gx, -gy];
  else if (angle === 270) [gx, gy] = [gy, -gx];

  targetX = clamp(gx / RANGE);
  targetY = clamp(gy / RANGE);
}

function onPointer(e: PointerEvent) {
  if (hasSensor) return; // a real sensor beats the mouse
  targetX = clamp((e.clientX / window.innerWidth) * 2 - 1);
  targetY = clamp((e.clientY / window.innerHeight) * 2 - 1);
}

function frame() {
  x += (targetX - x) * EASE;
  y += (targetY - y) * EASE;
  if (Math.abs(targetX - x) < SETTLE) x = targetX;
  if (Math.abs(targetY - y) < SETTLE) y = targetY;

  docEl.style.setProperty("--tilt-x", x.toFixed(4));
  docEl.style.setProperty("--tilt-y", y.toFixed(4));

  raf = requestAnimationFrame(frame);
}

/** Run the loop only while a tilt target is visible and the tab is awake. */
function sync() {
  const shouldRun = active && !document.hidden && onScreen.size > 0;
  if (shouldRun && !raf) {
    raf = requestAnimationFrame(frame);
  } else if (!shouldRun && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

function observe(scope: ParentNode) {
  scope.querySelectorAll?.(".tilt").forEach((el) => {
    if (observed.has(el)) return;
    observed.add(el);
    io.observe(el);
  });
}

function start() {
  if (active || reduced) return;
  active = true;
  docEl.classList.add("tilt-on");

  window.addEventListener("deviceorientation", onOrient, true);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", sync);

  observe(document);

  // Cards inside a client-loaded island mount after this runs.
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) observe(node as Element);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  sync();
}

async function requestSensorPermission(): Promise<boolean> {
  const DOE = (
    window as unknown as {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
    }
  ).DeviceOrientationEvent;

  if (typeof DOE?.requestPermission !== "function") return true; // no gate off iOS
  try {
    return (await DOE.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

let started = false;

/**
 * Called on every page load. Starts the effect if the user already enabled it
 * on a previous visit. Returns true when it is running.
 */
export function initTilt(): boolean {
  if (started) return active;
  started = true;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reduced = true;
    return false;
  }

  let remembered = false;
  try {
    remembered = localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    remembered = false; // storage blocked; stay off until asked
  }

  if (remembered) start();
  return active;
}

/**
 * Turn the effect on. Must be called from a click handler: iOS only hands over
 * motion data inside a user gesture. Returns true when it is running after.
 */
export async function enableTilt(): Promise<boolean> {
  if (reduced) return false;
  if (!(await requestSensorPermission())) return false;

  try {
    localStorage.setItem(STORAGE_KEY, "on");
  } catch {
    /* private mode: run anyway, just do not remember it */
  }

  start();
  return active;
}
