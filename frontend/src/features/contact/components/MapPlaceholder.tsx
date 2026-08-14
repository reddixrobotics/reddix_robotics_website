import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui';

export default function MapPlaceholder() {
  const address = "Reddix Robotics, 5th floor, Type I, APIIC, 6-B, Prashanth Nagar, IDA Kukatpally, Kukatpally, Hyderabad, Telangana 500072";
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-[var(--bg-secondary)] overflow-hidden rounded-none md:rounded-3xl border-y md:border border-[var(--border-strong)] flex items-center justify-center">
      {/* Google Map iframe */}
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Reddix Robotics HQ Location"
        className="absolute inset-0 w-full h-full opacity-80 dark:opacity-70 dark:invert dark:grayscale"
      />

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[var(--bg-secondary)]/80 via-transparent to-[var(--bg-secondary)]/20" />

      {/* Floating Info Box */}
      <div className="relative z-10 w-full max-w-md mx-4 md:mx-0">
        <div className="bg-[var(--bg-primary)]/90 backdrop-blur-md border border-[var(--border-strong)] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center shrink-0">
            <MapPin size={24} />
          </div>
          <div className="flex-grow">
            <h4 className="text-heading-xs mb-1">Reddix Robotics HQ</h4>
            <p className="text-body-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              {address}
            </p>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
              <Button variant="primary" size="sm" className="w-full justify-center">
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
