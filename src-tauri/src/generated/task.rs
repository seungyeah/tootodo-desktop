// This file is @generated by prost-build.
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TaskModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub title: ::prost::alloc::string::String,
    #[prost(enumeration = "TaskStatus", tag = "3")]
    pub status: i32,
    #[prost(bool, tag = "4")]
    pub milestone: bool,
    #[prost(message, repeated, tag = "5")]
    pub plans: ::prost::alloc::vec::Vec<WorkPlan>,
    #[prost(string, tag = "6")]
    pub parent_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "7")]
    pub critical_paths: ::prost::alloc::vec::Vec<CriticalPathInfo>,
    #[prost(message, repeated, tag = "8")]
    pub work_days: ::prost::alloc::vec::Vec<WorkDay>,
    #[prost(uint32, tag = "9")]
    pub total_time: u32,
    #[prost(message, optional, tag = "10")]
    pub chat: ::core::option::Option<super::chat::ChatModel>,
    #[prost(string, repeated, tag = "11")]
    pub related_notes: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(message, optional, tag = "12")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "13")]
    pub updated_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WorkPlan {
    #[prost(string, tag = "1")]
    pub start_date: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub end_date: ::prost::alloc::string::String,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WorkDay {
    #[prost(string, tag = "1")]
    pub date: ::prost::alloc::string::String,
    #[prost(message, optional, tag = "2")]
    pub working_time: ::core::option::Option<::prost_wkt_types::Duration>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CriticalPathInfo {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub color: ::prost::alloc::string::String,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CriticalPath {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub color: ::prost::alloc::string::String,
    #[prost(string, repeated, tag = "4")]
    pub task_ids: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum TaskStatus {
    Ongoing = 0,
    Completed = 1,
    Pending = 2,
}
impl TaskStatus {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            TaskStatus::Ongoing => "ONGOING",
            TaskStatus::Completed => "COMPLETED",
            TaskStatus::Pending => "PENDING",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "ONGOING" => Some(Self::Ongoing),
            "COMPLETED" => Some(Self::Completed),
            "PENDING" => Some(Self::Pending),
            _ => None,
        }
    }
}
