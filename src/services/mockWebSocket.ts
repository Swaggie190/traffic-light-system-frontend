import { store } from "../store";
import {
  setTrafficState,
  setTrafficLights,
  setConnectionStatus,
} from "../store/slices/simulationSlice";
import {
  generateMockTrafficState,
  generateMockTrafficLights,
} from "./mockData";

export class MockWebSocketService {
  private updateInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  constructor() {
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

    // Start sending mock updates every 2 seconds
    this.updateInterval = setInterval(() => {
      const mockTrafficState = generateMockTrafficState();
      const mockTrafficLights = generateMockTrafficLights();

      // Dispatch updates to Redux store
      store.dispatch(setTrafficState(mockTrafficState));
      store.dispatch(setTrafficLights(mockTrafficLights));

      console.log("Mock WebSocket: Sent traffic update");
    }, 2000);

    // Send initial data immediately
    setTimeout(() => {
      const mockTrafficState = generateMockTrafficState();
      const mockTrafficLights = generateMockTrafficLights();

      store.dispatch(setTrafficState(mockTrafficState));
      store.dispatch(setTrafficLights(mockTrafficLights));
    }, 500);
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
