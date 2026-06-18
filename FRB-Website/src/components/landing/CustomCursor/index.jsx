import { useEffect, useRef } from "react";

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Só ativa em dispositivos com hover (desktop)
    if (!window.matchMedia("(hover: hover)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hovering = false;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      // Aplica cursor:none globalmente só após o primeiro movimento real do mouse
      // Isso garante que o browser rastreie o ponteiro desde o início e o scroll wheel funcione imediatamente
      if (!document.documentElement.classList.contains("cursor-ready")) {
        document.documentElement.classList.add("cursor-ready");
      }
    };

    const onOver = (e) => {
      const hit = e.target.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor-hover]"
      );
      hovering = !!hit;
    };

    const animate = () => {
      // Dot — segue imediatamente
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${hovering ? 0.2 : 1})`;

      // Ring — segue com suavização (lerp)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${hovering ? 1.8 : 1})`;
      ring.style.borderColor = hovering ? "rgba(4,173,224,0.9)" : "rgba(4,173,224,0.42)";

      rafId = requestAnimationFrame(animate);
    };

    // Listeners passivos — não interferem em scroll nem em touch
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--accent)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform",
          transition: "transform 0.08s linear, opacity 0.3s ease",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1.5px solid rgba(4,173,224,0.45)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          willChange: "transform",
          transition: "transform 0.0s, border-color 0.2s ease, opacity 0.3s ease",
        }}
      />
    </>
  );
};
