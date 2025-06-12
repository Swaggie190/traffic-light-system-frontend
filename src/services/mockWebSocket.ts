import { store } from "../store";
import {
  setTrafficState,
  setTrafficLights,
  setConnectionStatus,
} from "../store/slices/simulationSlice";
import {
  TrafficStateResponse,
  TrafficLightStatus,
} from "../types/simulation";

interface SimulationState {
  currentPhase: "PHASE_1" | "PHASE_2";
  phaseStartTime: number;
  greenDuration: number;
  vehicleQueues: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  pedestrianQueues: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  timeStep: number;
}

export class MockWebSocketService {
  private updateInterval: NodeJS.Timeout | null = null;
  private isActive = false;
  private simulationState: SimulationState;
  private readonly UPDATE_INTERVAL = 1000; // 1 second updates
  private readonly MIN_GREEN_TIME = 15; // seconds
  private readonly MAX_GREEN_TIME = 45; // seconds

  constructor() {
    // Initialize simulation state
    this.simulationState = {
      currentPhase: "PHASE_1",
      phaseStartTime: Date.now(),
      greenDuration: 30,
      vehicleQueues: {
        north: 5,
        south: 7,
        east: 3,
        west: 4,
      },
      pedestrianQueues: {
        north: 2,
        south: 3,
        east: 1,
        west: 2,
      },
      timeStep: 0,
    };

    // Simulate connection after a short delay
    setTimeout(() => {
      store.dispatch(setConnectionStatus(true));
      console.log("Mock WebSocket connected");
    }, 1000);
  }

  public connect() {
    if (!this.isActive) {
      this.isActive = true;
      store.dispatch(setConnectionStatus(true));
      console.log("Mock WebSocket connecting...");
    }
  }

