// Functions to interact with task.rs backend
import type { TaskModel } from "$lib/schema";
import { invoke } from "@tauri-apps/api/core";

let tasks = $state<TaskModel[]>([]);

// Modified default export to expose raw target value
export default {
    get value() {
        return tasks;
    },
    get raw() {
        return Array.isArray(tasks) ? [...tasks] : [];
    }
};

// Fetch tasks is already implemented in the $effect block, but here's a reusable function
export async function handleFetchTasks(startDate: string, endDate: string) {
    try {
        await invoke("fetch_tasks", {
            startDate,
            endDate,
        }).then((fetchedTasks) => {
            tasks = fetchedTasks.sort(sort_tasks());
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        tasks = [];
    }
}

// Create a new task
export async function handleCreateTask(newTaskTitle: string, startDate: string, endDate: string) {
    if (!newTaskTitle) return;
    invoke("create_task", {
        title: newTaskTitle,
        subtasks: [],
        startDate,
        endDate
    }).then((newTask) => {
        tasks.push(newTask);
        console.log("New task created:", newTask);
    });
}

// Get a specific task by ID
export async function handleGetTask(taskId: string) {
    try {
        const task = await invoke("get_task", { id: taskId });
        return task;
    } catch (error) {
        console.error("Error getting task:", error);
        return null;
    }
}


// Update a task
export async function handleUpdateTask(
    taskId: string,
    updates: {
        title?: string;
        status?: number;
        progress_rate?: number;
        plans?: Array<any>;
        subtasks?: Array<any>;
        critical_path?: any;
    },
) {
    try {
        const updatedTask = await invoke("update_task", {
            id: taskId,
            taskData: updates,
        });

        // Update the tasks array with the updated task
        tasks = tasks.map((task) =>
            task.id === taskId ? updatedTask : task,
        );
        return updatedTask;
    } catch (error) {
        console.error("Error updating task:", error);
        return null;
    }
}

// Link/unlink notes to a task
export async function handleUpdateTaskNotes(
    taskId: string,
    noteId: string,
    action: "add" | "remove",
) {
    try {
        const updatedTask = await invoke("update_task_notes", {
            id: taskId,
            noteId,
            action,
        });

        // Update the tasks array with the updated task
        tasks = tasks.map((task) =>
            task.id === taskId ? updatedTask : task,
        );
        return updatedTask;
    } catch (error) {
        console.error("Error updating task notes:", error);
        return null;
    }
}

// Update or add a subtask
export async function handleUpdateSubtask(taskId: string, subtask: any) {
    try {
        const updatedTask = await invoke("update_subtask", {
            taskId,
            subtask,
        });

        // Update the tasks array with the updated task
        tasks = tasks.map((task) =>
            task.id === taskId ? updatedTask : task,
        );
        return updatedTask;
    } catch (error) {
        console.error("Error updating subtask:", error);
        return null;
    }
}

// Delete a subtask
export async function handleDeleteSubtask(taskId: string, subtaskId: string) {
    try {
        const updatedTask = await invoke("delete_subtask", {
            taskId,
            subtaskId,
        });

        // Update the tasks array with the updated task
        tasks = tasks.map((task) =>
            task.id === taskId ? updatedTask : task,
        );
        return updatedTask;
    } catch (error) {
        console.error("Error deleting subtask:", error);
        return null;
    }
}

// Update work day for a task
export async function handleUpdateWorkDay(taskId: string, workDay: any) {
    try {
        const updatedTask = await invoke("update_work_day", {
            id: taskId,
            workDay,
        });

        // Update the tasks array with the updated task
        tasks = tasks.map((task) =>
            task.id === taskId ? updatedTask : task,
        );
        return updatedTask;
    } catch (error) {
        console.error("Error updating work day:", error);
        return null;
    }
}

// Delete a task
export async function handleDeleteTask(taskId: string) {
    try {
        await invoke("delete_task", { id: taskId });

        // Remove the task from the tasks array
        tasks = tasks.filter((task) => task.id !== taskId);
        return true;
    } catch (error) {
        console.error("Error deleting task:", error);
        return false;
    }
}


// utils
function sort_tasks() {
    // duration 기준으로 정렬 (startDate가 빠른 것부터 정렬 -> endDate가 느린것부터 정렬)
    return (a, b) => {
        const diff = new Date(a.startDate) - new Date(b.startDate);
        if (diff === 0) {
            return new Date(b.endDate) - new Date(a.endDate);
        } else {
            return diff;
        }
    };
}