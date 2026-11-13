import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Card, InputField, TextareaField, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

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
      const { supabase } = await import('@/lib/supabase');
      const fileExt = resumeFile.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileName = `resumes/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      let resumeUrl = '';
      
      // 1. Upload Resume: Try public-media first, then application-documents
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('public-media')
        .upload(fileName, resumeFile, { upsert: true });

      if (!uploadErr && uploadData) {
        const { data: pData } = supabase.storage.from('public-media').getPublicUrl(fileName);
        resumeUrl = pData.publicUrl;
      } else {
        const { error: appDocErr } = await supabase.storage
          .from('application-documents')
          .upload(fileName, resumeFile, { upsert: true });
        
        if (!appDocErr) {
          const { data: pData } = supabase.storage.from('application-documents').getPublicUrl(fileName);
          resumeUrl = pData.publicUrl;
        } else {
          console.warn('Storage upload error:', uploadErr?.message, appDocErr?.message);
          throw new Error('Resume upload failed: ' + (uploadErr?.message || appDocErr?.message || 'Storage permission denied'));
        }
      }

      // 2. Submit Application with auto-generated ID, timestamps, and schema fallbacks
      const now = new Date().toISOString();
      const applicationId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const combinedCoverLetter = formData.message 
        ? `Area of Interest: ${formData.areaOfInterest}\nLinkedIn: ${formData.linkedinUrl}\n\n${formData.message}` 
        : `Area of Interest: ${formData.areaOfInterest}\nLinkedIn: ${formData.linkedinUrl}`;

      const primaryPayload: any = {
        id: applicationId,
        type: 'GENERAL',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        resumeUrl,
        coverLetter: combinedCoverLetter,
        status: 'RECEIVED',
        createdAt: now,
        updatedAt: now
      };

      let { error: dbError } = await supabase.from('Application').insert(primaryPayload);

      // Schema fallback: if camelCase columns don't exist, retry with snake_case
      if (dbError && (dbError.message?.includes('column') || dbError.code === 'PGRST204' || dbError.message?.includes('schema cache'))) {
        console.warn('Retrying general application insert with snake_case schema:', dbError.message);
        const snakePayload: any = {
          id: applicationId,
          type: 'GENERAL',
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          resume_url: resumeUrl,
          cover_letter: combinedCoverLetter,
          status: 'RECEIVED',
          created_at: now,
          updated_at: now
        };
        const retryRes = await supabase.from('Application').insert(snakePayload);
        dbError = retryRes.error;
      }

      if (dbError) throw dbError;
      
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: formData.email.trim(),
            subject: 'Application Received: Reddix Robotics',
            text: 'Hello ' + formData.name.trim() + ',\n\nWe have successfully received your application.\n\nBest,\nReddix Robotics Team'
          }
        });
      } catch {
        // non-blocking email notification
      }

      setHasApplied(true);
      setShowModal(true);
    } catch (error: any) {
      console.error('Submission failed', error);
      alert('Failed to submit application: ' + (error?.message || error?.details || 'Please check your inputs and try again.'));
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
