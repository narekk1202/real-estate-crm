import { Building2, CheckSquare, TrendingUp, Users } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { cn } from '#/lib/utils'

const items = [
  {
    label: 'New contacts',
    value: '12',
    icon: Users,
    colorClass: 'text-violet-600',
  },
  {
    label: 'Properties listed',
    value: '5',
    icon: Building2,
    colorClass: 'text-blue-600',
  },
  {
    label: 'Deals closed',
    value: '3',
    icon: TrendingUp,
    colorClass: 'text-emerald-600',
  },
  {
    label: 'Activities done',
    value: '41',
    icon: CheckSquare,
    colorClass: 'text-orange-600',
  },
] as const

export function ThisMonthSummary() {
  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">This Month</CardTitle>
        <CardDescription className="text-xs">
          Activity summary for March 2026
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className={cn('size-4', item.colorClass)} />
                {item.label}
              </div>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
