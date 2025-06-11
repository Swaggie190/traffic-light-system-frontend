import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Settings,
  Play,
  Clock,
  Users,
  Car,
  TrendingUp,
  Zap,
} from "lucide-react";

const scenarioTemplates = [
  {
    name: "Balanced Traffic",
    description:
      "Standard traffic flow with equal distribution in all directions",
    scenario: "BALANCED",
    icon: Settings,
    color: "bg-blue-50 text-blue-600",
    stats: {
      vehicleRate: "2.0/sec",
      pedestrianRate: "1.0/sec",
      efficiency: "85%",
    },
  },
  {
    name: "Heavy North-South",
    description: "Increased traffic flow on North-South corridor",
    scenario: "HEAVY_NS",
    icon: TrendingUp,
    color: "bg-orange-50 text-orange-600",
    stats: {
      vehicleRate: "4.0/sec",
      pedestrianRate: "1.5/sec",
      efficiency: "78%",
    },
  },
  {
    name: "Rush Hour",
    description: "Peak traffic conditions with high density in all directions",
    scenario: "RUSH_HOUR",
    icon: Zap,
    color: "bg-red-50 text-red-600",
    stats: {
      vehicleRate: "6.0/sec",
      pedestrianRate: "2.0/sec",
      efficiency: "72%",
    },
  },
];

export default function Scenarios() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scenarios</h1>
        <p className="text-muted-foreground">
          Pre-configured traffic scenarios and custom simulation templates
        </p>
      </div>

      {/* Scenario Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Preset Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarioTemplates.map((scenario) => (
            <Card
              key={scenario.name}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${scenario.color}`}>
                    <scenario.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div>{scenario.name}</div>
                    <Badge variant="outline" className="text-xs">
                      {scenario.scenario}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Car className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium">
                      {scenario.stats.vehicleRate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vehicles
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-xs font-medium">
                      {scenario.stats.pedestrianRate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pedestrians
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-xs font-medium">
                      {scenario.stats.efficiency}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Efficiency
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Quick Start
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Scenarios */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Scenarios</h2>
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Custom Scenario Builder
              </h3>
              <p className="text-muted-foreground mb-4">
                Create and save your own traffic scenarios with custom
                parameters
              </p>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Create Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scenarios */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Scenarios</h2>
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recent Scenarios</h3>
              <p className="text-muted-foreground">
                Your recently used scenarios will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
