import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { supabase } from '@/lib/supabase';
import type { Tables, Inserts } from '@/lib/supabase';

export interface Customer extends Tables<'customers'> {
  total_jobs?: number;
  total_spent?: number;
  last_service_date?: string;
  upcoming_jobs?: number;
}

export interface CustomerWithJobs extends Customer {
  jobs: Tables<'jobs'>[];
  bookings: Tables<'bookings'>[];
  invoices: Tables<'invoices'>[];
  communication_log: Tables<'communication_log'>[];
}

export function useCustomerManagement() {
  const sdk = useIframeSdk();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load customers from Supabase
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      
      try {
        if (!sdk) {
          console.log('useCustomerManagement: No SDK available');
          setCustomers([]);
          setLoading(false);
          return;
        }

        const urlData = await sdk.getTopLevelUrlData({});
        if (!urlData) {
          console.log('useCustomerManagement: No URL data available');
          setCustomers([]);
          setLoading(false);
          return;
        }

        const whopUserId = urlData.experienceId;
        
        // Load customers with aggregated data
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select(`
            *,
            jobs:jobs(count),
            bookings:bookings(count),
            invoices:invoices(count)
          `)
          .eq('whop_user_id', whopUserId)
          .order('created_at', { ascending: false });

        if (customersError) {
          console.error('useCustomerManagement: Customers error:', customersError);
          throw customersError;
        }

        // Transform the data to include aggregated information
        const customersWithStats = customersData?.map((customer: any) => ({
          ...customer,
          total_jobs: customer.jobs?.[0]?.count || 0,
          total_bookings: customer.bookings?.[0]?.count || 0,
          total_invoices: customer.invoices?.[0]?.count || 0,
        })) || [];

        setCustomers(customersWithStats);

      } catch (error) {
        console.error('useCustomerManagement: Error loading customers:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [sdk]);

  // Add a new customer
  const addCustomer = async (customerData: Omit<Inserts<'customers'>, 'whop_user_id'>) => {
    try {
      if (!sdk) {
        console.log('addCustomer: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('addCustomer: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { data, error } = await supabase
        .from('customers')
        .insert({ ...customerData, whop_user_id: whopUserId })
        .select()
        .single();

      if (error) {
        console.error('Failed to add customer:', error);
        throw error;
      }
      
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  };

  // Update a customer
  const updateCustomer = async (customerId: string, updates: Partial<Inserts<'customers'>>) => {
    try {
      if (!sdk) {
        console.log('updateCustomer: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('updateCustomer: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customerId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to update customer:', error);
        throw error;
      }
      
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? { ...customer, ...updates } : customer
      ));
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  };

  // Delete a customer
  const deleteCustomer = async (customerId: string) => {
    try {
      if (!sdk) {
        console.log('deleteCustomer: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('deleteCustomer: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to delete customer:', error);
        throw error;
      }
      
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  };

  // Get customer with full details
  const getCustomerDetails = async (customerId: string): Promise<CustomerWithJobs | null> => {
    try {
      if (!sdk) {
        console.log('getCustomerDetails: No SDK available');
        return null;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('getCustomerDetails: No URL data available');
        return null;
      }

      const whopUserId = urlData.experienceId;
      
      // Get customer with all related data
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select(`
          *,
          jobs:jobs(*),
          bookings:bookings(*),
          invoices:invoices(*),
          communication_log:communication_log(*)
        `)
        .eq('id', customerId)
        .eq('whop_user_id', whopUserId)
        .single();

      if (customerError) {
        console.error('Failed to get customer details:', customerError);
        throw customerError;
      }

      return customerData as CustomerWithJobs;
    } catch (error) {
      console.error('Failed to get customer details:', error);
      throw error;
    }
  };

  // Search customers
  const searchCustomers = (query: string): Customer[] => {
    if (!query.trim()) return customers;
    
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.email.toLowerCase().includes(lowercaseQuery) ||
      customer.phone?.toLowerCase().includes(lowercaseQuery) ||
      customer.address?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Get customers by type
  const getCustomersByType = (type: 'residential' | 'commercial'): Customer[] => {
    return customers.filter(customer => customer.customer_type === type);
  };

  // Get top customers by spending
  const getTopCustomers = (limit: number = 10): Customer[] => {
    return customers
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, limit);
  };

  // Get recent customers
  const getRecentCustomers = (limit: number = 10): Customer[] => {
    return customers
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  };

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerDetails,
    searchCustomers,
    getCustomersByType,
    getTopCustomers,
    getRecentCustomers
  };
}
