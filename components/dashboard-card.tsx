'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Edit3 } from 'lucide-react'
import type { Topic } from '@/lib/topics'

interface DashboardCardProps {
  topic: Topic
  completed: boolean
}

export function DashboardCard({ topic, completed }: DashboardCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-muted-foreground">
                  Day {topic.id}
                </span>
                {completed && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Done
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg leading-tight">
                {topic.title}
              </h3>
            </div>
          </div>
          
          <Link href={`/topic/${topic.id}`} className="mt-auto">
            <Button variant={completed ? "outline" : "default"} className="w-full gap-2">
              <Edit3 className="h-4 w-4" />
              {completed ? 'Review' : 'Write'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
