'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DashboardCard } from '@/components/dashboard-card'
import { topics } from '@/lib/topics'
import { getAllProgress, getTopicData } from '@/lib/storage'
import { BookOpen, BookMarked } from 'lucide-react'

export default function DashboardPage() {
  const [progress, setProgress] = useState({ completed: 0, total: 30, percentage: 0 })
  const [completionStatus, setCompletionStatus] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // Load progress and completion status
    const progressData = getAllProgress()
    setProgress(progressData)

    const status: Record<number, boolean> = {}
    topics.forEach((topic) => {
      const data = getTopicData(topic.id)
      status[topic.id] = data?.completed || false
    })
    setCompletionStatus(status)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  LOG 30
                </h1>
                <p className="text-muted-foreground">
                  Active English Learning Log, 30-day practice journey for Speaking
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/vocab">
                <BookMarked className="h-4 w-4" />
                All Vocab
              </Link>
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-12 rounded-lg border bg-card p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-2xl font-bold">
                {progress.completed}/{progress.total}
              </span>
            </div>
            <Progress value={progress.percentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progress.percentage}% completed · {progress.total - progress.completed} topics remaining
            </p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topics.map((topic) => (
            <DashboardCard
              key={topic.id}
              topic={topic}
              completed={completionStatus[topic.id] || false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
