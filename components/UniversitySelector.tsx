import { useState } from "react";

export default function UniversitySelector({ universities, onSearch }) {
  const [selectedUniversity, setSelectedUniversity] = useState("");

  //検索
  const handleSearch = () => {
    onSearch(selectedUniversity);
  };

  // リセット
  const handleReset = () => {
    setSelectedUniversity("");
    onSearch(""); 
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h1 className="text-xl font-bold mb-4">大学周辺検索</h1>
      {universities.map((university) => (
        <div key={university} className="flex items-center mb-2">
          <input
            type="radio"
            value={university}
            checked={selectedUniversity === university}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="mr-2"
          />
          <label>{university}</label>
        </div>
      ))}
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
        >
          検索
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
