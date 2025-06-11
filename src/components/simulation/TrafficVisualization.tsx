import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// Traffic Light Component
const TrafficLight = ({
  position,
  rotation,
  northSouthColor,
  eastWestColor,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  northSouthColor: "RED" | "YELLOW" | "GREEN";
  eastWestColor: "RED" | "YELLOW" | "GREEN";
}) => {
  const getColor = (color: string) => {
    switch (color) {
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
      <Cylinder args={[0.1, 0.1, 4]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#404040" />
      </Cylinder>

      {/* North-South Light Housing */}
      <group position={[0, 4.2, 0]}>
        <Box args={[0.4, 1.2, 0.2]}>
          <meshStandardMaterial color="#2a2a2a" />
        </Box>
        {/* Red Light */}
        <Sphere args={[0.12]} position={[0, 0.3, 0.15]}>
          <meshStandardMaterial
            color={northSouthColor === "RED" ? getColor("RED") : "#440000"}
            emissive={northSouthColor === "RED" ? getColor("RED") : "#000000"}
            emissiveIntensity={northSouthColor === "RED" ? 0.3 : 0}
          />
        </Sphere>
        {/* Yellow Light */}
        <Sphere args={[0.12]} position={[0, 0, 0.15]}>
          <meshStandardMaterial
            color={
              northSouthColor === "YELLOW" ? getColor("YELLOW") : "#444400"
            }
            emissive={
              northSouthColor === "YELLOW" ? getColor("YELLOW") : "#000000"
            }
            emissiveIntensity={northSouthColor === "YELLOW" ? 0.3 : 0}
          />
        </Sphere>
        {/* Green Light */}
        <Sphere args={[0.12]} position={[0, -0.3, 0.15]}>
          <meshStandardMaterial
            color={northSouthColor === "GREEN" ? getColor("GREEN") : "#004400"}
            emissive={
              northSouthColor === "GREEN" ? getColor("GREEN") : "#000000"
            }
            emissiveIntensity={northSouthColor === "GREEN" ? 0.3 : 0}
          />
        </Sphere>
      </group>

      {/* East-West Light Housing */}
      <group position={[0, 4.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Box args={[0.4, 1.2, 0.2]}>
          <meshStandardMaterial color="#2a2a2a" />
        </Box>
        {/* Red Light */}
        <Sphere args={[0.12]} position={[0, 0.3, 0.15]}>
          <meshStandardMaterial
            color={eastWestColor === "RED" ? getColor("RED") : "#440000"}
            emissive={eastWestColor === "RED" ? getColor("RED") : "#000000"}
            emissiveIntensity={eastWestColor === "RED" ? 0.3 : 0}
          />
        </Sphere>
        {/* Yellow Light */}
        <Sphere args={[0.12]} position={[0, 0, 0.15]}>
          <meshStandardMaterial
            color={eastWestColor === "YELLOW" ? getColor("YELLOW") : "#444400"}
            emissive={
              eastWestColor === "YELLOW" ? getColor("YELLOW") : "#000000"
            }
            emissiveIntensity={eastWestColor === "YELLOW" ? 0.3 : 0}
          />
        </Sphere>
        {/* Green Light */}
        <Sphere args={[0.12]} position={[0, -0.3, 0.15]}>
          <meshStandardMaterial
            color={eastWestColor === "GREEN" ? getColor("GREEN") : "#004400"}
            emissive={eastWestColor === "GREEN" ? getColor("GREEN") : "#000000"}
            emissiveIntensity={eastWestColor === "GREEN" ? 0.3 : 0}
          />
        </Sphere>
      </group>
    </group>
  );
};

// Vehicle Component
const Vehicle = ({
  position,
  rotation,
  type = "car",
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  type?: "car" | "truck" | "bus";
}) => {
  const ref = useRef<THREE.Group>(null);

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

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Box args={size}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Wheels */}
      <Cylinder
        args={[0.3, 0.3, 0.2]}
        position={[size[0] * 0.3, -size[1] * 0.5, size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 0.2]}
        position={[-size[0] * 0.3, -size[1] * 0.5, size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 0.2]}
        position={[size[0] * 0.3, -size[1] * 0.5, -size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder
        args={[0.3, 0.3, 0.2]}
        position={[-size[0] * 0.3, -size[1] * 0.5, -size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
    </group>
  );
};

// Road Component
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

    {/* Road Markings */}
    {/* Center lines */}
    <Box args={[0.1, 0.11, 40]} position={[0, 0.05, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    <Box args={[40, 0.11, 0.1]} position={[0, 0.05, 0]}>
      <meshStandardMaterial color="#fbbf24" />
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

// Animated Vehicles based on traffic state
const AnimatedVehicles = () => {
  const trafficState = useSelector(
    (state: RootState) => state.simulation.currentSimulation?.currentState,
  );

  const vehicles = useMemo(() => {
    if (!trafficState) return [];

    const vehicleList = [];
    const vehicleTypes = ["car", "truck", "bus"] as const;

    // North vehicles
    for (let i = 0; i < Math.min(trafficState.vehiclesNorth, 10); i++) {
      vehicleList.push({
        id: `north-${i}`,
        position: [1, 0.5, 8 + i * 3] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      });
    }

    // South vehicles
    for (let i = 0; i < Math.min(trafficState.vehiclesSouth, 10); i++) {
      vehicleList.push({
        id: `south-${i}`,
        position: [-1, 0.5, -8 - i * 3] as [number, number, number],
        rotation: [0, Math.PI, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      });
    }

    // East vehicles
    for (let i = 0; i < Math.min(trafficState.vehiclesEast, 10); i++) {
      vehicleList.push({
        id: `east-${i}`,
        position: [8 + i * 3, 0.5, 1] as [number, number, number],
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      });
    }

    // West vehicles
    for (let i = 0; i < Math.min(trafficState.vehiclesWest, 10); i++) {
      vehicleList.push({
        id: `west-${i}`,
        position: [-8 - i * 3, 0.5, -1] as [number, number, number],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      });
    }

    return vehicleList;
  }, [trafficState]);

  return (
    <>
      {vehicles.map((vehicle) => (
        <Vehicle
          key={vehicle.id}
          position={vehicle.position}
          rotation={vehicle.rotation}
          type={vehicle.type}
        />
      ))}
    </>
  );
};

export const TrafficVisualization = () => {
  const trafficLights = useSelector(
    (state: RootState) => state.simulation.trafficLights,
  );

  const northSouthColor = trafficLights?.northSouth?.color || "RED";
  const eastWestColor = trafficLights?.eastWest?.color || "RED";

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg overflow-hidden">
      <Canvas
        camera={{
          position: [25, 20, 25],
          fov: 50,
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[20, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Scene */}
        <Road />
        <TrafficLight
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          northSouthColor={northSouthColor}
          eastWestColor={eastWestColor}
        />
        <AnimatedVehicles />

        {/* Ground */}
        <Box args={[100, 0.1, 100]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#10b981" />
        </Box>

        {/* Direction Labels */}
        <Text
          position={[0, 1, 15]}
          fontSize={2}
          color="#374151"
          anchorX="center"
          anchorY="middle"
        >
          NORTH
        </Text>
        <Text
          position={[0, 1, -15]}
          fontSize={2}
          color="#374151"
          anchorX="center"
          anchorY="middle"
        >
          SOUTH
        </Text>
        <Text
          position={[15, 1, 0]}
          fontSize={2}
          color="#374151"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
        >
          EAST
        </Text>
        <Text
          position={[-15, 1, 0]}
          fontSize={2}
          color="#374151"
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
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
};
