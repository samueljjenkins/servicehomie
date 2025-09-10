import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { supabase } from '@/lib/supabase';
import type { Tables, Inserts } from '@/lib/supabase';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  status: 'active' | 'inactive';
  category: string;
  service_area: string;
}

export interface TimeWindow {
  start: string;
  end: string;
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WeeklyAvailability = TimeWindow[][];

export interface Booking {
  id: string;
  whop_user_id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  booking_date: string;
  start_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  job_id: string | null;
  technician_id: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export function useWhopData() {
  const sdk = useIframeSdk();
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<WeeklyAvailability>([
    [], [], [], [], [], [], []
  ]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase based on Whop user context
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        console.log('useWhopData: Starting to load data...');
        
        if (!sdk) {
          console.log('useWhopData: No SDK available');
          setServices([]);
          setAvailability([[], [], [], [], [], [], []]);
          setBookings([]);
          setLoading(false);
          return;
        }

        // Get company and experience data from Whop iframe
        const urlData = await sdk.getTopLevelUrlData({});
        
        if (!urlData) {
          console.log('useWhopData: No URL data available');
          setServices([]);
          setAvailability([[], [], [], [], [], [], []]);
          setBookings([]);
          setLoading(false);
          return;
        }

        // Use experience ID as user ID for now
        const whopUserId = urlData.experienceId;
        console.log('useWhopData: Loading data for experience:', whopUserId);
        
        // Load services for this user
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('whop_user_id', whopUserId)
          .order('created_at', { ascending: false });

        if (servicesError) {
          console.error('useWhopData: Services error:', servicesError);
          throw servicesError;
        }
        console.log('useWhopData: Services loaded:', servicesData);
        setServices(servicesData || []);

        // Load availability for this user
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('availability')
          .select('*')
          .eq('whop_user_id', whopUserId);

        if (availabilityError) {
          console.error('useWhopData: Availability error:', availabilityError);
          throw availabilityError;
        }
        console.log('useWhopData: Availability loaded:', availabilityData);

        // Convert database format to WeeklyAvailability
        const weeklyAvailability: WeeklyAvailability = [[], [], [], [], [], [], []];
        availabilityData?.forEach((avail: any) => {
          const dayIndex = avail.day_of_week;
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyAvailability[dayIndex].push({
              start: avail.start_time,
              end: avail.end_time
            });
          }
        });
        setAvailability(weeklyAvailability);

        // Load bookings for this user
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('whop_user_id', whopUserId)
          .order('booking_date', { ascending: true });

        if (bookingsError) {
          console.error('useWhopData: Bookings error:', bookingsError);
          throw bookingsError;
        }
        console.log('useWhopData: Bookings loaded:', bookingsData);
        setBookings(bookingsData || []);

        console.log('useWhopData: All data loaded successfully');

      } catch (error) {
        console.error('useWhopData: Error loading data:', error);
        setServices([]);
        setAvailability([[], [], [], [], [], [], []]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sdk]);

  // Add a new service
  const addService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      if (!sdk) {
        console.log('addService: No SDK available, cannot add service');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('addService: No URL data available, cannot add service');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { data, error } = await supabase
        .from('services')
        .insert({ ...serviceData, whop_user_id: whopUserId })
        .select()
        .single();

      if (error) {
        console.error('Failed to add service:', error);
        throw error;
      }
      setServices(prev => [...prev, data]);
    } catch (error) {
      console.error('Failed to add service:', error);
      throw error;
    }
  };

  // Update an existing service
  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    try {
      if (!sdk) {
        console.log('updateService: No SDK available, cannot update service');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('updateService: No URL data available, cannot update service');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to update service:', error);
        throw error;
      }
      setServices(prev => prev.map(service => service.id === serviceId ? { ...service, ...updates } : service));
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  };

