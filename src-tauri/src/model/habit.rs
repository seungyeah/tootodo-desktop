use prost::Message;
use prost_wkt_types::Timestamp;
use serde::Deserialize;
use specta::specta;
use tauri::plugin::TauriPlugin;
use tauri::{command, State};
use uuid::Uuid;

use crate::error::{AppError, Result};
use crate::store::AppDB;
use crate::utils::TimestampExt;

include!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/src/proto_generated/habit.rs"
));

pub fn habit_plugin<R: tauri::Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("habit")
        .invoke_handler(tauri::generate_handler![
            create_habit,
            get_habit,
            update_habit_record,
            update_habit,
            update_habit_notes,
            fetch_habits,
            delete_habit,
        ])
        .build()
}

impl HabitModel {
    pub fn new(name: String, icon: String, color: String, goal: Option<Goal>) -> Self {
        let timestamp: Timestamp = TimestampExt::now();

        Self {
            id: Uuid::now_v7().to_string(),
            name,
            icon,
            color,
            status: HabitStatus::Ongoing as i32,
            records: vec![],
            goal,
            chat: None,
            related_notes: vec![],
            created_at: Some(timestamp.clone()),
            updated_at: Some(timestamp),
        }
    }
}

#[command]
#[specta]
pub async fn create_habit(
    db: State<'_, AppDB>,
    name: String,
    icon: String,
    color: String,
    goal: Option<Goal>,
) -> Result<HabitModel> {
    if name.is_empty() {
        return Err(AppError::InvalidInput("Name is required".to_string()));
    }

    let habit = HabitModel::new(name, icon, color, goal);

    let mut buf = Vec::new();
    habit
        .encode(&mut buf)
        .map_err(|e| AppError::Serialization(e.to_string()))?;

    db.put("habit", habit.id.as_bytes(), &buf)?;

    Ok(habit)
}

#[command]
#[specta]
pub async fn get_habit(db: State<'_, AppDB>, id: String) -> Result<HabitModel> {
    let key = id.as_bytes();
    let habit = db.get("habit", key)?;
    match habit {
        Some(data) => {
            let habit = HabitModel::decode(&data[..])
                .map_err(|e| AppError::Serialization(e.to_string()))?;
            Ok(habit)
        }
        None => Err(AppError::NotFound(format!(
            "Habit not found with id: {}",
            id
        ))),
    }
}

#[derive(Deserialize)]
pub struct HabitUpdateData {
    pub name: Option<String>,
    pub icon: Option<String>,
    pub color: Option<String>,
    pub status: Option<i32>,
    pub goal: Option<Goal>,
}

#[command]
#[specta]
pub async fn update_habit(
    db: State<'_, AppDB>,
    id: String,
    habit_data: HabitUpdateData,
) -> Result<HabitModel> {
    let key = id.as_bytes();
    let stored_habit_data = db.get("habit", key)?;

    match stored_habit_data {
        Some(data) => {
            let mut habit = HabitModel::decode(&data[..])
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            // 기본 필드 업데이트
            if let Some(name) = habit_data.name {
                if name.is_empty() {
                    return Err(AppError::InvalidInput("Name cannot be empty".to_string()));
                }
                habit.name = name;
            }

            if let Some(icon) = habit_data.icon {
                habit.icon = icon;
            }

            if let Some(color) = habit_data.color {
                habit.color = color;
            }

            if let Some(status) = habit_data.status {
                habit.status = status;
            }

            if habit_data.goal.is_some() {
                habit.goal = habit_data.goal;
            }

            // 타임스탬프 업데이트
            habit.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            habit
                .encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("habit", key, &buf)?;

            Ok(habit)
        }
        None => Err(AppError::NotFound(format!(
            "Habit not found with id: {}",
            id
        ))),
    }
}

#[command]
#[specta]
pub async fn update_habit_record(
    db: State<'_, AppDB>,
    id: String,
    date: String,
    start_at: Option<Timestamp>,
    msg: String,
) -> Result<HabitModel> {
    let key = id.as_bytes();
    let habit_data = db.get("habit", key)?;

    match habit_data {
        Some(data) => {
            let mut habit = HabitModel::decode(&data[..])
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            // 기존 레코드 찾기
            let record_index = habit.records.iter().position(|record| record.date == date);

            if let Some(index) = record_index {
                // 기존 레코드 업데이트
                habit.records[index].start_at = start_at;
                habit.records[index].msg = msg;
            } else {
                // 새 레코드 추가
                habit.records.push(HabitRecord {
                    date,
                    start_at,
                    msg,
                });
            }

            // 타임스탬프 업데이트
            habit.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            habit
                .encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("habit", key, &buf)?;

            Ok(habit)
        }
        None => Err(AppError::NotFound(format!(
            "Habit not found with id: {}",
            id
        ))),
    }
}

#[command]
#[specta]
pub async fn update_habit_notes(
    db: State<'_, AppDB>,
    id: String,
    note_id: String,
    action: String, // "add" or "remove"
) -> Result<HabitModel> {
    let key = id.as_bytes();
    let habit_data = db.get("habit", key)?;

    match habit_data {
        Some(data) => {
            let mut habit = HabitModel::decode(&data[..])
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            match action.as_str() {
                "add" => {
                    // 노트가 이미 존재하는지 확인
                    if !habit.related_notes.contains(&note_id) {
                        habit.related_notes.push(note_id);
                    }
                }
                "remove" => {
                    // 노트를 제거
                    habit.related_notes.retain(|n| n != &note_id);
                }
                _ => {
                    return Err(AppError::InvalidInput(format!(
                        "Invalid action: {}. Expected 'add' or 'remove'",
                        action
                    )));
                }
            }

            // 타임스탬프 업데이트
            habit.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            habit
                .encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("habit", key, &buf)?;

            Ok(habit)
        }
        None => Err(AppError::NotFound(format!(
            "Habit not found with id: {}",
            id
        ))),
    }
}

#[command]
#[specta]
pub async fn fetch_habits(db: State<'_, AppDB>, status: Option<i32>) -> Result<Vec<HabitModel>> {
    let habits = db.fetch::<HabitModel>("habit")?;

    let filtered_habits: Vec<HabitModel> = if let Some(status_filter) = status {
        habits
            .into_iter()
            .filter(|(_, habit)| habit.status == status_filter)
            .map(|(_, habit)| habit)
            .collect()
    } else {
        habits.into_iter().map(|(_, habit)| habit).collect()
    };

    Ok(filtered_habits)
}

#[command]
#[specta]
pub async fn delete_habit(db: State<'_, AppDB>, id: String) -> Result<()> {
    let key = id.as_bytes();
    db.delete("habit", key)
}
