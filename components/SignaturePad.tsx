"use client";

import { useEffect, useRef, useState } from "react";

export default function SignaturePad({ submitLabel }: { submitLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0b0f19";
  }, []);

  function pointFromEvent(canvas: HTMLCanvasElement, e: React.PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const { x, y } = pointFromEvent(canvas, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointFromEvent(canvas, e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }

  function handlePointerUp() {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas || !hiddenInputRef.current) return;
    hiddenInputRef.current.value = canvas.toDataURL("image/png");
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    if (hiddenInputRef.current) hiddenInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-ink-soft">Sign below to approve this quote.</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={140}
        className="w-full touch-none rounded-lg border border-line bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <input ref={hiddenInputRef} type="hidden" name="signatureDataUrl" />
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleClear} className="btn-link">
          Clear
        </button>
        <button type="submit" disabled={!hasSignature} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
          {submitLabel}
        </button>
      </div>
      {!hasSignature && <p className="text-xs text-ink-faint">Sign above to enable the approve button.</p>}
    </div>
  );
}
