"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/technician-signup');
  }, [router]);
  return null;
} 