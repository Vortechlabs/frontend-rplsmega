import React, { useState } from 'react';
import apiClient from '../services/GlobalApi'; 
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

function CommentForm({ projectId, onCommentSubmitted }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!user) {
      alert("Kamu harus login dulu agar bisa memberi komentar.");
      navigate('/auth/login');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.post(`/projects/${projectId}/comments`, {
        projectId: projectId,
        content: content,
      });

      setSuccess(response.data.message);
      setContent('');
      onCommentSubmitted();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Terdapat masalah saat memposting komen anda.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <FiMessageSquare className="text-OxfordBlue text-xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Bagikan pendapatmu</h2>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm"
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Apa pendapatmu tentang proyek ini? Bersikaplah baik dan hindari perkataan buruk..."
          required
          maxLength={1000}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-oxring-OxfordBlue outline-none transition-all"
          rows={4}
        />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500">
            {content.length}/1000 karakter
          </span>
          
          <motion.button 
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all ${
              isSubmitting 
                ? 'bg-OxfordBlue-Dark cursor-not-allowed' 
                : 'bg-OxfordBlue hover:bg-OxfordBlue-Dark hover:scale-105 transition-transform delay-100 shadow-md'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memposting...
              </>
            ) : (
              <>
                <FiSend />
                Posting Komen
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CommentForm;