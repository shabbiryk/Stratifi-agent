"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pool } from "./asset-card";

interface PoolListProps {
  pools: Pool[];
  onSelect: (poolId: string) => void;
}

export function PoolList({ pools, onSelect }: PoolListProps) {
  return (
    <div className="space-y-4">
      {pools.map((pool, index) => (
        <motion.div
          key={pool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-slate-800 bg-slate-800/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{pool.name}</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-slate-400">APY: {pool.apy}%</p>
                  <p className="text-sm text-slate-400">TVL: ${pool.tvl}</p>
                  <p className="text-sm text-slate-400">Risk: {pool.risk}</p>
                </div>
              </div>
              <Button
                onClick={() => onSelect(pool.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Select Pool
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
