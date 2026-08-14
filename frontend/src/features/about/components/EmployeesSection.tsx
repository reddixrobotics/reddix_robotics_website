import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeading, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from '@/components/ui';
import { Linkedin } from 'lucide-react';
import { employees, type Employee } from '../data/mockData';

export default function EmployeesSection() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-[var(--color-brand)] transition-colors duration-300">
              <img 
                src={emp.photoUrl} 
                alt={emp.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
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
            <ModalHeader title="Team Member Profile" onClose={() => setSelectedEmployee(null)} />
            <ModalBody>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-[var(--border-strong)]">
                  <img 
                    src={selectedEmployee.photoUrl} 
                    alt={selectedEmployee.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-heading-lg mb-1">{selectedEmployee.name}</h3>
                  <p className="text-body-lg text-[var(--color-brand)] font-medium mb-4">{selectedEmployee.designation}</p>
                  
                  <div className="mb-4">
                    <p className="text-label text-[var(--text-tertiary)] mb-1">Experience</p>
                    <p className="text-body-md">{selectedEmployee.experience}</p>
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
              <Button 
                variant="outline" 
                onClick={() => window.open(selectedEmployee.linkedinUrl, '_blank')}
                className="flex items-center gap-2"
                aria-label={`View ${selectedEmployee.name}'s LinkedIn profile`}
              >
                <Linkedin size={18} /> Connect on LinkedIn
              </Button>
              <Button onClick={() => setSelectedEmployee(null)}>Close</Button>
            </ModalFooter>
          </Modal>
        )}
      </AnimatePresence>
    </Section>
  );
}
