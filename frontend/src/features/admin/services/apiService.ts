import apiClient from '@/services/apiClient';
import { ProductFormData } from '../components/forms/ProductForm';
import { EmployeeFormData } from '../components/forms/EmployeeForm';
import { ProjectFormData } from '../components/forms/ProjectForm';
import { WorkshopFormData } from '../components/forms/WorkshopForm';
import { JobFormData } from '../components/forms/JobForm';

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
      depositPercentage: 20,
      stock: 10,
      specifications: p.technicalSpecifications ? JSON.stringify(p.technicalSpecifications, null, 2) : '',
      features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
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
      depositPercentage: 20,
      stock: 10,
      specifications: p.technicalSpecifications ? JSON.stringify(p.technicalSpecifications, null, 2) : '',
      features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
    };
  },

  async create(item: Omit<ProductFormData, 'id'>): Promise<ProductFormData> {
    const id = `p_${Date.now()}`;
    const payload = {
      id,
      name: item.name,
      category: item.category,
      description: item.description,
      price: Number(item.price),
      features: typeof item.features === 'string' ? item.features.split('\n').filter(Boolean) : item.features || [],
      technicalSpecifications: item.specifications ? JSON.parse(item.specifications) : {},
      availability: true,
      images: []
    };
    const res = await apiClient.post<any>('/api/admin/products', payload);
    return res.data;
  },

  async update(id: string | number, updates: Partial<ProductFormData>): Promise<ProductFormData> {
    const payload: any = { ...updates };
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.features !== undefined && typeof updates.features === 'string') {
      payload.features = updates.features.split('\n').filter(Boolean);
    }
    if (updates.specifications !== undefined && typeof updates.specifications === 'string') {
      try {
        payload.technicalSpecifications = JSON.parse(updates.specifications);
      } catch (e) {
        payload.technicalSpecifications = {};
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
      skills: 'General',
      biography: e.description,
      linkedinUrl: e.linkedInUrl || '',
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
      skills: 'General',
      biography: e.description,
      linkedinUrl: e.linkedInUrl || '',
    };
  },

  async create(item: Omit<EmployeeFormData, 'id'>): Promise<EmployeeFormData> {
    const payload = {
      name: item.name,
      position: item.designation,
      experience: item.experience.toString(),
      description: item.biography,
      linkedInUrl: item.linkedinUrl || undefined,
      profilePhoto: '/images/placeholder.jpg',
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
