import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store";
import { cn } from "../../lib/utils";
import {
  BarChart3,
  Dashboard,
  Play,
  Settings,
  Traffic,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface AppShellProps {
  children: ReactNode;
}

const NavigationItem = ({
  to,
  icon: Icon,
  label,
  isActive,
}: {
  to: string;
  icon: any;
  label: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
      isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-accent",
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

const ConnectionStatus = () => {
  const isConnected = useSelector(
    (state: RootState) => state.simulation.isConnected,
  );

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <Badge variant="outline" className="text-green-700 border-green-200">
            Connected
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <Badge variant="outline" className="text-red-700 border-red-200">
            Disconnected
          </Badge>
        </>
      )}
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { to: "/", icon: Dashboard, label: "Dashboard" },
    { to: "/simulation", icon: Play, label: "Simulation" },
    { to: "/scenarios", icon: Settings, label: "Scenarios" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Traffic className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Traffic Control</h1>
            <p className="text-sm text-muted-foreground">Simulation System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavigationItem
            key={item.to}
            {...item}
            isActive={currentPath === item.to}
          />
        ))}
      </nav>

      {/* Connection Status */}
      <div className="p-4 border-t border-border">
        <ConnectionStatus />
      </div>
    </div>
  );
};

const Header = () => (
  <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
    <div>
      <h2 className="font-semibold text-xl">Traffic Light Control System</h2>
      <p className="text-sm text-muted-foreground">
        Real-time 3D Traffic Simulation
      </p>
    </div>
    <div className="flex items-center gap-4">
      <Badge variant="secondary">v1.0.0</Badge>
    </div>
  </header>
);

const AppShellContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <Provider store={store}>
      <AppShellContent>{children}</AppShellContent>
    </Provider>
  );
};
