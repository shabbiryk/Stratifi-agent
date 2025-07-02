"use client";

import { motion } from "framer-motion";
import { Star, Gift, Users, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts";

export default function PointsPage() {
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Rewards & Points
          </h1>
          <p className="text-slate-300 text-lg">
            Earn points and unlock exclusive rewards through your DeFi
            activities
          </p>
        </motion.div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">12,450</p>
                <p className="text-sm text-slate-400">Total Points</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">Gold</p>
                <p className="text-sm text-slate-400">Current Tier</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">23</p>
                <p className="text-sm text-slate-400">Referrals</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-sm text-slate-400">Rewards Claimed</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Coming Soon Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Points System</CardTitle>
            <CardDescription className="text-slate-400">
              Earn rewards for your DeFi activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <Star className="h-16 w-16 text-yellow-400 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Rewards Coming Soon
              </h3>
              <p className="text-slate-400 mb-6">
                We're building an exciting points and rewards system. Stay tuned
                for updates!
              </p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Get Notified
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
