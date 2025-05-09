import React from 'react'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'

function TermsConditions() {
  return (
    <>
      <Navbar />
      <div className="mt-14"></div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms and Conditions</h1>
            <p className="text-gray-500">Last updated: March 01, 2025</p>
          </div>
          
          <div className="prose prose-lg text-gray-600 space-y-8">
            <section className="bg-blue-50 p-6 rounded-lg">
              <p className="font-medium">Welcome to <span className="text-blue-600">PPLG SMEGA</span>! These Terms and Conditions outline the rules and regulations for using our website at <span className="text-blue-600">pplgsmega.com</span>.</p>
              <p className="mt-2">By accessing this website, you accept these terms in full. If you disagree, please refrain from using our site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">1. Key Definitions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Service</h3>
                  <p className="text-gray-600">Our website pplgsmega.com and all related services.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">User (You)</h3>
                  <p className="text-gray-600">Anyone accessing or using our Service.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Company (We)</h3>
                  <p className="text-gray-600">PPLG SMEGA, the operator of this Service.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Content</h3>
                  <p className="text-gray-600">All text, images, and materials on our Service.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">2. User Requirements</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">You must be at least 18 years old to use our Service.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">You agree to provide accurate information when using our Service.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">You are responsible for maintaining the confidentiality of your account.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">3. Service Usage</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700">Permitted Use</h3>
                  <p className="text-gray-600 mt-1">You may use our Service for personal, non-commercial purposes in accordance with these Terms.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700">Prohibited Activities</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    <li>Violating any laws or regulations</li>
                    <li>Attempting to gain unauthorized access to our systems</li>
                    <li>Uploading malicious content or viruses</li>
                    <li>Harassing other users or our staff</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">4. Intellectual Property</h2>
              <p className="text-gray-600">All content on our Service, including text, graphics, logos, and software, is the property of PPLG SMEGA or its content suppliers and protected by intellectual property laws.</p>
              <p className="mt-4 text-gray-600">You may not reproduce, distribute, or create derivative works without our express permission.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">5. Third-Party Links</h2>
              <p className="text-gray-600">Our Service may contain links to third-party websites. We have no control over and assume no responsibility for their content or practices.</p>
              <p className="mt-4 text-gray-600">We recommend reviewing the terms and privacy policies of any third-party sites you visit.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">6. Disclaimers</h2>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-medium text-gray-700">Service "AS IS"</h3>
                <p className="text-gray-600 mt-1">We provide our Service "as is" without warranties of any kind. We don't guarantee that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li>The Service will be uninterrupted or error-free</li>
                  <li>The results obtained will be accurate or reliable</li>
                  <li>The quality of any products or services will meet your expectations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">7. Limitation of Liability</h2>
              <p className="text-gray-600">To the maximum extent permitted by law, PPLG SMEGA shall not be liable for any indirect, incidental, or consequential damages resulting from your use of our Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">8. Governing Law</h2>
              <p className="text-gray-600">These Terms shall be governed by and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">9. Changes to Terms</h2>
              <p className="text-gray-600">We may update these Terms periodically. We'll notify you of significant changes via email or a notice on our Service.</p>
              <p className="mt-4 text-gray-600">Your continued use after changes constitutes acceptance of the new Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">10. Contact Information</h2>
              <p className="text-gray-600">For questions about these Terms, please contact us:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li>Email: legal@pplgsmega.com</li>
                <li>Website: <a href="https://pplgsmega.com/contact" className="text-blue-600 hover:underline">pplgsmega.com/contact</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TermsConditions