import { OverviewCards } from "../components/dashboard/OverviewCards";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Activity, TrendingUp, Users, Car } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor traffic light simulation performance and system status
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Connection</span>
              <Badge
                variant="outline"
                className="text-green-700 border-green-200"
              >
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">WebSocket Connection</span>
              <Badge
                variant="outline"
                className="text-green-700 border-green-200"
              >
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">3D Renderer</span>
              <Badge
                variant="outline"
                className="text-green-700 border-green-200"
              >
                60 FPS
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backend Status</span>
              <Badge
                variant="outline"
                className="text-green-700 border-green-200"
              >
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-xs text-muted-foreground">
                  Total Vehicles Processed
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-xs text-muted-foreground">
                  Average Efficiency
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">2.3s</div>
                <div className="text-xs text-muted-foreground">
                  Avg Wait Time
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">4.7</div>
                <div className="text-xs text-muted-foreground">
                  Performance Score
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5" />
              3D Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Real-time 3D traffic intersection with animated vehicles and
              traffic lights.
            </p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Four-way intersection</li>
              <li>• Animated vehicles (cars, trucks, buses)</li>
              <li>• Real-time light changes</li>
              <li>• 60 FPS performance</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Real-time Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Control and monitor traffic simulations with live data updates.
            </p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• WebSocket live updates</li>
              <li>• Start/stop simulations</li>
              <li>• Parameter adjustment</li>
              <li>• Performance metrics</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze simulation performance and compare different scenarios.
            </p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Performance comparison</li>
              <li>• Trend analysis</li>
              <li>• Optimization insights</li>
              <li>• Data export</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
