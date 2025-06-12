import { useState } from "react";
import { TrafficVisualization } from "../components/simulation/TrafficVisualization";
import { SimulationControls } from "../components/simulation/SimulationControls";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  Play,
  Users,
  Car,
  Clock,
  BarChart3,
  Activity,
  Navigation,
} from "lucide-react";
import { WebSocketDebugger } from "../components/WebSocketDebugger";

const LiveMetrics = () => {
  const simulation = useSelector(
    (state: RootState) => state.simulation.currentSimulation,
  );
  const trafficLights = useSelector(
    (state: RootState) => state.simulation.trafficLights,
  );

  if (!simulation?.currentState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Live Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start a simulation to view live metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  const state = simulation.currentState;
  const totalVehicles =
    state.vehiclesNorth +
    state.vehiclesSouth +
    state.vehiclesEast +
    state.vehiclesWest;
  const totalPedestrians =
    state.pedestriansNorth +
    state.pedestriansSouth +
    state.pedestriansEast +
    state.pedestriansWest;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Live Metrics
            <Badge
              variant="outline"
              className="text-green-700 border-green-200"
            >
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Vehicles</span>
              </div>
              <div className="text-2xl font-bold">{totalVehicles}</div>
              <div className="text-xs text-muted-foreground">
                Currently queued
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Total Pedestrians</span>
              </div>
              <div className="text-2xl font-bold">{totalPedestrians}</div>
              <div className="text-xs text-muted-foreground">
                Waiting to cross
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Current Phase</span>
              </div>
              <div className="text-2xl font-bold">{state.currentPhase}</div>
              <div className="text-xs text-muted-foreground">
                {state.currentGreenTime}s elapsed
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Time Step</span>
              </div>
              <div className="text-2xl font-bold">{state.timeStep}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(state.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>North</span>
                  <span>{state.vehiclesNorth}</span>
                </div>
                <Progress
                  value={
                    (state.vehiclesNorth / Math.max(totalVehicles, 1)) * 100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>South</span>
                  <span>{state.vehiclesSouth}</span>
                </div>
                <Progress
                  value={
                    (state.vehiclesSouth / Math.max(totalVehicles, 1)) * 100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>East</span>
                  <span>{state.vehiclesEast}</span>
                </div>
                <Progress
                  value={
                    (state.vehiclesEast / Math.max(totalVehicles, 1)) * 100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>West</span>
                  <span>{state.vehiclesWest}</span>
                </div>
                <Progress
                  value={
                    (state.vehiclesWest / Math.max(totalVehicles, 1)) * 100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pedestrian Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>North</span>
                  <span>{state.pedestriansNorth}</span>
                </div>
                <Progress
                  value={
                    (state.pedestriansNorth / Math.max(totalPedestrians, 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>South</span>
                  <span>{state.pedestriansSouth}</span>
                </div>
                <Progress
                  value={
                    (state.pedestriansSouth / Math.max(totalPedestrians, 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>East</span>
                  <span>{state.pedestriansEast}</span>
                </div>
                <Progress
                  value={
                    (state.pedestriansEast / Math.max(totalPedestrians, 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>West</span>
                  <span>{state.pedestriansWest}</span>
                </div>
                <Progress
                  value={
                    (state.pedestriansWest / Math.max(totalPedestrians, 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {trafficLights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Traffic Light Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-sm font-medium">North-South Direction</div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      trafficLights.northSouth.color === "RED"
                        ? "bg-traffic-red-500"
                        : trafficLights.northSouth.color === "YELLOW"
                          ? "bg-traffic-yellow-500"
                          : "bg-traffic-green-500"
                    }`}
                  />
                  <span className="font-medium">
                    {trafficLights.northSouth.color}
                  </span>
                  <Badge variant="outline">
                    {trafficLights.northSouth.duration}s
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Pedestrian crossing:{" "}
                  {trafficLights.northSouth.pedestrianCrossing ? "Yes" : "No"}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-sm font-medium">East-West Direction</div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      trafficLights.eastWest.color === "RED"
                        ? "bg-traffic-red-500"
                        : trafficLights.eastWest.color === "YELLOW"
                          ? "bg-traffic-yellow-500"
                          : "bg-traffic-green-500"
                    }`}
                  />
                  <span className="font-medium">
                    {trafficLights.eastWest.color}
                  </span>
                  <Badge variant="outline">
                    {trafficLights.eastWest.duration}s
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Pedestrian crossing:{" "}
                  {trafficLights.eastWest.pedestrianCrossing ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Remaining Green Time:</span>
                <span className="font-medium">
                  {trafficLights.remainingGreenTime}s
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Next Phase Countdown:</span>
                <span className="font-medium">
                  {trafficLights.nextPhaseCountdown}s
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function Simulation() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulation</h1>
        <p className="text-muted-foreground">
          Create, control, and visualize traffic light simulations in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 3D Visualization - Takes up 2 columns on large screens */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                3D Traffic Intersection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrafficVisualization />
            </CardContent>
          </Card>
        </div>

        {/* Controls - Takes up 1 column */}
        <div className="space-y-6">
          <SimulationControls />
        </div>
      </div>

      {/* Live Metrics */}
      <LiveMetrics />
      <WebSocketDebugger />
    </div>
  );
}
