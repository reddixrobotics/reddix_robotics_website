import { useState, useEffect } from 'react';
import { Button, InputField, TextareaField, Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ui';

interface JourneyFormData {
  year: string;
  title: string;
  description: string;
}

interface JourneyFormProps {
  initialData?: JourneyFormData;
  onSubmit: (data: JourneyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function JourneyForm({ initialData, onSubmit, onCancel, isLoading }: JourneyFormProps) {
  const [formData, setFormData] = useState<JourneyFormData>({
    year: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal open={true} onClose={onCancel} size="md">
      <ModalHeader title={initialData ? 'Edit Journey Milestone' : 'Add New Milestone'} />
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <InputField
            label="Year or Period"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g. 2026 or 'Today'"
            required
          />
          <InputField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Foundation"
            required
          />
          <TextareaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed description of the milestone..."
            required
          />
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Milestone' : 'Create Milestone'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
