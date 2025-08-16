import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';

// Simple in-memory storage for development
// In production, you could use localStorage or minimal backend
const memoryStorage = new Map();

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

  // Load data from memory storage
  useEffect(() => {
    const loadData = () => {
      const storedServices = memoryStorage.get('services') || [];
      const storedAvailability = memoryStorage.get('availability') || [
        [], // Sunday
        [], // Monday
        [], // Tuesday
        [], // Wednesday
        [], // Thursday
        [], // Friday
        []  // Saturday
      ];
      const storedBookings = memoryStorage.get('bookings') || [];

      setServices(storedServices);
      setAvailability(storedAvailability);
      setBookings(storedBookings);
    };

    loadData();
  }, []);

  // Save data to memory storage
  const saveData = (key: string, data: any) => {
    memoryStorage.set(key, data);
  };

  // Service management
  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    saveData('services', updatedServices);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, ...updates } : service
    );
    setServices(updatedServices);
    saveData('services', updatedServices);
  };

  const deleteService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    saveData('services', updatedServices);
  };

  const toggleServiceStatus = (id: string) => {
    const updatedServices = services.map(service =>
      service.id === id 
        ? { ...service, status: (service.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
        : service
    );
    setServices(updatedServices);
    saveData('services', updatedServices);
  };

  // Availability management
  const updateAvailability = (newAvailability: WeeklyAvailability) => {
    setAvailability(newAvailability);
    saveData('availability', newAvailability);
  };

  const updateTimeWindow = (dayIndex: number, windowIndex: number, field: keyof TimeWindow, value: string) => {
    const next = structuredClone(availability);
    next[dayIndex as keyof WeeklyAvailability][windowIndex][field] = value;
    setAvailability(next);
    saveData('availability', next);
  };

  const addTimeWindow = (dayIndex: number) => {
    const next = structuredClone(availability);
    next[dayIndex as keyof WeeklyAvailability].push({ start: "09:00", end: "17:00" });
    setAvailability(next);
    saveData('availability', next);
  };

  const removeTimeWindow = (dayIndex: number, windowIndex: number) => {
    const next = structuredClone(availability);
    next[dayIndex as keyof WeeklyAvailability].splice(windowIndex, 1);
    setAvailability(next);
    saveData('availability', next);
  };

  // Booking management
  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking = { ...booking, id: Date.now().toString() };
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    saveData('bookings', updatedBookings);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, ...updates } : booking
    );
    setBookings(updatedBookings);
    saveData('bookings', updatedBookings);
  };

  return {
    // Data
    services,
    availability,
    bookings,
    
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
    
    getActiveServices: () => services.filter(service => service.status === 'active')
  };
}
