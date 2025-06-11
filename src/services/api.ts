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

const BASE_URL = "http://localhost:8080/api";

class APIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  private get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  private post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private delete<T>(endpoint: string): Promise<ApiResponse<T>> {
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
