import type { Task } from "./schema";

export type TaskCreationMode = "CREATE_TASK_WITH_TITLE" | "CREATE_TASK_FROM_TASK" | "CREATE_SUBTASK_FROM_TASK";
export type TaskDeleteOption = "CONVERT_SUBTASK_TO_TASK" | "DELETE_ALL_SUBTASK" | "DELETE_TASK";

export type TaskTreeItem = {
   task: Task;
   subtasks?: TaskTreeItem[];
};