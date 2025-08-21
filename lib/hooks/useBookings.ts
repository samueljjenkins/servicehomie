import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates } from '@/lib/supabase'

export type Booking = Tables<'bookings'>

export interface BookingWithDetails extends Booking {
  service: {
    name: string
    description: string | null
    price: number
    duration_minutes: number
  }
  customer: {
    email: string
    first_name: string | null
    last_name: string | null
  }
}

export function useBookings(tenantId: string) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load bookings on mount
  useEffect(() => {
    if (tenantId) {
      loadBookings()
    }
  }, [tenantId])

  async function loadBookings() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(name, description, price, duration_minutes),
          customer:customers(email, first_name, last_name)
        `)
        .eq('tenant_id', tenantId)
        .order('booking_date', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setBookings(data || [])
    } catch (err) {
      console.error('Error loading bookings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  async function createBooking(bookingData: Omit<Inserts<'bookings'>, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) {
    try {
      setError(null)

      const { data: newBooking, error: insertError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          tenant_id: tenantId
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // Reload bookings to get the full details
      await loadBookings()
      return newBooking
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err instanceof Error ? err.message : 'Failed to create booking')
      throw err
    }
  }

  async function updateBooking(bookingId: string, updates: Partial<Updates<'bookings'>>) {
    try {
      setError(null)

      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .eq('tenant_id', tenantId)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
      ))

      return updatedBooking
    } catch (err) {
      console.error('Error updating booking:', err)
      setError(err instanceof Error ? err.message : 'Failed to update booking')
      throw err
    }
  }

  async function cancelBooking(bookingId: string) {
    return updateBooking(bookingId, { status: 'cancelled' })
  }

  async function confirmBooking(bookingId: string) {
    return updateBooking(bookingId, { status: 'confirmed' })
  }

  async function completeBooking(bookingId: string) {
    return updateBooking(bookingId, { status: 'completed' })
  }

  // Get upcoming bookings (today and future)
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookingDate >= today && booking.status !== 'cancelled'
  })

  // Get past bookings
  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookingDate < today || booking.status === 'cancelled'
  })

  return {
    bookings,
    upcomingBookings,
    pastBookings,
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    confirmBooking,
    completeBooking,
    refresh: loadBookings
  }
}
