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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Syarat dan Ketentuan</h1>
            <p className="text-gray-500">Terakhir diperbarui: 10 Mei 2025</p>
          </div>
          
          <div className="prose prose-lg text-gray-600 space-y-8">
            <section className="bg-blue-50 p-6 rounded-lg">
              <p className="font-medium">Selamat datang di <span className="text-blue-600">RPL SMEGA</span>! Syarat dan Ketentuan ini mengatur aturan dan regulasi untuk menggunakan website kami di <span className="text-blue-600">rplsmega.netlify.app</span>.</p>
              <p className="mt-2">Dengan mengakses website ini, Anda menerima syarat-syarat ini sepenuhnya. Jika tidak setuju, harap tidak menggunakan situs kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">1. Definisi Utama</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Layanan</h3>
                  <p className="text-gray-600">Website rplsmega.netlify.app dan semua layanan terkait.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Pengguna (Anda)</h3>
                  <p className="text-gray-600">Siapapun yang mengakses atau menggunakan Layanan kami.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Perusahaan (Kami)</h3>
                  <p className="text-gray-600">RPL SMEGA, operator Layanan ini.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Konten</h3>
                  <p className="text-gray-600">Semua teks, gambar, dan materi di Layanan kami.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">2. Persyaratan Pengguna</h2>
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
                    <p className="text-gray-600">Anda merupakan siswa/siswi SMKN 1 Purbalingga atau yang berkaitan dibuktikan dengan NIS dan berusia minimal 15 tahun untuk menggunakan Layanan kami.</p>
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
                    <p className="text-gray-600">Anda setuju untuk memberikan informasi yang akurat saat menggunakan Layanan kami.</p>
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
                    <p className="text-gray-600">Anda bertanggung jawab untuk menjaga kerahasiaan akun Anda.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">3. Penggunaan Layanan</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700">Penggunaan yang Diperbolehkan</h3>
                  <p className="text-gray-600 mt-1">Anda dapat menggunakan Layanan kami untuk tujuan pribadi, non-komersial sesuai dengan Syarat ini.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-700">Aktivitas yang Dilarang</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    <li>Melanggar hukum atau regulasi apapun</li>
                    <li>Mencoba mendapatkan akses tidak sah ke sistem kami</li>
                    <li>Mengunggah konten berbahaya atau virus</li>
                    <li>Melecehkan pengguna lain atau staf kami</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">4. Kekayaan Intelektual</h2>
              <p className="text-gray-600">Semua konten di Layanan kami, termasuk teks, grafik, logo, dan perangkat lunak, adalah milik RPL SMEGA atau pemasok kontennya dan dilindungi oleh hukum kekayaan intelektual.</p>
              <p className="mt-4 text-gray-600">Anda tidak boleh mereproduksi, mendistribusikan, atau membuat karya turunan tanpa izin tertulis dari kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">5. Tautan Pihak Ketiga</h2>
              <p className="text-gray-600">Layanan kami mungkin berisi tautan ke website pihak ketiga. Kami tidak memiliki kendali dan tidak bertanggung jawab atas konten atau praktik mereka.</p>
              <p className="mt-4 text-gray-600">Kami merekomendasikan untuk meninjau syarat dan kebijakan privasi dari situs pihak ketiga yang Anda kunjungi.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">6. Penyangkalan</h2>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-medium text-gray-700">Layanan "APA ADANYA"</h3>
                <p className="text-gray-600 mt-1">Kami menyediakan Layanan "apa adanya" tanpa jaminan apapun. Kami tidak menjamin bahwa:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                  <li>Layanan akan terus tersedia atau bebas dari kesalahan</li>
                  <li>Hasil yang diperoleh akan akurat atau dapat diandalkan</li>
                  <li>Kualitas produk atau layanan akan memenuhi harapan Anda</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">7. Pembatasan Tanggung Jawab</h2>
              <p className="text-gray-600">Sejauh diizinkan oleh hukum, RPL SMEGA tidak bertanggung jawab atas kerusakan tidak langsung, insidental, atau konsekuensial yang diakibatkan oleh penggunaan Layanan kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">8. Hukum yang Berlaku</h2>
              <p className="text-gray-600">Syarat ini diatur oleh dan ditafsirkan sesuai dengan hukum Indonesia, tanpa memperhatikan ketentuan konflik hukum.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">9. Perubahan Syarat</h2>
              <p className="text-gray-600">Kami dapat memperbarui Syarat ini secara berkala. Kami akan memberi tahu Anda tentang perubahan signifikan melalui email atau pemberitahuan di Layanan kami.</p>
              <p className="mt-4 text-gray-600">Penggunaan terus menerus setelah perubahan berarti penerimaan terhadap Syarat yang baru.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">10. Informasi Kontak</h2>
              <p className="text-gray-600">Untuk pertanyaan tentang Syarat ini, silakan hubungi kami:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li>Email: Info@smkn1pbg.sch.id</li>
                <li>Telepon: 0281891550</li>
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