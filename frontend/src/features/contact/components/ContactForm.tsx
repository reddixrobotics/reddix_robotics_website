import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSearchParams } from 'react-router-dom';

import { contactMessageService } from '@/features/admin/services/apiService';

export default function ContactForm() {
  const [status, setStatus] = useState<'initial' | 'submitting' | 'success' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();
  const [subject, setSubject] = useState('');

  useEffect(() => {
    if (searchParams.get('request') === 'demo') {
      setSubject('sales');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || '';
    const company = (formData.get('company') as string) || '';
    const formSubject = formData.get('subject') as string;
    let message = formData.get('message') as string;

    if (company) {
      message = `Company: ${company}\n\n${message}`;
    }

    try {
      await contactMessageService.create({ name, email, phone, subject: formSubject, message });
      setStatus('success');
    } catch (error: any) {
      console.error("Failed to submit message:", error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'There was a problem submitting your message. Please try again later.');
    }
  };

  const handleReset = () => {
    setStatus('initial');
    setErrorMessage('');
    // Optionally reset form fields here using a ref or state
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-8 lg:p-10 relative overflow-hidden">
      
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-heading-md mb-4">Message Sent Successfully!</h3>
            <p className="text-body-lg text-[var(--text-secondary)] mb-8 max-w-md">
              Thank you for reaching out. One of our robotics specialists will get back to you within 24-48 business hours.
            </p>
            <Button onClick={handleReset} variant="outline">
              Send Another Message
            </Button>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            id="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-body-sm text-[var(--text-secondary)] mb-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow disabled:opacity-50"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-body-sm text-[var(--text-secondary)] mb-2">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow disabled:opacity-50"
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-body-sm text-[var(--text-secondary)] mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow disabled:opacity-50"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-body-sm text-[var(--text-secondary)] mb-2">Company</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow disabled:opacity-50"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-body-sm text-[var(--text-secondary)] mb-2">Subject <span className="text-red-500">*</span></label>
              <select 
                id="subject" 
                name="subject" 
                required 
                disabled={status === 'submitting'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow disabled:opacity-50"
              >
                <option value="" disabled>Select an inquiry type...</option>
                <option value="sales">Sales & Enterprise Solutions</option>
                <option value="support">Technical Support</option>
                <option value="partnerships">Partnerships</option>
                <option value="media">Media & Press</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-body-sm text-[var(--text-secondary)] mb-2">Message <span className="text-red-500">*</span></label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={5}
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow disabled:opacity-50 resize-y"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-500">
                <AlertCircle className="flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px]"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <><Loader2 className="animate-spin mr-2" /> Sending...</>
              ) : (
                <><Send size={18} className="mr-2" /> Send Message</>
              )}
            </Button>
            
            <p className="text-xs text-[var(--text-tertiary)] mt-4">
              By submitting this form, you agree to our privacy policy and consent to being contacted by Reddix Robotics.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
