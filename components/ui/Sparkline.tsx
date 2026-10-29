import { useId } from "react";
import { cn } from "@/lib/utils/cn";

type SparklineProps = {
  data: number[];
  /** Sets the line color through `currentColor`, e.g. "text-primary-500". Fills the parent's width. */
  className?: string;
};

const WIDTH = 100;
const HEIGHT = 40;

/** Tiny dependency-free trend line with a soft fill, rendered on the server. */
export function Sparkline({ data, className }: SparklineProps) {
  const gradientId = useId();
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const range = Math.max(...data) - min || 1;
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * WIDTH,
    y: HEIGHT - 2 - ((value - min) / range) * (HEIGHT - 4),
  }));
  // Smooth curve: each segment is a cubic Bézier with horizontal control points at its midpoint.
  const line = points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    const previous = points[index - 1];
    const midX = (previous.x + point.x) / 2;
    return `${path} C${midX},${previous.y} ${midX},${point.y} ${point.x},${point.y}`;
  }, "");

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className={cn("h-10 w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
