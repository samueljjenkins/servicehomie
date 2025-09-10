import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';
import { supabase } from '@/lib/supabase';
import type { Tables, Inserts } from '@/lib/supabase';

export interface Job extends Tables<'jobs'> {
  customer?: Tables<'customers'>;
  service?: Tables<'services'>;
  technician?: Tables<'technicians'>;
  materials?: Tables<'job_materials'>[];
  expenses?: Tables<'expenses'>[];
}

export interface JobWithDetails extends Job {
  customer: Tables<'customers'>;
  service: Tables<'services'> | null;
  technician: Tables<'technicians'> | null;
  materials: Tables<'job_materials'>[];
  expenses: Tables<'expenses'>[];
  communication_log: Tables<'communication_log'>[];
}

export function useJobManagement() {
  const sdk = useIframeSdk();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Load jobs from Supabase
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      
      try {
        if (!sdk) {
          console.log('useJobManagement: No SDK available');
          setJobs([]);
          setLoading(false);
          return;
        }

        const urlData = await sdk.getTopLevelUrlData({});
        if (!urlData) {
          console.log('useJobManagement: No URL data available');
          setJobs([]);
          setLoading(false);
          return;
        }

        const whopUserId = urlData.experienceId;
        
        // Load jobs with related data
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(`
            *,
            customer:customers(*),
            service:services(*),
            technician:technicians(*)
          `)
          .eq('whop_user_id', whopUserId)
          .order('created_at', { ascending: false });

        if (jobsError) {
          console.error('useJobManagement: Jobs error:', jobsError);
          throw jobsError;
        }

        setJobs(jobsData || []);

      } catch (error) {
        console.error('useJobManagement: Error loading jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [sdk]);

  // Add a new job
  const addJob = async (jobData: Omit<Inserts<'jobs'>, 'whop_user_id' | 'job_number'>) => {
    try {
      if (!sdk) {
        console.log('addJob: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('addJob: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...jobData, whop_user_id: whopUserId })
        .select(`
          *,
          customer:customers(*),
          service:services(*),
          technician:technicians(*)
        `)
        .single();

      if (error) {
        console.error('Failed to add job:', error);
        throw error;
      }
      
      setJobs(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Failed to add job:', error);
      throw error;
    }
  };

  // Update a job
  const updateJob = async (jobId: string, updates: Partial<Inserts<'jobs'>>) => {
    try {
      if (!sdk) {
        console.log('updateJob: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('updateJob: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to update job:', error);
        throw error;
      }
      
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      ));
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  };

  // Delete a job
  const deleteJob = async (jobId: string) => {
    try {
      if (!sdk) {
        console.log('deleteJob: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('deleteJob: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('whop_user_id', whopUserId);

      if (error) {
        console.error('Failed to delete job:', error);
        throw error;
      }
      
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Failed to delete job:', error);
      throw error;
    }
  };

  // Get job with full details
  const getJobDetails = async (jobId: string): Promise<JobWithDetails | null> => {
    try {
      if (!sdk) {
        console.log('getJobDetails: No SDK available');
        return null;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('getJobDetails: No URL data available');
        return null;
      }

      const whopUserId = urlData.experienceId;
      
      // Get job with all related data
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          *,
          customer:customers(*),
          service:services(*),
          technician:technicians(*),
          materials:job_materials(*),
          expenses:expenses(*),
          communication_log:communication_log(*)
        `)
        .eq('id', jobId)
        .eq('whop_user_id', whopUserId)
        .single();

      if (jobError) {
        console.error('Failed to get job details:', jobError);
        throw jobError;
      }

      return jobData as JobWithDetails;
    } catch (error) {
      console.error('Failed to get job details:', error);
      throw error;
    }
  };

  // Update job status
  const updateJobStatus = async (jobId: string, status: Tables<'jobs'>['status']) => {
    try {
      await updateJob(jobId, { status });
    } catch (error) {
      console.error('Failed to update job status:', error);
      throw error;
    }
  };

  // Assign technician to job
  const assignTechnician = async (jobId: string, technicianId: string) => {
    try {
      await updateJob(jobId, { technician_id: technicianId });
    } catch (error) {
      console.error('Failed to assign technician:', error);
      throw error;
    }
  };

  // Start job (set actual start time)
  const startJob = async (jobId: string) => {
    try {
      const now = new Date().toISOString();
      await updateJob(jobId, { 
        status: 'in_progress',
        actual_start_time: now 
      });
    } catch (error) {
      console.error('Failed to start job:', error);
      throw error;
    }
  };

  // Complete job (set actual end time and calculate duration)
  const completeJob = async (jobId: string, completionNotes?: string) => {
    try {
      const now = new Date().toISOString();
      
      // Get current job to calculate duration
      const currentJob = jobs.find(job => job.id === jobId);
      let actualDurationMinutes = null;
      
      if (currentJob?.actual_start_time) {
        const startTime = new Date(currentJob.actual_start_time);
        const endTime = new Date(now);
        actualDurationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      }
      
      await updateJob(jobId, { 
        status: 'completed',
        actual_end_time: now,
        actual_duration_minutes: actualDurationMinutes,
        completion_notes: completionNotes
      });
    } catch (error) {
      console.error('Failed to complete job:', error);
      throw error;
    }
  };

  // Add material to job
  const addJobMaterial = async (jobId: string, materialData: Omit<Inserts<'job_materials'>, 'job_id'>) => {
    try {
      if (!sdk) {
        console.log('addJobMaterial: No SDK available');
        return;
      }

      const { data, error } = await supabase
        .from('job_materials')
        .insert({ ...materialData, job_id: jobId })
        .select()
        .single();

      if (error) {
        console.error('Failed to add job material:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to add job material:', error);
      throw error;
    }
  };

  // Add expense to job
  const addJobExpense = async (jobId: string, expenseData: Omit<Inserts<'expenses'>, 'whop_user_id' | 'job_id'>) => {
    try {
      if (!sdk) {
        console.log('addJobExpense: No SDK available');
        return;
      }

      const urlData = await sdk.getTopLevelUrlData({});
      if (!urlData) {
        console.log('addJobExpense: No URL data available');
        return;
      }

      const whopUserId = urlData.experienceId;
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({ ...expenseData, whop_user_id: whopUserId, job_id: jobId })
        .select()
        .single();

      if (error) {
        console.error('Failed to add job expense:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to add job expense:', error);
      throw error;
    }
  };

  // Filter jobs by status
  const getJobsByStatus = (status: Tables<'jobs'>['status']): Job[] => {
    return jobs.filter(job => job.status === status);
  };

  // Get jobs for a specific technician
  const getJobsForTechnician = (technicianId: string): Job[] => {
    return jobs.filter(job => job.technician_id === technicianId);
  };

  // Get jobs for a specific customer
  const getJobsForCustomer = (customerId: string): Job[] => {
    return jobs.filter(job => job.customer_id === customerId);
  };

  // Get today's jobs
  const getTodaysJobs = (): Job[] => {
    const today = new Date().toISOString().split('T')[0];
    return jobs.filter(job => job.scheduled_date === today);
  };

  // Get upcoming jobs
  const getUpcomingJobs = (days: number = 7): Job[] => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return jobs.filter(job => {
      if (!job.scheduled_date) return false;
      const jobDate = new Date(job.scheduled_date);
      return jobDate >= today && jobDate <= futureDate && job.status !== 'completed' && job.status !== 'cancelled';
    });
  };

  // Get overdue jobs
  const getOverdueJobs = (): Job[] => {
    const today = new Date().toISOString().split('T')[0];
    return jobs.filter(job => 
      job.scheduled_date && 
      job.scheduled_date < today && 
      job.status !== 'completed' && 
      job.status !== 'cancelled'
    );
  };

  // Get jobs by priority
  const getJobsByPriority = (priority: Tables<'jobs'>['priority']): Job[] => {
    return jobs.filter(job => job.priority === priority);
  };

  // Calculate job statistics
  const getJobStats = () => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(job => job.status === 'completed').length;
    const inProgressJobs = jobs.filter(job => job.status === 'in_progress').length;
    const scheduledJobs = jobs.filter(job => job.status === 'scheduled').length;
    const cancelledJobs = jobs.filter(job => job.status === 'cancelled').length;
    
    const totalRevenue = jobs
      .filter(job => job.status === 'completed')
      .reduce((sum, job) => sum + (job.total_cost || 0), 0);
    
    const averageJobValue = completedJobs > 0 ? totalRevenue / completedJobs : 0;
    
    return {
      totalJobs,
      completedJobs,
      inProgressJobs,
      scheduledJobs,
      cancelledJobs,
      totalRevenue,
      averageJobValue,
      completionRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0
    };
  };

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob,
    getJobDetails,
    updateJobStatus,
    assignTechnician,
    startJob,
    completeJob,
    addJobMaterial,
    addJobExpense,
    getJobsByStatus,
    getJobsForTechnician,
    getJobsForCustomer,
    getTodaysJobs,
    getUpcomingJobs,
    getOverdueJobs,
    getJobsByPriority,
    getJobStats
  };
}
