import React, { useState } from 'react';

const PasswordForm = ({
  showTokenForm,
  token,
  tokenVerified,
  user,
  handleInputChange,
  handleTokenChange,
  requestToken,
  verifyToken,
  handlePasswordSubmit,
  prevStep,
  handleSubmit
}) => {
  const [loadingStates, setLoadingStates] = useState({
    tokenRequest: false,
    tokenVerification: false,
    passwordChange: false,
    saveWithoutChanges: false
  });

  const handleTokenRequest = async (e) => {
    e?.preventDefault();
    setLoadingStates(prev => ({...prev, tokenRequest: true}));
    try {
      await requestToken();
    } catch (error) {
      console.error("Error in token request:", error);
    } finally {
      setLoadingStates(prev => ({...prev, tokenRequest: false}));
    }
  };

  const handleTokenVerification = async (e) => {
    e?.preventDefault();
    setLoadingStates(prev => ({...prev, tokenVerification: true}));
    try {
      await verifyToken();
    } catch (error) {
      console.error("Error in token verification:", error);
    } finally {
      setLoadingStates(prev => ({...prev, tokenVerification: false}));
    }
  };

  const handlePasswordChange = async (e) => {
    if (e) e.preventDefault();
    setLoadingStates(prev => ({...prev, passwordChange: true}));
    try {
      await handlePasswordSubmit();
    } catch (error) {
      console.error("Error in password change:", error);
    } finally {
      setLoadingStates(prev => ({...prev, passwordChange: false}));
    }
  };

const handleSaveWithoutChanges = async (e) => {
  e?.preventDefault?.(); // Safely call preventDefault if event exists
  setLoadingStates(prev => ({...prev, saveWithoutChanges: true}));
  try {
    await handleSubmit(e); // Pass the event to handleSubmit
  } catch (error) {
    console.error("Error saving without changes:", error);
  } finally {
    setLoadingStates(prev => ({...prev, saveWithoutChanges: false}));
  }
};

  return (
    <div className="space-y-6">
      {!showTokenForm ? (
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-OxfordBlue-Dark mb-2">Password Change Security</h3>
          <p className="text-OxfordBlue mb-4">
            We need to verify your identity before password change.
          </p>
          <button
            type="button"
            onClick={handleTokenRequest}
            disabled={loadingStates.tokenRequest}
            className="px-6 py-2.5 bg-OxfordBlue text-white rounded-lg hover:bg-OxfordBlue-Dark transition duration-300 shadow-md flex items-center justify-center gap-2"
          >
            {loadingStates.tokenRequest ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : 'Request Verification Token'}
          </button>
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={(e) => handleSaveWithoutChanges(e)}
              disabled={loadingStates.saveWithoutChanges}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
            >
              {loadingStates.saveWithoutChanges ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : 'Simpan tanpa ubah password'}
            </button>
          </div>
        </div>
      ) : !tokenVerified ? (
        <div className="p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-OxfordBlue mb-2">Verify Your Identity</h3>
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={token}
                onChange={handleTokenChange}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-OxfordBlue focus:border-OxfordBlue"
                placeholder="Enter 6-digit token"
                maxLength="6"
              />
              <button
                type="button"
                onClick={handleTokenVerification}
                disabled={loadingStates.tokenVerification}
                className="px-4 py-3 bg-OxfordBlue text-white rounded-lg hover:bg-OxfordBlue-Dark flex items-center justify-center gap-2"
              >
                {loadingStates.tokenVerification ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : 'Verify'}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleSaveWithoutChanges}
              disabled={loadingStates.saveWithoutChanges}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              {loadingStates.saveWithoutChanges ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : 'Simpan tanpa ubah password'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-4">Setel Password baru</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password baru
              </label>
              <input
                type="password"
                name="password"
                value={user.password || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-OxfordBlue focus:border-OxfordBlue"
                placeholder="Masukan password baru"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Password requirements:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one number</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Kembali
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSaveWithoutChanges}
                disabled={loadingStates.saveWithoutChanges}
                className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                {loadingStates.saveWithoutChanges ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : 'Simpan tanpa ubah password'}
              </button>
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={loadingStates.passwordChange}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                {loadingStates.passwordChange ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : 'Ubah Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordForm;