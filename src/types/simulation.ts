// Request Types
export interface SimulationConfigRequest {
  name: string;
  scenario: "BALANCED" | "HEAVY_NS" | "RUSH_HOUR";
  lambdaNorth: number; // Vehicle arrival rate North (0.0-10.0)
  lambdaSouth: number; // Vehicle arrival rate South (0.0-10.0)
  lambdaEast: number; // Vehicle arrival rate East (0.0-10.0)
  lambdaWest: number; // Vehicle arrival rate West (0.0-10.0)
  muNorth: number; // Pedestrian arrival rate North (0.0-5.0)
  muSouth: number; // Pedestrian arrival rate South (0.0-5.0)
  muEast: number; // Pedestrian arrival rate East (0.0-5.0)
  muWest: number; // Pedestrian arrival rate West (0.0-5.0)
  sigmaNorth: number; // Service rate North (0.1-10.0)
  sigmaSouth: number; // Service rate South (0.1-10.0)
  sigmaEast: number; // Service rate East (0.1-10.0)
  sigmaWest: number; // Service rate West (0.1-10.0)
  minGreenTime: number; // Min green time (5-30)
  maxGreenTime: number; // Max green time (30-120)
  yellowTime: number; // Yellow duration (1-10)
  redClearanceTime: number; // Red clearance (1-10)
  pedestrianWeight: number; // Pedestrian weight (0.0-1.0)
  switchingThreshold: number; // Switching threshold (1.0-5.0)
  vehiclePerformanceWeight: number; // Vehicle weight (0.0-1.0)
  pedestrianPerformanceWeight: number; // Pedestrian weight (0.0-1.0)
}

export interface SimulationRequest {
  durationSeconds: number; // Simulation duration (1-3600)
  timeStepMillis: number; // Time step interval (100-10000)
  realTimeMode: boolean; // Real-time or fast mode
}

export interface SensorDataRequest {
  vehiclesNorth: number;
  vehiclesSouth: number;
  vehiclesEast: number;
  vehiclesWest: number;
  pedestriansNorth: number;
  pedestriansSouth: number;
  pedestriansEast: number;
  pedestriansWest: number;
}

// Response Types
export interface SimulationStatusResponse {
  simulationId: string;
  status: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "ERROR";
  currentTimeStep: number;
  totalTimeSteps: number;
  progress: number; // Percentage (0-100)
  currentState: TrafficStateResponse;
  message?: string;
  lastUpdate: string; // ISO date string
}

export interface TrafficStateResponse {
  timeStep: number;
  timestamp: string; // ISO date string
  vehiclesNorth: number;
  vehiclesSouth: number;
  vehiclesEast: number;
  vehiclesWest: number;
  pedestriansNorth: number;
  pedestriansSouth: number;
  pedestriansEast: number;
  pedestriansWest: number;
  currentPhase: "PHASE_1" | "PHASE_2";
  currentGreenTime: number;
  calculatedGreenTime: number;
  phase1Density: number;
  phase2Density: number;
}

export interface TrafficLightStatus {
  simulationId: string;
  timeStep: number;
  timestamp: string;
  northSouth: {
    color: "RED" | "YELLOW" | "GREEN";
    duration: number;
    pedestrianCrossing: boolean;
  };
  eastWest: {
    color: "RED" | "YELLOW" | "GREEN";
    duration: number;
    pedestrianCrossing: boolean;
  };
  currentGreenTime: number;
  remainingGreenTime: number;
  nextPhaseCountdown: number;
  northSouthDensity: number;
  eastWestDensity: number;
}

export interface PerformanceMetricsResponse {
  simulationId: string;
  totalTimeSteps: number;
  averageVehicleWaitingTime: number;
  averagePedestrianWaitingTime: number;
  combinedPerformanceIndex: number;
  totalVehiclesProcessed: number;
  totalPedestriansProcessed: number;
  phase1TotalTime: number;
  phase2TotalTime: number;
  calculatedAt: string; // ISO date string
}

export interface DashboardSummary {
  totalSimulations: number;
  activeSimulations: number;
  completedSimulations: number;
  averagePerformanceIndex: number;
  bestPerformingScenario: string;
  mostRecentSimulation: SimulationConfigResponse;
  recentPerformance: QuickStats[];
  lastUpdate: string; // ISO date string
}

export interface SimulationConfigResponse extends SimulationConfigRequest {
  simulationId: string;
  createdAt: string;
  status: string;
}

export interface QuickStats {
  simulationId: string;
  performanceIndex: number;
  completedAt: string;
}

export interface ScenarioTemplate {
  name: string;
  description: string;
  scenario: "BALANCED" | "HEAVY_NS" | "RUSH_HOUR";
  lambdaNorth: number;
  lambdaSouth: number;
  lambdaEast: number;
  lambdaWest: number;
  muNorth: number;
  muSouth: number;
  muEast: number;
  muWest: number;
  sigmaNorth: number;
  sigmaSouth: number;
  sigmaEast: number;
  sigmaWest: number;
  minGreenTime: number;
  maxGreenTime: number;
  yellowTime: number;
  redClearanceTime: number;
  pedestrianWeight: number;
  switchingThreshold: number;
  vehiclePerformanceWeight: number;
  pedestrianPerformanceWeight: number;
}

export interface ComparisonReport {
  simulations: SimulationConfigResponse[];
  metrics: PerformanceMetricsResponse[];
  insights: string[];
}

export interface SensorStatusResponse {
  sensorId: string;
  status: "ACTIVE" | "INACTIVE" | "ERROR";
  lastUpdate: string;
  currentData: SensorDataRequest;
}

// WebSocket Message Types
export interface WebSocketTopics {
  trafficUpdates: string; // `/topic/simulation/${simulationId}`
  statusUpdates: string; // `/topic/simulation/${simulationId}/status`
  systemMessages: string; // '/topic/system'
}

export interface TrafficUpdateMessage extends TrafficStateResponse {}

export interface StatusUpdateMessage {
  status: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "ERROR";
  message: string;
  timestamp: number;
}

export interface SystemMessage {
  message: string;
  timestamp: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp: string; // ISO date string
}

// UI State Types
export interface SimulationState {
  currentSimulation: SimulationStatusResponse | null;
  trafficLights: TrafficLightStatus | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardState {
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
}
