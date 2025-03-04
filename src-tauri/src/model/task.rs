use std::collections::HashMap;

use chrono::Utc;
use prost::Message;
use prost_wkt_types::Timestamp;
use serde::{Deserialize, Serialize};
use specta::specta;
use tauri::{command, State};
use uuid::Uuid;

use crate::error::{AppError, Result};
use crate::store::AppDB;

include!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/src/generated/task.rs"
));

impl TaskModel {
    pub fn new(
        title: String,
        parent_id: Option<String>,
        start_date: String,
        end_date: String,
    ) -> Self {
        let datetime = Utc::now();
        let timestamp = Timestamp {
            seconds: datetime.timestamp(),
            nanos: datetime.timestamp_subsec_nanos() as i32,
        };

        Self {
            id: Uuid::now_v7().to_string(),
            title,
            parent_id: parent_id.unwrap_or_default(),
            milestone: false,
            created_at: Some(timestamp.clone()),
            updated_at: Some(timestamp),
            status: TaskStatus::Ongoing as i32,
            plans: vec![WorkPlan {
                start_date,
                end_date,
            }],
            critical_paths: vec![],
            work_days: vec![],
            total_time: 0,
            chat: None,
            related_notes: vec![],
        }
    }
}

#[command]
#[specta]
pub async fn create_task(
    db: State<'_, AppDB>,
    title: String,
    parent_id: Option<String>,
    start_date: String,
    end_date: String,
) -> Result<TaskModel> {
    let task = TaskModel::new(title, parent_id, start_date, end_date);

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
impl TaskTreeItem {
    // TaskModel을 TaskTreeItem으로 변환하는 헬퍼 메서드
    fn from_task(task: TaskModel) -> Self {
        TaskTreeItem {
            task,
            subtasks: Vec::new(),
        }
    }
}

#[command]
pub async fn fetch_tasks(
    db: State<'_, AppDB>,
    start_date: String,
    end_date: String,
) -> Result<Vec<TaskTreeItem>> {
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

    // 태스크를 트리 구조로 변환
    let mut task_map: std::collections::HashMap<String, TaskTreeItem> = HashMap::new();
    let mut root_tasks: Vec<TaskTreeItem> = Vec::new();

    // 모든 태스크를 TaskTreeItem으로 변환하여 맵에 저장
    for task in filtered_tasks {
        let tree_item = TaskTreeItem::from_task(task.clone());
        task_map.insert(task.id.clone(), tree_item);
    }

    // 부모-자식 관계 구성
    for (_, task) in task_map.clone() {
        if task.task.parent_id.is_empty() {
            // 루트 태스크
            root_tasks.push(task);
        } else {
            // 자식 태스크
            if let Some(parent) = task_map.get_mut(&task.task.parent_id) {
                parent.subtasks.push(task);
            }
        }
    }

    Ok(root_tasks)
}

#[command]
pub async fn delete_task(db: State<'_, AppDB>, id: String) -> Result<()> {
    let key = id.as_bytes();
    db.delete("task", key)
}
