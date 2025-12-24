"use client";

import { api } from "@/trpc/react";
import { Send, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple" | "red";
  badge?: string;
  badgeColor?: "red" | "yellow";
  subtitle?: string;
}

const colorStyles = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
};

function StatCard({ label, value, icon, color, badge, badgeColor = "red", subtitle }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={cn("p-2 rounded-lg", colorStyles[color])}>{icon}</span>
          {badge && (
            <Badge variant={badgeColor === "red" ? "destructive" : "secondary"} className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {subtitle && <div className="text-xs text-muted-foreground/70 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface DashboardStatsProps {
  period?: "week" | "month" | "all";
}

export function DashboardStats({ period = "week" }: DashboardStatsProps) {
  const { data: stats, isLoading } = api.review.getDashboardStats.useQuery({ period });

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Sent"
        value={stats.sent}
        icon={<Send className="w-5 h-5" />}
        color="blue"
      />
      <StatCard
        label="Approved"
        value={stats.approved}
        icon={<CheckCircle className="w-5 h-5" />}
        color="green"
        subtitle={stats.approvalRate !== null ? `${stats.approvalRate}% rate` : undefined}
      />
      <StatCard
        label="Pending"
        value={stats.pending}
        icon={<Clock className="w-5 h-5" />}
        color="yellow"
        badge={stats.overdue > 0 ? `${stats.overdue} overdue` : undefined}
        badgeColor="red"
      />
      <StatCard
        label="Avg. Time"
        value={stats.avgTimeDays !== null ? `${stats.avgTimeDays}d` : "—"}
        icon={<TrendingUp className="w-5 h-5" />}
        color="purple"
        subtitle={stats.changesRequested > 0 ? `${stats.changesRequested} need changes` : undefined}
      />
    </div>
  );
}
