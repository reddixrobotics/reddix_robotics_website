import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeading, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from '@/components/ui';
import { Linkedin } from 'lucide-react';
import apiClient from '@/services/apiClient';

export interface PublicEmployee {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  biography: string;
  skills: string[];
  experience: string;
  linkedinUrl: string;
}

export default function EmployeesSection() {
  const [selectedEmployee, setSelectedEmployee] = useState<PublicEmployee | null>(null);
  const [employees, setEmployees] = useState<PublicEmployee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get('/api/employees');
        let backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
        
        const mapped = res.data.map((e: any) => {
          let photo = e.profilePhoto;
          if (photo && photo.startsWith('/uploads/')) {
            photo = `${backendUrl}${photo}`;
          }
          if (!photo) {
            photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=333333&color=ffffff&size=200`;
          }
          return {
            id: e.id,
            name: e.name,
            designation: e.position,
            photoUrl: photo,
            biography: e.description,
            skills: Array.isArray(e.skills) ? e.skills : [],
            experience: e.experience,
            linkedinUrl: e.linkedInUrl || '',
          };
        });
        setEmployees(mapped);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Section className="bg-[var(--bg-secondary)]">
      <SectionHeading 
        eyebrow="Our Team" 
        title="The People Behind Reddix" 
        description="A multidisciplinary team of engineers, researchers, and visionaries."
      />
      
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {employees.map((emp, i) => (
          <motion.div
            key={emp.id}
            className="flex flex-col items-center text-center group cursor-pointer"
            onClick={() => setSelectedEmployee(emp)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-[var(--color-brand)] transition-colors duration-300 bg-[var(--bg-tertiary)] flex items-center justify-center">
              <img 
                src={emp.photoUrl} 
                alt={emp.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=333333&color=ffffff&size=200`; }}
              />
            </div>
            <h4 className="text-heading-sm font-semibold group-hover:text-[var(--color-brand)] transition-colors">{emp.name}</h4>
            <p className="text-body-sm text-[var(--text-secondary)] mt-1">{emp.designation}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEmployee && (
          <Modal
            open={!!selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            size="lg"
            aria-label={`${selectedEmployee.name} details`}
          >
            <ModalHeader title="Team Member Profile" />
            <ModalBody>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-[var(--border-strong)] bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <img 
                    src={selectedEmployee.photoUrl} 
                    alt={selectedEmployee.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployee.name)}&background=333333&color=ffffff&size=200`; }}
                  />
                </div>
                <div>
                  <h3 className="text-heading-lg mb-1">{selectedEmployee.name}</h3>
                  <p className="text-body-lg text-[var(--color-brand)] font-medium mb-4">{selectedEmployee.designation}</p>
                  
                  <div className="mb-4">
                    <p className="text-label text-[var(--text-tertiary)] mb-1">Experience</p>
                    <p className="text-body-md">{selectedEmployee.experience} Years</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-label text-[var(--text-tertiary)] mb-2">Core Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map(skill => (
                        <Badge key={skill} variant="neutral" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-label text-[var(--text-tertiary)] mb-1">Biography</p>
                    <p className="text-body-md text-[var(--text-secondary)] leading-relaxed">
                      {selectedEmployee.biography}
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--border-primary)]">
              {selectedEmployee.linkedinUrl && (
                <Button 
                  variant="outline" 
                  onClick={() => window.open(selectedEmployee.linkedinUrl, '_blank')}
                  className="flex items-center gap-2"
                  aria-label={`View ${selectedEmployee.name}'s LinkedIn profile`}
                >
                  <Linkedin size={18} /> Connect on LinkedIn
                </Button>
              )}
              <Button onClick={() => setSelectedEmployee(null)}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </AnimatePresence>
    </Section>
  );
}
