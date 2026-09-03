import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/routes/routePaths';
import apiClient from '@/services/apiClient';

export default function Ros2ApplicationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    collegeOrCompany: '',
    branchOrRole: '',
    experience: '',
    usedLinux: false,
    usedRos2: false,
    usedPython: false,
    usedCpp: false,
    builtRoboticsProject: false,
    reason: '',
    goal: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      // Send core fields plus a composed message string for the extra fields
      // to remain compatible with existing backend
      const extraDetails = `
        City: ${formData.city}
        College/Company: ${formData.collegeOrCompany}
        Branch/Role: ${formData.branchOrRole}
        Experience: ${formData.experience}
        Linux: ${formData.usedLinux ? 'Yes' : 'No'}
        ROS 2: ${formData.usedRos2 ? 'Yes' : 'No'}
        Python: ${formData.usedPython ? 'Yes' : 'No'}
        C++: ${formData.usedCpp ? 'Yes' : 'No'}
        Built Robotics Project: ${formData.builtRoboticsProject ? 'Yes' : 'No'}
        Reason: ${formData.reason}
        Goal: ${formData.goal}
      `;

      await apiClient.post('/api/workshops/register', {
        workshopId: 'ros2-industry-immersion',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: extraDetails, // Backend may save this if supported, else it drops gracefully
      });
      
      navigate(ROUTES.WORKSHOP_ROS2_IMMERSION_SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Application failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-content flex flex-col items-center justify-center py-12 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-surface-secondary">
        <div 
          className="h-full bg-brand transition-all duration-500" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-2xl bg-surface-secondary border border-border-subtle shadow-xl rounded-xl p-8 md:p-12 relative overflow-hidden">
        <div className="mb-8">
          <button onClick={() => navigate(ROUTES.WORKSHOP_ROS2_IMMERSION)} className="text-content-muted hover:text-content text-sm font-bold tracking-widest transition-colors">
            &larr; BACK TO PROGRAM
          </button>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">APPLY FOR COHORT</h1>
          <p className="text-content-secondary">Step {step} of 4</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-status-error-bg border border-status-error text-status-error rounded">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border-subtle pb-2">ABOUT YOU</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">Full Name *</label>
                    <input type="text" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">Email Address *</label>
                    <input type="email" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">Phone Number *</label>
                    <input type="tel" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">City *</label>
                    <input type="text" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border-subtle pb-2">EDUCATION / WORK</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">College / Company *</label>
                    <input type="text" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.collegeOrCompany} onChange={e => setFormData({...formData, collegeOrCompany: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">Branch / Role *</label>
                    <input type="text" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.branchOrRole} onChange={e => setFormData({...formData, branchOrRole: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">Year of Study / Experience *</label>
                    <input type="text" className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                           value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border-subtle pb-2">TECHNICAL BACKGROUND</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Have you used Linux?', field: 'usedLinux' },
                    { label: 'Have you used ROS 2?', field: 'usedRos2' },
                    { label: 'Have you used Python?', field: 'usedPython' },
                    { label: 'Have you used C++?', field: 'usedCpp' },
                    { label: 'Have you built a robotics project?', field: 'builtRoboticsProject' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface border border-border-strong rounded">
                      <span className="text-sm">{item.label}</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={item.field} checked={formData[item.field as keyof typeof formData] === true} 
                                 onChange={() => setFormData({...formData, [item.field]: true})} className="accent-brand" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={item.field} checked={formData[item.field as keyof typeof formData] === false} 
                                 onChange={() => setFormData({...formData, [item.field]: false})} className="accent-brand" />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border-subtle pb-2">YOUR GOAL</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">Why do you want to join? *</label>
                    <textarea rows={3} className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                              value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm text-content-secondary mb-1">What do you want to build? *</label>
                    <textarea rows={3} className="w-full bg-surface border border-border-strong rounded px-4 py-3 text-content focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" 
                              value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}></textarea>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-10 pt-6 border-t border-border-subtle">
          <button 
            onClick={handleBack}
            className={`px-6 py-3 font-bold tracking-widest text-sm transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-content-muted hover:text-content'}`}
          >
            BACK
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.name || !formData.email || !formData.phone || !formData.city)) ||
                (step === 2 && (!formData.collegeOrCompany || !formData.branchOrRole || !formData.experience))
              }
              className="px-8 py-3 bg-surface border border-border-strong text-content hover:bg-surface-tertiary font-bold tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.reason || !formData.goal}
              className="px-8 py-3 bg-brand hover:bg-brand-hover text-content-inverse font-bold tracking-widest text-sm transition-all shadow-brand disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION \u2192'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
