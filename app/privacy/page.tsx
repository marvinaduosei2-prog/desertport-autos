'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="relative h-[40vh] min-h-[300px] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(132, 204, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto desktop-scale-80">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
              Privacy <span className="text-lime-500">Policy</span>
            </h1>
            <p className="text-lg text-gray-300">Last updated: December 29, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-[1200px] mx-auto">
        <div className="desktop-scale-80">
          <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <Section title="Introduction">
              <p>
                At DesertPort Autos ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </Section>

            <Section title="Information We Collect">
              <p><strong>Personal Information:</strong></p>
              <ul>
                <li>Name, email address, phone number</li>
                <li>Mailing address and billing information</li>
                <li>Driver's license and identification documents</li>
                <li>Financial information for transactions</li>
              </ul>
              <p><strong>Vehicle Information:</strong></p>
              <ul>
                <li>Vehicle preferences and search history</li>
                <li>Trade-in vehicle details</li>
                <li>Purchase and service history</li>
              </ul>
              <p><strong>Automatic Information:</strong></p>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Cookies and usage data</li>
                <li>Website navigation and interaction data</li>
              </ul>
            </Section>

            <Section title="How We Use Your Information">
              <p>We use your information to:</p>
              <ul>
                <li>Process vehicle purchases and transactions</li>
                <li>Provide customer service and support</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </Section>

            <Section title="Information Sharing">
              <p>We may share your information with:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who assist with business operations</li>
                <li><strong>Financial Institutions:</strong> For financing and payment processing</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </Section>

            <Section title="Data Security">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </Section>

            <Section title="Your Rights">
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </Section>

            <Section title="Cookies and Tracking">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings. See our Cookie Policy for more details.
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <p>
                <strong>DesertPort Autos</strong><br />
                123 Luxury Lane<br />
                Beverly Hills, CA 90210<br />
                Email: privacy@desertport.com<br />
                Phone: +1 (234) 567-890
              </p>
            </Section>
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl font-black text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-700 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}

