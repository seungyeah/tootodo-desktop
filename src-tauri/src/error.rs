use serde::Serialize;
use std::result::Result as StdResult;
use thiserror::Error;

// Define a type alias for Results that use AppError
pub type Result<T> = StdResult<T, AppError>;

#[derive(Error, Debug, Serialize)]
pub enum AppError {
    #[error("Database error: {0}")]
    DB(#[from] DBError),

    #[error("Serialization error: {0}")]
    Serialization(String),

    #[error("Deserialization error: {0}")]
    Deserialization(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("IO error: {0}")]
    IoError(String),

    #[error("Unexpected error: {0}")]
    Other(String),
}

#[derive(Error, Debug, Serialize)]
pub enum DBError {
    #[error("Column family '{0}' not found")]
    ColumnFamilyNotFound(String),

    #[error("RocksDB error: {0}")]
    RocksDBError(String),

    #[error("Failed to decode key: {0}")]
    KeyDecodeError(String),

    #[error("Failed to decode value: {0}")]
    ValueDecodeError(String),

    #[error("Operation failed: {0}")]
    OperationError(String),
}

// Implement conversions from common error types
impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        AppError::IoError(error.to_string())
    }
}

impl From<rocksdb::Error> for DBError {
    fn from(error: rocksdb::Error) -> Self {
        DBError::RocksDBError(error.to_string())
    }
}

impl From<std::string::FromUtf8Error> for DBError {
    fn from(error: std::string::FromUtf8Error) -> Self {
        DBError::KeyDecodeError(error.to_string())
    }
}

impl From<String> for AppError {
    fn from(error: String) -> Self {
        AppError::Other(error)
    }
}

impl From<&str> for AppError {
    fn from(error: &str) -> Self {
        AppError::Other(error.to_string())
    }
}
