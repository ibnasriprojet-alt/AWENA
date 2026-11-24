"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

// Fresh, guaranteed working high-quality Unsplash images (Architecture & Minimalist theme)
const IMAGES = [
  { src: "/produits/robe-eventail.jpg", alt: "Robe jaune et blanc avec éventail fleuri" },
  { src: "/produits/robe-bleue.jpg", alt: "Robe bleue brodée" },
  { src: "/produits/duo-ceremonie.jpg", alt: "Tenues de cérémonie rouge et verte" },
  { src: "/produits/kanzu-or.jpg", alt: "Tunique blanche aux broderies dorées" },
  { src: "/produits/kanzu-or-portrait.jpg", alt: "Portrait de la tunique blanche brodée d'or" },
  { src: "/produits/salouva-azur.jpg", alt: "Salouva bleu et or" },
  { src: "/produits/robe-terracotta.jpg", alt: "Robe terracotta et vert" },
];

// Calculate a sweeping 3D arch around the center point for both mobile and desktop
const generatePanoramicCards = () => {
  const total = IMAGES.length;
  const centerIndex = (total - 1) / 2;

  return IMAGES.map((item, i) => {
    const offset = i - centerIndex;
    const absOffset = Math.abs(offset);
    const zIndex = Math.round(10 - absOffset);

    return {
      item,
      z: zIndex,
      desktop: {
        // Increased stack offset slightly to accommodate larger cards
        stacked: { x: offset * 2, y: offset * -2, rotateZ: offset * 2.5, rotateY: 0, scale: 1 },
        // Increased spread (x from 13 to 18) for larger cards
        panoramic: { x: offset * 18, y: absOffset * 3, rotateZ: offset * 1.5, rotateY: offset * -12, scale: 1 - absOffset * 0.05 },
        // Significantly larger sizes. Margins are exactly -50% of w/h to maintain perfect center.
        size: { w: "22vw", h: "32vh", ml: "-11vw", mt: "-16vh" }
      },
      mobile: {
        stacked: { x: offset * 1.5, y: offset * -1.5, rotateZ: offset * 3, rotateY: 0, scale: 1 },
        // Tighter X spread and more aggressive Y dip for mobile portrait screens
        panoramic: { x: offset * 16, y: absOffset * 5, rotateZ: offset * 2, rotateY: offset * -15, scale: 1 - absOffset * 0.04 },
        // Significantly larger for mobile devices too
        size: { w: "46vw", h: "30vh", ml: "-23vw", mt: "-15vh" }
      },
    };
  });
};

const CARDS = generatePanoramicCards();

// Optimized physics to remove scroll jitter (higher damping, zero bounce)
const PROGRESS_SPRING = { stiffness: 80, damping: 25, mass: 0.5, restDelta: 0.001 };
const PARALLAX_SPRING = { stiffness: 50, damping: 25, mass: 0.5 };

function usePointerTilt(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, PARALLAX_SPRING);
  const tiltY = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled || !active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientY / window.innerHeight - 0.5) * -10);
      rawY.set((e.clientX / window.innerWidth - 0.5) * 10);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, enabled, rawX, rawY]);

  return { tiltX, tiltY };
}

