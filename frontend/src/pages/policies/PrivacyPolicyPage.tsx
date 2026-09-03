import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container-content py-12 md:py-20 max-w-4xl mx-auto px-6">
      
            <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Privacy Policy</h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: September 2026</p>
            
            <div className="space-y-8 text-[var(--text-secondary)]">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">1. Introduction</h2>
                    <p>Welcome to Reddix Robotics. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website reddixrobotics.com or use our services.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">2. Information We Collect</h2>
                    <p className="mb-2">We may collect the following customer information:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Shipping address</li>
                        <li>Account information</li>
                        <li>Order information</li>
                        <li>Workshop registration information</li>
                        <li>Website usage information</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">3. How We Use Information</h2>
                    <p>We use your information to process orders, register you for workshops, provide customer support, improve our services, and communicate with you about your transactions and our products.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">4. Payment Information</h2>
                    <p>Payment processing is handled securely through our payment gateway provider (Razorpay). <strong>Reddix Robotics does not store your credit card numbers, UPI credentials, or other sensitive payment data on our servers.</strong></p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">5. Cookies</h2>
                    <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information to enhance your user experience.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">6. Data Security</h2>
                    <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">7. Third-Party Services</h2>
                    <p>We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, such as our payment processing gateway and delivery partners.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">8. User Rights</h2>
                    <p>You have the right to access, update, or delete the personal information we have on you. Please contact us to exercise these rights.</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">9. Data Retention</h2>
                    <p>We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required by law.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">10. Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                    <p className="mt-2">Email: reddixrobotics@gmail.com</p>
                    <p>Phone: +91 7036780248</p>
                    <p>Address: Reddix Robotics, 5th floor, Type I, APIIC, 6-B, Prashanth Nagar, IDA Kukatpally, Hyderabad, Telangana 500072</p>
                </section>
            </div>
        
    </div>
  );
}
