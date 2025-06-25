import { motion } from "framer-motion";
import { Protocol } from "./asset-card";
import { cn } from "@/lib/utils";

interface RiskAssessmentProps {
  protocols: Protocol[];
}

export function RiskAssessment({ protocols }: RiskAssessmentProps) {
  // Calculate average risk level
  const getAverageRiskLevel = () => {
    const riskValues = {
      low: 0,
      medium: 1,
      high: 2,
    };

    const avgRisk =
      protocols.reduce((acc, protocol) => {
        return acc + riskValues[protocol.risk];
      }, 0) / protocols.length;

    if (avgRisk < 0.5) return "low";
    if (avgRisk < 1.5) return "medium";
    return "high";
  };

  const averageRisk = getAverageRiskLevel();

  return (
    <div className="mb-6 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm">Low Risk</span>
        <span className="text-sm">High Risk</span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-700">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          initial={{ width: "100%" }}
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <motion.div
          className="absolute h-full w-3 translate-x-[30%] bg-white"
          initial={{ x: "0%" }}
          animate={{ x: "30%" }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
      <div className="mt-2 text-center text-sm">
        This strategy has a{" "}
        <span
          className={cn(
            "font-medium",
            averageRisk === "low"
              ? "text-green-400"
              : averageRisk === "medium"
              ? "text-yellow-400"
              : "text-red-400"
          )}
        >
          {averageRisk}
        </span>{" "}
        risk profile
      </div>
    </div>
  );
}
