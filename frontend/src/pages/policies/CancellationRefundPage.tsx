import React from 'react';

export default function CancellationRefundPage() {
  return (
    <div className="container-content py-12 md:py-20 max-w-4xl mx-auto px-6">
      
            <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Cancellation & Refund Policy</h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: September 2026</p>
            
            <div className="space-y-8 text-[var(--text-secondary)]">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">1. Physical Robotics Products</h2>
                    <p className="mb-2">For physical products purchased from Reddix Robotics:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Damaged Products:</strong> If you receive a product that is damaged during transit, you may be eligible for a <strong>replacement</strong>. We do not offer automatic refunds for damaged products.</li>
                        <li><strong>Replacement Process:</strong> To claim a replacement for a damaged product, you must contact Reddix Robotics promptly upon receipt. You will be required to provide your order number and clear evidence, such as photographs or a video, showing the damage.</li>
                        <li><strong>Verification:</strong> Reddix Robotics will review the claim. If the product is verified as damaged or defective according to our policy, a replacement may be provided. All replacements are subject to product availability.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">2. Workshops & Services</h2>
                    <p>Workshops are digital or service-based registrations. Cancellation and refund eligibility for workshops depend on the specific terms communicated to you at the time of registration. Please review the applicable workshop details before completing your enrollment.</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">3. Payment Failures</h2>
                    <p>Unsuccessful or failed payment transactions do not constitute completed orders. If your payment fails, your order will not be processed. If money has been deducted from your account during a failed transaction, it will typically be refunded to your original payment method by your bank or the payment gateway provider within their standard processing times.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">4. Contact Information</h2>
                    <p>To request a replacement or inquire about a cancellation, please contact our support team:</p>
                    <p className="mt-2">Email: reddixrobotics@gmail.com</p>
                    <p>Phone: +91 7036780248</p>
                    <p>Address: Reddix Robotics, 5th floor, Type I, APIIC, 6-B, Prashanth Nagar, IDA Kukatpally, Hyderabad, Telangana 500072</p>
                </section>
            </div>
        
    </div>
  );
}
