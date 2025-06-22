"use client"

import { useState } from "react"
import { Moon, Sun, Shield, AlertTriangle, Network, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"

interface NetworkData {
  flowID: string
  srcIP: string
  destIP: string
  srcPort: string
  destPort: string
  timestamp: string
  protocol: string
}

interface PredictionResult {
  isAnomaly: boolean
  confidence: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  message: string
  timestamp: string
}

export default function AnomalyDetectionDashboard() {
  const { theme, setTheme } = useTheme()
  const [networkData, setNetworkData] = useState<NetworkData>({
    flowID: "",
    srcIP: "",
    destIP: "",
    srcPort: "",
    destPort: "",
    timestamp: "",
    protocol: "",
  })
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof NetworkData, value: string) => {
    setNetworkData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePredict = async () => {
    setIsLoading(true);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(networkData),
      });
      const apiResponse = await response.json();

      // Map backend response to your PredictionResult interface
      setPrediction({
        isAnomaly: apiResponse.prediction !== "Normal",
        confidence: apiResponse.confidence ?? 100,
        riskLevel:
          apiResponse.riskLevel ??
          (apiResponse.prediction === "Normal" ? "LOW" : "HIGH"),
        message: apiResponse.prediction,
        timestamp: new Date().toLocaleString(),
      });
    } catch (error) {
      setPrediction({
        isAnomaly: false,
        confidence: 0,
        riskLevel: "LOW",
        message: "Error connecting to backend.",
        timestamp: new Date().toLocaleString(),
      });
    }

    setIsLoading(false);
  };

  const isFormValid = Object.values(networkData).every((value) => value.trim() !== "")

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Network Anomaly Detection</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Network Security Monitor</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Traffic Data
              </CardTitle>
              <CardDescription>Enter network flow information to analyze for potential anomalies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flowID">Flow ID</Label>
                  <Input
                    id="flowID"
                    placeholder="e.g., FL_001234"
                    value={networkData.flowID}
                    onChange={(e) => handleInputChange("flowID", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select value={networkData.protocol} onValueChange={(value) => handleInputChange("protocol", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TCP">TCP</SelectItem>
                      <SelectItem value="UDP">UDP</SelectItem>
                      <SelectItem value="ICMP">ICMP</SelectItem>
                      <SelectItem value="HTTP">HTTP</SelectItem>
                      <SelectItem value="HTTPS">HTTPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="srcIP">Source IP</Label>
                  <Input
                    id="srcIP"
                    placeholder="e.g., 192.168.1.100"
                    value={networkData.srcIP}
                    onChange={(e) => handleInputChange("srcIP", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destIP">Destination IP</Label>
                  <Input
                    id="destIP"
                    placeholder="e.g., 10.0.0.50"
                    value={networkData.destIP}
                    onChange={(e) => handleInputChange("destIP", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="srcPort">Source Port</Label>
                  <Input
                    id="srcPort"
                    placeholder="e.g., 8080"
                    value={networkData.srcPort}
                    onChange={(e) => handleInputChange("srcPort", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destPort">Destination Port</Label>
                  <Input
                    id="destPort"
                    placeholder="e.g., 443"
                    value={networkData.destPort}
                    onChange={(e) => handleInputChange("destPort", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={networkData.timestamp}
                  onChange={(e) => handleInputChange("timestamp", e.target.value)}
                />
              </div>

              <Button onClick={handlePredict} disabled={!isFormValid || isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Predict Anomaly
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>AI model prediction results and threat assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {!prediction && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter network data and click "Predict Anomaly" to analyze</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyzing network traffic...</p>
                </div>
              )}

              {prediction && (
                <div className="space-y-6">
                  <Alert className={prediction.isAnomaly ? "border-red-500" : "border-green-500"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{prediction.message}</AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold mb-1">{prediction.isAnomaly ? "ANOMALY" : "NORMAL"}</div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold mb-1">{prediction.confidence}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge className={`${getRiskColor(prediction.riskLevel)} text-white`}>
                        {prediction.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analysis Time</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {prediction.timestamp}
                      </div>
                    </div>
                  </div>

                  {prediction.isAnomaly && (
                    <Alert className="border-orange-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Recommended Actions:</strong>
                        <ul className="mt-2 list-disc list-inside text-sm">
                          <li>Monitor this connection closely</li>
                          <li>Check firewall logs for related activity</li>
                          <li>Consider blocking suspicious IPs</li>
                          <li>Alert security team if confidence is high</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
