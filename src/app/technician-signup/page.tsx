"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-utils';

const services = ["Window Cleaning", "Pressure Washing", "Gutter Cleaning"];

export default function TechnicianSignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(
        { email, password },
        {
          fullName,
          phone,
          role: 'technician',
        }
      );
      setSuccess(true);
      setTimeout(() => router.push('/technician-dashboard'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your Technician Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <h3 className="text-lg font-medium text-green-600">Registration Successful!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Please check your email to confirm your account. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField id="fullName" label="Full Name" type="text" value={fullName} setter={setFullName} required />
              <InputField id="email" label="Email Address" type="email" value={email} setter={setEmail} required />
              <InputField id="phone" label="Phone Number" type="tel" value={phone} setter={setPhone} required />
              <InputField id="password" label="Password" type="password" value={password} setter={setPassword} required />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Sign Up as Technician'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const InputField = ({ id, label, type, value, setter, required = false }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input id={id} name={id} type={type} value={value} onChange={e => setter(e.target.value)} required={required} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
    </div>
  </div>
);

const FileUploadField = ({ id, label, onChange, multiple = false, required = false }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input id={id} name={id} type="file" onChange={onChange} multiple={multiple} required={required} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
    </div>
  </div>
);