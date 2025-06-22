"use client"

import { ThemeProvider } from "./theme-provider"
import AnomalyDetectionDashboard from "./dashboard"

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AnomalyDetectionDashboard />
    </ThemeProvider>
  )
}
