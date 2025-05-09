import React from 'react';

const TeamMembersStep = ({ 
  teamMembers, 
  setTeamMembers, 
  includeUploaderInTeam, 
  setIncludeUploaderInTeam,
  user
}) => {
  const handleTeamMemberChange = (index, field, value) => {
    const newMembers = [...teamMembers];
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { memberName: '', class: '', position: '' }]);
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Anggota Grup</h3>
          <button
            type="button"
            onClick={handleAddTeamMember}
            className="inline-flex items-center px-3 py-2 hover:scale-105 transition-transform bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white text-sm font-medium rounded-md"
          >
            <svg className="-ml-1 mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Anggota
          </button>
        </div>

        {teamMembers.map((member, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-end bg-gray-50 p-4 rounded-lg">
            <div className="col-span-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nama</label>
              <input
                type="text"
                value={member.memberName}
                onChange={(e) => handleTeamMemberChange(index, 'memberName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama Anggota"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
              <select
                value={member.class}
                onChange={(e) => handleTeamMemberChange(index, 'class', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih kelas</option>
                <option value="XI RPL 1">XI RPL 1</option>
                <option value="XI RPL 2">XI RPL 2</option>
                <option value="XII RPL 1">XII RPL 1</option>
                <option value="XII RPL 2">XII RPL 2</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Posisi</label>
              <input
                type="text"
                value={member.position}
                onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Posisi"
                required
              />
            </div>
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => handleRemoveTeamMember(index)}
                className="w-full h-10 flex hover:scale-105 transition-transform items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Include Uploader */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="include-uploader"
              name="include-uploader"
              type="checkbox"
              checked={includeUploaderInTeam}
              onChange={(e) => setIncludeUploaderInTeam(e.target.checked)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="include-uploader" className="font-medium text-gray-700">
              Masukan saya kedalam grup sebegai ketua
            </label>
            <p className="text-gray-500">
              {user?.name || user[0]?.name} ({user?.class || user[0]?.class || 'XII RPL 1'})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersStep;