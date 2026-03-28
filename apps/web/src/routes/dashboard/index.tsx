import { createFileRoute } from '@tanstack/react-router'

import { ActivityFeed } from '#/components/dashboard/activity-feed'
import { PipelineStages } from '#/components/dashboard/pipeline-stages'
import { StatsGrid } from '#/components/dashboard/stats-grid'
import { ThisMonthSummary } from '#/components/dashboard/this-month-summary'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="flex flex-col gap-4">
          <PipelineStages />
          <ThisMonthSummary />
        </div>
      </div>
    </div>
  )
}
