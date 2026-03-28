import { CheckSquare, Clock, FileText, Mail, Phone, Users } from 'lucide-react'

import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { cn } from '#/lib/utils'

const activityConfig = {
  CALL: { icon: Phone, colorClass: 'bg-blue-100 text-blue-600', label: 'Call' },
  EMAIL: {
    icon: Mail,
    colorClass: 'bg-purple-100 text-purple-600',
    label: 'Email',
  },
  MEETING: {
    icon: Users,
    colorClass: 'bg-green-100 text-green-600',
    label: 'Meeting',
  },
  NOTE: {
    icon: FileText,
    colorClass: 'bg-gray-100 text-gray-600',
    label: 'Note',
  },
  TASK: {
    icon: CheckSquare,
    colorClass: 'bg-orange-100 text-orange-600',
    label: 'Task',
  },
} as const

type ActivityType = keyof typeof activityConfig

interface Activity {
  id: number
  type: ActivityType
  title: string
  description: string
  initials: string
  time: string
  entity: string
}

const recentActivities: Activity[] = [
  {
    id: 1,
    type: 'CALL',
    title: 'Call with Sarah Johnson',
    description:
      'Discussed pricing for Sunset Villa — interested in scheduling a viewing',
    initials: 'SJ',
    time: '2 min ago',
    entity: 'Sunset Villa',
  },
  {
    id: 2,
    type: 'NOTE',
    title: 'Note added on Oak Street deal',
    description: 'Client requested additional time to review contract terms',
    initials: 'MD',
    time: '45 min ago',
    entity: 'Oak Street Apt.',
  },
  {
    id: 3,
    type: 'EMAIL',
    title: 'Proposal sent to Chen Wei',
    description:
      'Sent property comparison report for 3 commercial listings in downtown',
    initials: 'CW',
    time: '2 hrs ago',
    entity: 'Downtown Office',
  },
  {
    id: 4,
    type: 'MEETING',
    title: 'Property tour — Riverside Condo',
    description:
      'Completed walkthrough with the Martínez family. Very positive feedback.',
    initials: 'LM',
    time: '4 hrs ago',
    entity: 'Riverside Condo',
  },
  {
    id: 5,
    type: 'TASK',
    title: 'Follow-up reminder set',
    description: 'Reminder: call back about Hillside House offer details',
    initials: 'AW',
    time: 'Yesterday',
    entity: 'Hillside House',
  },
  {
    id: 6,
    type: 'EMAIL',
    title: 'Contract draft shared',
    description: 'Sent revised contract to both parties for the Lakeview deal',
    initials: 'TE',
    time: 'Yesterday',
    entity: 'Lakeview Estate',
  },
]

function ActivityItem({ activity }: { activity: Activity }) {
  const cfg = activityConfig[activity.type]
  const Icon = cfg.icon

  return (
    <div className="flex gap-3 py-3.5">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="text-xs font-semibold">
          {activity.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium leading-tight">
            {activity.title}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {activity.time}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {activity.description}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium',
              cfg.colorClass,
            )}
          >
            <Icon className="size-3" />
            {cfg.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {activity.entity}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ActivityFeed() {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Latest updates across your contacts and deals
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Live
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y px-6">
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
