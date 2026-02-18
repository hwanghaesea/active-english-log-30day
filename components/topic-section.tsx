'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface TopicSectionProps {
  title: string
  krValue: string
  enValue: string
  onKrChange: (value: string) => void
  onEnChange: (value: string) => void
  readOnly?: boolean
}

export function TopicSection({
  title,
  krValue,
  enValue,
  onKrChange,
  onEnChange,
  readOnly = false,
}: TopicSectionProps) {
  if (readOnly) {
    // Review mode: side-by-side layout
    return (
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Korean</Label>
            <div className="min-h-[120px] whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
              {krValue || <span className="text-muted-foreground italic">No content</span>}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">English</Label>
            <div className="min-h-[120px] whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
              {enValue || <span className="text-muted-foreground italic">No content</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit mode: stacked layout
  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-kr`} className="text-sm font-medium">
            Korean (한국어)
          </Label>
          <Textarea
            id={`${title}-kr`}
            value={krValue}
            onChange={(e) => onKrChange(e.target.value)}
            placeholder="Write in Korean..."
            className="min-h-[120px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-en`} className="text-sm font-medium">
            English
          </Label>
          <Textarea
            id={`${title}-en`}
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            placeholder="Write in English..."
            className="min-h-[120px] resize-none"
          />
        </div>
      </div>
    </div>
  )
}
