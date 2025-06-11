import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  createSimulation,
  startSimulation,
  stopSimulation,
  getSimulationStatus,
} from "../store/slices/simulationSlice";
import {
  SimulationConfigRequest,
  SimulationRequest,
} from "../types/simulation";
import { webSocketService } from "../services/websocket";

export const useSimulation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const simulation = useSelector((state: RootState) => state.simulation);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    webSocketService.connect();

    return () => {
      // Cleanup on unmount
      webSocketService.disconnect();
    };
  }, []);

  const createNewSimulation = async (config: SimulationConfigRequest) => {
    try {
      const result = await dispatch(createSimulation(config));
      if (createSimulation.fulfilled.match(result)) {
        const simulationId = result.payload;
        // Subscribe to WebSocket updates for this simulation
        webSocketService.subscribeToSimulation(simulationId);
        // Fetch initial status
        dispatch(getSimulationStatus(simulationId));
        return simulationId;
      }
    } catch (error) {
      console.error("Failed to create simulation:", error);
      throw error;
    }
  };

  const startCurrentSimulation = async (
    simulationId: string,
    request: SimulationRequest,
  ) => {
    try {
      await dispatch(startSimulation({ id: simulationId, request }));
    } catch (error) {
      console.error("Failed to start simulation:", error);
      throw error;
    }
  };

  const stopCurrentSimulation = async (simulationId: string) => {
    try {
      await dispatch(stopSimulation(simulationId));
    } catch (error) {
      console.error("Failed to stop simulation:", error);
      throw error;
    }
  };

  const refreshSimulationStatus = (simulationId: string) => {
    dispatch(getSimulationStatus(simulationId));
  };

  return {
    simulation: simulation.currentSimulation,
    trafficLights: simulation.trafficLights,
    isConnected: simulation.isConnected,
    isLoading: simulation.isLoading,
    error: simulation.error,
    createNewSimulation,
    startCurrentSimulation,
    stopCurrentSimulation,
    refreshSimulationStatus,
  };
};
