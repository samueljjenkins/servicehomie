import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { supabase } from '@/lib/supabase';
import type { Tables, Inserts } from '@/lib/supabase';

export interface Technician extends Tables<'technicians'> {
  total_jobs?: number;
  completed_jobs?: number;
  total_hours?: number;
  average_rating?: number;
  current_jobs?: number;
}

export interface TechnicianWithJobs extends Technician {
  jobs: Tables<'jobs'>[];
  equipment: Tables<'equipment'>[];
}

export function useTechnicianManagement() {
  const sdk = useIframeSdk();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  // Load technicians from Supabase
  useEffect(() => {
    const loadTechnicians = async () => {
      setLoading(true);
      
      try {
        if (!sdk) {
          console.log('useTechnicianManagement: No SDK available');
          setTechnicians([]);
          setLoading(false);
          return;
        }

        const urlData = await sdk.getTopLevelUrlData({});
        if (!urlData) {
          console.log('useTechnicianManagement: No URL data available');
          setTechnicians([]);
          setLoading(false);
          return;
        }

        const whopUserId = urlData.experienceId;
        
        // Load technicians with job statistics
        const { data: techniciansData, error: techniciansError } = await supabase
          .from('technicians')
          .select(`
            *,
            jobs:jobs(count),
            completed_jobs:jobs!inner(count, status.eq.completed),
            current_jobs:jobs!inner(count, status.in.(scheduled,in_progress))
          `)
          .eq('whop_user_id', whopUserId)
          .order('created_at', { ascending: false });

        if (techniciansError) {
          console.error('useTechnicianManagement: Technicians error:', techniciansError);
          throw techniciansError;
        }

        // Transform the data to include aggregated information
        const techniciansWithStats = techniciansData?.map((technician: any) => ({
          ...technician,
          total_jobs: technician.jobs?.[0]?.count || 0,
          completed_jobs: technician.completed_jobs?.[0]?.count || 0,
          current_jobs: technician.current_jobs?.[0]?.count || 0,
        })) || [];

        setTechnicians(techniciansWithStats);

      } catch (error) {
        console.error('useTechnicianManagement: Error loading technicians:', error);
        setTechnicians([]);
      } finally {
        setLoading(false);
      }
    };

    loadTechnicians();
  }, [sdk]);

  // Add a new technician
  const addTechnician = async (technicianData: Omit<Inserts<'technicians'>, 'whop_user_id'>) => {
    try {
      if (!sdk) {
        console.log('addTechnician: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('addTechnician: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { data, error } = await supabase
        .from('technicians')
        .insert({ ...technicianData, whop_user_id: whopUserId })
        .select()
        .single();

      if (error) {
        console.error('Failed to add technician:', error);
        throw error;
      }
      
      setTechnicians(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Failed to add technician:', error);
      throw error;
    }
  };

  // Update a technician
  const updateTechnician = async (technicianId: string, updates: Partial<Inserts<'technicians'>>) => {
    try {
      if (!sdk) {
        console.log('updateTechnician: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('updateTechnician: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { error } = await supabase
        .from('technicians')
        .update(updates)
        .eq('id', technicianId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to update technician:', error);
        throw error;
      }
      
      setTechnicians(prev => prev.map(technician => 
        technician.id === technicianId ? { ...technician, ...updates } : technician
      ));
    } catch (error) {
      console.error('Failed to update technician:', error);
      throw error;
    }
  };

  // Delete a technician
  const deleteTechnician = async (technicianId: string) => {
    try {
      if (!sdk) {
        console.log('deleteTechnician: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('deleteTechnician: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', technicianId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to delete technician:', error);
        throw error;
      }
      
      setTechnicians(prev => prev.filter(technician => technician.id !== technicianId));
    } catch (error) {
      console.error('Failed to delete technician:', error);
      throw error;
    }
  };

  // Get technician with full details
  const getTechnicianDetails = async (technicianId: string): Promise<TechnicianWithJobs | null> => {
    try {
      if (!sdk) {
        console.log('getTechnicianDetails: No SDK available');
        return null;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('getTechnicianDetails: No URL data available');
        return null;
      }

      const whopUserId = urlData.experienceId;
      
      // Get technician with all related data
      const { data: technicianData, error: technicianError } = await supabase
        .from('technicians')
        .select(`
          *,
          jobs:jobs(*),
          equipment:equipment(*)
        `)
        .eq('id', technicianId)
        .eq('whop_user_id', whopUserId)
        .single();

      if (technicianError) {
        console.error('Failed to get technician details:', technicianError);
        throw technicianError;
      }

      return technicianData as TechnicianWithJobs;
    } catch (error) {
      console.error('Failed to get technician details:', error);
      throw error;
    }
  };

  // Update technician status
  const updateTechnicianStatus = async (technicianId: string, status: Tables<'technicians'>['status']) => {
    try {
      await updateTechnician(technicianId, { status });
    } catch (error) {
      console.error('Failed to update technician status:', error);
      throw error;
    }
  };

  // Add skill to technician
  const addSkill = async (technicianId: string, skill: string) => {
    try {
      const technician = technicians.find(t => t.id === technicianId);
      if (!technician) throw new Error('Technician not found');
      
      const currentSkills = technician.skills || [];
      if (!currentSkills.includes(skill)) {
        const newSkills = [...currentSkills, skill];
        await updateTechnician(technicianId, { skills: newSkills });
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      throw error;
    }
  };

  // Remove skill from technician
  const removeSkill = async (technicianId: string, skill: string) => {
    try {
      const technician = technicians.find(t => t.id === technicianId);
      if (!technician) throw new Error('Technician not found');
      
      const currentSkills = technician.skills || [];
      const newSkills = currentSkills.filter(s => s !== skill);
      await updateTechnician(technicianId, { skills: newSkills });
    } catch (error) {
      console.error('Failed to remove skill:', error);
      throw error;
    }
  };

  // Get technicians by skill
  const getTechniciansBySkill = (skill: string): Technician[] => {
    return technicians.filter(technician => 
      technician.skills?.includes(skill) && technician.status === 'active'
    );
  };

  // Get active technicians
  const getActiveTechnicians = (): Technician[] => {
    return technicians.filter(technician => technician.status === 'active');
  };

  // Get available technicians (active and not overloaded)
  const getAvailableTechnicians = (maxCurrentJobs: number = 3): Technician[] => {
    return technicians.filter(technician => 
      technician.status === 'active' && 
      (technician.current_jobs || 0) < maxCurrentJobs
    );
  };

  // Get top performing technicians
  const getTopTechnicians = (limit: number = 5): Technician[] => {
    return technicians
      .filter(technician => technician.status === 'active')
      .sort((a, b) => (b.completed_jobs || 0) - (a.completed_jobs || 0))
      .slice(0, limit);
  };

  // Search technicians
  const searchTechnicians = (query: string): Technician[] => {
    if (!query.trim()) return technicians;
    
    const lowercaseQuery = query.toLowerCase();
    return technicians.filter(technician => 
      technician.name.toLowerCase().includes(lowercaseQuery) ||
      technician.email.toLowerCase().includes(lowercaseQuery) ||
      technician.skills?.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Calculate technician utilization
  const getTechnicianUtilization = (technicianId: string): number => {
    const technician = technicians.find(t => t.id === technicianId);
    if (!technician) return 0;
    
    const totalJobs = technician.total_jobs || 0;
    const completedJobs = technician.completed_jobs || 0;
    
    return totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;
  };

  // Get technician performance metrics
  const getTechnicianPerformance = (technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    if (!technician) return null;
    
    return {
      totalJobs: technician.total_jobs || 0,
      completedJobs: technician.completed_jobs || 0,
      currentJobs: technician.current_jobs || 0,
      utilization: getTechnicianUtilization(technicianId),
      hourlyRate: technician.hourly_rate || 0,
      skills: technician.skills || [],
      status: technician.status
    };
  };

  // Get all available skills
  const getAllSkills = (): string[] => {
    const allSkills = technicians.reduce((skills, technician) => {
      return [...skills, ...(technician.skills || [])];
    }, [] as string[]);
    
    return [...new Set(allSkills)].sort();
  };

  // Calculate team statistics
  const getTeamStats = () => {
    const activeTechnicians = technicians.filter(t => t.status === 'active');
    const totalJobs = technicians.reduce((sum, t) => sum + (t.total_jobs || 0), 0);
    const completedJobs = technicians.reduce((sum, t) => sum + (t.completed_jobs || 0), 0);
    const currentJobs = technicians.reduce((sum, t) => sum + (t.current_jobs || 0), 0);
    
    return {
      totalTechnicians: technicians.length,
      activeTechnicians: activeTechnicians.length,
      totalJobs,
      completedJobs,
      currentJobs,
      averageJobsPerTechnician: activeTechnicians.length > 0 ? totalJobs / activeTechnicians.length : 0,
      completionRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0
    };
  };

  return {
    technicians,
    loading,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    getTechnicianDetails,
    updateTechnicianStatus,
    addSkill,
    removeSkill,
    getTechniciansBySkill,
    getActiveTechnicians,
    getAvailableTechnicians,
    getTopTechnicians,
    searchTechnicians,
    getTechnicianUtilization,
    getTechnicianPerformance,
    getAllSkills,
    getTeamStats
  };
}
