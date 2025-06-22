"use client"

import { useState } from "react"
import { Moon, Sun, Shield, AlertTriangle, Network, Clock, Activity, Zap, Eye, TrendingUp } from "lucide-react"
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
    setIsLoading(true)
    setPrediction(null)

    // Simulate API call to ML model
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock prediction logic - in real app, this would call your backend
    const isAnomaly = Math.random() > 0.7 // 30% chance of anomaly
    const confidence = Math.random() * 100

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW"
    let message = "Network traffic appears normal"

    if (isAnomaly) {
      if (confidence > 90) {
        riskLevel = "CRITICAL"
        message = "CRITICAL: High probability of network attack detected!"
      } else if (confidence > 70) {
        riskLevel = "HIGH"
        message = "HIGH RISK: Suspicious network activity detected"
      } else if (confidence > 50) {
        riskLevel = "MEDIUM"
        message = "MEDIUM RISK: Potential anomaly in network traffic"
      } else {
        riskLevel = "LOW"
        message = "LOW RISK: Minor irregularities detected"
      }
    } else {
      message = "Network traffic is normal - no threats detected"
    }

    setPrediction({
      isAnomaly,
      confidence: Math.round(confidence),
      riskLevel,
      message,
      timestamp: new Date().toLocaleString(),
    })

    setIsLoading(false)
  }

  const isFormValid = Object.values(networkData).every((value) => value.trim() !== "")

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "from-red-500 to-red-600"
      case "HIGH":
        return "from-orange-500 to-red-500"
      case "MEDIUM":
        return "from-yellow-500 to-orange-500"
      case "LOW":
        return "from-blue-500 to-cyan-500"
      default:
        return "from-emerald-500 to-teal-500"
    }
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-0"
      case "HIGH":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"
      case "MEDIUM":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"
      case "LOW":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
      default:
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Network Anomaly Detection
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">AI-Powered Network Security Monitor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800">
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">System Active</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full border-2 hover:scale-105 transition-transform"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Scans</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <Eye className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Normal Traffic</p>
                  <p className="text-2xl font-bold">94.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Anomalies</p>
                  <p className="text-2xl font-bold">72</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Accuracy</p>
                  <p className="text-2xl font-bold">98.7%</p>
                </div>
                <Zap className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Network Traffic Data
                </span>
              </CardTitle>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                Enter network flow information to analyze for potential anomalies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="flowID" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Flow ID
                  </Label>
                  <Input
                    id="flowID"
                    placeholder="e.g., FL_001234"
                    value={networkData.flowID}
                    onChange={(e) => handleInputChange("flowID", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="protocol" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Protocol
                  </Label>
                  <Select value={networkData.protocol} onValueChange={(value) => handleInputChange("protocol", value)}>
                    <SelectTrigger className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="srcIP" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Source IP
                  </Label>
                  <Input
                    id="srcIP"
                    placeholder="e.g., 192.168.1.100"
                    value={networkData.srcIP}
                    onChange={(e) => handleInputChange("srcIP", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="destIP" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Destination IP
                  </Label>
                  <Input
                    id="destIP"
                    placeholder="e.g., 10.0.0.50"
                    value={networkData.destIP}
                    onChange={(e) => handleInputChange("destIP", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="srcPort" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Source Port
                  </Label>
                  <Input
                    id="srcPort"
                    placeholder="e.g., 8080"
                    value={networkData.srcPort}
                    onChange={(e) => handleInputChange("srcPort", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="destPort" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Destination Port
                  </Label>
                  <Input
                    id="destPort"
                    placeholder="e.g., 443"
                    value={networkData.destPort}
                    onChange={(e) => handleInputChange("destPort", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="timestamp" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Timestamp
                </Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={networkData.timestamp}
                  onChange={(e) => handleInputChange("timestamp", e.target.value)}
                  className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl h-12"
                />
              </div>

              <Button
                onClick={handlePredict}
                disabled={!isFormValid || isLoading}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing Network Traffic...
                  </>
                ) : (
                  <>
                    <Shield className="mr-3 h-5 w-5" />
                    Predict Anomaly
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Analysis Results
                </span>
              </CardTitle>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                AI model prediction results and threat assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!prediction && !isLoading && (
                <div className="text-center py-16">
                  <div className="p-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Network className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    Enter network data and click "Predict Anomaly" to analyze
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    Analyzing network traffic patterns...
                  </p>
                </div>
              )}

              {prediction && (
                <div className="space-y-8">
                  <Alert
                    className={`border-2 rounded-xl p-6 ${
                      prediction.isAnomaly
                        ? "border-red-200 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
                        : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 ${prediction.isAnomaly ? "text-red-600" : "text-emerald-600"}`}
                    />
                    <AlertDescription className="text-lg font-semibold ml-2">{prediction.message}</AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-6">
                    <Card
                      className={`border-0 bg-gradient-to-br ${
                        prediction.isAnomaly ? "from-red-500 to-orange-500" : "from-emerald-500 to-teal-500"
                      } text-white shadow-lg`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">{prediction.isAnomaly ? "ANOMALY" : "NORMAL"}</div>
                        <div className="text-sm opacity-90 font-medium">Network Status</div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">{prediction.confidence}%</div>
                        <div className="text-sm opacity-90 font-medium">Confidence Score</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Risk Level</span>
                      <Badge className={`px-4 py-2 text-sm font-bold ${getRiskBadgeColor(prediction.riskLevel)}`}>
                        {prediction.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analysis Time</span>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        <Clock className="h-4 w-4" />
                        {prediction.timestamp}
                      </div>
                    </div>
                  </div>

                  {prediction.isAnomaly && (
                    <Alert className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <AlertDescription>
                        <strong className="text-orange-800 dark:text-orange-300">Recommended Security Actions:</strong>
                        <ul className="mt-3 space-y-2 text-sm text-orange-700 dark:text-orange-300">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Monitor this connection closely for suspicious patterns
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Review firewall logs for related network activity
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Consider implementing IP blocking for suspicious sources
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Alert security team immediately if confidence exceeds 85%
                          </li>
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
