import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
    // General Platform
    {
        question: "Platform ini untuk apa?",
        answer: "Platform ini dirancang untuk siswa SMKN 1 Purbalingga khususnya jurusan RPL untuk membagikan hasil proyek PKL mereka, mendapatkan umpan balik, dan terhubung dengan komunitas profesional."
    },
    {
        question: "Siapa yang bisa menggunakan platform ini?",
        answer: "Platform ini khusus untuk siswa, alumni, dan staf pengajar SMKN 1 Purbalingga, terutama dari jurusan Rekayasa Perangkat Lunak (RPL)."
    },

    // Account Related
    {
        question: "Bagaimana cara membuat akun?",
        answer: "Anda bisa mendaftar menggunakan email belajar (@smk.belajar.id) atau email pribadi anda, dan pastikan NIS sesuai"
    },
    {
        question: "Kenapa web ini membutuhkan email?",
        answer: "Web kami membutuhkan email anda untuk mengirimkan email kode verifikasi token jika anda lupa password demi keamanan."
    },
    {
        question: "Apa yang harus dilakukan jika lupa password?",
        answer: "Gunakan fitur 'Lupa Password' di halaman login. Kode token reset password akan dikirim ke email terdaftar."
    },

    // Project Submission
    {
        question: "Apa syarat mengunggah proyek?",
        answer: "Proyek harus merupakan karya asli, tidak melanggar hak cipta, dan sesuai dengan kurikulum PKL RPL SMKN 1 Purbalingga."
    },
    {
        question: "Format file apa saja yang didukung untuk upload proyek?",
        answer: "Kami mendukung gambar (JPG, PNG) dengan ukuran maksimal 2MB per file."
    },

    // Privacy Policy
    {
        question: "Bagaimana data pribadi saya dilindungi?",
        answer: "Kami menerapkan enkripsi data dan kebijakan privasi ketat. Data siswa hanya digunakan untuk keperluan edukasi dan tidak dibagikan ke pihak ketiga tanpa izin."
    },
    {
        question: "Siapa yang bisa melihat informasi profil saya?",
        answer: "Informasi dasar seperti nama dan kelas dapat dilihat oleh semua pengguna terdaftar, namun informasi kontak pribadi hanya dapat diakses oleh admin dan guru terkait."
    },

    // Terms & Conditions
    {
        question: "Apa konsekuensi jika melanggar ketentuan platform?",
        answer: "Pelanggaran seperti plagiarisme atau konten tidak pantas dapat berakibat penghapusan proyek, suspensi akun, atau tindakan disipliner sesuai peraturan sekolah."
    },
    {
        question: "Bolehkah saya menggunakan proyek orang lain sebagai referensi?",
        answer: "Boleh sebagai referensi belajar, namun harus mencantumkan sumber asli dan tidak boleh disajikan sebagai karya sendiri."
    },

    // Technical
    {
        question: "Apa yang harus dilakukan jika mengalami error saat upload?",
        answer: "1) Cek koneksi internet, 2) Pastikan format file sesuai, 3) Kurangi ukuran file jika terlalu besar, 4) Hubungi tim teknis jika masalah berlanjut."
    },
    {
        question: "Bagaimana cara melaporkan bug atau masalah teknis?",
        answer: "Jika anda mendapati masalah atau bug anda bisa menghubungi langsung guru RPL terkait."
    },

    // Community
    {
        question: "Bagaimana aturan memberikan komentar pada proyek orang lain?",
        answer: "Komentar harus bersifat konstruktif, tidak mengandung SARA, dan fokus pada aspek teknis proyek. Komentar negatif tanpa solusi akan dihapus."
    },
    {
        question: "Apakah ada fitur kolaborasi proyek?",
        answer: "Ya, Anda bisa menmabahkan anggota tim untuk kolaborasi pada satu proyek melalui fitur 'Tambah Anggota Tim'."
    },

    // School Policy
    {
        question: "Apakah unggahan proyek mempengaruhi nilai PKL?",
        answer: "Ya, kualitas proyek yang diunggah menjadi salah satu komponen penilaian PKL, termasuk aktivitas diskusi dan kontribusi di platform."
    },
    {
        question: "Bagaimana jika proyek saya mengandung informasi rahasia sekolah?",
        answer: "Dilarang mengunggah dokumen rahasia sekolah. Jika proyek membutuhkan data sensitif, gunakan data dummy dan konsultasikan dengan guru pembimbing."
    }
    ];

  // Filter FAQ berdasarkan search term
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white sm:py-20 lg:py-28">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wider text-OxfordBlue uppercase rounded-full bg-OxfordBlue/10">
              Pertanyaan Umum
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Informasi <span className="text-OxfordBlue">Tambahan</span>
            </h2>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8 mb-12 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari pertanyaan atau jawaban..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === searchTerm.toLowerCase() && searchTerm ? (
                        <span key={i} className="bg-yellow-200">{part}</span>
                      ) : (
                        part
                      )
                    )}
                  </h3>
                  {activeIndex === index ? (
                    <FiChevronUp className="w-5 h-5 text-OxfordBlue" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-OxfordBlue" />
                  )}
                </button>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600">
                      {faq.answer.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                        part.toLowerCase() === searchTerm.toLowerCase() && searchTerm ? (
                          <span key={i} className="bg-yellow-200">{part}</span>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Tidak ditemukan</h3>
              <p className="mt-2 text-gray-600">
                Tidak ada pertanyaan yang cocok dengan pencarian "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 text-sm text-OxfordBlue hover:text-OxfordBlue-Dark"
              >
                Reset pencarian
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;