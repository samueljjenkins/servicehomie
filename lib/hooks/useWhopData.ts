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
}

export interface TimeWindow {
  start: string;
  end: string;
}

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WeeklyAvailability = TimeWindow[][];

export interface Booking {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  booking_date: string;
  start_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
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
        // For now, use a mock user ID since getCurrentUser doesn't exist
        // In production, this would come from Whop's user context
        const mockUserId = 'mock-user-' + Date.now();
        
        // Load services for this user
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('whop_user_id', mockUserId)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // Load availability for this user
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('availability')
          .select('*')
          .eq('whop_user_id', mockUserId);

        if (availabilityError) throw availabilityError;

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
          .eq('whop_user_id', mockUserId)
          .order('booking_date', { ascending: true });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty data
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
      const mockUserId = 'mock-user-' + Date.now();

      const newService: Inserts<'services'> = {
        whop_user_id: mockUserId,
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        duration_minutes: serviceData.duration_minutes,
        status: serviceData.status
      };

      const { data, error } = await supabase
        .from('services')
        .insert(newService)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  };

  // Update an existing service
  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(s => s.id === serviceId ? data : s));
      return data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  // Delete a service
  const deleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  // Toggle service status
  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const newStatus = (service.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive';
      await updateService(serviceId, { status: newStatus });
    } catch (error) {
      console.error('Error toggling service status:', error);
      throw error;
    }
  };

  // Update availability for a specific day
  const updateAvailability = async (newAvailability: WeeklyAvailability) => {
    try {
      const mockUserId = 'mock-user-' + Date.now();

      // Delete existing availability for this user
      await supabase
        .from('availability')
        .delete()
        .eq('whop_user_id', mockUserId);

      // Insert new availability
      const availabilityRecords: Inserts<'availability'>[] = [];
      
      newAvailability.forEach((windows, dayIndex) => {
        windows.forEach(window => {
          availabilityRecords.push({
            whop_user_id: mockUserId,
            day_of_week: dayIndex,
            start_time: window.start,
            end_time: window.end
          });
        });
      });

      if (availabilityRecords.length > 0) {
        const { error } = await supabase
          .from('availability')
          .insert(availabilityRecords);

        if (error) throw error;
      }

      setAvailability(newAvailability);
    } catch (error) {
      console.error('Error updating availability:', error);
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
  const addBooking = async (bookingData: Omit<Booking, 'id'>) => {
    try {
      const mockUserId = 'mock-user-' + Date.now();

      const newBooking: Inserts<'bookings'> = {
        whop_user_id: mockUserId,
        service_id: bookingData.service_id,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        booking_date: bookingData.booking_date,
        start_time: bookingData.start_time,
        total_price: bookingData.total_price,
        status: bookingData.status
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(newBooking)
        .select()
        .single();

      if (error) throw error;

      setBookings(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  };

  // Update an existing booking
  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      setBookings(prev => prev.map(b => b.id === bookingId ? data : b));
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
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

  // Clear all data (for testing)
  const clearAllData = async () => {
    try {
      const mockUserId = 'mock-user-' + Date.now();

      await supabase.from('services').delete().eq('whop_user_id', mockUserId);
      await supabase.from('availability').delete().eq('whop_user_id', mockUserId);
      await supabase.from('bookings').delete().eq('whop_user_id', mockUserId);

      setServices([]);
      setAvailability([[], [], [], [], [], [], []]);
      setBookings([]);
    } catch (error) {
      console.error('Error clearing data:', error);
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
