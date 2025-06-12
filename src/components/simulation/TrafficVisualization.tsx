import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// Individual Traffic Light Component (for each direction)
const DirectionalTrafficLight = ({
  position,
  rotation,
  color,
  direction,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: "RED" | "YELLOW" | "GREEN";
  direction: string;
}) => {
  const getColor = (lightColor: string) => {
    switch (lightColor) {
      case "RED":
        return "#ef4444";
      case "YELLOW":
        return "#eab308";
      case "GREEN":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Traffic Light Pole */}
      <Cylinder args={[0.08, 0.08, 3.5]} position={[0, 1.75, 0]}>
        <meshStandardMaterial color="#404040" />
      </Cylinder>

      {/* Light Housing */}
      <group position={[0, 3.7, 0]}>
        <Box args={[0.3, 1, 0.15]}>
          <meshStandardMaterial color="#2a2a2a" />
        </Box>
        
        {/* Red Light */}
        <Sphere args={[0.08]} position={[0, 0.25, 0.1]}>
          <meshStandardMaterial
            color={color === "RED" ? getColor("RED") : "#440000"}
            emissive={color === "RED" ? getColor("RED") : "#000000"}
            emissiveIntensity={color === "RED" ? 0.6 : 0}
          />
        </Sphere>
        
        {/* Yellow Light */}
        <Sphere args={[0.08]} position={[0, 0, 0.1]}>
          <meshStandardMaterial
            color={color === "YELLOW" ? getColor("YELLOW") : "#444400"}
            emissive={color === "YELLOW" ? getColor("YELLOW") : "#000000"}
            emissiveIntensity={color === "YELLOW" ? 0.6 : 0}
          />
        </Sphere>
        
        {/* Green Light */}
        <Sphere args={[0.08]} position={[0, -0.25, 0.1]}>
          <meshStandardMaterial
            color={color === "GREEN" ? getColor("GREEN") : "#004400"}
            emissive={color === "GREEN" ? getColor("GREEN") : "#000000"}
            emissiveIntensity={color === "GREEN" ? 0.6 : 0}
          />
        </Sphere>
      </group>

      {/* Direction Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {direction}
      </Text>
    </group>
  );
};

// Four separate traffic lights for realistic intersection
const TrafficLights = ({
  trafficState,
}: {
  trafficState: any;
}) => {
  // Derive traffic light colors from traffic state (backend logic)
  const northSouthColor = trafficState?.currentPhase === "PHASE_1" ? "GREEN" : "RED";
  const eastWestColor = trafficState?.currentPhase === "PHASE_2" ? "GREEN" : "RED";

  return (
    <group>
      {/* North Traffic Light */}
      <DirectionalTrafficLight
        position={[2, 0, 8]}
        rotation={[0, Math.PI, 0]}
        color={northSouthColor}
        direction="N"
      />
      
      {/* South Traffic Light */}
      <DirectionalTrafficLight
        position={[-2, 0, -8]}
        rotation={[0, 0, 0]}
        color={northSouthColor}
        direction="S"
      />
      
      {/* East Traffic Light */}
      <DirectionalTrafficLight
        position={[8, 0, -2]}
        rotation={[0, -Math.PI / 2, 0]}
        color={eastWestColor}
        direction="E"
      />
      
      {/* West Traffic Light */}
      <DirectionalTrafficLight
        position={[-8, 0, 2]}
        rotation={[0, Math.PI / 2, 0]}
        color={eastWestColor}
        direction="W"
      />
    </group>
  );
};

