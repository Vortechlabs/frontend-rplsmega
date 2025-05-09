import React from 'react';
import Swal from 'sweetalert2';

const ProjectImagesStep = ({ images, imageNames, setImages, setImageNames }) => {
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 2048 * 1024;

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        Swal.fire('Gagal', `${file.name} terlalu besar. Maksimal ukuran gambar 2MB.`, 'error');
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > 2) {
      Swal.fire('Gagal', 'Kamu hanya bisa mengunggah maksimal 2 gambar.', 'error');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    setImageNames(prev => [...prev, ...Array(validFiles.length).fill('')]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageNames(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all hover:border-OxfordBlue">
        <div className="flex flex-col items-center justify-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Unggah gambar proyek</h3>
          <p className="mt-1 text-sm text-gray-500">PNG, JPG ukuran 2MB (max 2 images)</p>
          <p className="mt-1 text-sm text-gray-500">Resolusi terbaik minimal 1000x700px</p>
          <label className="mt-4 inline-flex items-center px-4 py-2 bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white text-sm font-medium rounded-md transition-all cursor-pointer">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Pilih Dokumen
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border rounded-xl p-3 hover:shadow-md transition-all relative group">
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={imageNames[index] || ''}
                onChange={(e) => {
                  const newNames = [...imageNames];
                  newNames[index] = e.target.value;
                  setImageNames(newNames);
                }}
                placeholder="Ex: Frontend Image"
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-OxfordBlue focus:border-OxfordBlue-Dark"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-xl bg-gray-50">
          <p className="text-gray-500">Tidak ada gambar yang diunggah</p>
        </div>
      )}
    </div>
  );
};

export default ProjectImagesStep;