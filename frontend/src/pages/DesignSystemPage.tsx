import { useState } from 'react';
import {
  Button, Badge, Card, InputField, TextareaField,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Section, SectionHeading,
} from '@/components/ui';
import { Mail, Search, ArrowRight, Check, AlertCircle } from 'lucide-react';

/**
 * HomePage — Design System Showcase
 * Demonstrates every token, component, and state in the Reddix design system.
 * Replace with the real home page content when pages are built.
 */
export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [inputError, setInputError] = useState('');

  const handleValidate = () => {
    setInputError(inputVal.trim() === '' ? 'This field is required.' : '');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="section"
        style={{
          borderBottom: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div className="container-content text-center">
          <p className="text-eyebrow mb-4">Design System Preview</p>
          <h1 className="text-display-lg">
            Reddix{' '}
            <span className="text-gradient">Robotics</span>
          </h1>
          <p className="text-body-lg mx-auto mt-5 max-w-prose">
            Pioneering autonomous intelligence. A premium, accessible design
            system built on CSS design tokens, dual theming, and clean
            component architecture.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">Get Started <ArrowRight size={16} aria-hidden="true" /></Button>
            <Button variant="secondary" size="lg">Learn More</Button>
          </div>
        </div>
      </section>

      {/* ── Buttons ────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow="Components"
          title="Buttons"
          description="Five semantic variants × five sizes with loading and disabled states."
          align="left"
        />

        <div className="space-y-6">
          {/* Variants */}
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          {/* Sizes */}
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
          {/* States */}
          <div className="flex flex-wrap gap-3">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" loading>Loading outline</Button>
          </div>
        </div>
      </Section>

      {/* ── Badges ─────────────────────────────────────────────── */}
      <Section compact style={{ backgroundColor: 'var(--bg-secondary)' } as React.CSSProperties}>
        <SectionHeading eyebrow="Components" title="Badges" align="left" />
        <div className="flex flex-wrap gap-3">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning" dot>Pending</Badge>
          <Badge variant="error" dot>Offline</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="solid">Solid Brand</Badge>
          <Badge variant="brand" size="sm">Small</Badge>
          <Badge variant="brand" size="lg">Large</Badge>
        </div>
      </Section>

      {/* ── Cards ──────────────────────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow="Components" title="Cards" align="left" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="text-label mb-2">Default card</p>
            <h3 className="text-heading-md">Autonomous Navigation</h3>
            <p className="text-body-sm mt-2">
              Real-time path planning for complex environments using sensor
              fusion and ML inference.
            </p>
          </Card>
          <Card raised accentBorder>
            <Badge variant="brand" size="sm" className="mb-3">Featured</Badge>
            <h3 className="text-heading-md">Raised + Accent Border</h3>
            <p className="text-body-sm mt-2">
              Elevated card with a tomato red top border to draw attention to
              key content.
            </p>
          </Card>
          <Card interactive>
            <p className="text-label mb-2">Interactive card</p>
            <h3 className="text-heading-md">Hover for interaction</h3>
            <p className="text-body-sm mt-2">
              Hover and focus styles for clickable cards — keyboard navigable.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── Inputs ─────────────────────────────────────────────── */}
      <Section compact style={{ backgroundColor: 'var(--bg-secondary)' } as React.CSSProperties}>
        <SectionHeading eyebrow="Components" title="Form Inputs" align="left" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <InputField
            label="Email address"
            placeholder="you@company.com"
            type="email"
            iconLeft={<Mail size={15} />}
            hint="We'll never share your email."
          />
          <InputField
            label="Search"
            placeholder="Search products…"
            iconLeft={<Search size={15} />}
          />
          <InputField
            label="Validated field"
            placeholder="Required"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={handleValidate}
            error={inputError}
            required
          />
        </div>
        <div className="mt-5 max-w-lg">
          <TextareaField
            label="Message"
            placeholder="Describe your project requirements…"
            hint="Minimum 20 characters."
            rows={4}
          />
        </div>
      </Section>

      {/* ── Alerts ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow="Components" title="Alerts" align="left" />
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="alert alert-info">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong className="block font-semibold">Info:</strong>
              System maintenance scheduled for this weekend.
            </div>
          </div>
          <div className="alert alert-success">
            <Check size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong className="block font-semibold">Success:</strong>
              Your configuration has been saved successfully.
            </div>
          </div>
          <div className="alert alert-warning">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong className="block font-semibold">Warning:</strong>
              API rate limit approaching — 80% used.
            </div>
          </div>
          <div className="alert alert-error">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong className="block font-semibold">Error:</strong>
              Failed to connect to the robotics API endpoint.
            </div>
          </div>
        </div>
      </Section>

      {/* ── Typography ─────────────────────────────────────────── */}
      <Section compact style={{ backgroundColor: 'var(--bg-secondary)' } as React.CSSProperties}>
        <SectionHeading eyebrow="Design Tokens" title="Typography" align="left" />
        <div className="space-y-4 max-w-3xl">
          <p className="text-display-md">Display MD — Outfit 700</p>
          <p className="text-display-sm">Display SM — Outfit 700</p>
          <p className="text-heading-xl">Heading XL — Outfit 600</p>
          <p className="text-heading-lg">Heading LG — Outfit 600</p>
          <p className="text-heading-md">Heading MD — Outfit 600</p>
          <p className="text-body-lg">Body LG — Inter 400 · Line height 1.7</p>
          <p className="text-body-md">Body MD — Inter 400 · Line height 1.65</p>
          <p className="text-body-sm">Body SM — Inter 400 · Line height 1.6</p>
          <p className="text-caption">Caption — 12px / 1.5</p>
          <p className="text-label">Label — Uppercase 600</p>
          <p className="text-eyebrow">Eyebrow — Uppercase brand color</p>
        </div>
      </Section>

      {/* ── Modal ──────────────────────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow="Components" title="Modal" align="left" />
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="demo-modal-title"
          hideCloseButton
        >
          <ModalHeader
            title="Confirm action"
            description="Please review the details before proceeding."
            onClose={() => setModalOpen(false)}
          />
          <ModalBody>
            <p className="text-body-md">
              This is a demonstration of the Reddix modal component. It
              includes focus trapping, Escape key dismissal, scroll lock, and
              overlay-click to close. Fully accessible.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </Section>

    </div>
  );
}
