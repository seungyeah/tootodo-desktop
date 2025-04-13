use prost::Message;
use prost_wkt_types::Timestamp;
use tauri::{command, State};
use uuid::Uuid;

use crate::error::{AppError, Result};
use crate::store::AppDB;
use crate::utils::TimestampExt;

include!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/src/proto_generated/memo.rs"
));

impl MemoModel {
    pub fn new(title: String, color: i32) -> Self {
        let timestamp: Timestamp = TimestampExt::now();

        Self {
            id: Uuid::now_v7().to_string(),
            title,
            color,
            pinned: false,
            content: "".to_string(),
            created_at: Some(timestamp.clone()),
            updated_at: Some(timestamp),
        }
    }
}

#[command]
pub async fn create_memo(
    db: State<'_, AppDB>,
    title: String,
    color: Option<i32>,
) -> Result<MemoModel> {
    if title.is_empty() {
        return Err(AppError::InvalidInput("Title is required".to_string()));
    }

    let memo = MemoModel::new(title, color.unwrap_or(Color::Unknown as i32));

    let mut buf = Vec::new();
    memo.encode(&mut buf)
        .map_err(|e| AppError::Serialization(e.to_string()))?;

    db.put("memo", memo.id.as_bytes(), &buf)?;

    Ok(memo)
}

#[command]
pub async fn get_memo(db: State<'_, AppDB>, id: String) -> Result<MemoModel> {
    let key = id.as_bytes();
    let memo = db.get("memo", key)?;
    match memo {
        Some(data) => {
            let memo =
                MemoModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;
            Ok(memo)
        }
        None => Err(AppError::NotFound(format!(
            "Memo not found with id: {}",
            id
        ))),
    }
}

#[command]
pub async fn update_memo(
    db: State<'_, AppDB>,
    id: String,
    title: Option<String>,
    content: Option<String>,
    color: Option<i32>,
    pinned: Option<bool>,
) -> Result<MemoModel> {
    let key = id.as_bytes();
    let memo_data = db.get("memo", key)?;

    match memo_data {
        Some(data) => {
            let mut memo =
                MemoModel::decode(&data[..]).map_err(|e| AppError::Serialization(e.to_string()))?;

            // 필드 업데이트
            if let Some(title) = title {
                memo.title = title;
            }

            if let Some(content) = content {
                memo.content = content;
            }

            if let Some(color) = color {
                memo.color = color;
            }

            if let Some(pinned) = pinned {
                memo.pinned = pinned;
            }

            // 타임스탬프 업데이트
            memo.updated_at = Some(TimestampExt::now());

            // 저장
            let mut buf = Vec::new();
            memo.encode(&mut buf)
                .map_err(|e| AppError::Serialization(e.to_string()))?;

            db.put("memo", key, &buf)?;

            Ok(memo)
        }
        None => Err(AppError::NotFound(format!(
            "Memo not found with id: {}",
            id
        ))),
    }
}

#[command]
pub async fn fetch_memos(
    db: State<'_, AppDB>,
    pinned_only: Option<bool>,
    color: Option<i32>,
) -> Result<Vec<MemoModel>> {
    let memos = db.fetch::<MemoModel>("memo")?;

    let mut filtered_memos: Vec<MemoModel> = memos.into_iter().map(|(_, memo)| memo).collect();

    // 핀 여부로 필터링
    if let Some(true) = pinned_only {
        filtered_memos = filtered_memos
            .into_iter()
            .filter(|memo| memo.pinned)
            .collect();
    }

    // 색상으로 필터링
    if let Some(color_filter) = color {
        filtered_memos = filtered_memos
            .into_iter()
            .filter(|memo| memo.color == color_filter)
            .collect();
    }

    // 최신순 정렬
    filtered_memos.sort_by(|a, b| {
        let a_time = a.updated_at.as_ref().map_or(0, |t| t.seconds);
        let b_time = b.updated_at.as_ref().map_or(0, |t| t.seconds);
        b_time.cmp(&a_time)
    });

    Ok(filtered_memos)
}

#[command]
pub async fn delete_memo(db: State<'_, AppDB>, id: String) -> Result<()> {
    let key = id.as_bytes();
    db.delete("memo", key)
}
