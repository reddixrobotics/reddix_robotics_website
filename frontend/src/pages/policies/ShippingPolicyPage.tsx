import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="container-content py-12 md:py-20 max-w-4xl mx-auto px-6">
      
            <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Shipping Policy</h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: September 2026</p>
            
            <div className="space-y-8 text-[var(--text-secondary)]">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">1. General Information</h2>
                    <p>Reddix Robotics currently offers shipping for our physical robotics products <strong>within India only</strong>. At this time, we do not support international shipping.</p>
                    <p className="mt-2">Please note that our Workshops are digital or service-based registrations and do not require physical shipping.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">2. Order Processing</h2>
                    <p>All orders for physical products are processed only after successful payment verification. You will receive an order confirmation email once your order has been successfully placed.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">3. Shipping Information</h2>
                    <p>Customers are responsible for providing correct and complete shipping information. Reddix Robotics is not responsible for delayed or lost shipments due to incorrect address details provided by the customer.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">4. Delivery Timelines & Delays</h2>
                    <p>We strive to dispatch orders promptly. Delivery timelines depend on the destination and the courier service. Delays may occasionally occur due to courier/logistics issues, adverse weather conditions, or other unforeseen circumstances outside of our control.</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">5. Package Inspection & Damaged Products</h2>
                    <p>Customers should inspect the package carefully upon receipt. If the product or package arrives damaged:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Please contact Reddix Robotics immediately.</li>
                        <li>Provide your order details and clear evidence (photographs/video) of the damaged package and product.</li>
                        <li>Damaged products may be eligible for replacement after our team verifies the claim. (Please refer to our Cancellation & Refund Policy for more details).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">6. Contact Us</h2>
                    <p>For any questions regarding your shipment, please contact us:</p>
                    <p className="mt-2">Email: reddixrobotics@gmail.com</p>
                    <p>Phone: +91 7036780248</p>
                </section>
            </div>
        
    </div>
  );
}
