import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Section, Card, InputField, TextareaField, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import apiClient from '@/services/apiClient';

export default function WorkshopRegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const appliedIds = JSON.parse(localStorage.getItem('applied_opportunities') || '[]');
    if (id && appliedIds.includes(id)) {
      setHasApplied(true);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (id?.startsWith('ws-')) {
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        await apiClient.post('/api/workshops/register', {
          workshopId: id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
      }
      setHasApplied(true);
      const appliedIds = JSON.parse(localStorage.getItem('applied_opportunities') || '[]');
      if (id && !appliedIds.includes(id)) {
        appliedIds.push(id);
        localStorage.setItem('applied_opportunities', JSON.stringify(appliedIds));
      }
      setShowModal(true);
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/careers');
  };

  return (
    <Section>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/careers')}>
          &larr; Back to Careers
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Register for Workshop: {id}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <InputField label="Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <InputField label="Phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <InputField label="College/Company" required />
          <InputField label="Qualification/Experience" required disabled={hasApplied} />
          <TextareaField label="Message" rows={4} disabled={hasApplied} />
          <Button type="submit" variant="primary" fullWidth loading={isSubmitting} disabled={hasApplied}>
            {hasApplied ? 'Applied ✓' : 'Register'}
          </Button>
        </form>
      </Card>
      
      <Modal isOpen={showModal} onClose={handleClose}>
        <ModalHeader title="Success" onClose={handleClose} />
        <ModalBody>
          <p>You are registered successfully!</p>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Back to Careers</Button>
            <Button variant="primary" className="flex-1" onClick={() => navigate('/profile/applications')}>Track Registration</Button>
          </div>
        </ModalFooter>
      </Modal>
    </Section>
  );
}
