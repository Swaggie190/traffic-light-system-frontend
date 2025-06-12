import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { webSocketService } from '../services/websocket';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const WebSocketDebugger: React.FC = () => {
  const [connectionInfo, setConnectionInfo] = useState<any>({});
  const [showDebugger, setShowDebugger] = useState(false);
  
  const isConnected = useSelector((state: RootState) => state.simulation.isConnected);
  const trafficState = useSelector((state: RootState) => state.simulation.currentSimulation?.currentState);
  const trafficLights = useSelector((state: RootState) => state.simulation.trafficLights);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webSocketService && typeof (webSocketService as any).getConnectionInfo === 'function') {
        setConnectionInfo((webSocketService as any).getConnectionInfo());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleReconnect = () => {
    console.log('🔄 Manual reconnection attempt...');
    webSocketService.disconnect();
    setTimeout(() => {
      webSocketService.connect();
    }, 1000);
  };

  const handleTestSubscription = () => {
    const testSimId = 'test-simulation-' + Date.now();
    console.log(`📡 Testing subscription with simulation ID: ${testSimId}`);
    webSocketService.subscribeToSimulation(testSimId);
  };

  if (!showDebugger) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebugger(true)}
        >
          🐛 Debug WebSocket
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-background/95 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">WebSocket Debugger</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugger(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Connection Status */}
          <div className="space-y-1">
            <div className="font-medium">Connection Status</div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </Badge>
              <Badge variant="outline">
                {connectionInfo.useMock ? "Mock" : "Real"}
              </Badge>
            </div>
          </div>

          {/* Connection Info */}
          <div className="space-y-1">
            <div className="font-medium">Details</div>
            <div className="space-y-1 text-muted-foreground">
              <div>Client State: {connectionInfo.clientState || "Unknown"}</div>
              <div>Reconnect Attempts: {connectionInfo.reconnectAttempts || 0}</div>
              <div>Active Subscriptions: {connectionInfo.subscriptions?.length || 0}</div>
            </div>
          </div>

          {/* Subscriptions */}
          {connectionInfo.subscriptions?.length > 0 && (
            <div className="space-y-1">
              <div className="font-medium">Active Subscriptions</div>
              <div className="space-y-1">
                {connectionInfo.subscriptions.map((sub: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Data Flow */}
          <div className="space-y-1">
            <div className="font-medium">Data Flow</div>
            <div className="space-y-1 text-muted-foreground">
              <div>Traffic State: {trafficState ? "✅ Active" : "❌ None"}</div>
              <div>Traffic Lights: {trafficLights ? "✅ Active" : "❌ None"}</div>
              {trafficState && (
                <div>Phase: {trafficState.currentPhase}</div>
              )}
              {trafficLights && (
                <div>
                  N-S: {trafficLights.northSouth.color} | 
                  E-W: {trafficLights.eastWest.color}
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Counts */}
          {trafficState && (
            <div className="space-y-1">
              <div className="font-medium">Vehicle Counts</div>
              <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                <div>N: {trafficState.vehiclesNorth}</div>
                <div>S: {trafficState.vehiclesSouth}</div>
                <div>E: {trafficState.vehiclesEast}</div>
                <div>W: {trafficState.vehiclesWest}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconnect}
              className="w-full text-xs"
            >
              🔄 Reconnect
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSubscription}
              className="w-full text-xs"
            >
              📡 Test Subscription
            </Button>
          </div>

          {/* Console Link */}
          <div className="text-center text-muted-foreground">
            Check browser console for detailed logs
          </div>
        </CardContent>
      </Card>
    </div>
  );
};