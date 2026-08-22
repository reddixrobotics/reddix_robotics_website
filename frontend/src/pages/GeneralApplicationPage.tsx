import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Card, InputField, TextareaField, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import apiClient from '@/services/apiClient';

export default function GeneralApplicationPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    areaOfInterest: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload a resume.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Upload Resume
      const fileData = new FormData();
      fileData.append('file', resumeFile);
      const uploadRes = await apiClient.post('/api/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const resumeUrl = uploadRes.data.url;

      // 2. Submit Application
      await apiClient.post('/api/careers/apply', {
        type: 'GENERAL',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        resumeUrl,
        coverLetter: formData.message ? `Area of Interest: ${formData.areaOfInterest}\nLinkedIn: ${formData.linkedinUrl}\n\n${formData.message}` : `Area of Interest: ${formData.areaOfInterest}\nLinkedIn: ${formData.linkedinUrl}`,
      });

      setHasApplied(true);
      setShowModal(true);
    } catch (error: any) {
      console.error('Submission failed', error);
      alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
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
        <h1 className="text-2xl font-bold mb-4">General Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={hasApplied} />
          <InputField label="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={hasApplied} />
          <InputField label="Phone" type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} disabled={hasApplied} />
          <InputField label="Resume" type="file" required onChange={e => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) setResumeFile(target.files[0]);
          }} disabled={hasApplied} />
          <InputField label="LinkedIn URL" type="url" value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} disabled={hasApplied} />
          <InputField label="Area of Interest" required value={formData.areaOfInterest} onChange={e => setFormData({ ...formData, areaOfInterest: e.target.value })} disabled={hasApplied} />
          <TextareaField label="Message" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} disabled={hasApplied} />
          <Button type="submit" variant="primary" fullWidth loading={isSubmitting} disabled={hasApplied}>
            {hasApplied ? 'Applied ✓' : 'Submit Application'}
          </Button>
        </form>
      </Card>
      
      <Modal isOpen={showModal} onClose={handleClose}>
        <ModalHeader title="Success" onClose={handleClose} />
        <ModalBody>
          <div className="py-4 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            <p className="text-[var(--text-secondary)]">Your general application has been submitted successfully. We will be in touch soon!</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handleClose}>Back to Careers</Button>
            <Button variant="primary" className="flex-1" onClick={() => navigate('/profile/applications')}>Track Application</Button>
          </div>
        </ModalFooter>
      </Modal>
    </Section>
  );
}
