// use std::collections::HashMap;

use prost::Message;
use prost_wkt_types::Timestamp;
use serde::{Deserialize, Serialize};
use tauri::{command, State};
use uuid::Uuid;

use crate::error::{AppError, Result};
use crate::store::AppDB;
use crate::utils::TimestampExt;

include!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/src/proto_generated/task.rs"
));

impl TaskModel {
    pub fn new(
        title: String,
        subtasks: Option<Vec<SubtaskModel>>,
        start_date: String,
        end_date: String,
    ) -> Self {
        let timestamp: Timestamp = TimestampExt::now();

        let subtasks = subtasks.unwrap_or_default();

        Self {
            id: Uuid::now_v7().to_string(),
            title,
            progress_rate: 0,
            status: TaskStatus::Ongoing as i32,
            plans: vec![WorkPlan {
                start_date,
                end_date,
            }],
            subtasks,
            critical_path: None,
            work_days: vec![],
            total_time: 0,
            chat: None,
            related_notes: vec![],
            created_at: Some(timestamp.clone()),
            updated_at: Some(timestamp),
        }
    }
}

#[command]
pub async fn create_task(
    db: State<'_, AppDB>,
    title: String,
    subtasks: Option<Vec<SubtaskModel>>,
    start_date: String,
    end_date: String,
) -> Result<TaskModel> {
    if title.is_empty() {
        return Err(AppError::InvalidInput("Title is required".to_string()));
    }

    let task = TaskModel::new(title, subtasks, start_date, end_date);

    let mut buf = Vec::new();
    task.encode(&mut buf)
        .map_err(|e| AppError::Serialization(e.to_string()))?;

    db.put("task", task.id.as_bytes(), &buf)?;

    Ok(task)
}

#[command]
pub async fn get_task(db: State<'_, AppDB>, id: String) -> Result<TaskModel> {
    let key = id.as_bytes();
    let task = db.get("task", key)?;
    match task {
        Some(data) => {
            let task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;
            Ok(task)
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            id
        ))),
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct TaskTreeItem {
    pub task: TaskModel,
    pub subtasks: Vec<TaskTreeItem>,
}

// impl TaskTreeItem {
//     // TaskModel을 TaskTreeItem으로 변환하는 헬퍼 메서드
//     fn from_task(task: TaskModel) -> Self {
//         TaskTreeItem {
//             task,
//             subtasks: Vec::new(),
//         }
//     }
// }

#[command]
pub async fn fetch_tasks(
    db: State<'_, AppDB>,
    start_date: String,
    end_date: String,
) -> Result<Vec<TaskModel>> {
    let tasks = db.fetch::<TaskModel>("task")?;

    // 먼저 날짜 필터링을 적용
    let filtered_tasks: Vec<TaskModel> = if !start_date.is_empty() && !end_date.is_empty() {
        tasks
            .into_iter()
            .filter(|(_, task)| {
                // plans 배열 내에서 start_date와 end_date를 필터링
                task.plans
                    .iter()
                    .any(|plan| plan.start_date < end_date && plan.end_date > start_date)
            })
            .map(|(_, task)| task)
            .collect()
    } else {
        tasks.into_iter().map(|(_, task)| task).collect()
    };

    // // 태스크를 트리 구조로 변환
    // let mut task_map: std::collections::HashMap<String, TaskTreeItem> = HashMap::new();
    // let mut root_tasks: Vec<TaskTreeItem> = Vec::new();

    // // 모든 태스크를 TaskTreeItem으로 변환하여 맵에 저장
    // for task in filtered_tasks {
    //     let tree_item = TaskTreeItem::from_task(task.clone());
    //     task_map.insert(task.id.clone(), tree_item);
    // }

    // // 부모-자식 관계 구성
    // for (_, task) in task_map.clone() {
    //     if task.task.parent_id.is_empty() {
    //         // 루트 태스크
    //         root_tasks.push(task);
    //     } else {
    //         // 자식 태스크
    //         if let Some(parent) = task_map.get_mut(&task.task.parent_id) {
    //             parent.subtasks.push(task);
    //         }
    //     }
    // }

    Ok(filtered_tasks)
}

#[derive(Deserialize)]
pub struct TaskUpdateData {
    pub title: Option<String>,
    pub status: Option<i32>,
    pub progress_rate: Option<u32>,
    pub plans: Option<Vec<WorkPlan>>,
    pub subtasks: Option<Vec<SubtaskModel>>,
    pub critical_path: Option<CriticalPathInfo>,
}

