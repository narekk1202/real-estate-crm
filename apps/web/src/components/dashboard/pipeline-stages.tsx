import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'

interface DealStage {
  label: string
  count: number
  value: number
  barClass: string
}

const dealStages: DealStage[] = [
  { label: 'Prospect', count: 5, value: 420_000, barClass: 'bg-slate-400' },
  { label: 'Negotiation', count: 3, value: 680_000, barClass: 'bg-blue-500' },
  { label: 'Contract', count: 2, value: 860_000, barClass: 'bg-amber-500' },
  {
    label: 'Closed Won',
    count: 18,
    value: 4_200_000,
    barClass: 'bg-emerald-500',
  },
  { label: 'Closed Lost', count: 6, value: 890_000, barClass: 'bg-red-400' },
]

const maxValue = Math.max(...dealStages.map((s) => s.value))
const totalValue = dealStages.reduce((acc, s) => acc + s.value, 0)

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  return `$${val}`
}

function StageRow({ stage }: { stage: DealStage }) {
  const pct = (stage.value / maxValue) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className={cn('size-2 rounded-full', stage.barClass)} />
          <span className="font-medium">{stage.label}</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-xs">
            {stage.count}
          </Badge>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {formatCurrency(stage.value)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full', stage.barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function PipelineStages() {
  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Pipeline by Stage</CardTitle>
        <CardDescription className="text-xs">
          Current deal distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dealStages.map((stage) => (
          <StageRow key={stage.label} stage={stage} />
        ))}
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Total Pipeline
          </span>
          <span className="font-bold">{formatCurrency(totalValue)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
