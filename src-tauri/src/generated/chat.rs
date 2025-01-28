// This file is @generated by prost-build.
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ChatModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(enumeration = "ChatForm", tag = "2")]
    pub chat_type: i32,
    #[prost(message, repeated, tag = "3")]
    pub chat_msgs: ::prost::alloc::vec::Vec<MsgModel>,
    #[prost(message, optional, tag = "4")]
    pub fixed_msg: ::core::option::Option<MsgModel>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(enumeration = "MsgType", tag = "2")]
    pub msg_type: i32,
    #[prost(string, tag = "3")]
    pub content: ::prost::alloc::string::String,
    #[prost(bool, tag = "4")]
    pub booked: bool,
    #[prost(message, repeated, tag = "5")]
    pub replies: ::prost::alloc::vec::Vec<MsgReplyModel>,
    #[prost(message, optional, tag = "6")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgReplyModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(enumeration = "MsgType", tag = "2")]
    pub msg_type: i32,
    #[prost(string, tag = "3")]
    pub content: ::prost::alloc::string::String,
    #[prost(message, optional, tag = "6")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum ChatForm {
    Unknown = 0,
    Task = 1,
    Note = 2,
    Weekly = 3,
    Ai = 4,
}
impl ChatForm {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            ChatForm::Unknown => "UNKNOWN",
            ChatForm::Task => "TASK",
            ChatForm::Note => "NOTE",
            ChatForm::Weekly => "WEEKLY",
            ChatForm::Ai => "AI",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "UNKNOWN" => Some(Self::Unknown),
            "TASK" => Some(Self::Task),
            "NOTE" => Some(Self::Note),
            "WEEKLY" => Some(Self::Weekly),
            "AI" => Some(Self::Ai),
            _ => None,
        }
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum MsgType {
    Text = 0,
    Question = 1,
    Answer = 2,
    Image = 3,
    File = 4,
    Link = 5,
    Audio = 6,
}
impl MsgType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            MsgType::Text => "TEXT",
            MsgType::Question => "QUESTION",
            MsgType::Answer => "ANSWER",
            MsgType::Image => "IMAGE",
            MsgType::File => "FILE",
            MsgType::Link => "LINK",
            MsgType::Audio => "AUDIO",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "TEXT" => Some(Self::Text),
            "QUESTION" => Some(Self::Question),
            "ANSWER" => Some(Self::Answer),
            "IMAGE" => Some(Self::Image),
            "FILE" => Some(Self::File),
            "LINK" => Some(Self::Link),
            "AUDIO" => Some(Self::Audio),
            _ => None,
        }
    }
}
