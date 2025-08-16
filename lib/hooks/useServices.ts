import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates } from '@/lib/supabase'

export type Service = Tables<'services'>

export function useServices(tenantId: string) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load services on mount
  useEffect(() => {
    if (tenantId) {
      loadServices()
    }
  }, [tenantId])

  async function loadServices() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setServices(data || [])
    } catch (err) {
      console.error('Error loading services:', err)
      setError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  async function addService(serviceData: Omit<Inserts<'services'>, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) {
    try {
      setError(null)

      const { data: newService, error: insertError } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          tenant_id: tenantId
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      setServices(prev => [newService, ...prev])
      return newService
    } catch (err) {
      console.error('Error adding service:', err)
      setError(err instanceof Error ? err.message : 'Failed to add service')
      throw err
    }
  }

  async function updateService(serviceId: string, updates: Partial<Updates<'services'>>) {
    try {
      setError(null)

      const { data: updatedService, error: updateError } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .eq('tenant_id', tenantId)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setServices(prev => prev.map(service => 
        service.id === serviceId ? updatedService : service
      ))

      return updatedService
    } catch (err) {
      console.error('Error updating service:', err)
      setError(err instanceof Error ? err.message : 'Failed to update service')
      throw err
    }
  }

  async function deleteService(serviceId: string) {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('tenant_id', tenantId)

      if (deleteError) {
        throw deleteError
      }

      setServices(prev => prev.filter(service => service.id !== serviceId))
    } catch (err) {
      console.error('Error deleting service:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete service')
      throw err
    }
  }

  async function toggleServiceStatus(serviceId: string) {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    const newStatus = service.status === 'active' ? 'inactive' : 'active'
    await updateService(serviceId, { status: newStatus })
  }

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refresh: loadServices
  }
}