// Enhanced Vehicle Component with proper movement
const MovingVehicle = ({
  id,
  direction,
  queuePosition,
  type = "car",
  trafficState,
}: {
  id: string;
  direction: "north" | "south" | "east" | "west";
  queuePosition: number;
  type?: "car" | "truck" | "bus";
  trafficState: any;
}) => {
  const ref = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3());
  const targetRef = useRef(new THREE.Vector3());

  const { color, size } = useMemo(() => {
    switch (type) {
      case "truck":
        return {
          color: "#1f2937",
          size: [2.5, 1.8, 1.2] as [number, number, number],
        };
      case "bus":
        return {
          color: "#fbbf24",
          size: [3.5, 2.2, 1.5] as [number, number, number],
        };
      default:
        return {
          color: "#3b82f6",
          size: [2, 1.4, 1] as [number, number, number],
        };
    }
  }, [type]);

  // Calculate vehicle position and movement based on traffic state
  const { position, rotation, isMoving, targetPosition } = useMemo(() => {
    const stopLineDistance = 6;
    const vehicleSpacing = 3;
    
    // Determine if this direction can move (has green light)
    const canMove = 
      (direction === "north" || direction === "south") ? 
        trafficState?.currentPhase === "PHASE_1" : // N-S green in PHASE_1
        trafficState?.currentPhase === "PHASE_2";   // E-W green in PHASE_2

    let basePosition: [number, number, number];
    let vehicleRotation: [number, number, number];
    let target: [number, number, number];

    switch (direction) {
      case "north":
        // Cars driving south (toward negative Z)
        basePosition = [1, 0.5, stopLineDistance + queuePosition * vehicleSpacing];
        vehicleRotation = [0, 0, 0];
        target = canMove ? [1, 0.5, -20] : [1, 0.5, stopLineDistance + queuePosition * vehicleSpacing];
        break;
      case "south":
        // Cars driving north (toward positive Z)
        basePosition = [-1, 0.5, -stopLineDistance - queuePosition * vehicleSpacing];
        vehicleRotation = [0, Math.PI, 0];
        target = canMove ? [-1, 0.5, 20] : [-1, 0.5, -stopLineDistance - queuePosition * vehicleSpacing];
        break;
      case "east":
        // Cars driving west (toward negative X)
        basePosition = [stopLineDistance + queuePosition * vehicleSpacing, 0.5, 1];
        vehicleRotation = [0, -Math.PI / 2, 0];
        target = canMove ? [-20, 0.5, 1] : [stopLineDistance + queuePosition * vehicleSpacing, 0.5, 1];
        break;
      case "west":
        // Cars driving east (toward positive X)
        basePosition = [-stopLineDistance - queuePosition * vehicleSpacing, 0.5, -1];
        vehicleRotation = [0, Math.PI / 2, 0];
        target = canMove ? [20, 0.5, -1] : [-stopLineDistance - queuePosition * vehicleSpacing, 0.5, -1];
        break;
      default:
        basePosition = [0, 0.5, 0];
        vehicleRotation = [0, 0, 0];
        target = [0, 0.5, 0];
    }

    return {
      position: basePosition,
      rotation: vehicleRotation,
      isMoving: canMove,
      targetPosition: target,
    };
  }, [direction, queuePosition, trafficState?.currentPhase]);

  // Initialize position reference
  useMemo(() => {
    positionRef.current.set(...position);
    targetRef.current.set(...targetPosition);
  }, [position, targetPosition]);

  // Animation frame for smooth movement
  useFrame((state, delta) => {
    if (!ref.current) return;

    const speed = 0.1; // units per second
    const target = targetRef.current;
    const current = positionRef.current;

    if (isMoving) {
      // Move toward target
      const direction = target.clone().sub(current).normalize();
      const distance = current.distanceTo(target);

      if (distance > 0.5) {
        const moveDistance = Math.min(speed * delta * 60, distance);
        current.add(direction.multiplyScalar(moveDistance));
        ref.current.position.copy(current);
      }
    } else {
      // Stop at current position (red light)
      ref.current.position.copy(current);
    }

    // Update target if it changed
    targetRef.current.copy(new THREE.Vector3(...targetPosition));
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Box args={size}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Wheels */}
      {[
        [size[0] * 0.3, -size[1] * 0.5, size[2] * 0.4],
        [-size[0] * 0.3, -size[1] * 0.5, size[2] * 0.4],
        [size[0] * 0.3, -size[1] * 0.5, -size[2] * 0.4],
        [-size[0] * 0.3, -size[1] * 0.5, -size[2] * 0.4],
      ].map((pos, i) => (
        <Cylinder
          key={i}
          args={[0.3, 0.3, 0.2]}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>
      ))}
    </group>
  );
};

// Intelligent Vehicle Management with Proper Traffic Logic
const TrafficAwareVehicles = () => {
  const trafficState = useSelector(
    (state: RootState) => state.simulation.currentSimulation?.currentState,
  );

  const vehicles = useMemo(() => {
    if (!trafficState) return [];

    const vehicleList: Array<{
      id: string;
      direction: "north" | "south" | "east" | "west";
      queuePosition: number;
      type: "car" | "truck" | "bus";
    }> = [];

    const vehicleTypes = ["car", "truck", "bus"] as const;

    // Create vehicles for each direction based on queue length
    // North vehicles (cars from north driving south)
    for (let i = 0; i < Math.min(trafficState.vehiclesNorth, 10); i++) {
      vehicleList.push({
        id: `north-${i}`,
        direction: "north",
        queuePosition: i,
        type: vehicleTypes[i % vehicleTypes.length],
      });
    }

    // South vehicles (cars from south driving north)  
    for (let i = 0; i < Math.min(trafficState.vehiclesSouth, 10); i++) {
      vehicleList.push({
        id: `south-${i}`,
        direction: "south",
        queuePosition: i,
        type: vehicleTypes[i % vehicleTypes.length],
      });
    }

    // East vehicles (cars from east driving west)
    for (let i = 0; i < Math.min(trafficState.vehiclesEast, 10); i++) {
      vehicleList.push({
        id: `east-${i}`,
        direction: "east",
        queuePosition: i,
        type: vehicleTypes[i % vehicleTypes.length],
      });
    }

    // West vehicles (cars from west driving east)
    for (let i = 0; i < Math.min(trafficState.vehiclesWest, 10); i++) {
      vehicleList.push({
        id: `west-${i}`,
        direction: "west",
        queuePosition: i,
        type: vehicleTypes[i % vehicleTypes.length],
      });
    }

    return vehicleList;
  }, [trafficState]);

  return (
    <>
      {vehicles.map((vehicle) => (
        <MovingVehicle
          key={vehicle.id}
          id={vehicle.id}
          direction={vehicle.direction}
          queuePosition={vehicle.queuePosition}
          type={vehicle.type}
          trafficState={trafficState}
        />
      ))}
    </>
  );
};

