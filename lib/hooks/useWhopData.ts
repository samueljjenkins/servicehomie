import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';

// Use localStorage for persistence instead of in-memory storage
const STORAGE_KEYS = {
  SERVICES: 'whop_services',
  AVAILABILITY: 'whop_availability', 
  BOOKINGS: 'whop_bookings'
};

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

export type WeeklyAvailability = {
  [K in 0 | 1 | 2 | 3 | 4 | 5 | 6]: TimeWindow[];
};

export interface Booking {
  id: string;
  service_id: string;
  customer_email: string;
  customer_name: string;
  booking_date: string;
  start_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_price: number;
}

export function useWhopData() {
  const sdk = useIframeSdk();
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<WeeklyAvailability>([
    [], // Sunday
    [], // Monday
    [], // Tuesday
    [], // Wednesday
    [], // Thursday
    [], // Friday
    []  // Saturday
  ]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const loadData = () => {
        // Load services
        const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (storedServices) {
          setServices(JSON.parse(storedServices));
        }

        // Load availability
        const storedAvailability = localStorage.getItem(STORAGE_KEYS.AVAILABILITY);
        if (storedAvailability) {
          setAvailability(JSON.parse(storedAvailability));
        } else {
          // Set default availability (9 AM - 5 PM weekdays)
          const defaultAvailability: WeeklyAvailability = [
            [], // Sunday
            [{ start: "09:00", end: "17:00" }], // Monday
            [{ start: "09:00", end: "17:00" }], // Tuesday
            [{ start: "09:00", end: "17:00" }], // Wednesday
            [{ start: "09:00", end: "17:00" }], // Thursday
            [{ start: "09:00", end: "17:00" }], // Friday
            []  // Saturday
          ];
          setAvailability(defaultAvailability);
          localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(defaultAvailability));
        }

        // Load bookings
        const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }
      };

      loadData();
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Fallback to default data if localStorage fails
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage
  const saveData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Service management
  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    saveData(STORAGE_KEYS.SERVICES, updatedServices);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, ...updates } : service
    );
    setServices(updatedServices);
    saveData(STORAGE_KEYS.SERVICES, updatedServices);
  };

  const deleteService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    saveData(STORAGE_KEYS.SERVICES, updatedServices);
  };

  const toggleServiceStatus = (id: string) => {
    const updatedServices = services.map(service =>
      service.id === id 
        ? { ...service, status: (service.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
        : service
    );
    setServices(updatedServices);
    saveData(STORAGE_KEYS.SERVICES, updatedServices);
  };

  // Availability management
  const updateAvailability = (newAvailability: WeeklyAvailability) => {
    setAvailability(newAvailability);
    saveData(STORAGE_KEYS.AVAILABILITY, newAvailability);
  };

  const updateTimeWindow = (dayIndex: number, windowIndex: number, field: keyof TimeWindow, value: string) => {
    const next = structuredClone(availability);
    next[dayIndex as keyof WeeklyAvailability][windowIndex][field] = value;
    setAvailability(next);
    saveData(STORAGE_KEYS.AVAILABILITY, next);
  };

  const addTimeWindow = (dayIndex: number) => {
    const next = structuredClone(availability);
    next[dayIndex as keyof WeeklyAvailability].push({ start: "09:00", end: "17:00" });
    setAvailability(next);
    saveData(STORAGE_KEYS.AVAILABILITY, next);
  };

  const removeTimeWindow = (dayIndex: number, windowIndex: number) => {
    const next = structuredClone(availability);
    next[dayIndex as keyof WeeklyAvailability].splice(windowIndex, 1);
    setAvailability(next);
    saveData(STORAGE_KEYS.AVAILABILITY, next);
  };

  // Booking management
  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking = { ...booking, id: Date.now().toString() };
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    saveData(STORAGE_KEYS.BOOKINGS, updatedBookings);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, ...updates } : booking
    );
    setBookings(updatedBookings);
    saveData(STORAGE_KEYS.BOOKINGS, updatedBookings);
  };

  return {
    // Data
    services,
    availability,
    bookings,
    loading,
    
    // Service actions
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    
    // Availability actions
    updateAvailability,
    updateTimeWindow,
    addTimeWindow,
    removeTimeWindow,
    
    // Booking actions
    addBooking,
    updateBooking,
    
    // Helper functions
    getUpcomingBookings: () => {
      const now = new Date();
      return bookings.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        return bookingDate > now && booking.status === 'confirmed';
      });
    },
    
    getActiveServices: () => services.filter(service => service.status === 'active'),
    
    // Data persistence
    clearAllData: () => {
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.AVAILABILITY);
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      setServices([]);
      setAvailability([[], [], [], [], [], [], []]);
      setBookings([]);
    }
  };
}
