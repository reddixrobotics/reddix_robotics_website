import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Card, InputField, TextareaField, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

export default function GeneralApplicationPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowModal(true);
    }, 1000);
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
        <h1 className="text-2xl font-bold mb-4">General Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" required />
          <InputField label="Email" type="email" required />
          <InputField label="Phone" type="tel" required />
          <InputField label="Resume" type="file" required />
          <InputField label="LinkedIn URL" type="url" />
          <InputField label="Area of Interest" required />
          <TextareaField label="Message" rows={4} />
          <Button type="submit" variant="primary" fullWidth loading={isSubmitting}>
            Submit Application
          </Button>
        </form>
      </Card>
      
      <Modal isOpen={showModal} onClose={handleClose}>
        <ModalHeader title="Success" onClose={handleClose} />
        <ModalBody>
          <p>General application submitted successfully!</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </Modal>
    </Section>
  );
}
