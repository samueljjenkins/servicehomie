import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates } from '@/lib/supabase'
import type { WeeklyAvailability, Weekday, TimeWindow } from '@/lib/availability'

export type AvailabilityRecord = Tables<'availability'>

export function useAvailability(tenantId: string) {
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    0: [], // Sunday
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: []  // Saturday
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load availability on mount
  useEffect(() => {
    if (tenantId) {
      loadAvailability()
    }
  }, [tenantId])

  async function loadAvailability() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('availability')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)

      if (fetchError) {
        throw fetchError
      }

      // Convert database records to WeeklyAvailability format
      const weeklyAvailability: WeeklyAvailability = {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
      }

      data?.forEach(record => {
        weeklyAvailability[record.day_of_week as Weekday] = [{
          start: record.start_time,
          end: record.end_time
        }]
      })

      setAvailability(weeklyAvailability)
    } catch (err) {
      console.error('Error loading availability:', err)
      setError(err instanceof Error ? err.message : 'Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  async function saveAvailability(weeklyAvailability: WeeklyAvailability) {
    try {
      setError(null)

      // Clear existing availability for this tenant
      const { error: deleteError } = await supabase
        .from('availability')
        .delete()
        .eq('tenant_id', tenantId)

      if (deleteError) {
        throw deleteError
      }

      // Insert new availability records
      const availabilityRecords: Omit<Inserts<'availability'>, 'id' | 'created_at' | 'updated_at'>[] = []

      Object.entries(weeklyAvailability).forEach(([weekday, windows]) => {
        if (windows.length > 0) {
          windows.forEach(window => {
            availabilityRecords.push({
              tenant_id: tenantId,
              day_of_week: parseInt(weekday),
              start_time: window.start,
              end_time: window.end,
              is_active: true
            })
          })
        }
      })

      if (availabilityRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('availability')
          .insert(availabilityRecords)

        if (insertError) {
          throw insertError
        }
      }

      setAvailability(weeklyAvailability)
      return true
    } catch (err) {
      console.error('Error saving availability:', err)
      setError(err instanceof Error ? err.message : 'Failed to save availability')
      throw err
    }
  }

  async function updateTimeWindow(dayIndex: Weekday, windowIndex: number, field: keyof TimeWindow, value: string) {
    const next = structuredClone(availability)
    next[dayIndex][windowIndex][field] = value
    setAvailability(next)
  }

  async function addTimeWindow(dayIndex: Weekday) {
    const next = structuredClone(availability)
    next[dayIndex].push({ start: "09:00", end: "17:00" })
    setAvailability(next)
  }

  async function removeTimeWindow(dayIndex: Weekday, windowIndex: number) {
    const next = structuredClone(availability)
    next[dayIndex].splice(windowIndex, 1)
    setAvailability(next)
  }

  async function toggleDayEnabled(dayIndex: Weekday) {
    const windows = availability[dayIndex]
    const next = { ...availability, [dayIndex]: windows.length ? [] : [{ start: "09:00", end: "17:00" }] } as WeeklyAvailability
    setAvailability(next)
  }

  return {
    availability,
    loading,
    error,
    saveAvailability,
    updateTimeWindow,
    addTimeWindow,
    removeTimeWindow,
    toggleDayEnabled,
    refresh: loadAvailability
  }
}
