use chrono::Utc;
use prost::Message;
use serde::{Deserialize, Serialize};
use tauri::{command, State};
use uuid::Uuid;

use crate::error::{AppError, Result};
use crate::store::AppDB;

include!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/src/generated/task.rs"
));

#[derive(Serialize, Deserialize)]
pub struct Res<Model> {
    key: String,
    value: Model,
}

impl TaskModel {
    pub fn new(
        title: String,
        parent_id: Option<String>,
        start_date: String,
        end_date: String,
    ) -> Self {
        let datetime = Utc::now();

        Self {
            id: Uuid::now_v7().to_string(),
            title,
            parent_id: parent_id.unwrap_or_default(),
            start_date,
            end_date,
            due_at: "".to_string(),
            milestone: false,
            progress_rate: 0,
            created_at: datetime.to_string(),
            updated_at: datetime.to_string(),
        }
    }
}

#[command]
pub async fn create_task(
    db: State<'_, AppDB>,
    title: String,
    parent_id: Option<String>,
    start_date: String,
    end_date: String,
) -> Result<Res<TaskModel>> {
    let task = TaskModel::new(title, parent_id, start_date, end_date);

    let mut buf = Vec::new();
    task.encode(&mut buf)
        .map_err(|e| AppError::Serialization(e.to_string()))?;

    db.put("task", task.id.as_bytes(), &buf)?;

    Ok(Res {
        key: task.id.clone(),
        value: task,
    })
}

#[command]
pub async fn get_task(db: State<'_, AppDB>, id: String) -> Result<Res<TaskModel>> {
    let key = id.as_bytes();
    let task = db.get("task", key)?;
    match task {
        Some(data) => {
            let task =
                TaskModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;
            Ok(Res {
                key: task.id.clone(),
                value: task,
            })
        }
        None => Err(AppError::NotFound(format!(
            "Task not found with id: {}",
            id
        ))),
    }
}

#[command]
pub async fn fetch_tasks(
    db: State<'_, AppDB>,
    start_date: String,
    end_date: String,
) -> Result<Vec<(String, TaskModel)>> {
    let tasks = db.fetch::<TaskModel>("task")?;

    // start_date와 end_date가 모두 제공된 경우에만 필터링
    if !start_date.is_empty() && !end_date.is_empty() {
        Ok(tasks
            .into_iter()
            .filter(|(_, task)| {
                // task의 기간이 주어진 기간과 겹치는지 확인
                task.start_date < end_date && task.end_date > start_date
            })
            .collect())
    } else {
        // 날짜 필터가 없는 경우 모든 태스크 반환
        Ok(tasks)
    }
}

#[command]
pub async fn delete_task(db: State<'_, AppDB>, id: String) -> Result<()> {
    let key = id.as_bytes();
    db.delete("task", key)
}
