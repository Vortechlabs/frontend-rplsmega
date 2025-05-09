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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kebijakan Privasi</h1>
          <p className="text-gray-500 mb-8">Terakhir diperbarui: 10 Mei 2025</p>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <section>
              <p>Di RPL SMEGA, kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda ketika Anda mengunjungi website kami <span className="text-blue-600">rplsmega.netlify.app</span>.</p>
              <p>Dengan menggunakan Layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini. Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Definisi Utama</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Data Pribadi</h3>
                  <p className="text-gray-600">Informasi apa pun yang dapat mengidentifikasi Anda (misalnya, nis, nama, email).</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Data Penggunaan</h3>
                  <p className="text-gray-600">Informasi yang dikumpulkan secara otomatis (misalnya, halaman yang dikunjungi, waktu yang dihabiskan).</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Cookies</h3>
                  <p className="text-gray-600">File data kecil yang disimpan di perangkat Anda untuk meningkatkan pengalaman.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Layanan</h3>
                  <p className="text-gray-600">Merujuk pada website kami <span className="text-blue-600">rplsmega.netlify.app</span>.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Informasi yang Kami Kumpulkan</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Informasi yang Anda Berikan</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Detail akun (nis, nama, email, kelas, proyek)</li>
                    <li>Informasi pendaftaran akun</li>
                    <li>Detail proyek yang anda buat beserta komentar</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Informasi yang Dikumpulkan Secara Otomatis</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Alamat IP dan jenis browser</li>
                    <li>Halaman yang dikunjungi dan waktu yang dihabiskan</li>
                    <li>Informasi perangkat (untuk pengguna mobile)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Bagaimana Kami Menggunakan Informasi Anda</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Penyampaian Layanan</h3>
                  <p className="text-gray-600">Untuk menyediakan dan memelihara website dan layanan kami.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Komunikasi</h3>
                  <p className="text-gray-600">Untuk menanggapi pertanyaan Anda dan mengirim pemberitahuan penting.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Peningkatan</h3>
                  <p className="text-gray-600">Untuk menganalisis penggunaan dan meningkatkan pengalaman pengguna.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-700">Keamanan</h3>
                  <p className="text-gray-600">Untuk memantau dan mencegah aktivitas penipuan.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Berbagi & Perlindungan Data</h2>
              <p>Kami dapat membagikan informasi Anda dengan penyedia layanan tepercaya yang membantu kami mengoperasikan website, menjalankan bisnis, atau melayani pengguna. Kami mewajibkan semua pihak ketiga untuk menghormati privasi data Anda.</p>
              <p className="mt-4">Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi data pribadi Anda. Namun, tidak ada transmisi internet yang 100% aman, jadi kami tidak dapat menjamin keamanan mutlak.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Hak Anda</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Akses:</strong> Anda dapat meminta salinan data pribadi Anda.</li>
                <li><strong>Koreksi:</strong> Anda dapat meminta koreksi informasi yang tidak akurat.</li>
                <li><strong>Penghapusan:</strong> Anda dapat meminta penghapusan data pribadi Anda dalam kondisi tertentu.</li>
                <li><strong>Opt-out:</strong> Anda dapat berhenti berlangganan komunikasi pemasaran kapan saja.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Privasi Anak</h2>
              <p>Layanan kami tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak secara sadar mengumpulkan informasi pribadi dari anak di bawah 13 tahun. Jika kami menemukan bahwa seorang anak telah memberikan kami informasi pribadi, kami akan menghapusnya segera.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Perubahan pada Kebijakan Ini</h2>
              <p>Kami dapat memperbarui Kebijakan Privasi kami secara berkala. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting kebijakan baru di halaman ini dan memperbarui tanggal "Terakhir diperbarui".</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Hubungi Kami</h2>
              <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Email: Info@smkn1pbg.sch.id</li>
                <li>Telepon: 0281891550 </li>
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