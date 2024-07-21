import React, { useState, useEffect } from 'react';
import { getUniversities } from "@/components/GetUniversity";

interface UniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (university: string) => void;
}

const UniversityModal: React.FC<UniversityModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [universities, setUniversities] = useState<string[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      const universityList = await getUniversities();
      // universityListを大学名の配列に変換
      const universityNames = universityList.map((univ: { name: string }) => univ.name);
      setUniversities(universityNames);
    };

    fetchUniversities();
  }, []); // 第二引数の空の配列で初回レンダリング時のみ実行される

  if (!isOpen) return null;

  const handleSearch = () => {
    if (selectedUniversity) {
      onSearch(selectedUniversity);
    } else {
      alert('大学を選択してください。');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">大学を選択してください</h2>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="form-select w-full mb-4"
        >
          <option value="" disabled>大学を選択</option>
          {universities.map((university, index) => (
            <option key={index} value={university}>{university}</option>
          ))}
        </select>
        <div className="flex justify-between w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            onClick={onClose}
          >
            閉じる
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleSearch}
          >
            検索
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityModal;
