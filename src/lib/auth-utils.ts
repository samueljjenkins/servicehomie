import { User } from '@clerk/nextjs/server';
import { UserResource } from '@clerk/types';

// Define user roles
export type UserRole = 'admin' | 'technician' | 'customer';

// Function to determine user role based on email or other criteria
export function getUserRole(user: User | UserResource | null): UserRole {
  if (!user) return 'customer';
  
  // Check if user has admin email (you can customize this logic)
  const adminEmails = [
    'admin@servicehomie.com',
    'samuel@servicehomie.com',
    // Add more admin emails as needed
  ];
  
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  
  if (userEmail && adminEmails.includes(userEmail)) {
    return 'admin';
  }
  
  // For now, assume all other users are technicians
  // You can add more logic here based on your needs
  return 'technician';
  }
  
// Function to get the appropriate dashboard URL for a user
export function getDashboardUrl(user: User | UserResource | null): string {
  const role = getUserRole(user);
  
  switch (role) {
    case 'admin':
      return '/admin';
    case 'technician':
      return '/technician-dashboard';
    default:
      return '/'; // Homepage for customers
  }
}

// Function to check if user has access to a specific route
export function hasAccess(user: User | UserResource | null, requiredRole: UserRole): boolean {
  const userRole = getUserRole(user);
  
  if (requiredRole === 'admin') {
    return userRole === 'admin';
  }
  
  if (requiredRole === 'technician') {
    return userRole === 'technician' || userRole === 'admin';
  }
  
  return true; // Customers can access public routes
} 