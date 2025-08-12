/**
 * Tenant detection utilities for iframe environments
 * Handles both query parameters and route parameters
 */

export interface TenantInfo {
  id: string;
  isValid: boolean;
  source: 'query' | 'route' | 'fallback';
}

/**
 * Detect tenant from multiple sources with fallback
 * Works in iframe environments where cookies/session storage may be blocked
 */
export function detectTenant(
  queryTenant: string | null,
  routeTenant: string | null,
  fallbackTenant: string = 'demo'
): TenantInfo {
  // 1. Check query parameter first (e.g., ?tenant=slug)
  if (queryTenant && isValidTenant(queryTenant)) {
    return {
      id: queryTenant,
      isValid: true,
      source: 'query'
    };
  }
  
  // 2. Check route parameter if no valid query param
  if (routeTenant && isValidTenant(routeTenant)) {
    return {
      id: routeTenant,
      isValid: true,
      source: 'route'
    };
  }
  
  // 3. Fallback to default tenant
  return {
    id: fallbackTenant,
    isValid: true,
    source: 'fallback'
  };
}

/**
 * Validate tenant ID format
 * Ensures tenant is a valid slug format
 */
export function isValidTenant(tenant: string): boolean {
  if (!tenant || typeof tenant !== 'string') {
    return false;
  }
  
  // Basic validation: alphanumeric, hyphens, underscores, 3-50 chars
  const tenantRegex = /^[a-zA-Z0-9_-]{3,50}$/;
  return tenantRegex.test(tenant);
}

/**
 * Get tenant from URL search params
 * Safe for iframe environments
 */
export function getTenantFromURL(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tenant = urlParams.get('tenant');
    return tenant && isValidTenant(tenant) ? tenant : null;
  } catch (error) {
    console.warn('Failed to parse URL params:', error);
    return null;
  }
}

/**
 * Get tenant from current pathname
 * Safe for iframe environments
 */
export function getTenantFromPath(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const pathParts = window.location.pathname.split('/');
    const tenantIndex = pathParts.findIndex(part => part === 't') + 1;
    const tenant = pathParts[tenantIndex];
    return tenant && isValidTenant(tenant) ? tenant : null;
  } catch (error) {
    console.warn('Failed to parse pathname:', error);
    return null;
  }
}

/**
 * Build tenant URL with query parameter
 * Useful for iframe embedding
 */
export function buildTenantURL(tenant: string, baseURL?: string): string {
  const base = baseURL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/t/${tenant}?tenant=${tenant}`;
}

/**
 * Check if running in iframe environment
 */
export function isInIframe(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    return window.self !== window.top;
  } catch (error) {
    // If we can't access window.top, we're likely in an iframe
    return true;
  }
}

/**
 * Check if running in Whop iframe
 */
export function isInWhopIframe(): boolean {
  if (!isInIframe()) {
    return false;
  }
  
  try {
    return document.referrer.includes('whop.com') || 
           window.location.hostname.includes('whop.com');
  } catch (error) {
    return false;
  }
}
