import React from 'react';

export default function StaticContactPage() {
  return (
    <div className="container-content py-12 md:py-20 max-w-4xl mx-auto px-6">
      
            <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Contact Us</h1>
            <p className="text-sm text-[var(--text-muted)] mb-8">Get in touch with Reddix Robotics.</p>
            
            <div className="space-y-8 text-[var(--text-secondary)]">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Business Information</h2>
                    <p className="font-medium text-lg text-[var(--text-primary)] mb-4">Reddix Robotics</p>
                    
                    <div className="space-y-4">
                        <div>
                            <strong className="block text-[var(--text-primary)]">Email:</strong>
                            <a href="mailto:reddixrobotics@gmail.com" className="text-blue-500 hover:underline">reddixrobotics@gmail.com</a>
                        </div>
                        
                        <div>
                            <strong className="block text-[var(--text-primary)]">Phone:</strong>
                            <a href="tel:+917036780248" className="text-blue-500 hover:underline">+91 7036780248</a>
                        </div>
                        
                        <div>
                            <strong className="block text-[var(--text-primary)]">Address:</strong>
                            <p>Reddix Robotics, 5th floor, Type I, APIIC, 6-B,</p>
                            <p>Prashanth Nagar, IDA Kukatpally,</p>
                            <p>Hyderabad, Telangana 500072</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)] mt-8">Business Hours</h2>
                    <ul className="list-none space-y-2">
                        <li><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM IST</li>
                        <li><strong>Saturday-Sunday:</strong> Closed</li>
                    </ul>
                </section>
            </div>
        
    </div>
  );
}
