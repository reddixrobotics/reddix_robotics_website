import { partnersData } from '@/data/partners';
import PartnerCard from './PartnerCard';

export default function PartnersGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {partnersData.map((partner, index) => (
        <PartnerCard key={partner.id} partner={partner} index={index} />
      ))}
    </div>
  );
}
