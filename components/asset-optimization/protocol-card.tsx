import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Protocol } from "./asset-card";

interface ProtocolCardProps {
  protocol: Protocol;
  index: number;
}

export function ProtocolCard({ protocol, index }: ProtocolCardProps) {
  return (
    <motion.div
      key={protocol.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
      className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-slate-700 p-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          </div>
          <div>
            <h5 className="font-medium">{protocol.name}</h5>
            <p className="text-xs text-slate-400">Protocol</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Current APY</p>
          <p className="text-xl font-bold">{protocol.apy.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {protocol.features.map((feature, i) => (
          <span
            key={i}
            className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300"
          >
            {feature}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gauge className="h-4 w-4 text-slate-400" />
          <span className="text-sm">Risk Level:</span>
          <span
            className={cn(
              "text-sm",
              protocol.risk === "low"
                ? "text-green-400"
                : protocol.risk === "medium"
                ? "text-yellow-400"
                : "text-red-400"
            )}
          >
            {protocol.risk}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-700 hover:bg-slate-800"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}
