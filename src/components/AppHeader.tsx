"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';

export default function AppHeader() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const authLinks = (isMobile: boolean) => {
    if (!isLoaded) {
      // Render a placeholder on the server and during initial client render
      return <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>;
    }
    
    if (isSignedIn) {
      return (
        <>
          <Link 
            href="/technician-dashboard"
            className={isMobile ? "block py-2 px-4 text-gray-600 hover:text-blue-600" : "text-gray-600 hover:text-blue-600"}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <div className={isMobile ? "mt-2" : ""}>
            <UserButton 
              appearance={{
                elements: {
                  userButtonBox: isMobile ? "w-full text-left bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 transition" : "bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition"
                }
              }}
            />
          </div>
        </>
      );
    }
    
    return (
      <>
        <SignInButton mode="modal">
          <button className={isMobile ? "block py-2 px-4 text-gray-600 hover:text-blue-600" : "text-gray-600 hover:text-blue-600"}>
            Login
          </button>
        </SignInButton>
        <Link 
          href="/technician-signup" 
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
        <Link href="/" className="text-2xl font-bold text-blue-600" onClick={() => setIsMenuOpen(false)} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
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