'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

export default function CookiesPage() {
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
              Cookie <span className="text-lime-500">Policy</span>
            </h1>
            <p className="text-lg text-gray-300">Last updated: December 29, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-[1200px] mx-auto">
        <div className="desktop-scale-80">
          <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <Section title="What Are Cookies">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </Section>

            <Section title="How We Use Cookies">
              <p>
                DesertPort Autos uses cookies to enhance your browsing experience, analyze website traffic, and personalize content. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted).
              </p>
            </Section>

            <Section title="Types of Cookies We Use">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                  </p>
                  <ul>
                    <li>Authentication and security</li>
                    <li>Shopping cart functionality</li>
                    <li>Session management</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Cookies</h3>
                  <p>
                    These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve website performance.
                  </p>
                  <ul>
                    <li>Google Analytics</li>
                    <li>Page load times</li>
                    <li>Error tracking</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Functional Cookies</h3>
                  <p>
                    These cookies allow the website to remember choices you make (such as your user name, language, or region) and provide enhanced features.
                  </p>
                  <ul>
                    <li>User preferences</li>
                    <li>Language settings</li>
                    <li>Remembered searches</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Targeting/Advertising Cookies</h3>
                  <p>
                    These cookies are used to deliver advertisements more relevant to you and your interests. They may be set by our advertising partners through our site.
                  </p>
                  <ul>
                    <li>Personalized advertisements</li>
                    <li>Retargeting campaigns</li>
                    <li>Social media integration</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="Third-Party Cookies">
              <p>
                In addition to our own cookies, we may also use third-party cookies to report website usage statistics and deliver advertisements. These third parties include:
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> For website analytics</li>
                <li><strong>Facebook Pixel:</strong> For advertising and analytics</li>
                <li><strong>Google Ads:</strong> For advertising campaigns</li>
                <li><strong>LinkedIn Insights:</strong> For business analytics</li>
              </ul>
            </Section>

            <Section title="Managing Cookies">
              <p>
                You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and parts of our website may no longer be fully accessible.
              </p>
              <p><strong>Browser Settings:</strong></p>
              <p>
                Most web browsers allow you to manage your cookie preferences through their settings. You can set your browser to refuse cookies or delete certain cookies. The following links provide instructions for managing cookies in popular browsers:
              </p>
              <ul>
                <li>Chrome: Settings → Privacy and security → Cookies</li>
                <li>Firefox: Options → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Privacy, search, and services → Cookies</li>
              </ul>
            </Section>

            <Section title="Cookie Consent">
              <p>
                When you first visit our website, we will ask for your consent to use non-essential cookies. You can change your cookie preferences at any time by accessing the cookie settings in your browser or using our cookie consent tool.
              </p>
            </Section>

            <Section title="Do Not Track Signals">
              <p>
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to have your online activity tracked. Our website currently does not respond to DNT signals.
              </p>
            </Section>

            <Section title="Updates to This Policy">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have questions about our use of cookies, please contact us at:
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

