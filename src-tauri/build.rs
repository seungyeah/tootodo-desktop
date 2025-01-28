fn main() {
    let mut config = prost_build::Config::new();
    config.type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]");
    config
        .extern_path(".google.protobuf.Any", "::prost_wkt_types::Any")
        .extern_path(".google.protobuf.Timestamp", "::prost_wkt_types::Timestamp")
        .extern_path(".google.protobuf.Duration", "::prost_wkt_types::Duration")
        .extern_path(".google.protobuf.Value", "::prost_wkt_types::Value");
    config.out_dir("src/generated"); // 생성된 파일을 특정 디렉토리에 저장
    config
        .compile_protos(
            &[
                "proto/chat.proto",
                "proto/habit.proto",
                "proto/memo.proto",
                "proto/task.proto",
                "proto/note.proto",
                "proto/weekly.proto",
            ],
            &["proto/"],
        )
        .expect("Failed to compile .proto files");

    tauri_build::build()
}
