import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Calendar,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { cn } from '#/lib/utils'

const stats = [
  {
    title: 'Total Contacts',
    value: '247',
    description: '34 leads · 189 clients',
    icon: Users,
    trend: '+12 this month',
    trendUp: true,
    iconClass: 'bg-violet-100 text-violet-600',
  },
  {
    title: 'Properties',
    value: '89',
    description: '62 available · 18 reserved',
    icon: Building2,
    trend: '+5 this month',
    trendUp: true,
    iconClass: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Open Deals',
    value: '$2.4M',
    description: '12 active deals',
    icon: TrendingUp,
    trend: '+$340K this month',
    trendUp: true,
    iconClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Upcoming Activities',
    value: '18',
    description: '3 overdue',
    icon: Calendar,
    trend: '8 due today',
    trendUp: false,
    iconClass: 'bg-amber-100 text-amber-600',
  },
] as const

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const Icon = stat.icon
  return (
    <Card className="gap-3">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className={cn('rounded-lg p-2.5', stat.iconClass)}>
            <Icon className="size-5" />
          </div>
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              stat.trendUp ? 'text-emerald-600' : 'text-amber-600',
            )}
          >
            {stat.trendUp ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <AlertCircle className="size-3" />
            )}
            {stat.trend}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
        <p className="mt-0.5 text-sm font-medium">{stat.title}</p>
        <p className="text-xs text-muted-foreground">{stat.description}</p>
      </CardContent>
    </Card>
  )
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  )
}
