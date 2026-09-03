import apiClient from '@/services/apiClient';
import { ProductFormData } from '../components/forms/ProductForm';
import { EmployeeFormData } from '../components/forms/EmployeeForm';
import { ProjectFormData } from '../components/forms/ProjectForm';
import { WorkshopFormData } from '../components/forms/WorkshopForm';
import { JobFormData } from '../components/forms/JobForm';
import { InternshipFormData } from '../components/forms/InternshipForm';

// ─── File Upload Service ───────────────────────────────────────────────────────

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await apiClient.post<any>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.url;
}

// ─── Dashboard Service ─────────────────────────────────────────────────────────

export const dashboardService = {
  async getStats(): Promise<any> {
    const res = await apiClient.get<any>('/api/admin/dashboard');
    return res.data;
  }
};



// ─── Contact Message Service ───────────────────────────────────────────────────

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';
  createdAt: string;
}

export const contactMessageService = {
  async create(data: Omit<ContactMessageData, 'id' | 'status' | 'createdAt'>): Promise<ContactMessageData> {
    const res = await apiClient.post<ContactMessageData>('/api/contact', data);
    return res.data;
  },

  async getAll(): Promise<ContactMessageData[]> {
    const res = await apiClient.get<ContactMessageData[]>('/api/admin/contact');
    return res.data;
  },

  async getById(id: string): Promise<ContactMessageData> {
    const res = await apiClient.get<ContactMessageData>(`/api/admin/contact/${id}`);
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<ContactMessageData> {
    const res = await apiClient.patch<ContactMessageData>(`/api/admin/contact/${id}/status`, { status });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/contact/${id}`);
  },

  async reply(id: string, message: string): Promise<any> {
    const res = await apiClient.post(`/api/admin/contact/${id}/reply`, { message });
    return res.data;
  }
};

// ─── Products Service ──────────────────────────────────────────────────────────

export const productService = {
  async getAll(): Promise<ProductFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/products');
    return res.data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      depositPercentage: p.depositPercentage ?? 20,
      stock: p.stock ?? 10,
      specifications: p.technicalSpecifications 
        ? (Object.keys(p.technicalSpecifications).length === 1 && p.technicalSpecifications.details)
          ? p.technicalSpecifications.details
          : Object.entries(p.technicalSpecifications).map(([k, v]) => `${k}: ${v}`).join('\n')
        : '',
      features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
      images: p.images?.map((i: any) => i.url) || [],
    }));
  },

  async getById(id: string | number): Promise<ProductFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/products/${id}`);
    const p = res.data;
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      depositPercentage: p.depositPercentage ?? 20,
      stock: p.stock ?? 10,
      specifications: p.technicalSpecifications 
        ? (Object.keys(p.technicalSpecifications).length === 1 && p.technicalSpecifications.details)
          ? p.technicalSpecifications.details
          : Object.entries(p.technicalSpecifications).map(([k, v]) => `${k}: ${v}`).join('\n')
        : '',
      features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
      images: p.images?.map((i: any) => i.url) || [],
    };
  },

  async create(item: Omit<ProductFormData, 'id'>): Promise<ProductFormData> {
    const id = `p_${Date.now()}`;
    let techSpecs: any = {};
    if (item.specifications) {
      try {
        techSpecs = JSON.parse(item.specifications);
      } catch (e) {
        const lines = item.specifications.split('\n');
        lines.forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx !== -1) {
            const k = line.slice(0, colonIdx).trim();
            const v = line.slice(colonIdx + 1).trim();
            if (k) techSpecs[k] = v;
          } else if (line.trim()) {
            techSpecs[line.trim()] = "Yes";
          }
        });
      }
    }

    const payload = {
      id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: Number(item.price),
      depositPercentage: Number(item.depositPercentage),
      stock: Number(item.stock),
      features: typeof item.features === 'string' ? item.features.split('\n').filter(Boolean) : item.features || [],
      technicalSpecifications: techSpecs,
      availability: true,
      images: item.images || []
    };
    const res = await apiClient.post<any>('/api/admin/products', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<ProductFormData>): Promise<ProductFormData> {
    const payload: any = { ...updates };
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.depositPercentage !== undefined) payload.depositPercentage = Number(updates.depositPercentage);
    if (updates.stock !== undefined) payload.stock = Number(updates.stock);
    if (updates.features !== undefined && typeof updates.features === 'string') {
      payload.features = updates.features.split('\n').filter(Boolean);
    }
    if (updates.specifications !== undefined && typeof updates.specifications === 'string') {
      try {
        payload.technicalSpecifications = JSON.parse(updates.specifications);
      } catch (e) {
        const lines = updates.specifications.split('\n');
        const techSpecs: any = {};
        lines.forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx !== -1) {
            const k = line.slice(0, colonIdx).trim();
            const v = line.slice(colonIdx + 1).trim();
            if (k) techSpecs[k] = v;
          } else if (line.trim()) {
            techSpecs[line.trim()] = "Yes";
          }
        });
        payload.technicalSpecifications = techSpecs;
      }
      delete payload.specifications;
    }
    const res = await apiClient.patch<any>(`/api/admin/products/${id}`, payload);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${id}`);
  }
};

// ─── Employees Service ─────────────────────────────────────────────────────────

export const employeeService = {
  async getAll(): Promise<EmployeeFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/employees');
    return res.data.map(e => ({
      id: e.id,
      name: e.name,
      designation: e.position,
      experience: parseInt(e.experience) || 0,
      skills: Array.isArray(e.skills) ? e.skills.join(', ') : '',
      biography: e.description,
      linkedinUrl: e.linkedInUrl || '',
      profilePhoto: e.profilePhoto || '',
    }));
  },

  async getById(id: string | number): Promise<EmployeeFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/employees/${id}`);
    const e = res.data;
    if (!e) return null;
    return {
      id: e.id,
      name: e.name,
      designation: e.position,
      experience: parseInt(e.experience) || 0,
      skills: Array.isArray(e.skills) ? e.skills.join(', ') : '',
      biography: e.description,
      linkedinUrl: e.linkedInUrl || '',
      profilePhoto: e.profilePhoto || '',
    };
  },

  async create(item: Omit<EmployeeFormData, 'id'>): Promise<EmployeeFormData> {
    const payload = {
      name: item.name,
      position: item.designation,
      experience: item.experience.toString(),
      description: item.biography,
      linkedInUrl: item.linkedinUrl || undefined,
      profilePhoto: item.profilePhoto || '/images/placeholder.jpg',
      skills: item.skills.split(',').map(s => s.trim()).filter(Boolean),
      priority: 1
    };
    const res = await apiClient.post<any>('/api/admin/employees', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<EmployeeFormData>): Promise<EmployeeFormData> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.designation !== undefined) payload.position = updates.designation;
    if (updates.experience !== undefined) payload.experience = updates.experience.toString();
    if (updates.biography !== undefined) payload.description = updates.biography;
    if (updates.linkedinUrl !== undefined) payload.linkedInUrl = updates.linkedinUrl;
    if (updates.profilePhoto !== undefined) payload.profilePhoto = updates.profilePhoto;
    if (updates.skills !== undefined) payload.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    
    const res = await apiClient.patch<any>(`/api/admin/employees/${id}`, payload);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/employees/${id}`);
  }
};

// ─── Projects Service ──────────────────────────────────────────────────────────

export const projectService = {
  async getAll(): Promise<ProjectFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/projects');
    return res.data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
      year: parseInt(p.date) || new Date().getFullYear(),
      details: p.description,
    }));
  },

  async getById(id: string | number): Promise<ProjectFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/projects/${id}`);
    const p = res.data;
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
      year: parseInt(p.date) || new Date().getFullYear(),
      details: p.description,
    };
  },

  async create(item: Omit<ProjectFormData, 'id'>): Promise<ProjectFormData> {
    const payload = {
      name: item.name,
      category: item.category,
      description: item.description,
      technologies: item.technologies.split(',').map(s => s.trim()).filter(Boolean),
      images: [],
      status: 'Completed',
      date: item.year.toString()
    };
    const res = await apiClient.post<any>('/api/admin/projects', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<ProjectFormData>): Promise<ProjectFormData> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.technologies !== undefined) {
      payload.technologies = updates.technologies.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.year !== undefined) payload.date = updates.year.toString();
    const res = await apiClient.patch<any>(`/api/admin/projects/${id}`, payload);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/projects/${id}`);
  }
};

// ─── Workshops Service ─────────────────────────────────────────────────────────

export const workshopService = {
  async getAll(): Promise<WorkshopFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/workshops');
    return res.data.map(w => ({
      id: w.id,
      title: w.title,
      description: w.description,
      date: w.date ? new Date(w.date).toISOString().split('T')[0] : '',
      duration: w.duration,
      location: w.location,
      posterUrl: w.posterUrl,
    }));
  },

  async getById(id: string | number): Promise<WorkshopFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/workshops/${id}`);
    const w = res.data;
    if (!w) return null;
    return {
      id: w.id,
      title: w.title,
      description: w.description,
      date: w.date ? new Date(w.date).toISOString().split('T')[0] : '',
      duration: w.duration,
      location: w.location,
      posterUrl: w.posterUrl,
    };
  },

  async create(item: Omit<WorkshopFormData, 'id'>): Promise<WorkshopFormData> {
    const payload = {
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString(),
      time: '10:00 AM',
      duration: item.duration,
      location: item.location,
      posterUrl: item.posterUrl,
      capacity: 50,
      status: 'PUBLISHED'
    };
    const res = await apiClient.post<any>('/api/admin/workshops', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<WorkshopFormData>): Promise<WorkshopFormData> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.date !== undefined) payload.date = new Date(updates.date).toISOString();
    if (updates.duration !== undefined) payload.duration = updates.duration;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.posterUrl !== undefined) payload.posterUrl = updates.posterUrl;
    const res = await apiClient.patch<any>(`/api/admin/workshops/${id}`, payload);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/workshops/${id}`);
  }
};

// ─── Jobs Service ──────────────────────────────────────────────────────────────

export const jobService = {
  async getAll(): Promise<JobFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/careers/jobs');
    return res.data.map(j => ({
      id: j.id,
      title: j.title,
      department: j.department,
      location: j.location,
      employmentType: j.type,
      experience: j.experienceLevel,
      salary: j.salary || '',
      skills: Array.isArray(j.requirements) ? j.requirements.join(', ') : '',
      description: j.description,
    }));
  },

  async getById(id: string | number): Promise<JobFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/careers/jobs/${id}`);
    const j = res.data;
    if (!j) return null;
    return {
      id: j.id,
      title: j.title,
      department: j.department,
      location: j.location,
      employmentType: j.type,
      experience: j.experienceLevel,
      salary: j.salary || '',
      skills: Array.isArray(j.requirements) ? j.requirements.join(', ') : '',
      description: j.description,
    };
  },

  async create(item: Omit<JobFormData, 'id'>): Promise<JobFormData> {
    const payload = {
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.employmentType,
      experienceLevel: item.experience,
      salary: item.salary,
      requirements: item.skills.split(',').map(s => s.trim()).filter(Boolean),
      responsibilities: [],
      description: item.description,
      status: 'PUBLISHED'
    };
    const res = await apiClient.post<any>('/api/admin/careers/jobs', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<JobFormData>): Promise<JobFormData> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.department !== undefined) payload.department = updates.department;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.employmentType !== undefined) payload.type = updates.employmentType;
    if (updates.experience !== undefined) payload.experienceLevel = updates.experience;
    if (updates.salary !== undefined) payload.salary = updates.salary;
    if (updates.skills !== undefined) {
      payload.requirements = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.description !== undefined) payload.description = updates.description;
    const res = await apiClient.patch<any>(`/api/admin/careers/jobs/${id}`, payload);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/careers/jobs/${id}`);
  }
};

// ─── Journeys Service ──────────────────────────────────────────────────────────

export interface JourneyFormData {
  id?: string;
  year: string;
  title: string;
  description: string;
}

export const journeyService = {
  async getAll(): Promise<JourneyFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/journeys');
    return res.data;
  },

  async getById(id: string | number): Promise<JourneyFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/journeys/${id}`);
    return res.data;
  },

  async create(item: Omit<JourneyFormData, 'id'>): Promise<JourneyFormData> {
    const res = await apiClient.post<any>('/api/admin/journeys', item);
    return res.data;
  },

  async update(id: string | number, updates: Partial<JourneyFormData>): Promise<JourneyFormData> {
    const res = await apiClient.patch<any>(`/api/admin/journeys/${id}`, updates);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/journeys/${id}`);
  }
};

// ─── Upcoming Projects Service ─────────────────────────────────────────────────

export const upcomingProjectService = {
  getAll: async () => {
    try {
      const res = await apiClient.get<any[]>('/api/admin/upcoming-projects');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch upcoming projects', error);
      throw error;
    }
  },

  create: async (payload: any) => {
    try {
      const res = await apiClient.post<any>('/api/admin/upcoming-projects', payload);
      return res.data;
    } catch (error) {
      console.error('Failed to create upcoming project', error);
      throw error;
    }
  },

  update: async (id: string, payload: any) => {
    try {
      const res = await apiClient.patch<any>(`/api/admin/upcoming-projects/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error('Failed to update upcoming project', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await apiClient.delete(`/api/admin/upcoming-projects/${id}`);
    } catch (error) {
      console.error('Failed to delete upcoming project', error);
      throw error;
    }
  }
};

