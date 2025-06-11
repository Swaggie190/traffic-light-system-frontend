import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Download,
  GitCompare,
  Activity,
  Clock,
  Target,
} from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Analyze simulation performance and compare different scenarios
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <CompareIcon className="h-4 w-4 mr-2" />
            Compare Simulations
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Performance Index
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-green-600">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Wait Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-blue-600">-8% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Throughput
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-purple-600">vehicles/hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Efficiency
            </CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-orange-600">+5% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Scenario Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">Balanced Traffic</div>
                  <div className="text-sm text-muted-foreground">
                    Standard conditions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">4.7</div>
                  <div className="text-xs text-muted-foreground">
                    Performance Index
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">Heavy North-South</div>
                  <div className="text-sm text-muted-foreground">
                    Increased N-S traffic
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">3.9</div>
                  <div className="text-xs text-muted-foreground">
                    Performance Index
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">Rush Hour</div>
                  <div className="text-sm text-muted-foreground">
                    Peak traffic conditions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">3.2</div>
                  <div className="text-xs text-muted-foreground">
                    Performance Index
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Performance Chart</h3>
              <p className="text-muted-foreground mb-4">
                Historical performance trends will be displayed here
              </p>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Vehicle Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Processed:</span>
                  <span className="font-medium">2,456</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Queue Length:</span>
                  <span className="font-medium">3.2 vehicles</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Max Wait Time:</span>
                  <span className="font-medium">45.6s</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Pedestrian Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Crossings:</span>
                  <span className="font-medium">1,127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Wait Time:</span>
                  <span className="font-medium">18.3s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Safety Score:</span>
                  <span className="font-medium">98.5%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">System Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Phase Changes:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Green Time:</span>
                  <span className="font-medium">42.1s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>System Efficiency:</span>
                  <span className="font-medium">89.2%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">
                  Increase North-South Green Time
                </div>
                <div className="text-sm text-blue-700">
                  Analysis suggests increasing green time by 15% could improve
                  throughput by 8%
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">
                  Optimize Pedestrian Crossing
                </div>
                <div className="text-sm text-green-700">
                  Adjusting pedestrian weight to 0.4 could reduce overall wait
                  times
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-orange-900">
                  Peak Hour Adjustment
                </div>
                <div className="text-sm text-orange-700">
                  Consider dynamic timing adjustments during peak traffic hours
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