#[command]
pub async fn update_task(
    db: State<'_, AppDB>,
    id: String,
    task_data: TaskUpdateData,
) -> Result<TaskModel> {
    let key = id.as_bytes();
    let stored_task_data = db.get("task", key)?;

    match stored_task_data {
        Some(data) => {
            let mut task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;

            // 기본 필드 업데이트
            if let Some(title) = task_data.title {
                if title.is_empty() {
                    return Err(AppError::InvalidInput("Title cannot be empty".to_string()));
                }
                task.title = title;
            }

            if let Some(status) = task_data.status {
                task.status = status;
                if status == TaskStatus::Completed as i32 {
                    // 완료 상태로 변경 시 진행률 100%로 설정
                    task.progress_rate = 100;
                }
            }

            if let Some(progress_rate) = task_data.progress_rate {
                task.progress_rate = progress_rate;
            }

            if let Some(plans) = task_data.plans {
                task.plans = plans;
            }

            if task_data.critical_path.is_some() {
                task.critical_path = task_data.critical_path;
            }

            // 타임스탬프 업데이트
            task.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            task.encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("task", key, &buf)?;

            Ok(task)
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            id
        ))),
    }
}

#[command]
pub async fn update_task_notes(
    db: State<'_, AppDB>,
    id: String,
    note_id: String,
    action: String, // "add" or "remove"
) -> Result<TaskModel> {
    let key = id.as_bytes();
    let task_data = db.get("task", key)?;

    match task_data {
        Some(data) => {
            let mut task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;

            match action.as_str() {
                "add" => {
                    // 노트가 이미 존재하는지 확인
                    if !task.related_notes.contains(&note_id) {
                        task.related_notes.push(note_id);
                    }
                }
                "remove" => {
                    // 노트를 제거
                    task.related_notes.retain(|n| n != &note_id);
                }
                _ => {
                    return Err(AppError::InvalidInput(format!(
                        "Invalid action: {}. Expected 'add' or 'remove'",
                        action
                    )));
                }
            }

            // 타임스탬프 업데이트
            task.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            task.encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("task", key, &buf)?;

            Ok(task)
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            id
        ))),
    }
}

#[command]
pub async fn update_subtask(
    db: State<'_, AppDB>,
    task_id: String,
    subtask: SubtaskModel,
) -> Result<TaskModel> {
    let key = task_id.as_bytes();
    let task_data = db.get("task", key)?;

    match task_data {
        Some(data) => {
            let mut task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;

            // 기존 서브태스크 찾기
            let subtask_index = task.subtasks.iter().position(|s| s.id == subtask.id);

            if let Some(index) = subtask_index {
                // 기존 서브태스크 업데이트
                task.subtasks[index] = subtask;
            } else {
                // 새 서브태스크 추가
                task.subtasks.push(subtask);
            }

            // 타임스탬프 업데이트
            task.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            task.encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("task", key, &buf)?;

            Ok(task)
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            task_id
        ))),
    }
}

#[command]
pub async fn delete_subtask(
    db: State<'_, AppDB>,
    task_id: String,
    subtask_id: String,
) -> Result<TaskModel> {
    let key = task_id.as_bytes();
    let task_data = db.get("task", key)?;

    match task_data {
        Some(data) => {
            let mut task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;

            // 서브태스크 제거
            task.subtasks.retain(|s| s.id != subtask_id);

            // 타임스탬프 업데이트
            task.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            task.encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("task", key, &buf)?;

            Ok(task)
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            task_id
        ))),
    }
}

#[command]
pub async fn update_work_day(
    db: State<'_, AppDB>,
    id: String,
    work_day: WorkDay,
) -> Result<TaskModel> {
    let key = id.as_bytes();
    let task_data = db.get("task", key)?;

    match task_data {
        Some(data) => {
            let mut task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;

            // 기존 작업일 찾기
            let day_index = task.work_days.iter().position(|d| d.date == work_day.date);

            if let Some(index) = day_index {
                // 기존 작업일 업데이트
                task.work_days[index] = work_day;
            } else {
                // 새 작업일 추가
                task.work_days.push(work_day);
            }

            // 총 작업 시간 재계산
            task.total_time = task
                .work_days
                .iter()
                .filter_map(|day| day.working_time.as_ref())
                .map(|duration| duration.seconds as u32)
                .sum();

            // 타임스탬프 업데이트
            task.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            task.encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("task", key, &buf)?;

            Ok(task)
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            id
        ))),
    }
}

#[command]
pub async fn delete_task(db: State<'_, AppDB>, id: String) -> Result<()> {
    let key = id.as_bytes();
    db.delete("task", key)
}
