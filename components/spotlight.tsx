"use client";

import React, { useRef, useState, useEffect } from "react";
import useMousePosition from "@/utils/useMousePosition";

type SpotlightProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Spotlight({
  children,
  className = "",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  const mouse = useRef({ x: 0, y: 0 });
  const containerSize = useRef({ w: 0, h: 0 });
  const boxes = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    boxes.current = Array.from(
      containerRef.current.children,
    ) as HTMLElement[];
  }, []);

  useEffect(() => {
    initContainer();
    window.addEventListener("resize", initContainer);

    return () => window.removeEventListener("resize", initContainer);
  }, []);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition]);

  const initContainer = () => {
    if (!containerRef.current) return;

    containerSize.current = {
      w: containerRef.current.offsetWidth,
      h: containerRef.current.offsetHeight,
    };
  };

  const onMouseMove = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const { w, h } = containerSize.current;

    const x = mousePosition.x - rect.left;
    const y = mousePosition.y - rect.top;

    const inside = x > 0 && x < w && y > 0 && y < h;

    if (!inside) return;

    mouse.current = { x, y };

    boxes.current.forEach((box) => {
      const boxX =
        -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;

      const boxY =
        -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;

      box.style.setProperty("--mouse-x", `${boxX}px`);
      box.style.setProperty("--mouse-y", `${boxY}px`);

      // 🌸 إضافة هوية شغف (اختياري – يستخدم في CSS)
      box.style.setProperty("--spotlight-color", "#E96B8A");
    });
  };

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}