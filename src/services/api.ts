import {
  SimulationConfigRequest,
  SimulationRequest,
  SimulationStatusResponse,
  TrafficStateResponse,
  PerformanceMetricsResponse,
  DashboardSummary,
  TrafficLightStatus,
  ScenarioTemplate,
  ComparisonReport,
  SensorDataRequest,
  SensorStatusResponse,
  ApiResponse,
  SimulationConfigResponse,
} from "../types/simulation";
import {
  mockDashboardSummary,
  mockSimulationStatus,
  mockPerformanceMetrics,
  mockScenarioTemplates,
  generateMockTrafficLights,
  generateMockTrafficState,
} from "./mockData";

const BASE_URL = "http://localhost:8080/api";
const USE_MOCK_DATA = false; // Set to false when backend is available

class APIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    // If mock data is enabled, return mock data directly without making network requests
    if (USE_MOCK_DATA) {
      console.warn(`Using mock data for ${endpoint}`);
      return this.getMockResponse<T>(endpoint);
    }

    const url = `${BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      console.log(`Request method: ${config.method || "GET"}`);
      console.log(`Request headers:`, config.headers);
      if (config.body) {
        console.log(`Request body:`, config.body);
      }

      const response = await fetch(url, config);

      // Always try to parse the response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        data = { message: "Invalid response format" };
      }

      console.log(`Response status: ${response.status}`);
      console.log(`Response data:`, data);

      if (!response.ok) {
        // Log detailed validation errors
        console.error(`Backend validation error:`, {
          status: response.status,
          statusText: response.statusText,
          errorData: data,
          url: url,
          requestBody: config.body,
        });

        throw new Error(
          data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      console.error(`Full URL attempted: ${url}`);
      console.error(`Request config:`, config);

      // Check if it's a network error vs server error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("Network connection failed - backend may not be running");
        // Fall back to mock data for network errors
        console.warn(
          `Backend not available, falling back to mock data for ${endpoint}`,
        );
        return this.getMockResponse<T>(endpoint);
      }

      // Re-throw server validation errors without fallback
      throw error;
    }
  }

  private getMockResponse<T>(endpoint: string): ApiResponse<T> {
    const mockData = this.getMockDataForEndpoint(endpoint);
    return {
      success: true,
      data: mockData as T,
      message: "Mock data - backend not available",
      timestamp: new Date().toISOString(),
    };
  }

  private getMockDataForEndpoint(endpoint: string): any {
    switch (endpoint) {
      case "/dashboard/summary":
        return mockDashboardSummary;
      case "/scenarios":
        return mockScenarioTemplates;
      default:
        if (endpoint.includes("/status")) {
          return mockSimulationStatus;
        }
        if (endpoint.includes("/metrics")) {
          return mockPerformanceMetrics;
        }
        if (endpoint.includes("/trafficlight")) {
          return generateMockTrafficLights();
        }
        if (endpoint.includes("/states")) {
          return [generateMockTrafficState()];
        }
        if (
          endpoint.includes("/simulations") &&
          endpoint.endsWith("/simulations")
        ) {
          return [mockDashboardSummary.mostRecentSimulation];
        }
        return null;
    }
  }

  protected get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  protected post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  protected delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Simulation Management API
class SimulationAPI extends APIService {
  createSimulation(
    config: SimulationConfigRequest,
  ): Promise<ApiResponse<string>> {
    return this.post<string>("/simulations", config);
  }

  startSimulation(
    id: string,
    request: SimulationRequest,
  ): Promise<ApiResponse<null>> {
    return this.post<null>(`/simulations/${id}/start`, request);
  }

  stopSimulation(id: string): Promise<ApiResponse<null>> {
    return this.post<null>(`/simulations/${id}/stop`);
  }

  getSimulationStatus(
    id: string,
  ): Promise<ApiResponse<SimulationStatusResponse>> {
    return this.get<SimulationStatusResponse>(`/simulations/${id}/status`);
  }

  getSimulationConfig(
    id: string,
  ): Promise<ApiResponse<SimulationConfigResponse>> {
    return this.get<SimulationConfigResponse>(`/simulations/${id}/config`);
  }

  getSimulationStates(
    id: string,
    fromStep?: number,
    toStep?: number,
    limit?: number,
  ): Promise<ApiResponse<TrafficStateResponse[]>> {
    const params = new URLSearchParams();
    if (fromStep !== undefined) params.append("fromStep", fromStep.toString());
    if (toStep !== undefined) params.append("toStep", toStep.toString());
    if (limit !== undefined) params.append("limit", limit.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get<TrafficStateResponse[]>(
      `/simulations/${id}/states${query}`,
    );
  }

  getSimulationMetrics(
    id: string,
  ): Promise<ApiResponse<PerformanceMetricsResponse>> {
    return this.get<PerformanceMetricsResponse>(`/simulations/${id}/metrics`);
  }

  getAllSimulations(): Promise<ApiResponse<SimulationConfigResponse[]>> {
    return this.get<SimulationConfigResponse[]>("/simulations");
  }

  deleteSimulation(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/simulations/${id}`);
  }
}

// Dashboard & Analytics API
class DashboardAPI extends APIService {
  getSummary(): Promise<ApiResponse<DashboardSummary>> {
    return this.get<DashboardSummary>("/dashboard/summary");
  }

  getTrafficLightStatus(id: string): Promise<ApiResponse<TrafficLightStatus>> {
    return this.get<TrafficLightStatus>(`/dashboard/trafficlight/${id}`);
  }

  compareSimulations(
    simulationIds: string[],
  ): Promise<ApiResponse<ComparisonReport>> {
    return this.post<ComparisonReport>("/dashboard/compare", simulationIds);
  }

  getTopPerformers(
    limit?: number,
  ): Promise<ApiResponse<PerformanceMetricsResponse[]>> {
    const query = limit ? `?limit=${limit}` : "";
    return this.get<PerformanceMetricsResponse[]>(
      `/dashboard/topperformers${query}`,
    );
  }
}

// Scenario Management API
class ScenarioAPI extends APIService {
  getScenarios(): Promise<ApiResponse<ScenarioTemplate[]>> {
    return this.get<ScenarioTemplate[]>("/scenarios");
  }

  applyScenario(
    name: string,
    simulationId: string,
  ): Promise<ApiResponse<null>> {
    return this.post<null>(`/scenarios/${name}/apply/${simulationId}`);
  }
}

// Sensor Data API
class SensorAPI extends APIService {
  sendSensorData(
    id: string,
    data: SensorDataRequest,
  ): Promise<ApiResponse<null>> {
    return this.post<null>(`/sensors/${id}/data`, data);
  }

  getSensorStatus(id: string): Promise<ApiResponse<SensorStatusResponse>> {
    return this.get<SensorStatusResponse>(`/sensors/${id}/status`);
  }
}

// Export service instances
export const simulationAPI = new SimulationAPI();
export const dashboardAPI = new DashboardAPI();
export const scenarioAPI = new ScenarioAPI();
export const sensorAPI = new SensorAPI();
