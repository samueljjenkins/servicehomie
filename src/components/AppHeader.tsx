"use client";

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';

export default function AppHeader() {
  const { user, profile, signOut, loading } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log({ user, loading, isClient });
  }, [user, loading, isClient]);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
    window.location.href = '/'; 
  };
  
  const authLinks = (isMobile: boolean) => {
    if (!isClient) {
      // Render a placeholder on the server and during initial client render
      return <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>;
    }
    if (loading) {
      return <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>;
    }
    if (user) {
      return (
        <>
          <Link 
            href={profile?.user_type === 'technician' ? '/technician-dashboard' : '/homeowner-dashboard'}
            className={isMobile ? "block py-2 px-4 text-gray-600 hover:text-blue-600" : "text-gray-600 hover:text-blue-600"}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className={isMobile ? "w-full text-left bg-red-500 text-white mt-2 py-2 px-4 rounded-md font-medium hover:bg-red-600 transition" : "bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition"}
          >
            Sign Out
          </button>
        </>
      );
    }
    return (
      <>
        <Link 
          href="/login" 
          className={isMobile ? "block py-2 px-4 text-gray-600 hover:text-blue-600" : "text-gray-600 hover:text-blue-600"}
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className={isMobile ? "block bg-blue-600 text-white mt-2 py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition" : "bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"}
          onClick={() => setIsMenuOpen(false)}
        >
          Sign Up
        </Link>
      </>
    );
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600" onClick={() => setIsMenuOpen(false)}>
          Service Homie
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          {authLinks(false)}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4">
          <div className="container mx-auto px-6 flex flex-col space-y-2">
            <Link href="/about" className="block py-2 px-4 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 px-4 text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <hr/>
            {authLinks(true)}
          </div>
        </div>
      )}
    </header>
  );
} 