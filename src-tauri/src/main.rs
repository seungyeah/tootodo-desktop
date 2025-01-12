// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod model;
mod store;

use model::task::{create_task, delete_task, fetch_tasks, get_task};
use store::AppDB;
use tauri::{generate_context, generate_handler};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 데이터베이스 초기화
    let db_path = format!("{}/rocksdb_data", std::env::var("HOME").unwrap());
    // println!("{}", &db_path);
    let app_db = AppDB::new(&db_path)?;
    // 메모리 주소 출력
    println!("AppDB address in main: {:p}", &app_db);

    // Tauri 앱 실행
    tauri::Builder::default()
        .manage(app_db) // AppDB를 State로 등록
        .invoke_handler(generate_handler![
            create_task,
            get_task,
            fetch_tasks,
            delete_task
        ])
        .run(generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