function GalleryCard({ card, progress, isSpreadActive, isMobile }: any) {
  const { item, desktop, mobile, z } = card;
  const activeLayout = isMobile ? mobile : desktop;
  const { stacked, panoramic, size } = activeLayout;

  // Custom S-curve easing for elegance
  const ease = useTransform(progress, (p: number) =>
    p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
  );

  // Raw numeric interpolations converted natively to strings (fixes layout recalculation jitter)
  const xRaw = useTransform(ease, [0, 1], [stacked.x, panoramic.x]);
  const yRaw = useTransform(ease, [0, 1], [stacked.y, panoramic.y]);
  const x = useTransform(xRaw, (v) => `${v}vw`);
  const y = useTransform(yRaw, (v) => `${v}vh`);
  
  const rotateZ = useTransform(ease, [0, 1], [stacked.rotateZ, panoramic.rotateZ]);
  const rotateY = useTransform(ease, [0, 1], [stacked.rotateY, panoramic.rotateY]);
  const scale = useTransform(ease, [0, 1], [0.75, panoramic.scale]);

  return (
    <div 
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{ zIndex: z }}
    >
      <motion.div
        className="will-change-transform cursor-pointer pointer-events-auto shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-md"
        style={{
          width: size.w,
          height: size.h,
          marginLeft: size.ml,
          marginTop: size.mt,
          x,
          y,
          rotateZ,
          rotateY,
          scale,
          transformOrigin: "center center -50px" 
        }}
      >
        <div className="hero-frame group relative h-full w-full overflow-hidden bg-white p-2 pb-7 max-md:p-1 max-md:pb-4 transition-shadow duration-500 hover:shadow-black/20 ring-1 ring-black/5">
          {/* Cadre éditorial */}
          <div className="relative h-full w-full overflow-hidden bg-neutral-200">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
            <img
              src={item.src}
              alt={item.alt}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-2 bottom-1 flex items-center justify-between text-[7px] font-semibold uppercase tracking-[0.18em] text-[#5A5C3B] max-md:inset-x-1 max-md:text-[6px]">
            <span className="truncate">{item.alt.split(" ").slice(0, 3).join(" ")}</span>
            <span>AWENA · 26</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PanoramicSpreadHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, PROGRESS_SPRING);
  const progress = useTransform(smoothProgress, [0.15, 0.85], [0, 1]);

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.95));

  const { tiltX, tiltY } = usePointerTilt(spread, !reduce);

  // Typography starts lower and scales up into position as cards unspool
  // Moved up slightly more ("-22vh") to give the larger images breathing room
  const textY = useTransform(progress, [0.2, 1], ["10vh", "-22vh"]);
  const textScale = useTransform(progress, [0.2, 1], [0.85, 1]);
  const textOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  return (
    <section 
      ref={wrapRef} 
      className="relative w-full h-[400vh] bg-neutral-50 text-neutral-900 transition-colors duration-500"
    >
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {/* Fond du hero — image fixe derrière la scène, sans toucher aux cartes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/fond-hero.jpg')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F3EADC]/70 via-[#F3EADC]/25 to-[#F3EADC]/70"
        />

        {/* Halo lumineux derrière les cartes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-[#B69475]/10 blur-[130px]" />
        </div>

        <div className="pointer-events-none absolute left-[5vw] top-1/2 hidden -translate-y-1/2 md:flex md:flex-col md:gap-3 lg:flex">
          <span className="h-10 w-px bg-[#5A5C3B]/40" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#5A5C3B] [writing-mode:vertical-rl]">
            Collection 01 — 07
          </span>
        </div>
        <div className="pointer-events-none absolute right-[5vw] top-1/2 hidden -translate-y-1/2 md:flex md:flex-col md:items-end md:gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#5A5C3B] [writing-mode:vertical-rl]">
            Automne · Hiver 2026
          </span>
          <span className="h-10 w-px bg-[#5A5C3B]/40" />
        </div>

        {/* Scene Container - Reacts to pointer tilt for whole-gallery parallax */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
        >
          {CARDS.map((card, i) => (
            <GalleryCard
              key={i}
              card={card}
              progress={progress}
              isSpreadActive={spread}
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        {/* Typographie éditoriale */}
        <motion.div
          className="pointer-events-none absolute z-[5] flex flex-col items-center text-center px-6"
          style={{ y: textY, scale: textScale, opacity: textOpacity }}
        >
          <span className="mb-5 flex items-center gap-3 text-[10px] md:text-[0.75vw] uppercase tracking-[0.4em] font-semibold text-[#5A5C3B]">
            <span className="h-px w-7 bg-[#B54E30]" />
            Collection Automne · Hiver 2026
            <span className="h-px w-7 bg-[#B54E30]" />
          </span>
          <h2 className="font-display text-6xl leading-[0.92] tracking-tight sm:text-7xl md:text-[6vw]">
            Le beau <em className="font-normal text-[#B54E30]">dure.</em>
          </h2>
        </motion.div>

        {/* Invitation au défilement */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#5A5C3B]">Faites défiler</span>
          <span className="relative h-10 w-px overflow-hidden bg-[#5A5C3B]/25">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-[#B54E30]"
              animate={{ y: ["-100%", "260%"] }}
              transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
