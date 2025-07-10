"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/context/UserContext';

const services = ["Window Cleaning", "Pressure Washing", "Gutter Cleaning"];

export default function TechnicianApplicationPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [zipCodes, setZipCodes] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [govId, setGovId] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [insuranceProof, setInsuranceProof] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, loading: userLoading } = useUser();

  const uploadFile = async (file: File, pathPrefix: string) => {
    const fileExt = file.name.split('.').pop();
    // Use the correct folder name for each document
    let folder = pathPrefix;
    if (folder === 'profile_photo') folder = 'profile_photo_url';
    if (folder === 'gov_id') folder = 'gov_id_url';
    if (folder === 'business_license') folder = 'business_license_url';
    if (folder === 'insurance_proof') folder = 'insurance_proof_url';
    const filePath = `${folder}/${crypto.randomUUID()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('technician-documents').upload(filePath, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('technician-documents').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and commission fee.');
      return;
    }
    if (!govId || !businessLicense || !insuranceProof) {
      setError('All required documents must be uploaded.');
      return;
    }
    if (userLoading) {
      setError('Checking login status...');
      return;
    }
    if (!user) {
      setError('You must be logged in to apply.');
      return;
    }
    setLoading(true);
    try {
      const applicationId = crypto.randomUUID();
      // Upload files
      const govIdUrl = await uploadFile(govId, 'gov_id');
      const businessLicenseUrl = await uploadFile(businessLicense, 'business_license');
      const insuranceProofUrl = await uploadFile(insuranceProof, 'insurance_proof');
      let profilePhotoUrl = '';
      if (profilePhoto) {
        profilePhotoUrl = await uploadFile(profilePhoto, 'profile_photo');
      }
      // Insert application
      const { error: insertError } = await supabase
        .from('technician_applications')
        .insert({
          id: applicationId,
          user_id: user.id,
          email: user.email,
          full_name: fullName,
          phone_number: phone,
          service_category: serviceCategory,
          service_area_zip_codes: zipCodes,
          experience_description: experienceDescription,
          company_name: companyName,
          years_experience: yearsExperience,
          profile_photo_url: profilePhotoUrl,
          gov_id_url: govIdUrl,
          business_license_url: businessLicenseUrl,
          insurance_proof_url: insuranceProofUrl,
          status: 'pending',
        });
      if (insertError) throw insertError;
      setSuccess(true);
      setTimeout(() => router.push('/technician-application-status'), 2000);
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
          Technician Application
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please complete your application to start selling on Service Homie.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <h3 className="text-lg font-medium text-green-600">Application Submitted!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Redirecting to your application status...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" name="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input id="phone" name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700">Service Category</label>
                <select id="serviceCategory" value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option value="" disabled>Select a service</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="zipCodes" className="block text-sm font-medium text-gray-700">Service Area Zip Codes (comma-separated)</label>
                <input id="zipCodes" name="zipCodes" type="text" value={zipCodes} onChange={e => setZipCodes(e.target.value)} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="experienceDescription" className="block text-sm font-medium text-gray-700">Short Description of Experience</label>
                <textarea id="experienceDescription" value={experienceDescription} onChange={e => setExperienceDescription(e.target.value)} rows={4} required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name (optional)</label>
                <input id="companyName" name="companyName" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">Years of Experience (optional)</label>
                <input id="yearsExperience" name="yearsExperience" type="number" min="0" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo (optional)</label>
                <input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={e => setProfilePhoto(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label htmlFor="govId" className="block text-sm font-medium text-gray-700">Government-issued Photo ID <span className="text-red-500">*</span></label>
                <input id="govId" name="govId" type="file" accept="image/*,application/pdf" onChange={e => setGovId(e.target.files?.[0] || null)} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700">Business License <span className="text-red-500">*</span></label>
                <input id="businessLicense" name="businessLicense" type="file" accept="image/*,application/pdf" onChange={e => setBusinessLicense(e.target.files?.[0] || null)} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label htmlFor="insuranceProof" className="block text-sm font-medium text-gray-700">Proof of Insurance <span className="text-red-500">*</span></label>
                <input id="insuranceProof" name="insuranceProof" type="file" accept="image/*,application/pdf" onChange={e => setInsuranceProof(e.target.files?.[0] || null)} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex items-center">
                <input id="agreedToTerms" type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">I agree to the Service Homie Terms of Service and 15% commission fee.</label>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {!user && !userLoading && (
                <p className="text-sm text-red-600 text-center">You must be logged in to apply.</p>
              )}
              <div>
                <button type="submit" disabled={loading || !user} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 