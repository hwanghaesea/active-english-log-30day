'use client'

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
import { Plus, X } from 'lucide-react'
import type { VocabEntry } from '@/lib/storage'

interface VocabBuilderProps {
  vocab: VocabEntry[]
  onChange: (vocab: VocabEntry[]) => void
  readOnly?: boolean
}

export function VocabBuilder({ vocab, onChange, readOnly = false }: VocabBuilderProps) {
  const addRow = () => {
    onChange([...vocab, { word: '', meaning: '' }])
  }

  const deleteRow = (index: number) => {
    onChange(vocab.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: 'word' | 'meaning', value: string) => {
    const updated = [...vocab]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  if (readOnly) {
    return (
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Vocabulary</h3>
        {vocab.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No vocabulary added</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">Word / Expression</TableHead>
                  <TableHead className="w-[55%]">Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vocab.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{entry.word}</TableCell>
                    <TableCell>{entry.meaning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vocabulary Builder</h3>
        <Button onClick={addRow} size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>
      
      {vocab.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Click "Add Row" to start building your vocabulary list
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Word / Expression</TableHead>
                <TableHead className="w-[50%]">Meaning</TableHead>
                <TableHead className="w-[10%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vocab.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={entry.word}
                      onChange={(e) => updateRow(index, 'word', e.target.value)}
                      placeholder="Enter word..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={entry.meaning}
                      onChange={(e) => updateRow(index, 'meaning', e.target.value)}
                      placeholder="Enter meaning..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteRow(index)}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