  // Delete a service
  const deleteService = async (serviceId: string) => {
    try {
      if (!sdk) {
        console.log('deleteService: No SDK available, cannot delete service');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('deleteService: No URL data available, cannot delete service');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to delete service:', error);
        throw error;
      }
      setServices(prev => prev.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw error;
    }
  };

  // Toggle service status
  const toggleServiceStatus = async (serviceId: string) => {
    try {
      if (!sdk) {
        console.log('toggleServiceStatus: No SDK available, cannot toggle service');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('toggleServiceStatus: No URL data available, cannot toggle service');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { data, error } = await supabase
        .from('services')
        .select('status')
        .eq('id', serviceId)
        .eq('whop_user_id', whopUserId)
        .single();

      if (error) {
        console.error('Failed to get service status:', error);
        throw error;
      }

      const currentStatus = data?.status;
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      const { error: updateError } = await supabase
        .from('services')
        .update({ status: newStatus })
        .eq('id', serviceId)
        .eq('whop_user_id', whopUserId);

      if (updateError) {
        console.error('Failed to toggle service status:', updateError);
        throw updateError;
      }
      setServices(prev => prev.map(service => service.id === serviceId ? { ...service, status: newStatus } : service));
    } catch (error) {
      console.error('Failed to toggle service status:', error);
      throw error;
    }
  };

  // Update availability
  const updateAvailability = async (newAvailability: WeeklyAvailability) => {
    try {
      if (!sdk) {
        console.log('updateAvailability: No SDK available, cannot update availability');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('updateAvailability: No URL data available, cannot update availability');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to clear existing availability:', error);
        throw error;
      }

      const availabilityInserts: Inserts<'availability'>[] = [];
      newAvailability.forEach((day, dayIndex) => {
        day.forEach(window => {
          availabilityInserts.push({
            whop_user_id: whopUserId,
            day_of_week: dayIndex,
            start_time: window.start,
            end_time: window.end
          });
        });
      });

      const { error: insertError } = await supabase
        .from('availability')
        .insert(availabilityInserts);

      if (insertError) {
        console.error('Failed to update availability:', insertError);
        throw insertError;
      }
      setAvailability(newAvailability);
    } catch (error) {
      console.error('Failed to update availability:', error);
      throw error;
    }
  };

  // Update a specific time window
  const updateTimeWindow = (dayIndex: Weekday, windowIndex: number, field: keyof TimeWindow, value: string) => {
    const next = structuredClone(availability);
    next[dayIndex][windowIndex][field] = value;
    setAvailability(next);
  };

  // Add a new time window
  const addTimeWindow = (dayIndex: Weekday) => {
    const next = structuredClone(availability);
    next[dayIndex].push({ start: "09:00", end: "17:00" });
    setAvailability(next);
  };

  // Remove a time window
  const removeTimeWindow = (dayIndex: Weekday, windowIndex: number) => {
    const next = structuredClone(availability);
    next[dayIndex].splice(windowIndex, 1);
    setAvailability(next);
  };

  // Add a new booking
  const addBooking = async (bookingData: Omit<Booking, 'id' | 'whop_user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!sdk) {
        console.log('addBooking: No SDK available, cannot add booking');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('addBooking: No URL data available, cannot add booking');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { data, error } = await supabase
        .from('bookings')
        .insert({ ...bookingData, whop_user_id: whopUserId })
        .select()
        .single();

      if (error) {
        console.error('Failed to add booking:', error);
        throw error;
      }
      setBookings(prev => [...prev, data]);
    } catch (error) {
      console.error('Failed to add booking:', error);
      throw error;
    }
  };

  // Update a booking
  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      if (!sdk) {
        console.log('updateBooking: No SDK available, cannot update booking');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('updateBooking: No URL data available, cannot update booking');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to update booking:', error);
        throw error;
      }
      setBookings(prev => prev.map(booking => booking.id === bookingId ? { ...booking, ...updates } : booking));
    } catch (error) {
      console.error('Failed to update booking:', error);
      throw error;
    }
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= today && booking.status !== 'cancelled';
    });
  };

  // Get active services
  const getActiveServices = () => {
    return services.filter(service => service.status === 'active');
  };

  // Clear all data for a user
  const clearAllData = async () => {
    try {
      if (!sdk) {
        console.log('clearAllData: No SDK available, cannot clear data');
        return;
      }

      // Get company and experience data from Whop iframe
      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('clearAllData: No URL data available, cannot clear data');
        return;
      }

      const whopUserId = urlData.experienceId;
      const { error: deleteServicesError } = await supabase
        .from('services')
        .delete()
        .eq('whop_user_id', whopUserId);

      if (deleteServicesError) {
        console.error('Failed to clear services:', deleteServicesError);
        throw deleteServicesError;
      }

      const { error: deleteAvailabilityError } = await supabase
        .from('availability')
        .delete()
        .eq('whop_user_id', whopUserId);

      if (deleteAvailabilityError) {
        console.error('Failed to clear availability:', deleteAvailabilityError);
        throw deleteAvailabilityError;
      }

      const { error: deleteBookingsError } = await supabase
        .from('bookings')
        .delete()
        .eq('whop_user_id', whopUserId);

      if (deleteBookingsError) {
        console.error('Failed to clear bookings:', deleteBookingsError);
        throw deleteBookingsError;
      }

      setServices([]);
      setAvailability([[], [], [], [], [], [], []]);
      setBookings([]);
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  };

  return {
    services,
    availability,
    bookings,
    loading,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    updateAvailability,
    updateTimeWindow,
    addTimeWindow,
    removeTimeWindow,
    addBooking,
    updateBooking,
    getUpcomingBookings,
    getActiveServices,
    clearAllData
  };
}
