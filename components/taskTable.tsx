"use client";
import { ReactElement, useState, useEffect } from "react";
import getData from "./getData";
import UniversitySelector from "./UniversitySelector";
import Map from "./Map";

function TaskTable() {
  const [taskList, setTaskList] = useState<Array<ReactElement>>([]);
  const universities = ["学習院大学", "University B", "University C"]; // 大学名のリスト

  const handleSearch = (selectedUniversity) => {
    getData(setTaskList, selectedUniversity);
  };

  // 初回レンダリング時に全てのデータを取得
  useEffect(() => {
    getData(setTaskList, "");
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="sm:w-full lg:w-1/2 xl:w-1/3 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-4 lg:mt-0 lg:ml-4">
        <UniversitySelector universities={universities} onSearch={handleSearch} />
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">施設一覧</h1>
          <ul className="mt-4 divide-y divide-gray-200">
            {taskList}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default TaskTable;