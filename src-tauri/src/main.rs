// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod error;
mod model;
mod store;

use model::task::{create_task, delete_task, fetch_tasks, get_task};
use std::path::PathBuf;
use store::AppDB;
use tauri::{generate_context, generate_handler};
use tauri_api::path::data_dir;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut db_path: PathBuf = data_dir().expect("no data dir");
    db_path.push("tootodo");
    db_path.push("rocksdb_data");

    let app_db = AppDB::new(db_path.to_str().expect("invalid db path"))?;

    // Tauri 앱 실행
    tauri::Builder::default()
        .manage(app_db) // AppDB를 State로 등록
        .invoke_handler(generate_handler![
            create_task,
            get_task,
            fetch_tasks,
            delete_task,
        ])
        .run(generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
