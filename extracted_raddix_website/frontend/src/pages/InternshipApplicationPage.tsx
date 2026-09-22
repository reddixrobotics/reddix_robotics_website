import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Section, Card, InputField, TextareaField, Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from '@/components/ui';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import apiClient from '@/services/apiClient';

export default function InternshipApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const appliedIds = JSON.parse(localStorage.getItem('applied_opportunities') || '[]');
    if (id && appliedIds.includes(id)) {
      setHasApplied(true);
    }

    apiClient.get('/api/careers/internships')
      .then(res => {
        const item = res.data.find((i: any) => i.id === id);
        if (item) setInternship(item);
      })
      .catch(console.error);
  }, [id]);
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
        type: 'INTERNSHIP',
        internshipId: id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        resumeUrl,
        coverLetter: formData.message,
      });

      setHasApplied(true);
      const appliedIds = JSON.parse(localStorage.getItem('applied_opportunities') || '[]');
      if (id && !appliedIds.includes(id)) {
        appliedIds.push(id);
        localStorage.setItem('applied_opportunities', JSON.stringify(appliedIds));
      }
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
    <Section className="py-12 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/careers')} className="text-[var(--text-secondary)] hover:text-white">
            &larr; Back to Careers
          </Button>
        </div>

        {internship ? (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left Column: Internship Description */}
            <div className="lg:w-2/3">
              <div className="mb-8 border-b border-[var(--border-strong)] pb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{internship.title}</h1>
                {internship.company && <h2 className="text-xl font-medium text-[var(--text-primary)] mb-6">{internship.company}</h2>}
                
                <div className="flex flex-wrap items-center gap-4 text-body-md text-[var(--text-secondary)]">
                  <span className="text-[var(--color-brand)] font-medium bg-[var(--color-brand)]/10 px-3 py-1 rounded-full">{internship.department}</span>
                  {internship.type && <Badge variant="neutral">{internship.type}</Badge>}
                  {internship.location && <div className="flex items-center gap-2"><MapPin size={18} /> {internship.location}</div>}
                  {internship.duration && <div className="flex items-center gap-2"><Clock size={18} /> {internship.duration}</div>}
                  {internship.stipend && <div className="flex items-center gap-2"><Briefcase size={18} /> {internship.stipend}</div>}
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none text-body-lg text-[var(--text-secondary)]">
                <h3 className="text-2xl font-bold text-white mb-4">About the Internship</h3>
                <p className="whitespace-pre-line mb-10 leading-relaxed text-[var(--text-secondary)]">{internship.description}</p>
                
                {internship.skills && internship.skills.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-4 mt-10">Required Skills</h3>
                    <ul className="list-disc pl-5 space-y-3 mb-8 text-[var(--text-secondary)]">
                      {internship.skills.map((skill: string) => (
                        <li key={skill} className="pl-2 leading-relaxed">{skill}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Application Form */}
            <div className="lg:w-1/3 w-full lg:sticky lg:top-24">
              <Card className="p-6 md:p-8 border-[var(--border-strong)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm shadow-xl rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-[var(--border-strong)]">Apply for this role</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputField label="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <InputField label="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  <InputField label="Phone" type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  <InputField label="College / University" required />
                  <InputField label="Course / Major" required />
                  <InputField label="Graduation year" type="number" required />
                  <InputField label="Resume" type="file" required onChange={e => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files[0]) setResumeFile(target.files[0]);
                  }} />
                  <InputField label="Portfolio / GitHub URL" type="url" placeholder="https://" />
                  <InputField label="LinkedIn URL" type="url" placeholder="https://" />
                  <TextareaField label="Cover Letter / Message" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} disabled={hasApplied} />
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting} disabled={hasApplied} className="mt-2">
                    {hasApplied ? 'Applied ✓' : 'Submit Application'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="h-8 w-8 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)] mx-auto mb-4" />
             <h1 className="text-xl text-[var(--text-secondary)]">Loading Internship Details...</h1>
          </div>
        )}
        
        <Modal isOpen={showModal} onClose={handleClose}>
          <ModalHeader title="Application Received" onClose={handleClose} />
          <ModalBody>
            <div className="py-4 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-[var(--text-secondary)]">Your application for <strong>{internship?.title}</strong> has been submitted successfully. We will be in touch soon!</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Back to Careers</Button>
              <Button variant="primary" className="flex-1" onClick={() => navigate('/profile/applications')}>Track Application</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </Section>
  );
}
