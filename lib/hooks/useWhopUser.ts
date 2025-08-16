import { useState, useEffect } from 'react'
import { useIframeSdk } from '@whop/react'
import { supabase } from '@/lib/supabase'
import { useTenants } from './useTenants'
import type { Tables } from '@/lib/supabase'

export interface WhopUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  tenant_id: string
  whop_user_id: string
}

export function useWhopUser(tenantId: string) {
  const sdk = useIframeSdk()
  const { ensureTenantExists } = useTenants()
  const [user, setUser] = useState<WhopUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function authenticateUser() {
      try {
        setLoading(true)
        setError(null)

        // For now, create a mock user since Whop SDK integration needs more investigation
        // TODO: Implement proper Whop user authentication
        const mockUser = {
          id: 'mock-user-id',
          email: 'user@example.com',
          first_name: 'Mock',
          last_name: 'User',
          tenant_id: 'mock-tenant-id',
          whop_user_id: 'mock-whop-id'
        }

        // Ensure tenant exists first
        const tenant = await ensureTenantExists(tenantId)
        if (!tenant) {
          throw new Error('Failed to create or find tenant')
        }

        // For now, just set the mock user
        setUser(mockUser)

      } catch (err) {
        console.error('Authentication error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed')
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      authenticateUser()
    }
  }, [tenantId, ensureTenantExists])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user
  }
}
