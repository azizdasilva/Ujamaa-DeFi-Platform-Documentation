/**
 * Regulator - Contact Page
 *
 * Contact information for regulatory inquiries.
 *
 * Route: /regulator/contact
 */

import React from 'react';
import MVPBanner from '../../components/MVPBanner';
import TestnetNotice from '../../components/TestnetNotice';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Contact: React.FC = () => {
  const contacts = [
    {
      title: 'Compliance Department',
      email: 'compliance@ujamaa-defi.com',
      phone: '+230 XXXX XXXX',
      hours: 'Mon-Fri, 9:00-17:00 EAT',
      icon: '📧',
    },
    {
      title: 'Legal Department',
      email: 'legal@ujamaa-defi.com',
      phone: '+230 XXXX XXXX',
      hours: 'Mon-Fri, 9:00-17:00 EAT',
      icon: '⚖️',
    },
    {
      title: 'Technical Support',
      email: 'tech@ujamaa-defi.com',
      phone: '+230 XXXX XXXX',
      hours: '24/7',
      icon: '🔧',
    },
    {
      title: 'Emergency Hotline',
      email: 'emergency@ujamaa-defi.com',
      phone: '+230 XXXX XXXX',
      hours: '24/7',
      icon: '🚨',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6ED]">
      <MVPBanner />

      {/* Header */}
      <header className="bg-[#F9F6ED] border-b border-[#103b5b]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#103b5b]">Regulatory Contact</h1>
              <p className="text-[#8b5b3d] mt-1">Contact information for regulatory inquiries</p>
            </div>
            <TestnetNotice variant="badge" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {contacts.map((contact, idx) => (
            <Card key={idx}>
              <div className="text-center">
                <div className="text-4xl mb-4">{contact.icon}</div>
                <h3 className="font-bold text-[#103b5b] mb-2">{contact.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{contact.hours}</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Email:</span>
                    <br />
                    <a href={`mailto:${contact.email}`} className="text-[#00A8A8] hover:underline">
                      {contact.email}
                    </a>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Phone:</span>
                    <br />
                    <a href={`tel:${contact.phone}`} className="text-[#00A8A8] hover:underline">
                      {contact.phone}
                    </a>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Send Message */}
        <Card>
          <h3 className="text-xl font-bold text-[#103b5b] mb-6">Send a Message</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]">
                <option>Compliance Department</option>
                <option>Legal Department</option>
                <option>Technical Support</option>
                <option>Emergency Hotline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="Brief subject line"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                placeholder="Your message..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8A8]"
              />
            </div>
          </div>
          <div className="mt-6">
            <Button variant="primary" size="lg" onClick={() => alert('🚀 MVP TESTNET: Message sent!\n\nIn production, this will send your message to the selected department.')}>
              Send Message
            </Button>
          </div>
        </Card>

        {/* Office Location */}
        <Card className="mt-6">
          <h3 className="text-xl font-bold text-[#103b5b] mb-6">Office Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-[#103b5b] mb-4">Registered Office</h4>
              <address className="not-italic text-gray-700">
                <p>Ujamaa DeFi Platform</p>
                <p>Cybercity, Ebene</p>
                <p>Mauritius</p>
                <p className="mt-4">
                  <strong>Postal Address:</strong><br />
                  PO Box XXXX<br />
                  Cybercity, Ebene<br />
                  Mauritius
                </p>
              </address>
            </div>
            <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[200px]">
              <p className="text-gray-500 text-center">
                🗺️ Map View<br />
                <span className="text-sm">Mauritius Office Location</span>
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Contact;