// Enhanced Road with proper stop lines
const Road = () => (
  <group>
    {/* North-South Road */}
    <Box args={[4, 0.1, 40]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#374151" />
    </Box>

    {/* East-West Road */}
    <Box args={[40, 0.1, 4]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#374151" />
    </Box>

    {/* Center lines */}
    <Box args={[0.1, 0.11, 40]} position={[0, 0.05, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    <Box args={[40, 0.11, 0.1]} position={[0, 0.05, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>

    {/* Stop Lines - Where vehicles actually stop */}
    {/* North stop line (for cars coming from north) */}
    <Box args={[4, 0.12, 0.3]} position={[0, 0.06, 6]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    {/* South stop line (for cars coming from south) */}
    <Box args={[4, 0.12, 0.3]} position={[0, 0.06, -6]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    {/* East stop line (for cars coming from east) */}
    <Box args={[0.3, 0.12, 4]} position={[6, 0.06, 0]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    {/* West stop line (for cars coming from west) */}
    <Box args={[0.3, 0.12, 4]} position={[-6, 0.06, 0]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>

    {/* Crosswalk stripes */}
    {Array.from({ length: 8 }, (_, i) => (
      <Box
        key={`crosswalk-ns-${i}`}
        args={[0.3, 0.11, 4]}
        position={[-1.5 + i * 0.4, 0.05, 0]}
      >
        <meshStandardMaterial color="#f9fafb" />
      </Box>
    ))}
    {Array.from({ length: 8 }, (_, i) => (
      <Box
        key={`crosswalk-ew-${i}`}
        args={[4, 0.11, 0.3]}
        position={[0, 0.05, -1.5 + i * 0.4]}
      >
        <meshStandardMaterial color="#f9fafb" />
      </Box>
    ))}
  </group>
);

// Debug Info Display
const DebugInfo = ({ trafficState }: { trafficState: any }) => {
  if (!trafficState) return null;

  return (
    <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono">
      <div className="space-y-1">
        <div>Phase: {trafficState.currentPhase}</div>
        <div>Green Time: {trafficState.currentGreenTime}/{trafficState.calculatedGreenTime}s</div>
        <div>N-S Light: {trafficState.currentPhase === "PHASE_1" ? "🟢 GREEN" : "🔴 RED"}</div>
        <div>E-W Light: {trafficState.currentPhase === "PHASE_2" ? "🟢 GREEN" : "🔴 RED"}</div>
        <div className="border-t border-gray-600 pt-1 mt-2">
          <div>Vehicles: N:{trafficState.vehiclesNorth} S:{trafficState.vehiclesSouth} E:{trafficState.vehiclesEast} W:{trafficState.vehiclesWest}</div>
          <div>Density: N-S:{trafficState.phase1Density?.toFixed(1)} E-W:{trafficState.phase2Density?.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

// Main Traffic Visualization Component
export const TrafficVisualization = () => {
  const trafficState = useSelector(
    (state: RootState) => state.simulation.currentSimulation?.currentState,
  );

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg overflow-hidden relative">
      <Canvas
        camera={{
          position: [30, 25, 30],
          fov: 50,
        }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {/* Scene Components */}
        <Road />
        <TrafficLights trafficState={trafficState} />
        <TrafficAwareVehicles />

        {/* Ground */}
        <Box args={[100, 0.1, 100]} position={[0, -0.1, 0]} receiveShadow>
          <meshStandardMaterial color="#10b981" />
        </Box>

        {/* Direction Labels */}
        <Text
          position={[0, 1, 20]}
          fontSize={3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          NORTH
        </Text>
        <Text
          position={[0, 1, -20]}
          fontSize={3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          SOUTH
        </Text>
        <Text
          position={[20, 1, 0]}
          fontSize={3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
        >
          EAST
        </Text>
        <Text
          position={[-20, 1, 0]}
          fontSize={3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]}
        >
          WEST
        </Text>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={15}
          maxDistance={60}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Debug Info Overlay */}
      <DebugInfo trafficState={trafficState} />
    </div>
  );
};