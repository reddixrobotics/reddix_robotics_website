import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/data/products';
import { CheckCircle2 } from 'lucide-react';

interface ProductDetailsTabsProps {
  product: Product;
}

type TabId = 'description' | 'features' | 'specs';

export default function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features', label: 'Key Features' },
    { id: 'specs', label: 'Technical Specifications' }
  ];

  return (
    <div className="mt-24 border border-[var(--border-strong)] rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
      <div className="flex overflow-x-auto border-b border-[var(--border-strong)] hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`px-8 py-4 text-heading-sm whitespace-nowrap transition-colors relative ${
              activeTab === tab.id ? 'text-[var(--color-brand)] bg-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeProductTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-brand)]" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-8 md:p-12 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-heading-md mb-6">About the {product.name}</h3>
              <div className="prose prose-invert max-w-none text-body-lg text-[var(--text-secondary)] space-y-6">
                <p>
                  The {product.name} represents the pinnacle of modern robotics engineering. Designed in our cutting-edge laboratories, this device is built to handle the most demanding tasks in industrial and research environments.
                </p>
                <p>
                  {product.description}
                </p>
                <p>
                  Every unit undergoes rigorous quality assurance testing, including extreme temperature cycling, continuous load testing for 72 hours, and precise calibration to ensure it meets our strict enterprise-grade standards before it ever reaches your facility.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-heading-md mb-6">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={24} className="text-[var(--color-brand)] flex-shrink-0 mt-0.5" />
                    <span className="text-body-lg text-[var(--text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {activeTab === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-heading-md mb-6">Technical Specifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr key={key} className={`border-b border-[var(--border-strong)] ${idx % 2 === 0 ? 'bg-[var(--bg-primary)]/50' : ''}`}>
                        <th className="py-4 px-6 text-body-md font-medium text-[var(--text-primary)] w-1/3">{key}</th>
                        <td className="py-4 px-6 text-body-md text-[var(--text-secondary)]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
