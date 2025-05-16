import { motion } from 'framer-motion';
import { FaUserPlus, FaUpload, FaRocket } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-2xl" />,
      number: '1',
      title: 'Buat Akun Gratis',
      description: 'Daftar mudah menggunakan email dan nis. Kelola karya, berinteraksi dengan pengguna, dan dapatkan umpan balik.'
    },
    {
      icon: <FaUpload className="text-2xl" />,
      number: '2',
      title: 'Bagikan Karya Anda',
      description: 'Tambahkan detail karya termasuk judul, deskripsi, media, dan anggota tim. Pamerkan karya Anda secara profesional.'
    },
    {
      icon: <FaRocket className="text-2xl" />,
      number: '3',
      title: 'Publikasikan',
      description: 'Bagikan karya dengan komunitas. Dapatkan penilaian, komentar, dan masukan berharga untuk meningkatkan keterampilan Anda.'
    }
  ];

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
              Cara Kerja
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Bagikan Karya Anda dalam <span className="text-OxfordBlue">3 Langkah</span>
            </h2>
            <p className="max-w-lg mx-auto mt-4 text-lg leading-relaxed text-gray-600">
              Ikuti langkah ini untuk memamerkan karya anda dan menginspirasi sesama siswa.
            </p>
          </motion.div>
        </div>

        <div className="relative mt-16 lg:mt-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-full p-8 transition-all duration-300 bg-white border border-gray-200 rounded-2xl group-hover:border-OxfordBlue/30 group-hover:shadow-xl">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto transition-all duration-300 bg-OxfordBlue rounded-full shadow-lg group-hover:bg-GoldenYellow group-hover:scale-110">
                      <span className="text-xl font-semibold text-white">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-all duration-300 bg-OxfordBlue/10 rounded-2xl group-hover:bg-OxfordBlue/20">
                    <div className="text-OxfordBlue group-hover:text-GoldenYellow">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900">{step.title}</h3>
                  <p className="mt-4 text-base text-center text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;