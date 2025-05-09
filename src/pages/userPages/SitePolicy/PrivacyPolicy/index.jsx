import React from 'react'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'

function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="mt-14"></div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: March 01, 2025</p>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <section>
              <p>At PPLG SMEGA, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website <span className="text-blue-600">pplgsmega.com</span>.</p>
              <p>By using our Service, you agree to the collection and use of information in accordance with this policy. If you have any questions, please don't hesitate to contact us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Key Definitions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Personal Data</h3>
                  <p className="text-gray-600">Any information that can identify you (e.g., name, email, address).</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Usage Data</h3>
                  <p className="text-gray-600">Information collected automatically (e.g., pages visited, time spent).</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Cookies</h3>
                  <p className="text-gray-600">Small data files stored on your device to enhance your experience.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Service</h3>
                  <p className="text-gray-600">Refers to our website <span className="text-blue-600">pplgsmega.com</span>.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Information You Provide</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Contact details (name, email, phone number)</li>
                    <li>Account registration information</li>
                    <li>Any messages or inquiries you send us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Information Collected Automatically</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information (for mobile users)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Service Delivery</h3>
                  <p className="text-gray-600">To provide and maintain our website and services.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Communication</h3>
                  <p className="text-gray-600">To respond to your inquiries and send important notices.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Improvements</h3>
                  <p className="text-gray-600">To analyze usage and enhance user experience.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Security</h3>
                  <p className="text-gray-600">To monitor and prevent fraudulent activities.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Sharing & Protection</h2>
              <p>We may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving our users. We require all third parties to respect your data privacy.</p>
              <p className="mt-4">We implement appropriate security measures to protect your personal data. However, no internet transmission is 100% secure, so we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Rights</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access:</strong> You can request copies of your personal data.</li>
                <li><strong>Correction:</strong> You can request correction of inaccurate information.</li>
                <li><strong>Deletion:</strong> You can request deletion of your personal data under certain conditions.</li>
                <li><strong>Opt-out:</strong> You can opt-out of marketing communications at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Children's Privacy</h2>
              <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover that a child has provided us with personal information, we will delete it immediately.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Changes to This Policy</h2>
              <p>We may update our Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Email: privacy@pplgsmega.com</li>
                <li>Through our contact page: <a href="https://pplgsmega.com/contact" className="text-blue-600 hover:underline">pplgsmega.com/contact</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PrivacyPolicy