import { useState } from "react";
import { useSimulation } from "../../hooks/useSimulation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  Play,
  Square,
  RotateCcw,
  Settings,
  Clock,
  Users,
  Car,
  AlertCircle,
} from "lucide-react";
import {
  SimulationConfigRequest,
  SimulationRequest,
} from "../../types/simulation";

export const SimulationControls = () => {
  const {
    simulation,
    isLoading,
    error,
    createNewSimulation,
    startCurrentSimulation,
    stopCurrentSimulation,
  } = useSimulation();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<SimulationConfigRequest>({
    name: "New Simulation",
    scenario: "BALANCED",
    lambdaNorth: 2.0,
    lambdaSouth: 2.0,
    lambdaEast: 2.0,
    lambdaWest: 2.0,
    muNorth: 1.0,
    muSouth: 1.0,
    muEast: 1.0,
    muWest: 1.0,
    sigmaNorth: 3.0,
    sigmaSouth: 3.0,
    sigmaEast: 3.0,
    sigmaWest: 3.0,
    minGreenTime: 10,
    maxGreenTime: 60,
    yellowTime: 3,
    redClearanceTime: 2,
    pedestrianWeight: 0.3,
    switchingThreshold: 2.0,
    vehiclePerformanceWeight: 0.7,
    pedestrianPerformanceWeight: 0.3,
  });

  const [runConfig, setRunConfig] = useState<SimulationRequest>({
    durationSeconds: 300,
    timeStepMillis: 1000,
    realTimeMode: true,
  });

  const handleCreateSimulation = async () => {
    try {
      const simulationId = await createNewSimulation(config);
      setIsConfiguring(false);
    } catch (error) {
      console.error("Failed to create simulation:", error);
    }
  };

  const handleStartSimulation = async () => {
    if (simulation) {
      try {
        await startCurrentSimulation(simulation.simulationId, runConfig);
      } catch (error) {
        console.error("Failed to start simulation:", error);
      }
    }
  };

  const handleStopSimulation = async () => {
    if (simulation) {
      try {
        await stopCurrentSimulation(simulation.simulationId);
      } catch (error) {
        console.error("Failed to stop simulation:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING":
        return "bg-status-running";
      case "PAUSED":
        return "bg-status-paused";
      case "COMPLETED":
        return "bg-status-completed";
      case "ERROR":
        return "bg-status-error";
      default:
        return "bg-status-idle";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <Play className="h-4 w-4" />;
      case "PAUSED":
        return <Clock className="h-4 w-4" />;
      case "COMPLETED":
        return <RotateCcw className="h-4 w-4" />;
      case "ERROR":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  if (isConfiguring) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Simulation Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Simulation Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) =>
                    setConfig({ ...config, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scenario">Scenario Type</Label>
                <Select
                  value={config.scenario}
                  onValueChange={(value: any) =>
                    setConfig({ ...config, scenario: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BALANCED">Balanced Traffic</SelectItem>
                    <SelectItem value="HEAVY_NS">Heavy North-South</SelectItem>
                    <SelectItem value="RUSH_HOUR">Rush Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicle Arrival Rates (vehicles/sec)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>North: {config.lambdaNorth}</Label>
                  <Slider
                    value={[config.lambdaNorth]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, lambdaNorth: value })
                    }
                    max={10}
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>South: {config.lambdaSouth}</Label>
                  <Slider
                    value={[config.lambdaSouth]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, lambdaSouth: value })
                    }
                    max={10}
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>East: {config.lambdaEast}</Label>
                  <Slider
                    value={[config.lambdaEast]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, lambdaEast: value })
                    }
                    max={10}
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>West: {config.lambdaWest}</Label>
                  <Slider
                    value={[config.lambdaWest]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, lambdaWest: value })
                    }
                    max={10}
                    min={0}
                    step={0.1}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pedestrian Arrival Rates (pedestrians/sec)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>North: {config.muNorth}</Label>
                  <Slider
                    value={[config.muNorth]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, muNorth: value })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>South: {config.muSouth}</Label>
                  <Slider
                    value={[config.muSouth]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, muSouth: value })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>East: {config.muEast}</Label>
                  <Slider
                    value={[config.muEast]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, muEast: value })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>West: {config.muWest}</Label>
                  <Slider
                    value={[config.muWest]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, muWest: value })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">
                Traffic Light Timing (seconds)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Green Time: {config.minGreenTime}</Label>
                  <Slider
                    value={[config.minGreenTime]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, minGreenTime: value })
                    }
                    max={30}
                    min={5}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Green Time: {config.maxGreenTime}</Label>
                  <Slider
                    value={[config.maxGreenTime]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, maxGreenTime: value })
                    }
                    max={120}
                    min={30}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yellow Time: {config.yellowTime}</Label>
                  <Slider
                    value={[config.yellowTime]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, yellowTime: value })
                    }
                    max={10}
                    min={1}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Red Clearance: {config.redClearanceTime}</Label>
                  <Slider
                    value={[config.redClearanceTime]}
                    onValueChange={([value]) =>
                      setConfig({ ...config, redClearanceTime: value })
                    }
                    max={10}
                    min={1}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateSimulation} disabled={isLoading}>
                Create Simulation
              </Button>
              <Button variant="outline" onClick={() => setIsConfiguring(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Simulation Control</span>
            {simulation && (
              <Badge
                variant="outline"
                className={`${getStatusColor(simulation.status)} text-white`}
              >
                {getStatusIcon(simulation.status)}
                {simulation.status}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {simulation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Progress</Label>
                  <div className="font-medium">
                    {simulation.progress.toFixed(1)}% (
                    {simulation.currentTimeStep}/{simulation.totalTimeSteps}{" "}
                    steps)
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Update</Label>
                  <div className="font-medium">
                    {new Date(simulation.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {simulation.currentState && (
                <div>
                  <Label className="text-muted-foreground">Current Phase</Label>
                  <div className="font-medium">
                    {simulation.currentState.currentPhase} - Green Time:{" "}
                    {simulation.currentState.currentGreenTime}s
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {simulation.status === "IDLE" && (
                  <Button onClick={handleStartSimulation} disabled={isLoading}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </Button>
                )}
                {simulation.status === "RUNNING" && (
                  <Button
                    onClick={handleStopSimulation}
                    variant="destructive"
                    disabled={isLoading}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Simulation
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsConfiguring(true)}
                  disabled={simulation.status === "RUNNING"}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure New
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                No simulation loaded. Create a new simulation to get started.
              </p>
              <Button onClick={() => setIsConfiguring(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Create Simulation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {simulation && (
        <Card>
          <CardHeader>
            <CardTitle>Run Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  value={runConfig.durationSeconds}
                  onChange={(e) =>
                    setRunConfig({
                      ...runConfig,
                      durationSeconds: parseInt(e.target.value) || 300,
                    })
                  }
                  min={1}
                  max={3600}
                />
              </div>
              <div className="space-y-2">
                <Label>Time Step (ms)</Label>
                <Input
                  type="number"
                  value={runConfig.timeStepMillis}
                  onChange={(e) =>
                    setRunConfig({
                      ...runConfig,
                      timeStepMillis: parseInt(e.target.value) || 1000,
                    })
                  }
                  min={100}
                  max={10000}
                  step={100}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="realtime"
                checked={runConfig.realTimeMode}
                onCheckedChange={(checked) =>
                  setRunConfig({ ...runConfig, realTimeMode: checked })
                }
              />
              <Label htmlFor="realtime">Real-time mode</Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
