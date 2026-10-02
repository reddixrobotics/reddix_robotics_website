import { supabase } from '@/lib/supabase';
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

  // Setting Content-Type to undefined removes the axios instance-level default
  // ('application/json') for this request only, so the browser auto-generates:
  // "multipart/form-data; boundary=----WebKitFormBoundaryXXXX"
  // Without the boundary, multer cannot parse the file parts and returns 400.
  const { supabase } = await import('@/lib/supabase');
  const uploadedFile = formData.get('file') as File;
  if (!uploadedFile) throw new Error("No file provided");
  const ext = uploadedFile.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { data, error } = await supabase.storage.from('public-media').upload(fileName, uploadedFile, { upsert: true });
  if (error) throw error;
  
  const { data: publicUrl } = supabase.storage.from('public-media').getPublicUrl(data.path);
  return publicUrl.publicUrl;
}

// ─── Dashboard Service ─────────────────────────────────────────────────────────

export const dashboardService = {
  async getStats(): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const [orders, revenue, products, workshops] = await Promise.all([
      supabase.from('Order').select('id', { count: 'exact', head: true }),
      supabase.from('Order').select('totalAmount').eq('paymentStatus', 'FULLY_PAID'),
      supabase.from('Product').select('id', { count: 'exact', head: true }),
      supabase.from('Workshop').select('id', { count: 'exact', head: true }),
    ]);
    const totalRev = (revenue.data || []).reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    return {
      totalOrders: orders.count || 0,
      totalRevenue: totalRev,
      totalProducts: products.count || 0,
      totalWorkshops: workshops.count || 0
    };
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
    const { supabase } = await import('@/lib/supabase');
    const insertData = {
      ...data,
      id: crypto.randomUUID(),
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const { error } = await supabase.from('ContactMessage').insert(insertData);
    if (error) throw error;
    await supabase.functions.invoke('send-email', {
      body: {
        to: 'admin@reddixrobotics.com',
        subject: 'New Contact Request: ' + data.subject,
        text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}`
      }
    });
    return insertData as any;
  },
  async getAll(): Promise<ContactMessageData[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('ContactMessage').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as any;
  },
  async getById(id: string): Promise<ContactMessageData> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('ContactMessage').select('*').eq('id', id).single();
    if (error) throw error;
    return data as any;
  },
  async updateStatus(id: string, status: 'UNREAD' | 'READ' | 'RESOLVED'): Promise<ContactMessageData> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('ContactMessage').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data as any;
  },
  async delete(id: string): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('ContactMessage').delete().eq('id', id);
    if (error) throw error;
  },
  async replyTo(id: string, message: string): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { data: msg } = await supabase.from('ContactMessage').select('email').eq('id', id).single();
    if (msg?.email) {
      await supabase.functions.invoke('send-email', {
        body: { to: msg.email, subject: 'Reply to your contact message', text: message }
      });
      await supabase.from('ContactMessage').update({ status: 'RESOLVED' }).eq('id', id);
    }
  }
};

// ─── Products Service ──────────────────────────────────────────────────────────

export const productService = {
  async getAll(): Promise<ProductFormData[]> {
    const { data, error } = await supabase.from('Product').select('*, ProductImage(*)').order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      depositPercentage: p.depositPercentage ?? 20,
      stock: p.stock ?? 10,
      specifications: p.technicalSpecifications 
        ? (Object.keys(p.technicalSpecifications).length === 1 && (p.technicalSpecifications as any).details)
          ? (p.technicalSpecifications as any).details
          : Object.entries(p.technicalSpecifications as any).map(([k, v]) => `${k}: ${v}`).join('\n')
        : '',
      features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
      images: p.ProductImage?.map((i: any) => i.url) || [],
    }));
  },

  async getById(id: string | number): Promise<ProductFormData | null> {
    const { data: p, error } = await supabase.from('Product').select('*, ProductImage(*)').eq('id', id).single();
    if (error || !p) return null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      depositPercentage: p.depositPercentage ?? 20,
      stock: p.stock ?? 10,
      specifications: p.technicalSpecifications 
        ? (Object.keys(p.technicalSpecifications).length === 1 && (p.technicalSpecifications as any).details)
          ? (p.technicalSpecifications as any).details
          : Object.entries(p.technicalSpecifications as any).map(([k, v]) => `${k}: ${v}`).join('\n')
        : '',
      features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
      images: p.ProductImage?.map((i: any) => i.url) || [],
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
        lines.forEach((line: string) => {
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
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('Product').insert(payload).select().single();
    if (error) throw error;
    
    if (item.images && item.images.length > 0) {
      const imagePayloads = item.images.map((url: string) => ({
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: data.id,
        url,
        isPrimary: item.images![0] === url,
        updatedAt: new Date().toISOString()
      }));
      const { error: imgError } = await supabase.from('ProductImage').insert(imagePayloads);
      if (imgError) throw imgError;
    }
    
    return this.getById(data.id) as Promise<ProductFormData>;
  },

  async update(id: string | number, updates: Partial<ProductFormData>): Promise<ProductFormData> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
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
        lines.forEach((line: string) => {
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
    }
    
    if (Object.keys(payload).length > 0) {
      payload.updatedAt = new Date().toISOString();
      const { error } = await supabase.from('Product').update(payload).eq('id', id);
      if (error) throw error;
    }
    
    if (updates.images !== undefined) {
      const { data: existingImages } = await supabase.from('ProductImage').select('*').eq('productId', id);
      const currentUrls = existingImages?.map((img: any) => img.url) || [];
      const newUrls = updates.images || [];
      
      const toDelete = existingImages?.filter((img: any) => !newUrls.includes(img.url)) || [];
      const toAdd = newUrls.filter((url: string) => !currentUrls.includes(url));
      
      if (toDelete.length > 0) {
        await supabase.from('ProductImage').delete().in('id', toDelete.map((img: any) => img.id));
      }
      
      if (toAdd.length > 0) {
        const imagePayloads = toAdd.map((url: string) => ({
          id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: id as string,
          url,
          isPrimary: newUrls[0] === url,
          updatedAt: new Date().toISOString()
        }));
        await supabase.from('ProductImage').insert(imagePayloads);
      }
    }

    return this.getById(id) as Promise<ProductFormData>;
  },

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from('Product').delete().eq('id', id);
    if (error) throw error;
  }
};


// ─── Employees Service ─────────────────────────────────────────────────────────

export const employeeService = {
  async getAll(): Promise<EmployeeFormData[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Employee').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map((e: any) => ({
      id: e.id,
      name: e.name,
      designation: e.position ?? '',           // DB: position
      experience: e.experience ?? 0,
      biography: e.description ?? '',          // DB: description
      profilePhoto: e.profilePhoto ?? '',
      skills: Array.isArray(e.skills) ? e.skills.join(', ') : (e.skills ?? ''),
      linkedinUrl: e.linkedInUrl ?? '',        // DB: linkedInUrl (capital I)
    }));
  },

  async getById(id: string | number): Promise<EmployeeFormData | null> {
    const { supabase } = await import('@/lib/supabase');
    const { data: e, error } = await supabase.from('Employee').select('*').eq('id', id).single();
    if (error) throw error;
    if (!e) return null;
    return {
      id: e.id,
      name: e.name,
      designation: e.position ?? '',           // DB: position
      experience: e.experience ?? 0,
      biography: e.description ?? '',          // DB: description
      profilePhoto: e.profilePhoto ?? '',
      skills: Array.isArray(e.skills) ? e.skills.join(', ') : (e.skills ?? ''),
      linkedinUrl: e.linkedInUrl ?? '',        // DB: linkedInUrl (capital I)
    };
  },

  async create(item: Omit<EmployeeFormData, 'id'>): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload: Record<string, any> = {
      name: item.name,
      position: (item as any).designation ?? '',          // form: designation → DB: position
      experience: (item as any).experience ?? 0,
      description: (item as any).biography ?? '',         // form: biography   → DB: description
      linkedInUrl: (item as any).linkedinUrl ?? '',       // form: linkedinUrl → DB: linkedInUrl
      profilePhoto: (item as any).profilePhoto ?? '',
      skills: (typeof item.skills === 'string')
        ? item.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (item.skills ?? []),
    };
    const { data, error } = await supabase.from('Employee').insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string | number, updates: Partial<EmployeeFormData>): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if ((updates as any).designation !== undefined) payload.position = (updates as any).designation;       // → position
    if ((updates as any).experience !== undefined) payload.experience = (updates as any).experience;
    if ((updates as any).biography !== undefined) payload.description = (updates as any).biography;        // → description
    if ((updates as any).linkedinUrl !== undefined) payload.linkedInUrl = (updates as any).linkedinUrl;   // → linkedInUrl
    if (updates.profilePhoto !== undefined) payload.profilePhoto = updates.profilePhoto;
    if (updates.skills !== undefined) {
      payload.skills = (typeof updates.skills === 'string')
        ? updates.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : updates.skills;
    }
    const { data, error } = await supabase.from('Employee').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string | number): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('Employee').delete().eq('id', id);
    if (error) throw error;
  }
};

// ─── Projects Service ──────────────────────────────────────────────────────────

export const projectService = {
  async getAll(): Promise<ProjectFormData[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Project').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      year: p.date ? parseInt(p.date) : new Date().getFullYear(),   // DB: date → form: year
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies ?? ''),
      details: '',  // no matching DB column — display only
    }));
  },
  async getById(id: string | number): Promise<ProjectFormData | null> {
    const { supabase } = await import('@/lib/supabase');
    const { data: p, error } = await supabase.from('Project').select('*').eq('id', id).single();
    if (error) throw error;
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      year: p.date ? parseInt(p.date) : new Date().getFullYear(),
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies ?? ''),
      details: '',
    };
  },
  async create(item: Omit<ProjectFormData, 'id'>): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload: Record<string, any> = {
      name: item.name,
      category: item.category,
      description: item.description,
      date: String((item as any).year ?? new Date().getFullYear()),  // form: year → DB: date
      technologies: (typeof item.technologies === 'string')
        ? item.technologies.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (item.technologies ?? []),
      images: [],
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString(),
      // 'details' field has no DB column — intentionally omitted
    };
    const { data, error } = await supabase.from('Project').insert(payload).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string | number, updates: Partial<ProjectFormData>): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
    if ((updates as any).year !== undefined) payload.date = String((updates as any).year);
    if (updates.technologies !== undefined) {
      payload.technologies = (typeof updates.technologies === 'string')
        ? updates.technologies.split(',').map((s: string) => s.trim()).filter(Boolean)
        : updates.technologies;
    }
    const { data, error } = await supabase.from('Project').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string | number): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('Project').delete().eq('id', id);
    if (error) throw error;
  }
};



// ─── Workshops Service ─────────────────────────────────────────────────────────

export const workshopService = {
  async getAll(): Promise<WorkshopFormData[]> {
    const { data, error } = await supabase.from('Workshop').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map((w: any) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      date: w.date ? new Date(w.date).toISOString().split('T')[0] : '',
      duration: w.duration,
      location: w.location,
      posterUrl: w.posterUrl,
      externalUrl: w.externalUrl,
        status: w.status,
    }));
  },

  async getById(id: string | number): Promise<WorkshopFormData | null> {
    const { data: w, error } = await supabase.from('Workshop').select('*').eq('id', id).single();
    if (error || !w) return null;
    return {
      id: w.id,
      title: w.title,
      description: w.description,
      date: w.date ? new Date(w.date).toISOString().split('T')[0] : '',
      duration: w.duration,
      location: w.location,
      posterUrl: w.posterUrl,
      externalUrl: w.externalUrl,
        status: w.status,
    };
  },

  async create(item: Omit<WorkshopFormData, 'id'>): Promise<WorkshopFormData> {
    const payload = {
      id: `w_${Date.now()}`,
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString(),
      time: '10:00 AM',
      duration: item.duration,
      location: item.location,
      posterUrl: item.posterUrl,
      externalUrl: item.externalUrl,
        status: item.status || 'PUBLISHED',
      capacity: 50,
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('Workshop').insert(payload).select().single();
    if (error) throw error;
    return this.getById(data.id) as Promise<WorkshopFormData>;
  },

  async update(id: string | number, updates: Partial<WorkshopFormData>): Promise<WorkshopFormData> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.date !== undefined) payload.date = new Date(updates.date).toISOString();
    if (updates.duration !== undefined) payload.duration = updates.duration;
      if (updates.status !== undefined) payload.status = updates.status;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.posterUrl !== undefined) payload.posterUrl = updates.posterUrl;
    if (updates.externalUrl !== undefined) payload.externalUrl = updates.externalUrl;
    
    if (Object.keys(payload).length > 0) {
      payload.updatedAt = new Date().toISOString();
      const { error } = await supabase.from('Workshop').update(payload).eq('id', id);
      if (error) throw error;
    }
    return this.getById(id) as Promise<WorkshopFormData>;
  },

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from('Workshop').delete().eq('id', id);
    if (error) throw error;
  }
};


// ─── Jobs Service ──────────────────────────────────────────────────────────────

export const jobService = {
  async getAll(): Promise<JobFormData[]> {
    const { data, error } = await supabase.from('Job').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map((j: any) => ({
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
    const { data: j, error } = await supabase.from('Job').select('*').eq('id', id).single();
    if (error || !j) return null;
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
      id: `job_${Date.now()}`,
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.employmentType,
      experienceLevel: item.experience,
      salary: item.salary,
      requirements: item.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      responsibilities: [],
      description: item.description,
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('Job').insert(payload).select().single();
    if (error) throw error;
    return this.getById(data.id) as Promise<JobFormData>;
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
      payload.requirements = updates.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (updates.description !== undefined) payload.description = updates.description;
    
    if (Object.keys(payload).length > 0) {
      payload.updatedAt = new Date().toISOString();
      const { error } = await supabase.from('Job').update(payload).eq('id', id);
      if (error) throw error;
    }
    return this.getById(id) as Promise<JobFormData>;
  },

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from('Job').delete().eq('id', id);
    if (error) throw error;
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
  async getAll(): Promise<any[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Journey').select('*').order('createdAt', { ascending: true });
    if (error) throw error;
    return data;
  },
  async getById(id: string | number): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Journey').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(item: any): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload = { ...item, updatedAt: new Date().toISOString() };
    const { data, error } = await supabase.from('Journey').insert(payload).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string | number, updates: any): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    const { data, error } = await supabase.from('Journey').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string | number): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('Journey').delete().eq('id', id);
    if (error) throw error;
  }
};

// ─── Upcoming Projects Service ─────────────────────────────────────────────────

export const upcomingProjectService = {
  async getAll(): Promise<any[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('UpcomingProject').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(payload: any): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('UpcomingProject').insert(payload).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, payload: any): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('UpcomingProject').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('UpcomingProject').delete().eq('id', id);
    if (error) throw error;
  }
};

// ─── Featured Projects Service ─────────────────────────────────────────────────

export interface FeaturedProjectFormData {
  designProcess?: string;
  designDate?: string;
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  projectUrl?: string;
  status?: string;
}

export const featuredProjectService = {
  async getAll(): Promise<FeaturedProjectFormData[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('FeaturedProject').select('*').order('createdAt', { ascending: true });
    if (error) throw error;
    return (data || []).map((p: any) => {
      let description = p.description;
      let designProcess = '';
      let designDate = '';
      try {
        const parsed = JSON.parse(p.description);
        description = parsed.text || p.description;
        designProcess = parsed.designProcess || '';
        designDate = parsed.designDate || '';
      } catch (e) {
      }
      return {
        id: p.id,
        title: p.title,
        description,
        designProcess,
        designDate,
        imageUrl: p.imageUrl,
        category: p.category,
        projectUrl: p.projectUrl,
        status: p.status,
      };
    });
  },
  async create(item: Omit<FeaturedProjectFormData, 'id'>): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const packedDescription = JSON.stringify({
      text: item.description,
      designProcess: item.designProcess || '',
      designDate: item.designDate || ''
    });
    const payload = {
      title: item.title,
      description: packedDescription,
      imageUrl: item.imageUrl,
      category: item.category,
      projectUrl: item.projectUrl,
      status: item.status || 'PUBLISHED'
    };
    const { data, error } = await supabase.from('FeaturedProject').insert(payload).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string | number, updates: Partial<FeaturedProjectFormData>): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.imageUrl !== undefined) payload.imageUrl = updates.imageUrl;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.projectUrl !== undefined) payload.projectUrl = updates.projectUrl;
    if (updates.status !== undefined) payload.status = updates.status;
    
    if (updates.description !== undefined || updates.designProcess !== undefined || updates.designDate !== undefined) {
       payload.description = JSON.stringify({
         text: updates.description || '',
         designProcess: updates.designProcess || '',
         designDate: updates.designDate || ''
       });
    }
    
    const { data, error } = await supabase.from('FeaturedProject').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string | number): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase.from('FeaturedProject').delete().eq('id', id);
    if (error) throw error;
  }
};

// ─── Internships Service ───────────────────────────────────────────────────────

export const internshipService = {
  async getAll(): Promise<InternshipFormData[]> {
    const { data, error } = await supabase.from('Internship').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return (data || []).map((i: any) => ({
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
    const { data: i, error } = await supabase.from('Internship').select('*').eq('id', id).single();
    if (error || !i) return null;
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
      id: `int_${Date.now()}`,
      title: item.title,
      company: item.company,
      description: item.description,
      department: item.department,
      location: item.location,
      duration: item.duration,
      type: item.type,
      stipend: item.stipend,
      skills: item.skills ? item.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      requirements: item.requirements ? item.requirements.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      applicationLink: item.applicationLink,
      imageUrl: item.imageUrl,
      deadline: item.deadline ? new Date(item.deadline).toISOString() : null,
      status: item.status || 'PUBLISHED',
      updatedAt: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('Internship').insert(payload).select().single();
    if (error) throw error;
    return this.getById(data.id) as Promise<InternshipFormData>;
  },

  async update(id: string | number, updates: Partial<InternshipFormData>): Promise<InternshipFormData> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.company !== undefined) payload.company = updates.company;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.department !== undefined) payload.department = updates.department;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.duration !== undefined) payload.duration = updates.duration;
      if (updates.status !== undefined) payload.status = updates.status;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.stipend !== undefined) payload.stipend = updates.stipend;
    if (updates.skills !== undefined) {
      payload.skills = updates.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (updates.requirements !== undefined) {
      payload.requirements = updates.requirements.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (updates.applicationLink !== undefined) payload.applicationLink = updates.applicationLink;
    if (updates.imageUrl !== undefined) payload.imageUrl = updates.imageUrl;
    if (updates.deadline !== undefined) payload.deadline = updates.deadline ? new Date(updates.deadline).toISOString() : null;
    if (updates.status !== undefined) payload.status = updates.status;

    if (Object.keys(payload).length > 0) {
      payload.updatedAt = new Date().toISOString();
      const { error } = await supabase.from('Internship').update(payload).eq('id', id);
      if (error) throw error;
    }
    return this.getById(id) as Promise<InternshipFormData>;
  },

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from('Internship').delete().eq('id', id);
    if (error) throw error;
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
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Application').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as any;
  },
  async updateApplicationStatus(id: string, status: string): Promise<ApplicationData> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Application').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data as any;
  },
  async getAllWorkshopRegistrations(): Promise<WorkshopRegistrationData[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('WorkshopRegistration').select('*, workshop:Workshop(title)').order('createdAt', { ascending: false });
    if (error) throw error;
    return data as any;
  },
  async updateWorkshopRegistrationStatus(id: string, status: string): Promise<WorkshopRegistrationData> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('WorkshopRegistration').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data as any;
  }
};

// ─── Orders Service ────────────────────────────────────────────────────────────

export const orderService = {
  async getAll(): Promise<any[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Order').select('*, customer:User(name, email), items:OrderItem(*, product:Product(*)), shipment:Shipment(*)').order('createdAt', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Order').select('*, customer:User(name, email), items:OrderItem(*, product:Product(*)), shipment:Shipment(*), payment:Payment(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async updateStatus(id: string, status: string): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Order').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async createShipment(id: string, payload: any): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data: res, error } = await supabase.functions.invoke('shiprocket-api', {
      body: { action: 'create_shipment', orderId: id, payload }
    });
    if (error) throw error;
    return res;
  },
  async updateShipment(id: string, payload: any): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data: res, error } = await supabase.functions.invoke('shiprocket-api', {
      body: { action: 'generate_awb', orderId: id, payload }
    });
    if (error) throw error;
    return res;
  }
};

// ─── Payments Service ──────────────────────────────────────────────────────────

export const paymentService = {
  async getAll(): Promise<any[]> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Payment').select('*, order:Order(orderNumber, customerId)').order('createdAt', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<any> {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase.from('Payment').select('*, order:Order(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  }
};










