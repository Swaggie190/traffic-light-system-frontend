import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// Safe Text Component with React 18 compatibility
interface SafeTextProps {
  position: [number, number, number];
  fontSize: number;
  color: string;
  anchorX: "center" | "left" | "right";
  anchorY: "middle" | "top" | "bottom";
  rotation?: [number, number, number];
  children: React.ReactNode;
}

const SafeText: React.FC<SafeTextProps> = ({ children, ...props }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    console.warn('Text component failed, rendering fallback');
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Text {...props}>
        {children}
      </Text>
    </Suspense>
  );
};

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

// Animated Vehicle Component with SLOW movement
const AnimatedVehicle = ({
  startPosition,
  endPosition,
  rotation,
  type = "car",
  delay = 0,
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  rotation: [number, number, number];
  type?: "car" | "truck" | "bus";
  delay?: number;
}) => {
  const ref = useRef<THREE.Group>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // VERY SLOW movement - takes 20 seconds to travel from start to end
  const MOVEMENT_DURATION = 20; // seconds
  const SPEED = 0.05; // Very slow speed multiplier

  useFrame((state, delta) => {
    if (ref.current) {
      setCurrentTime((prev) => prev + delta);
      
      // Apply delay before starting movement
      const adjustedTime = Math.max(0, currentTime - delay);
      
      // Calculate progress (0 to 1) over the duration
      const progress = Math.min(adjustedTime / MOVEMENT_DURATION, 1);
      
      // Linear interpolation between start and end positions
      const x = startPosition[0] + (endPosition[0] - startPosition[0]) * progress;
      const y = startPosition[1] + (endPosition[1] - startPosition[1]) * progress;
      const z = startPosition[2] + (endPosition[2] - startPosition[2]) * progress;
      
      ref.current.position.set(x, y, z);
      
      // Reset position when reaching the end (loop the animation)
      if (progress >= 1) {
        setCurrentTime(-delay); // Restart with delay
      }
    }
  });

  const { color, size } = useMemo(() => {
    switch (type) {
      case "truck":
        return {
          color: "#1f2937", // Black/Dark Gray
          size: [1.2, 0.8, 0.6] as [number, number, number], // Reduced by ~50%
        };
      case "bus":
        return {
          color: "#fbbf24", // Yellow
          size: [1.6, 1.0, 0.8] as [number, number, number], // Reduced by ~55%
        };
      default:
        return {
          color: "#3b82f6", // Blue
          size: [1.0, 0.7, 0.5] as [number, number, number], // Reduced by ~50%
        };
    }
  }, [type]);

  return (
    <group ref={ref} position={startPosition} rotation={rotation}>
      {/* Main vehicle body */}
      <Box args={size}>
        <meshStandardMaterial color={color} />
      </Box>
      
      {/* Vehicle wheels (4 smaller dark gray cylinders) */}
      <Cylinder
        args={[0.15, 0.15, 0.1]}
        position={[size[0] * 0.3, -size[1] * 0.5, size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder
        args={[0.15, 0.15, 0.1]}
        position={[-size[0] * 0.3, -size[1] * 0.5, size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder
        args={[0.15, 0.15, 0.1]}
        position={[size[0] * 0.3, -size[1] * 0.5, -size[2] * 0.4]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder
        args={[0.15, 0.15, 0.1]}
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
    {/* North-South Road (vertical) */}
    <Box args={[4, 0.1, 40]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#374151" />
    </Box>

    {/* East-West Road (horizontal) */}
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

// Slow Animated Vehicles with continuous movement
const SlowAnimatedVehicles = () => {
  const trafficState = useSelector(
    (state: RootState) => state.simulation.currentSimulation?.currentState,
  );

  const vehicles = useMemo(() => {
    if (!trafficState) {
      // Demo vehicles if no traffic state
      return [
        {
          id: "demo-north-1",
          startPosition: [1, 0.5, 15] as [number, number, number],
          endPosition: [1, 0.5, -15] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          type: "car" as const,
          delay: 0,
        },
        {
          id: "demo-south-1", 
          startPosition: [-1, 0.5, -15] as [number, number, number],
          endPosition: [-1, 0.5, 15] as [number, number, number],
          rotation: [0, Math.PI, 0] as [number, number, number],
          type: "truck" as const,
          delay: 3,
        },
        {
          id: "demo-east-1",
          startPosition: [15, 0.5, 1] as [number, number, number],
          endPosition: [-15, 0.5, 1] as [number, number, number],
          rotation: [0, -Math.PI / 2, 0] as [number, number, number],
          type: "bus" as const,
          delay: 6,
        },
        {
          id: "demo-west-1",
          startPosition: [-15, 0.5, -1] as [number, number, number],
          endPosition: [15, 0.5, -1] as [number, number, number],
          rotation: [0, Math.PI / 2, 0] as [number, number, number],
          type: "car" as const,
          delay: 9,
        },
      ];
    }

    const vehicleList = [];
    const vehicleTypes = ["car", "truck", "bus"] as const;

    // North vehicles (moving south)
    for (let i = 0; i < Math.min(trafficState.vehiclesNorth, 5); i++) {
      vehicleList.push({
        id: `north-${i}`,
        startPosition: [1, 0.5, 15 + i * 5] as [number, number, number],
        endPosition: [1, 0.5, -15] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        delay: i * 4, // 4 second delay between vehicles
      });
    }

    // South vehicles (moving north)
    for (let i = 0; i < Math.min(trafficState.vehiclesSouth, 5); i++) {
      vehicleList.push({
        id: `south-${i}`,
        startPosition: [-1, 0.5, -15 - i * 5] as [number, number, number],
        endPosition: [-1, 0.5, 15] as [number, number, number],
        rotation: [0, Math.PI, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        delay: i * 4,
      });
    }

    // East vehicles (moving west)
    for (let i = 0; i < Math.min(trafficState.vehiclesEast, 5); i++) {
      vehicleList.push({
        id: `east-${i}`,
        startPosition: [15 + i * 5, 0.5, 1] as [number, number, number],
        endPosition: [-15, 0.5, 1] as [number, number, number],
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        delay: i * 4,
      });
    }

    // West vehicles (moving east)
    for (let i = 0; i < Math.min(trafficState.vehiclesWest, 5); i++) {
      vehicleList.push({
        id: `west-${i}`,
        startPosition: [-15 - i * 5, 0.5, -1] as [number, number, number],
        endPosition: [15, 0.5, -1] as [number, number, number],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        delay: i * 4,
      });
    }

    return vehicleList;
  }, [trafficState]);

  return (
    <>
      {vehicles.map((vehicle) => (
        <AnimatedVehicle
          key={vehicle.id}
          startPosition={vehicle.startPosition}
          endPosition={vehicle.endPosition}
          rotation={vehicle.rotation}
          type={vehicle.type}
          delay={vehicle.delay}
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
      <Suspense fallback={<div className="flex items-center justify-center h-full text-lg">Loading 3D scene...</div>}>
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
          <SlowAnimatedVehicles />

          {/* Ground */}
          <Box args={[100, 0.1, 100]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Box>

          {/* Direction Labels - Now using SafeText */}
          <SafeText
            position={[0, 1, 15]}
            fontSize={2}
            color="#374151"
            anchorX="center"
            anchorY="middle"
          >
            NORTH
          </SafeText>
          <SafeText
            position={[0, 1, -15]}
            fontSize={2}
            color="#374151"
            anchorX="center"
            anchorY="middle"
          >
            SOUTH
          </SafeText>
          <SafeText
            position={[15, 1, 0]}
            fontSize={2}
            color="#374151"
            anchorX="center"
            anchorY="middle"
            rotation={[0, -Math.PI / 2, 0]}
          >
            EAST
          </SafeText>
          <SafeText
            position={[-15, 1, 0]}
            fontSize={2}
            color="#374151"
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI / 2, 0]}
          >
            WEST
          </SafeText>

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
      </Suspense>
    </div>
  );
};