export interface VocabEntry {
  word: string
  meaning: string
}

export interface TopicData {
  introduction: { kr: string; en: string }
  body1: { kr: string; en: string }
  body2: { kr: string; en: string }
  conclusion: { kr: string; en: string }
  vocab: VocabEntry[]
  completed: boolean
}

const STORAGE_PREFIX = 'topic-'

export function saveTopicData(id: number, data: TopicData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save topic data:', error)
  }
}

export function getTopicData(id: number): TopicData | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load topic data:', error)
    return null
  }
}

export function getAllProgress(): { completed: number; total: number; percentage: number } {
  if (typeof window === 'undefined') return { completed: 0, total: 30, percentage: 0 }
  
  let completedCount = 0
  const total = 30

  for (let i = 1; i <= total; i++) {
    const data = getTopicData(i)
    if (data?.completed) {
      completedCount++
    }
  }

  return {
    completed: completedCount,
    total,
    percentage: Math.round((completedCount / total) * 100),
  }
}

export interface VocabWithSource extends VocabEntry {
  topicId: number
  topicTitle: string
}

export function getAllVocab(): VocabWithSource[] {
  if (typeof window === 'undefined') return []
  
  const allVocab: VocabWithSource[] = []
  
  // Import topics dynamically to avoid circular dependency
  for (let i = 1; i <= 30; i++) {
    const data = getTopicData(i)
    if (data && data.vocab && data.vocab.length > 0) {
      data.vocab.forEach((entry) => {
        if (entry.word || entry.meaning) {
          allVocab.push({
            ...entry,
            topicId: i,
            topicTitle: `Day ${i}`,
          })
        }
      })
    }
  }
  
  return allVocab
}
