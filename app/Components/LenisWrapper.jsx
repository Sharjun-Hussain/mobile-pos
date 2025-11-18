"use client";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function LenisWrapper({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

export default LenisWrapper;
