'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
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

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
              Terms of <span className="text-lime-500">Service</span>
            </h1>
            <p className="text-lg text-gray-300">Last updated: December 29, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-[1200px] mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <Section title="Agreement to Terms">
              <p>
                By accessing or using DesertPort Autos website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the Terms, you may not access the Services.
              </p>
            </Section>

            <Section title="Use of Services">
              <p>You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul>
                <li>Use the Services in any way that violates applicable law or regulation</li>
                <li>Impersonate or attempt to impersonate DesertPort Autos, our employees, or other users</li>
                <li>Engage in any conduct that restricts or inhibits anyone's use of the Services</li>
                <li>Use any automated system to access the Services without our express written permission</li>
              </ul>
            </Section>

            <Section title="Vehicle Listings and Purchases">
              <p>
                All vehicle listings on our website are subject to prior sale. We make every effort to ensure accuracy of vehicle descriptions, specifications, and pricing, but errors may occur. We reserve the right to correct any errors and to refuse or cancel any orders if an error in pricing or description is discovered.
              </p>
              <p><strong>Purchase Terms:</strong></p>
              <ul>
                <li>All vehicle sales are subject to vehicle availability</li>
                <li>Deposits are non-refundable unless otherwise specified in writing</li>
                <li>Final sale prices may differ from listed prices due to taxes, fees, and other charges</li>
                <li>Vehicles are sold "as-is" unless covered by a specific warranty</li>
              </ul>
            </Section>

            <Section title="Financing">
              <p>
                Financing is subject to credit approval. All financing terms are subject to change without notice. APR, terms, and monthly payments may vary based on creditworthiness, loan amount, and other factors.
              </p>
            </Section>

            <Section title="Trade-Ins and Consignment">
              <p>
                Trade-in valuations are estimates and subject to physical inspection of the vehicle. Final trade-in values may differ from initial quotes. Consignment agreements are subject to separate written contracts.
              </p>
            </Section>

            <Section title="Intellectual Property">
              <p>
                The Services and all content, features, and functionality are owned by DesertPort Autos and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </Section>

            <Section title="User Accounts">
              <p>
                When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the maximum extent permitted by law, DesertPort Autos shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Services, even if we have been advised of the possibility of such damages.
              </p>
            </Section>

            <Section title="Disclaimer of Warranties">
              <p>
                The Services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </Section>

            <Section title="Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless DesertPort Autos and its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Services or violation of these Terms.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
            </Section>

            <Section title="Changes to Terms">
              <p>
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have questions about these Terms, please contact us at:
              </p>
              <p>
                <strong>DesertPort Autos</strong><br />
                123 Luxury Lane<br />
                Beverly Hills, CA 90210<br />
                Email: legal@desertport.com<br />
                Phone: +1 (234) 567-890
              </p>
            </Section>
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

