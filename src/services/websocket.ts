import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  TrafficUpdateMessage,
  StatusUpdateMessage,
  SystemMessage,
} from "../types/simulation";
import { store } from "../store";
import {
  setTrafficState,
  setTrafficLights,
  setConnectionStatus,
  updateSimulationStatus,
} from "../store/slices/simulationSlice";
import { mockWebSocketService } from "./mockWebSocket";

const USE_MOCK_WEBSOCKET = false; // Set to true to use mock data
const WEBSOCKET_URL = "http://localhost:8080/api/ws";

export class WebSocketService {
  private client: Client | null = null;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private useMock: boolean = false;
  private subscriptions: Map<string, any> = new Map();

  constructor() {
    console.log("🔧 Initializing WebSocket service");
    console.log(`📡 USE_MOCK_WEBSOCKET: ${USE_MOCK_WEBSOCKET}`);
    
    if (USE_MOCK_WEBSOCKET) {
      this.useMock = true;
      console.log("🎭 Using mock WebSocket service - skipping real WebSocket initialization");
    } else {
      console.log("🌐 Initializing real WebSocket service");
      console.log(`🔗 Backend URL: ${WEBSOCKET_URL}`);
      this.initializeClient();
    }
  }

  private initializeClient() {
    try {
      console.log("🏗️ Creating STOMP client with SockJS transport");
      
      this.client = new Client({
        webSocketFactory: () => {
          console.log(`🔌 Creating SockJS connection to: ${WEBSOCKET_URL}`);
          return new SockJS(WEBSOCKET_URL);
        },
        debug: (str) => {
          console.log("📨 STOMP:", str);
        },
        reconnectDelay: this.reconnectInterval,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectionTimeout: 10000,
      });

      // Connection success handler
      this.client.onConnect = (frame) => {
        console.log("✅ WebSocket connected successfully!");
        console.log("📋 Connection frame:", frame);
        this.reconnectAttempts = 0;
        store.dispatch(setConnectionStatus(true));
        this.subscribeToSystemMessages();
      };

      // Disconnection handler
      this.client.onDisconnect = (frame) => {
        console.log("❌ WebSocket disconnected");
        console.log("📋 Disconnect frame:", frame);
        store.dispatch(setConnectionStatus(false));
      };

      // STOMP error handler
      this.client.onStompError = (frame) => {
        console.error("💥 STOMP Error:", frame.headers["message"]);
        console.error("📋 Error frame:", frame);
        store.dispatch(setConnectionStatus(false));
        this.handleReconnection();
      };

      // WebSocket error handler
      this.client.onWebSocketError = (error) => {
        console.error("🌐 WebSocket Error:", error);
        store.dispatch(setConnectionStatus(false));
        this.handleReconnection();
      };

      // WebSocket close handler
      this.client.onWebSocketClose = (event) => {
        console.log("🔒 WebSocket closed:", event);
        store.dispatch(setConnectionStatus(false));
      };

    } catch (error) {
      console.error("💥 Failed to create WebSocket client:", error);
      this.fallbackToMock();
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectInterval}ms`
      );
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error("💀 Max reconnection attempts reached, falling back to mock");
      this.fallbackToMock();
    }
  }

  private fallbackToMock() {
    console.log("🎭 Falling back to mock WebSocket service");
    this.useMock = true;
    this.client?.deactivate();
    this.client = null;
    mockWebSocketService.connect();
  }

  public connect() {
    console.log("🔌 Attempting to connect...");
    
    if (this.useMock) {
      console.log("🎭 Using mock WebSocket");
      mockWebSocketService.connect();
      return;
    }

    if (!this.client) {
      console.error("❌ No WebSocket client initialized");
      this.fallbackToMock();
      return;
    }

    if (!this.client.connected) {
      try {
        console.log("🚀 Activating WebSocket client...");
        this.client.activate();
      } catch (error) {
        console.error("💥 Failed to activate WebSocket client:", error);
        this.fallbackToMock();
      }
    } else {
      console.log("✅ WebSocket already connected");
    }
  }

  public disconnect() {
    console.log("🔌 Disconnecting WebSocket...");
    
    if (this.useMock) {
      mockWebSocketService.disconnect();
      return;
    }

    // Clear all subscriptions
    this.subscriptions.clear();

    if (this.client && this.client.connected) {
      this.client.deactivate();
    }
    
    store.dispatch(setConnectionStatus(false));
  }

  public subscribeToSimulation(simulationId: string) {
    console.log(`📡 Subscribing to simulation: ${simulationId}`);
    
    if (this.useMock) {
      console.log("🎭 Using mock subscription");
      mockWebSocketService.subscribeToSimulation(simulationId);
      return;
    }

    if (!this.client || !this.client.connected) {
      console.warn("⚠️ WebSocket not connected, falling back to mock");
      this.fallbackToMock();
      mockWebSocketService.subscribeToSimulation(simulationId);
      return;
    }

    try {
      // Subscribe to traffic state updates
      const trafficTopic = `/topic/simulation/${simulationId}`;
      console.log(`📥 Subscribing to traffic updates: ${trafficTopic}`);
      
      const trafficSub = this.client.subscribe(trafficTopic, (message) => {
        try {
          console.log("📥 Received traffic update:", message.body);
          const trafficUpdate: TrafficUpdateMessage = JSON.parse(message.body);
          
          // Dispatch traffic state
          store.dispatch(setTrafficState(trafficUpdate));
          
          // Also create traffic lights status from the traffic update
          const trafficLights = this.createTrafficLightsFromState(trafficUpdate, simulationId);
          store.dispatch(setTrafficLights(trafficLights));
          
        } catch (error) {
          console.error("💥 Error parsing traffic update:", error);
        }
      });

      // Subscribe to simulation status updates
      const statusTopic = `/topic/simulation/${simulationId}/status`;
      console.log(`📥 Subscribing to status updates: ${statusTopic}`);
      
      const statusSub = this.client.subscribe(statusTopic, (message) => {
        try {
          console.log("📥 Received status update:", message.body);
          const statusUpdate: StatusUpdateMessage = JSON.parse(message.body);
          store.dispatch(
            updateSimulationStatus({
              status: statusUpdate.status,
              message: statusUpdate.message,
              lastUpdate: new Date(statusUpdate.timestamp).toISOString(),
            }),
          );
        } catch (error) {
          console.error("💥 Error parsing status update:", error);
        }
      });

      // Store subscriptions for cleanup
      this.subscriptions.set(`traffic-${simulationId}`, trafficSub);
      this.subscriptions.set(`status-${simulationId}`, statusSub);
      
      console.log("✅ Successfully subscribed to simulation updates");

    } catch (error) {
      console.error("💥 Failed to subscribe to simulation:", error);
      this.fallbackToMock();
      mockWebSocketService.subscribeToSimulation(simulationId);
    }
  }

  // Helper method to create traffic lights status from traffic state
  private createTrafficLightsFromState(state: any, simulationId: string) {
    const isPhase1 = state.currentPhase === "PHASE_1";
    
    return {
      simulationId,
      timeStep: state.timeStep,
      timestamp: state.timestamp,
      northSouth: {
        color: (isPhase1 ? "GREEN" : "RED") as "RED" | "YELLOW" | "GREEN",
        duration: state.calculatedGreenTime - state.currentGreenTime,
        pedestrianCrossing: !isPhase1,
      },
      eastWest: {
        color: (isPhase1 ? "RED" : "GREEN") as "RED" | "YELLOW" | "GREEN", 
        duration: state.calculatedGreenTime - state.currentGreenTime,
        pedestrianCrossing: isPhase1,
      },
      currentGreenTime: state.currentGreenTime,
      remainingGreenTime: Math.max(0, state.calculatedGreenTime - state.currentGreenTime),
      nextPhaseCountdown: Math.max(0, state.calculatedGreenTime - state.currentGreenTime),
      northSouthDensity: state.phase1Density || 0,
      eastWestDensity: state.phase2Density || 0,
    };
  }

  public unsubscribeFromSimulation(simulationId: string) {
    console.log(`📡 Unsubscribing from simulation: ${simulationId}`);
    
    if (this.useMock) {
      mockWebSocketService.unsubscribeFromSimulation(simulationId);
      return;
    }

    // Unsubscribe from specific topics
    const trafficSub = this.subscriptions.get(`traffic-${simulationId}`);
    const statusSub = this.subscriptions.get(`status-${simulationId}`);
    
    if (trafficSub) {
      trafficSub.unsubscribe();
      this.subscriptions.delete(`traffic-${simulationId}`);
      console.log("✅ Unsubscribed from traffic updates");
    }
    
    if (statusSub) {
      statusSub.unsubscribe();
      this.subscriptions.delete(`status-${simulationId}`);
      console.log("✅ Unsubscribed from status updates");
    }
  }

  private subscribeToSystemMessages() {
    if (!this.client || !this.client.connected) {
      return;
    }

    try {
      console.log("📥 Subscribing to system messages: /topic/system");
      
      const systemSub = this.client.subscribe("/topic/system", (message) => {
        try {
          console.log("📢 System message received:", message.body);
          const systemMessage: SystemMessage = JSON.parse(message.body);
          console.log("📢 System message content:", systemMessage.message);
        } catch (error) {
          console.error("💥 Error parsing system message:", error);
        }
      });
      
      this.subscriptions.set("system", systemSub);
      console.log("✅ Subscribed to system messages");
      
    } catch (error) {
      console.error("💥 Failed to subscribe to system messages:", error);
    }
  }

  public isConnected(): boolean {
    if (this.useMock) {
      return mockWebSocketService.isConnected();
    }
    return this.client?.connected || false;
  }

  // Debug method to check connection status
  public getConnectionInfo() {
    return {
      useMock: this.useMock,
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      subscriptions: Array.from(this.subscriptions.keys()),
      clientState: this.client?.connected ? "CONNECTED" : "DISCONNECTED",
    };
  }
}

export const webSocketService = new WebSocketService();