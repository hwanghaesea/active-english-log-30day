'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { TopicSection } from '@/components/topic-section'
import { VocabBuilder } from '@/components/vocab-builder'
import { topics } from '@/lib/topics'
import { getTopicData, saveTopicData, type TopicData, type VocabEntry } from '@/lib/storage'
import { ArrowLeft, Save, Eye, Edit3 } from 'lucide-react'
import { toast } from 'sonner'

interface TopicPageProps {
  params: Promise<{ id: string }>
}

export default function TopicPage({ params }: TopicPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const topicId = parseInt(resolvedParams.id)
  const topic = topics.find((t) => t.id === topicId)

  const [isReviewMode, setIsReviewMode] = useState(false)
  const [completed, setCompleted] = useState(false)
  
  // Form state
  const [introduction, setIntroduction] = useState({ kr: '', en: '' })
  const [body1, setBody1] = useState({ kr: '', en: '' })
  const [body2, setBody2] = useState({ kr: '', en: '' })
  const [conclusion, setConclusion] = useState({ kr: '', en: '' })
  const [vocab, setVocab] = useState<VocabEntry[]>([])

  // Load data on mount
  useEffect(() => {
    const data = getTopicData(topicId)
    if (data) {
      setIntroduction(data.introduction)
      setBody1(data.body1)
      setBody2(data.body2)
      setConclusion(data.conclusion)
      setVocab(data.vocab)
      setCompleted(data.completed)
    }
  }, [topicId])

  const handleSave = () => {
    const data: TopicData = {
      introduction,
      body1,
      body2,
      conclusion,
      vocab,
      completed,
    }
    saveTopicData(topicId, data)
    toast.success('Progress saved successfully!')
  }

  const toggleCompleted = () => {
    const newCompleted = !completed
    setCompleted(newCompleted)
    const data: TopicData = {
      introduction,
      body1,
      body2,
      conclusion,
      vocab,
      completed: newCompleted,
    }
    saveTopicData(topicId, data)
    toast.success(newCompleted ? 'Marked as complete!' : 'Marked as incomplete')
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Topic not found</h1>
          <Button onClick={() => router.push('/')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="mb-1 text-sm font-mono text-muted-foreground">
                {topic.week} · Day {topic.id}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
              <div className="mt-3 rounded-lg border bg-muted/50 p-3">
                <p className="text-sm font-medium text-muted-foreground">
                  <span className="font-semibold text-foreground">Speaking Guide:</span> {topic.guide}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:flex-shrink-0">
              <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
                <Edit3 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="mode-toggle" className="cursor-pointer text-sm font-medium">
                  {isReviewMode ? 'Review' : 'Edit'}
                </Label>
                <Switch
                  id="mode-toggle"
                  checked={isReviewMode}
                  onCheckedChange={setIsReviewMode}
                />
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <TopicSection
            title="Introduction"
            krValue={introduction.kr}
            enValue={introduction.en}
            onKrChange={(value) => setIntroduction({ ...introduction, kr: value })}
            onEnChange={(value) => setIntroduction({ ...introduction, en: value })}
            readOnly={isReviewMode}
          />

          <TopicSection
            title="Body 1 (Description)"
            krValue={body1.kr}
            enValue={body1.en}
            onKrChange={(value) => setBody1({ ...body1, kr: value })}
            onEnChange={(value) => setBody1({ ...body1, en: value })}
            readOnly={isReviewMode}
          />

          <TopicSection
            title="Body 2 (Experience/Story)"
            krValue={body2.kr}
            enValue={body2.en}
            onKrChange={(value) => setBody2({ ...body2, kr: value })}
            onEnChange={(value) => setBody2({ ...body2, en: value })}
            readOnly={isReviewMode}
          />

          <TopicSection
            title="Conclusion"
            krValue={conclusion.kr}
            enValue={conclusion.en}
            onKrChange={(value) => setConclusion({ ...conclusion, kr: value })}
            onEnChange={(value) => setConclusion({ ...conclusion, en: value })}
            readOnly={isReviewMode}
          />

          <VocabBuilder vocab={vocab} onChange={setVocab} readOnly={isReviewMode} />
        </div>

        {/* Action Buttons */}
        {!isReviewMode && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3">
              <Switch
                id="completed"
                checked={completed}
                onCheckedChange={toggleCompleted}
              />
              <Label htmlFor="completed" className="cursor-pointer text-sm font-medium">
                Mark as Complete
              </Label>
            </div>

            <Button onClick={handleSave} size="lg" className="gap-2">
              <Save className="h-4 w-4" />
              Save Progress
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
