import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  SimulationState,
  SimulationStatusResponse,
  TrafficLightStatus,
  TrafficStateResponse,
  SimulationConfigRequest,
  SimulationRequest,
} from "../../types/simulation";
import { simulationAPI } from "../../services/api";

const initialState: SimulationState = {
  currentSimulation: null,
  trafficLights: null,
  isConnected: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const createSimulation = createAsyncThunk(
  "simulation/create",
  async (config: SimulationConfigRequest) => {
    const response = await simulationAPI.createSimulation(config);
    return response.data;
  },
);

export const startSimulation = createAsyncThunk(
  "simulation/start",
  async ({ id, request }: { id: string; request: SimulationRequest }) => {
    const response = await simulationAPI.startSimulation(id, request);
    return response.data;
  },
);

export const stopSimulation = createAsyncThunk(
  "simulation/stop",
  async (id: string) => {
    const response = await simulationAPI.stopSimulation(id);
    return response.data;
  },
);

export const getSimulationStatus = createAsyncThunk(
  "simulation/status",
  async (id: string) => {
    const response = await simulationAPI.getSimulationStatus(id);
    return response.data;
  },
);

const simulationSlice = createSlice({
  name: "simulation",
  initialState,
  reducers: {
    setTrafficState: (state, action: PayloadAction<TrafficStateResponse>) => {
      if (state.currentSimulation) {
        state.currentSimulation.currentState = action.payload;
        state.currentSimulation.currentTimeStep = action.payload.timeStep;
      }
    },
    setTrafficLights: (state, action: PayloadAction<TrafficLightStatus>) => {
      state.trafficLights = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateSimulationStatus: (
      state,
      action: PayloadAction<Partial<SimulationStatusResponse>>,
    ) => {
      if (state.currentSimulation) {
        state.currentSimulation = {
          ...state.currentSimulation,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSimulation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSimulation.fulfilled, (state, action) => {
        state.isLoading = false;
        // The create response just returns the simulation ID
      })
      .addCase(createSimulation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create simulation";
      })
      .addCase(startSimulation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSimulation.fulfilled, (state) => {
        state.isLoading = false;
        if (state.currentSimulation) {
          state.currentSimulation.status = "RUNNING";
        }
      })
      .addCase(startSimulation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to start simulation";
      })
      .addCase(stopSimulation.fulfilled, (state) => {
        if (state.currentSimulation) {
          state.currentSimulation.status = "IDLE";
        }
      })
      .addCase(getSimulationStatus.fulfilled, (state, action) => {
        state.currentSimulation = action.payload;
      });
  },
});

export const {
  setTrafficState,
  setTrafficLights,
  setConnectionStatus,
  clearError,
  updateSimulationStatus,
} = simulationSlice.actions;

export default simulationSlice.reducer;