  public disconnect() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isActive = false;
    store.dispatch(setConnectionStatus(false));
    console.log("Mock WebSocket disconnected");
  }

  public subscribeToSimulation(simulationId: string) {
    if (!this.isActive) {
      console.warn("Mock WebSocket not connected, cannot subscribe");
      return;
    }

    console.log(`Mock WebSocket subscribing to simulation ${simulationId}`);

    // Start the simulation loop
    this.updateInterval = setInterval(() => {
      this.updateSimulation();
      const trafficState = this.generateTrafficState();
      const trafficLights = this.generateTrafficLights();

      // Dispatch updates to Redux store
      store.dispatch(setTrafficState(trafficState));
      store.dispatch(setTrafficLights(trafficLights));

      console.log("Mock WebSocket: Updated traffic state", {
        phase: this.simulationState.currentPhase,
        northSouthLight: trafficLights.northSouth.color,
        eastWestLight: trafficLights.eastWest.color,
        vehicles: this.simulationState.vehicleQueues,
      });
    }, this.UPDATE_INTERVAL);

    // Send initial data immediately
    setTimeout(() => {
      const trafficState = this.generateTrafficState();
      const trafficLights = this.generateTrafficLights();

      store.dispatch(setTrafficState(trafficState));
      store.dispatch(setTrafficLights(trafficLights));
    }, 500);
  }

  private updateSimulation() {
    this.simulationState.timeStep++;
    const currentTime = Date.now();
    const phaseElapsedTime = (currentTime - this.simulationState.phaseStartTime) / 1000;

    // Check if we should switch phases
    if (phaseElapsedTime >= this.simulationState.greenDuration) {
      this.switchPhase();
    } else {
      // Update vehicle queues based on current phase
      this.updateVehicleQueues();
      this.updatePedestrianQueues();
    }
  }

  private switchPhase() {
    // Switch to the other phase
    this.simulationState.currentPhase = 
      this.simulationState.currentPhase === "PHASE_1" ? "PHASE_2" : "PHASE_1";
    
    this.simulationState.phaseStartTime = Date.now();
    
    // Calculate new green duration based on traffic density
    const phase1Density = this.simulationState.vehicleQueues.north + this.simulationState.vehicleQueues.south;
    const phase2Density = this.simulationState.vehicleQueues.east + this.simulationState.vehicleQueues.west;
    
    const totalDensity = phase1Density + phase2Density;
    const currentPhaseDensity = this.simulationState.currentPhase === "PHASE_1" ? phase1Density : phase2Density;
    
    // Adaptive green time calculation
    if (totalDensity > 0) {
      const ratio = currentPhaseDensity / totalDensity;
      this.simulationState.greenDuration = Math.max(
        this.MIN_GREEN_TIME,
        Math.min(this.MAX_GREEN_TIME, this.MIN_GREEN_TIME + (this.MAX_GREEN_TIME - this.MIN_GREEN_TIME) * ratio)
      );
    } else {
      this.simulationState.greenDuration = this.MIN_GREEN_TIME;
    }

    console.log(`🚦 Phase switched to ${this.simulationState.currentPhase}, duration: ${this.simulationState.greenDuration}s`);
  }

  private updateVehicleQueues() {
    const arrival_rate = 0.3; // vehicles per second
    const service_rate = 0.5; // vehicles per second when green

    if (this.simulationState.currentPhase === "PHASE_1") {
      // North-South green, East-West red
      // North and South can clear vehicles
      this.simulationState.vehicleQueues.north = Math.max(0, 
        this.simulationState.vehicleQueues.north + this.randomArrival(arrival_rate) - this.randomService(service_rate)
      );
      this.simulationState.vehicleQueues.south = Math.max(0, 
        this.simulationState.vehicleQueues.south + this.randomArrival(arrival_rate) - this.randomService(service_rate)
      );
      
      // East and West accumulate vehicles
      this.simulationState.vehicleQueues.east = Math.min(15, 
        this.simulationState.vehicleQueues.east + this.randomArrival(arrival_rate)
      );
      this.simulationState.vehicleQueues.west = Math.min(15, 
        this.simulationState.vehicleQueues.west + this.randomArrival(arrival_rate)
      );
    } else {
      // East-West green, North-South red
      // East and West can clear vehicles
      this.simulationState.vehicleQueues.east = Math.max(0, 
        this.simulationState.vehicleQueues.east + this.randomArrival(arrival_rate) - this.randomService(service_rate)
      );
      this.simulationState.vehicleQueues.west = Math.max(0, 
        this.simulationState.vehicleQueues.west + this.randomArrival(arrival_rate) - this.randomService(service_rate)
      );
      
      // North and South accumulate vehicles
      this.simulationState.vehicleQueues.north = Math.min(15, 
        this.simulationState.vehicleQueues.north + this.randomArrival(arrival_rate)
      );
      this.simulationState.vehicleQueues.south = Math.min(15, 
        this.simulationState.vehicleQueues.south + this.randomArrival(arrival_rate)
      );
    }
  }

  private updatePedestrianQueues() {
    const ped_arrival_rate = 0.1; // pedestrians per second
    
    // Pedestrians can cross perpendicular to vehicle traffic
    if (this.simulationState.currentPhase === "PHASE_1") {
      // N-S vehicles green, E-W pedestrians can cross
      this.simulationState.pedestrianQueues.east = Math.max(0, 
        this.simulationState.pedestrianQueues.east - this.simulationState.pedestrianQueues.east
      );
      this.simulationState.pedestrianQueues.west = Math.max(0, 
        this.simulationState.pedestrianQueues.west - this.simulationState.pedestrianQueues.west
      );
      
      // N-S pedestrians accumulate
      this.simulationState.pedestrianQueues.north = Math.min(8, 
        this.simulationState.pedestrianQueues.north + this.randomArrival(ped_arrival_rate)
      );
      this.simulationState.pedestrianQueues.south = Math.min(8, 
        this.simulationState.pedestrianQueues.south + this.randomArrival(ped_arrival_rate)
      );
    } else {
      // E-W vehicles green, N-S pedestrians can cross
      this.simulationState.pedestrianQueues.north = Math.max(0, 
        this.simulationState.pedestrianQueues.north - this.simulationState.pedestrianQueues.north
      );
      this.simulationState.pedestrianQueues.south = Math.max(0, 
        this.simulationState.pedestrianQueues.south - this.simulationState.pedestrianQueues.south
      );
      
      // E-W pedestrians accumulate
      this.simulationState.pedestrianQueues.east = Math.min(8, 
        this.simulationState.pedestrianQueues.east + this.randomArrival(ped_arrival_rate)
      );
      this.simulationState.pedestrianQueues.west = Math.min(8, 
        this.simulationState.pedestrianQueues.west + this.randomArrival(ped_arrival_rate)
      );
    }
  }

  private randomArrival(rate: number): number {
    // Poisson-like arrival: probability of arrival in this time step
    return Math.random() < rate ? 1 : 0;
  }

  private randomService(rate: number): number {
    // Service rate: how many vehicles can be processed
    return Math.random() < rate ? 1 : 0;
  }

  private generateTrafficState(): TrafficStateResponse {
    return {
      timeStep: this.simulationState.timeStep,
      timestamp: new Date().toISOString(),
      vehiclesNorth: this.simulationState.vehicleQueues.north,
      vehiclesSouth: this.simulationState.vehicleQueues.south,
      vehiclesEast: this.simulationState.vehicleQueues.east,
      vehiclesWest: this.simulationState.vehicleQueues.west,
      pedestriansNorth: this.simulationState.pedestrianQueues.north,
      pedestriansSouth: this.simulationState.pedestrianQueues.south,
      pedestriansEast: this.simulationState.pedestrianQueues.east,
      pedestriansWest: this.simulationState.pedestrianQueues.west,
      currentPhase: this.simulationState.currentPhase,
      currentGreenTime: Math.floor((Date.now() - this.simulationState.phaseStartTime) / 1000),
      calculatedGreenTime: this.simulationState.greenDuration,
      phase1Density: (this.simulationState.vehicleQueues.north + this.simulationState.vehicleQueues.south) / 15,
      phase2Density: (this.simulationState.vehicleQueues.east + this.simulationState.vehicleQueues.west) / 15,
    };
  }

  private generateTrafficLights(): TrafficLightStatus {
    const currentGreenTime = Math.floor((Date.now() - this.simulationState.phaseStartTime) / 1000);
    const remainingGreenTime = Math.max(0, this.simulationState.greenDuration - currentGreenTime);
    
    return {
      simulationId: "mock-sim-123",
      timeStep: this.simulationState.timeStep,
      timestamp: new Date().toISOString(),
      northSouth: {
        color: this.simulationState.currentPhase === "PHASE_1" ? "GREEN" : "RED",
        duration: remainingGreenTime,
        pedestrianCrossing: this.simulationState.currentPhase === "PHASE_2",
      },
      eastWest: {
        color: this.simulationState.currentPhase === "PHASE_2" ? "GREEN" : "RED",
        duration: remainingGreenTime,
        pedestrianCrossing: this.simulationState.currentPhase === "PHASE_1",
      },
      currentGreenTime,
      remainingGreenTime,
      nextPhaseCountdown: remainingGreenTime,
      northSouthDensity: (this.simulationState.vehicleQueues.north + this.simulationState.vehicleQueues.south) / 15,
      eastWestDensity: (this.simulationState.vehicleQueues.east + this.simulationState.vehicleQueues.west) / 15,
    };
  }

  public unsubscribeFromSimulation(simulationId: string) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log(`Mock WebSocket unsubscribed from simulation ${simulationId}`);
  }

  public isConnected(): boolean {
    return this.isActive;
  }
}

// Create a singleton instance
export const mockWebSocketService = new MockWebSocketService();