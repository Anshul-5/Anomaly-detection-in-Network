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
      {/* Mobile-First Responsive Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title - Responsive */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Network Anomaly Detection
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                  AI-Powered Network Security Monitor
                </p>
              </div>
            </div>

            {/* Right Side Controls - Responsive */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Status Badge - Hidden on small mobile */}
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 hidden md:inline">
                  System Active
                </span>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full border-2 hover:scale-105 transition-transform h-9 w-9 sm:h-10 sm:w-10"
              >
                <Sun className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Responsive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-blue-100 text-xs sm:text-sm font-medium truncate">Total Scans</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">1,247</p>
                </div>
                <Eye className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-emerald-100 text-xs sm:text-sm font-medium truncate">Normal Traffic</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">94.2%</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-orange-100 text-xs sm:text-sm font-medium truncate">Anomalies</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">72</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-orange-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-purple-100 text-xs sm:text-sm font-medium truncate">Accuracy</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">98.7%</p>
                </div>
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-200 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Form - Mobile Optimized */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Network className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Network Traffic Data
                </span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Enter network flow information to analyze for potential anomalies
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6">
              {/* Form Fields - Mobile First Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="flowID" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Flow ID
                  </Label>
                  <Input
                    id="flowID"
                    placeholder="e.g., FL_001234"
                    value={networkData.flowID}
                    onChange={(e) => handleInputChange("flowID", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="protocol" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Protocol
                  </Label>
                  <Select value={networkData.protocol} onValueChange={(value) => handleInputChange("protocol", value)}>
                    <SelectTrigger className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="srcIP" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Source IP
                  </Label>
                  <Input
                    id="srcIP"
                    placeholder="e.g., 192.168.1.100"
                    value={networkData.srcIP}
                    onChange={(e) => handleInputChange("srcIP", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="destIP" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Destination IP
                  </Label>
                  <Input
                    id="destIP"
                    placeholder="e.g., 10.0.0.50"
                    value={networkData.destIP}
                    onChange={(e) => handleInputChange("destIP", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="srcPort" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Source Port
                  </Label>
                  <Input
                    id="srcPort"
                    placeholder="e.g., 8080"
                    value={networkData.srcPort}
                    onChange={(e) => handleInputChange("srcPort", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="destPort" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Destination Port
                  </Label>
                  <Input
                    id="destPort"
                    placeholder="e.g., 443"
                    value={networkData.destPort}
                    onChange={(e) => handleInputChange("destPort", e.target.value)}
                    className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="timestamp" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Timestamp
                </Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={networkData.timestamp}
                  onChange={(e) => handleInputChange("timestamp", e.target.value)}
                  className="border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base"
                />
              </div>

              {/* Mobile-Optimized Button */}
              <Button
                onClick={handlePredict}
                disabled={!isFormValid || isLoading}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span className="hidden sm:inline">Analyzing Network Traffic...</span>
                    <span className="sm:hidden">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    Predict Anomaly
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section - Mobile Optimized */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Analysis Results
                </span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                AI model prediction results and threat assessment
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!prediction && !isLoading && (
                <div className="text-center py-12 sm:py-16">
                  <div className="p-4 sm:p-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <Network className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium px-4">
                    Enter network data and click "Predict Anomaly" to analyze
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12 sm:py-16">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium px-4">
                    <span className="hidden sm:inline">Analyzing network traffic patterns...</span>
                    <span className="sm:hidden">Analyzing traffic...</span>
                  </p>
                </div>
              )}

              {prediction && (
                <div className="space-y-6 sm:space-y-8">
                  {/* Alert Message - Mobile Optimized */}
                  <Alert
                    className={`border-2 rounded-lg sm:rounded-xl p-4 sm:p-6 ${
                      prediction.isAnomaly
                        ? "border-red-200 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
                        : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${prediction.isAnomaly ? "text-red-600" : "text-emerald-600"}`}
                    />
                    <AlertDescription className="text-base sm:text-lg font-semibold ml-2 leading-relaxed">
                      {prediction.message}
                    </AlertDescription>
                  </Alert>

                  {/* Status Cards - Mobile Stack */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card
                      className={`border-0 bg-gradient-to-br ${
                        prediction.isAnomaly ? "from-red-500 to-orange-500" : "from-emerald-500 to-teal-500"
                      } text-white shadow-lg`}
                    >
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold mb-2">
                          {prediction.isAnomaly ? "ANOMALY" : "NORMAL"}
                        </div>
                        <div className="text-sm opacity-90 font-medium">Network Status</div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold mb-2">{prediction.confidence}%</div>
                        <div className="text-sm opacity-90 font-medium">Confidence Score</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Details Section - Mobile Optimized */}
                  <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Risk Level</span>
                      <Badge
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-bold self-start sm:self-auto ${getRiskBadgeColor(prediction.riskLevel)}`}
                      >
                        {prediction.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analysis Time</span>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">{prediction.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations - Mobile Optimized */}
                  {prediction.isAnomaly && (
                    <Alert className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      <AlertDescription>
                        <strong className="text-orange-800 dark:text-orange-300 text-sm sm:text-base">
                          Recommended Security Actions:
                        </strong>
                        <ul className="mt-3 space-y-2 text-sm text-orange-700 dark:text-orange-300">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                            <span>Monitor this connection closely for suspicious patterns</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                            <span>Review firewall logs for related network activity</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                            <span>Consider implementing IP blocking for suspicious sources</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                            <span>Alert security team immediately if confidence exceeds 85%</span>
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
