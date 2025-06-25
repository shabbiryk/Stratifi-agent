import { Cog } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OptimizationProgressProps {
  progress: number;
  protocolCount: number;
}

export function OptimizationProgress({
  progress,
  protocolCount,
}: OptimizationProgressProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>Optimization in progress...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-slate-700"
        indicatorClassName="bg-blue-500"
      />
      <div className="mt-2 flex items-center space-x-2 text-xs text-slate-400">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20">
          <Cog className="h-2.5 w-2.5 animate-spin text-blue-500" />
        </div>
        <span>Scanning {protocolCount} protocols for best yields</span>
      </div>
    </div>
  );
}
