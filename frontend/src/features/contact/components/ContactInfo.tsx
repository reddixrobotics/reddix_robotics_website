import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-display-sm mb-6">Get in Touch</h2>
        <p className="text-body-lg text-[var(--text-secondary)] mb-12 max-w-md">
          Whether you're looking to automate your facility, seeking technical support for existing hardware, or exploring partnership opportunities, our team is ready to assist you.
        </p>

        <div className="space-y-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0">
              <Mail className="text-[var(--color-brand)]" size={24} />
            </div>
            <div>
              <h4 className="text-heading-sm mb-1">Email Us</h4>
              <p className="text-body-md text-[var(--text-secondary)] mb-2">For general inquiries and support.</p>
              <a href="mailto:contact@reddixrobotics.com" className="text-body-md font-bold text-[var(--color-brand)] hover:underline">
                contact@reddixrobotics.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0">
              <Phone className="text-[var(--color-brand)]" size={24} />
            </div>
            <div>
              <h4 className="text-heading-sm mb-1">Call Us</h4>
              <p className="text-body-md text-[var(--text-secondary)] mb-2">Mon-Fri from 9am to 6pm IST.</p>
              <a href="tel:+15550000000" className="text-body-md font-bold text-[var(--color-brand)] hover:underline">
                +1 (555) 000-0000
              </a>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0">
              <MapPin className="text-[var(--color-brand)]" size={24} />
            </div>
            <div>
              <h4 className="text-heading-sm mb-1">Headquarters</h4>
              <p className="text-body-md text-[var(--text-secondary)]">
                Reddix Robotics, 5th floor, Type I, APIIC, 6-B,<br />
                Prashanth Nagar, IDA Kukatpally, Kukatpally,<br />
                Hyderabad, Telangana 500072
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0">
              <Clock className="text-[var(--color-brand)]" size={24} />
            </div>
            <div>
              <h4 className="text-heading-sm mb-1">Business Hours</h4>
              <p className="text-body-md text-[var(--text-secondary)]">
                Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
