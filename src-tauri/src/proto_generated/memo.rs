// This file is @generated by prost-build.
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MemoModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub title: ::prost::alloc::string::String,
    #[prost(enumeration = "Color", tag = "3")]
    pub color: i32,
    #[prost(bool, tag = "5")]
    pub pinned: bool,
    #[prost(string, tag = "6")]
    pub content: ::prost::alloc::string::String,
    #[prost(message, optional, tag = "7")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "8")]
    pub updated_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum Color {
    Unknown = 0,
    Yellow = 1,
    Green = 2,
    Blue = 3,
    Purple = 4,
    Pink = 5,
    Red = 6,
}
impl Color {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            Color::Unknown => "UNKNOWN",
            Color::Yellow => "YELLOW",
            Color::Green => "GREEN",
            Color::Blue => "BLUE",
            Color::Purple => "PURPLE",
            Color::Pink => "PINK",
            Color::Red => "RED",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "UNKNOWN" => Some(Self::Unknown),
            "YELLOW" => Some(Self::Yellow),
            "GREEN" => Some(Self::Green),
            "BLUE" => Some(Self::Blue),
            "PURPLE" => Some(Self::Purple),
            "PINK" => Some(Self::Pink),
            "RED" => Some(Self::Red),
            _ => None,
        }
    }
}