// ─── Featured Projects Service ─────────────────────────────────────────────────

export interface FeaturedProjectFormData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  projectUrl?: string;
  status?: string;
}

export const featuredProjectService = {
  getAll: async (): Promise<FeaturedProjectFormData[]> => {
    try {
      const res = await apiClient.get<any[]>('/api/admin/featured-projects');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch featured projects', error);
      throw error;
    }
  },

  create: async (payload: Omit<FeaturedProjectFormData, 'id'>): Promise<FeaturedProjectFormData> => {
    try {
      const res = await apiClient.post<any>('/api/admin/featured-projects', payload);
      return res.data;
    } catch (error) {
      console.error('Failed to create featured project', error);
      throw error;
    }
  },

  update: async (id: string, payload: Partial<FeaturedProjectFormData>): Promise<FeaturedProjectFormData> => {
    try {
      const res = await apiClient.put<any>(`/api/admin/featured-projects/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error('Failed to update featured project', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/admin/featured-projects/${id}`);
    } catch (error) {
      console.error('Failed to delete featured project', error);
      throw error;
    }
  }
};

// ─── Internships Service ───────────────────────────────────────────────────────

export const internshipService = {
  async getAll(): Promise<InternshipFormData[]> {
    const res = await apiClient.get<any[]>('/api/admin/careers/internships');
    return res.data.map(i => ({
      id: i.id,
      title: i.title,
      company: i.company || '',
      description: i.description,
      department: i.department,
      location: i.location || '',
      duration: i.duration,
      type: i.type || '',
      stipend: i.stipend || '',
      skills: Array.isArray(i.skills) ? i.skills.join(', ') : '',
      requirements: Array.isArray(i.requirements) ? i.requirements.join(', ') : '',
      applicationLink: i.applicationLink || '',
      imageUrl: i.imageUrl || '',
      deadline: i.deadline ? new Date(i.deadline).toISOString().split('T')[0] : '',
      status: i.status || 'DRAFT'
    }));
  },

  async getById(id: string | number): Promise<InternshipFormData | null> {
    const res = await apiClient.get<any>(`/api/admin/careers/internships/${id}`);
    const i = res.data;
    if (!i) return null;
    return {
      id: i.id,
      title: i.title,
      company: i.company || '',
      description: i.description,
      department: i.department,
      location: i.location || '',
      duration: i.duration,
      type: i.type || '',
      stipend: i.stipend || '',
      skills: Array.isArray(i.skills) ? i.skills.join(', ') : '',
      requirements: Array.isArray(i.requirements) ? i.requirements.join(', ') : '',
      applicationLink: i.applicationLink || '',
      imageUrl: i.imageUrl || '',
      deadline: i.deadline ? new Date(i.deadline).toISOString().split('T')[0] : '',
      status: i.status || 'DRAFT'
    };
  },

  async create(item: Omit<InternshipFormData, 'id'>): Promise<InternshipFormData> {
    const payload = {
      title: item.title,
      company: item.company,
      description: item.description,
      department: item.department,
      location: item.location,
      duration: item.duration,
      type: item.type,
      stipend: item.stipend,
      skills: item.skills ? item.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      requirements: item.requirements ? item.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
      applicationLink: item.applicationLink,
      imageUrl: item.imageUrl,
      deadline: item.deadline ? new Date(item.deadline).toISOString() : undefined,
      status: item.status || 'PUBLISHED'
    };
    const res = await apiClient.post<any>('/api/admin/careers/internships', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<InternshipFormData>): Promise<InternshipFormData> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.company !== undefined) payload.company = updates.company;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.department !== undefined) payload.department = updates.department;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.duration !== undefined) payload.duration = updates.duration;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.stipend !== undefined) payload.stipend = updates.stipend;
    if (updates.skills !== undefined) {
      payload.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.requirements !== undefined) {
      payload.requirements = updates.requirements.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.applicationLink !== undefined) payload.applicationLink = updates.applicationLink;
    if (updates.imageUrl !== undefined) payload.imageUrl = updates.imageUrl;
    if (updates.deadline !== undefined) payload.deadline = updates.deadline ? new Date(updates.deadline).toISOString() : null;
    if (updates.status !== undefined) payload.status = updates.status;

    const res = await apiClient.patch<any>(`/api/admin/careers/internships/${id}`, payload);
    return res.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/api/admin/careers/internships/${id}`);
  }
};

// ─── Applications & Registrations ──────────────────────────────────────────────

export interface ApplicationData {
  id: string;
  type: 'JOB' | 'INTERNSHIP' | 'GENERAL';
  jobId?: string;
  internshipId?: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  job?: { title: string };
  internship?: { title: string };
}

export interface WorkshopRegistrationData {
  id: string;
  workshopId: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  workshop?: { title: string };
}

export const applicationService = {
  async getAllApplications(): Promise<ApplicationData[]> {
    const res = await apiClient.get<ApplicationData[]>('/api/admin/careers/applications');
    return res.data;
  },

  async updateApplicationStatus(id: string, status: string): Promise<ApplicationData> {
    const res = await apiClient.patch<ApplicationData>(`/api/admin/careers/applications/${id}/status`, { status });
    return res.data;
  },

  async getAllWorkshopRegistrations(): Promise<WorkshopRegistrationData[]> {
    const res = await apiClient.get<WorkshopRegistrationData[]>('/api/admin/workshops/registrations');
    return res.data;
  },

  async updateWorkshopRegistrationStatus(id: string, status: string): Promise<WorkshopRegistrationData> {
    const res = await apiClient.patch<WorkshopRegistrationData>(`/api/admin/workshops/registrations/${id}/status`, { status });
    return res.data;
  }
};

// ─── Orders Service ────────────────────────────────────────────────────────────

export const orderService = {
  async getAll(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/api/admin/orders');
    return res.data;
  },

  async getById(id: string): Promise<any> {
    const res = await apiClient.get<any>(`/api/admin/orders/${id}`);
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<any> {
    const res = await apiClient.patch<any>(`/api/admin/orders/${id}/status`, { status });
    return res.data;
  },

  createShipment: async (id: string, data: any) => {
    const response = await apiClient.post(`/api/admin/orders/${id}/shipment`, data);
    return response.data;
  },

  updateShipment: async (id: string, data: any) => {
    const response = await apiClient.patch(`/api/admin/orders/${id}/shipment`, data);
    return response.data;
  }
};

// ─── Payments Service ──────────────────────────────────────────────────────────

export const paymentService = {
  async getAll(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/api/admin/payments');
    return res.data;
  },

  async getById(id: string): Promise<any> {
    const res = await apiClient.get<any>(`/api/admin/payments/${id}`);
    return res.data;
  }
};
