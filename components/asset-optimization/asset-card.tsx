import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance: string;
  protocols: Protocol[];
}

export interface Protocol {
  id: string;
  name: string;
  type: "borrow" | "lend";
  apy: number;
  risk: "low" | "medium" | "high";
  features: string[];
  pools: Pool[];
}

export interface Pool {
  id: string;
  name: string;
  apy: number;
  tvl: string;
  risk: "low" | "medium" | "high";
}

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
  isInView: boolean;
}

export function AssetCard({
  asset,
  isSelected,
  onSelect,
  index,
  isInView,
}: AssetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:border-blue-500/50",
          isSelected ? "border-blue-500 bg-blue-500/5" : ""
        )}
        onClick={() => {
          console.log("AssetCard clicked:", asset.id);
          onSelect(asset.id);
        }}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                {asset.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <CardDescription>
                  {asset.balance} {asset.symbol}
                </CardDescription>
              </div>
            </div>
            <ChevronRight
              className={cn(
                "h-5 w-5 text-slate-400 transition-transform",
                isSelected ? "rotate-90 text-blue-500" : ""
              )}
            />
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
