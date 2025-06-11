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
  setConnectionStatus,
  updateSimulationStatus,
} from "../store/slices/simulationSlice";

export class WebSocketService {
  private client: Client | null = null;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 10;
  private reconnectAttempts: number = 0;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/api/ws"),
      debug: (str) => {
        console.log("WebSocket Debug:", str);
      },
      reconnectDelay: this.reconnectInterval,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      store.dispatch(setConnectionStatus(true));
      this.subscribeToSystemMessages();
    };

    this.client.onDisconnect = () => {
      console.log("WebSocket disconnected");
      store.dispatch(setConnectionStatus(false));
    };

    this.client.onStompError = (frame) => {
      console.error("WebSocket error:", frame.headers["message"]);
      store.dispatch(setConnectionStatus(false));
      this.handleReconnection();
    };
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  public connect() {
    if (this.client && !this.client.connected) {
      this.client.activate();
    }
  }

  public disconnect() {
    if (this.client && this.client.connected) {
      this.client.deactivate();
    }
  }

  public subscribeToSimulation(simulationId: string) {
    if (!this.client || !this.client.connected) {
      console.warn("WebSocket not connected, cannot subscribe");
      return;
    }

    // Subscribe to traffic updates
    this.client.subscribe(`/topic/simulation/${simulationId}`, (message) => {
      try {
        const trafficUpdate: TrafficUpdateMessage = JSON.parse(message.body);
        store.dispatch(setTrafficState(trafficUpdate));
      } catch (error) {
        console.error("Error parsing traffic update:", error);
      }
    });

    // Subscribe to status updates
    this.client.subscribe(
      `/topic/simulation/${simulationId}/status`,
      (message) => {
        try {
          const statusUpdate: StatusUpdateMessage = JSON.parse(message.body);
          store.dispatch(
            updateSimulationStatus({
              status: statusUpdate.status,
              message: statusUpdate.message,
              lastUpdate: new Date(statusUpdate.timestamp).toISOString(),
            }),
          );
        } catch (error) {
          console.error("Error parsing status update:", error);
        }
      },
    );
  }

  public unsubscribeFromSimulation(simulationId: string) {
    if (!this.client || !this.client.connected) {
      return;
    }

    // Note: In a real implementation, you would need to keep track of subscription IDs
    // and unsubscribe using those IDs. For simplicity, we're not implementing that here.
    console.log(`Unsubscribing from simulation ${simulationId}`);
  }

  private subscribeToSystemMessages() {
    if (!this.client || !this.client.connected) {
      return;
    }

    this.client.subscribe("/topic/system", (message) => {
      try {
        const systemMessage: SystemMessage = JSON.parse(message.body);
        console.log("System message:", systemMessage.message);
        // You could dispatch this to a global notifications system
      } catch (error) {
        console.error("Error parsing system message:", error);
      }
    });
  }

  public isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const webSocketService = new WebSocketService();
