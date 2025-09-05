'use client'

import { useEffect, useRef } from 'react'

// Mock chart data - replace with actual Chart.js implementation
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [10000, 10400, 10200, 10800, 11200, 12400],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
    }
  ]
}

export function YieldChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // This is a placeholder for Chart.js implementation
    // You'll need to install and import Chart.js here
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        // Simple mock chart drawing
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        
        ctx.strokeStyle = '#22c55e'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(0, 150)
        ctx.lineTo(100, 120)
        ctx.lineTo(200, 140)
        ctx.lineTo(300, 100)
        ctx.lineTo(400, 80)
        ctx.lineTo(500, 60)
        ctx.stroke()
      }
    }
  }, [])

  return (
    <div className="h-64 w-full relative">
      <canvas 
        ref={canvasRef}
        width={500}
        height={200}
        className="w-full h-full rounded-lg"
      />
      <div className="absolute top-4 left-4 text-white">
        <p className="text-2xl font-bold text-green-400">$12,400</p>
        <p className="text-sm text-gray-400">+$2,400 (24%)</p>
      </div>
    </div>
  )
}
