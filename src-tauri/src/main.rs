// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod error;
mod model;
mod store;
mod utils;

use std::path::PathBuf;
use store::AppDB;
use tauri::generate_context;
use tauri_api::path::data_dir;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut db_path: PathBuf = data_dir().expect("no data dir");
    db_path.push("tootodo");
    db_path.push("rocksdb_data");

    let app_db = AppDB::new(db_path.to_str().expect("invalid db path"))?;

    // Tauri 앱 실행
    tauri::Builder::default()
        .manage(app_db) // AppDB를 State로 등록
        .plugin(model::habit::habit_plugin())
        .plugin(model::memo::memo_plugin())
        .plugin(model::task::task_plugin())
        .run(generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
