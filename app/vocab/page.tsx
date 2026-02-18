'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllVocab, type VocabWithSource } from '@/lib/storage'
import { topics } from '@/lib/topics'
import { ArrowLeft, BookOpen, Search } from 'lucide-react'

export default function VocabArchivePage() {
  const [allVocab, setAllVocab] = useState<VocabWithSource[]>([])
  const [filteredVocab, setFilteredVocab] = useState<VocabWithSource[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const vocab = getAllVocab()
    // Enhance with full topic titles
    const enhancedVocab = vocab.map((entry) => {
      const topic = topics.find((t) => t.id === entry.topicId)
      return {
        ...entry,
        topicTitle: topic ? `Day ${topic.id}: ${topic.title}` : `Day ${entry.topicId}`,
      }
    })
    setAllVocab(enhancedVocab)
    setFilteredVocab(enhancedVocab)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVocab(allVocab)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allVocab.filter(
      (entry) =>
        entry.word.toLowerCase().includes(query) ||
        entry.meaning.toLowerCase().includes(query) ||
        entry.topicTitle.toLowerCase().includes(query)
    )
    setFilteredVocab(filtered)
  }, [searchQuery, allVocab])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Global Vocabulary Archive
              </h1>
              <p className="text-muted-foreground">
                All words and expressions from your 30-day journey
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by word, meaning, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Vocabulary Entries
            </span>
            <span className="text-2xl font-bold">{allVocab.length}</span>
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Showing {filteredVocab.length} result{filteredVocab.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Vocabulary Table */}
        {filteredVocab.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              {searchQuery ? 'No matching vocabulary found' : 'No vocabulary entries yet'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'Try a different search term'
                : 'Start adding vocabulary in your topic pages to see them here'}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Word / Expression</TableHead>
                    <TableHead className="w-[40%]">Meaning</TableHead>
                    <TableHead className="w-[25%]">Source Topic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVocab.map((entry, index) => (
                    <TableRow key={`${entry.topicId}-${index}`}>
                      <TableCell className="font-medium">{entry.word}</TableCell>
                      <TableCell>{entry.meaning}</TableCell>
                      <TableCell>
                        <Link
                          href={`/topic/${entry.topicId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {entry.topicTitle}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
