fn main() {
    let mut config = prost_build::Config::new();
    config.out_dir("src/generated"); // 생성된 파일을 특정 디렉토리에 저장
    config
        .compile_protos(
            &[
                "proto/task_model.proto",
                "proto/note_model.proto",
                "proto/chat_model.proto",
            ],
            &["proto/"],
        )
        .expect("Failed to compile .proto files");

    tauri_build::build()
}
