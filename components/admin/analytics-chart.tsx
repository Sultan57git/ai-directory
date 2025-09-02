"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnalyticsChart() {
  const data = [
    { name: "Jan", submissions: 65, approvals: 58, users: 1200 },
    { name: "Feb", submissions: 78, approvals: 72, users: 1350 },
    { name: "Mar", submissions: 90, approvals: 85, users: 1500 },
    { name: "Apr", submissions: 81, approvals: 76, users: 1680 },
    { name: "May", submissions: 95, approvals: 89, users: 1890 },
    { name: "Jun", submissions: 110, approvals: 102, users: 2100 },
    { name: "Jul", submissions: 125, approvals: 118, users: 2350 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="submissions"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Submissions"
            />
            <Line type="monotone" dataKey="approvals" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Approvals" />
            <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" strokeWidth={2} name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
