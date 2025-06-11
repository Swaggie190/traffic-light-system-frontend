import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { RootState, AppDispatch } from "../../store";
import { fetchDashboardSummary } from "../../store/slices/dashboardSlice";
import {
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Car,
  BarChart3,
  Zap,
} from "lucide-react";

export const OverviewCards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, isLoading } = useSelector(
    (state: RootState) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    const interval = setInterval(() => {
      dispatch(fetchDashboardSummary());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Simulations",
      value: summary.totalSimulations,
      icon: Activity,
      description: `${summary.activeSimulations} active, ${summary.completedSimulations} completed`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Simulations",
      value: summary.activeSimulations,
      icon: Clock,
      description: "Currently running",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Performance",
      value: `${summary.averagePerformanceIndex.toFixed(2)}`,
      icon: TrendingUp,
      description: "Combined performance index",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Best Scenario",
      value: summary.bestPerformingScenario,
      icon: CheckCircle,
      description: "Top performing configuration",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {summary.mostRecentSimulation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Most Recent Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">
                  {summary.mostRecentSimulation.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summary.mostRecentSimulation.scenario}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">
                  ID: {summary.mostRecentSimulation.simulationId}
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: {summary.mostRecentSimulation.status}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">
                  Created:{" "}
                  {new Date(
                    summary.mostRecentSimulation.createdAt,
                  ).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(
                    summary.mostRecentSimulation.createdAt,
                  ).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {summary.recentPerformance && summary.recentPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.recentPerformance
                .slice(0, 5)
                .map((performance, index) => (
                  <div
                    key={performance.simulationId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Simulation {performance.simulationId.slice(-8)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(
                            performance.completedAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {performance.performanceIndex.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Performance Index
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress
                          value={Math.min(
                            performance.performanceIndex * 20,
                            100,
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(summary.lastUpdate).toLocaleString()}
      </div>
    </div>
  );
};
