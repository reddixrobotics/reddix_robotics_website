import { motion } from 'framer-motion';
import { Building2, MapPin } from 'lucide-react';
import { Partner } from '@/data/partners';
import { Badge } from '@/components/ui';

interface PartnerCardProps {
  partner: Partner;
  index: number;
}

export default function PartnerCard({ partner, index }: PartnerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-brand)]/50 hover:shadow-lg hover:shadow-brand/5"
    >
      <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
        
        {/* Logo Placeholder */}
        <div className="w-16 h-16 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] flex items-center justify-center mb-6 text-[var(--text-secondary)] group-hover:text-[var(--color-brand)] transition-colors">
          <Building2 size={28} />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-heading-xs font-display font-bold group-hover:text-white transition-colors">{partner.companyName}</h3>
          </div>
          
          <div className="flex items-center text-body-sm text-[var(--text-tertiary)] mb-4">
            <MapPin size={14} className="mr-1" />
            <span>{partner.country}</span>
          </div>

          <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed mb-6">
            {partner.description}
          </p>
        </div>

        {/* Footer / Badge */}
        <div className="pt-4 border-t border-[var(--border-strong)]/50">
          <Badge variant="secondary" className="font-normal text-xs">
            {partner.type}
          </Badge>
        </div>

      </div>

      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
