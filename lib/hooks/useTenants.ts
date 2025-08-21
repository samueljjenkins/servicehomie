import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables, Inserts, Updates } from '@/lib/supabase'

export type Tenant = Tables<'tenants'>

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tenants on mount
  useEffect(() => {
    loadTenants()
  }, [])

  async function loadTenants() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setTenants(data || [])
    } catch (err) {
      console.error('Error loading tenants:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  async function createTenant(tenantData: Omit<Inserts<'tenants'>, 'id' | 'created_at' | 'updated_at'>) {
    try {
      setError(null)

      const { data: newTenant, error: insertError } = await supabase
        .from('tenants')
        .insert(tenantData)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      setTenants(prev => [newTenant, ...prev])
      return newTenant
    } catch (err) {
      console.error('Error creating tenant:', err)
      setError(err instanceof Error ? err.message : 'Failed to create tenant')
      throw err
    }
  }

  async function updateTenant(tenantId: string, updates: Partial<Updates<'tenants'>>) {
    try {
      setError(null)

      const { data: updatedTenant, error: updateError } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', tenantId)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setTenants(prev => prev.map(tenant => 
        tenant.id === tenantId ? updatedTenant : tenant
      ))

      return updatedTenant
    } catch (err) {
      console.error('Error updating tenant:', err)
      setError(err instanceof Error ? err.message : 'Failed to update tenant')
      throw err
    }
  }

  async function deleteTenant(tenantId: string) {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId)

      if (deleteError) {
        throw deleteError
      }

      setTenants(prev => prev.filter(tenant => tenant.id !== tenantId))
    } catch (err) {
      console.error('Error deleting tenant:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete tenant')
      throw err
    }
  }

  async function getTenantByWhopCompanyId(whopCompanyId: string) {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('whop_company_id', whopCompanyId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    } catch (err) {
      console.error('Error getting tenant by Whop company ID:', err)
      throw err
    }
  }

  async function ensureTenantExists(whopCompanyId: string, name?: string) {
    try {
      let tenant = await getTenantByWhopCompanyId(whopCompanyId)
      
      if (!tenant) {
        tenant = await createTenant({
          whop_company_id: whopCompanyId,
          name: name || `${whopCompanyId.charAt(0).toUpperCase() + whopCompanyId.slice(1)}'s Business`,
          description: null,
          logo_url: null
        })
      }
      
      return tenant
    } catch (err) {
      console.error('Error ensuring tenant exists:', err)
      throw err
    }
  }

  return {
    tenants,
    loading,
    error,
    createTenant,
    updateTenant,
    deleteTenant,
    getTenantByWhopCompanyId,
    ensureTenantExists,
    refresh: loadTenants
  }
}
