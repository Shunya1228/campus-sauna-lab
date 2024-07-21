import { supabase } from "@/utils/supabase/supabase";
import Task from "./Task";
import { Dispatch, SetStateAction, ReactElement } from "react";

export default async function getData(
  setTaskList: Dispatch<SetStateAction<Array<ReactElement>>>,
  selectedUniversity: string
) {
  try {
    // クエリを作成
    let query = supabase.from("tasks").select("*");

    // selectedUniversityが設定されている場合のみフィルタリングを適用
    if (selectedUniversity) {
      query = query.eq("school", selectedUniversity);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    if (tasks) {
      const tmpTaskList = tasks.map((task) => (
        <li className="flex items-center justify-between py-2" key={task.id}>
          <Task
            taskList={setTaskList}
            id={task.id}
            text={task.text ?? ""}
            openinghours={task.openinghours}
            school={task.school}
            station={task.station}
            access={task.access}
            saunatemperature={task.saunatemperature ?? ""}
          />
        </li>
      ));
      setTaskList(tmpTaskList);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
