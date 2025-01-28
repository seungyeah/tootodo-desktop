// This file is @generated by prost-build.
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NoteModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub title: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "3")]
    pub tags: ::prost::alloc::vec::Vec<Tag>,
    #[prost(message, repeated, tag = "4")]
    pub pages: ::prost::alloc::vec::Vec<PageModel>,
    #[prost(string, repeated, tag = "5")]
    pub related_tasks: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(string, repeated, tag = "6")]
    pub related_habits: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(string, repeated, tag = "7")]
    pub related_notes: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(message, optional, tag = "8")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "9")]
    pub updated_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Tag {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub name: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "3")]
    pub groups: ::prost::alloc::vec::Vec<TagGroup>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TagGroup {
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
pub struct PageModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(enumeration = "PageType", tag = "2")]
    pub r#type: i32,
    #[prost(string, tag = "3")]
    pub title: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "4")]
    pub properties: ::prost::alloc::vec::Vec<Property>,
    #[prost(message, repeated, tag = "5")]
    pub contents: ::prost::alloc::vec::Vec<Block>,
    #[prost(message, optional, tag = "6")]
    pub chat: ::core::option::Option<super::chat::ChatModel>,
    #[prost(message, optional, tag = "7")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "8")]
    pub updated_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Property {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub name: ::prost::alloc::string::String,
    #[prost(enumeration = "PropertyType", tag = "3")]
    pub r#type: i32,
    #[prost(oneof = "property::Values", tags = "4, 5")]
    pub values: ::core::option::Option<property::Values>,
}
/// Nested message and enum types in `Property`.
pub mod property {
    #[derive(serde::Serialize, serde::Deserialize)]
    #[allow(clippy::derive_partial_eq_without_eq)]
    #[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Values {
        /// 단일 값
        #[prost(string, tag = "4")]
        SingleValue(::prost::alloc::string::String),
        /// 여러 값을 포함하는 메시지
        #[prost(message, tag = "5")]
        MultiValues(super::MultipleValues),
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MultipleValues {
    #[prost(string, repeated, tag = "1")]
    pub values: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Block {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(enumeration = "EditorBlockType", tag = "2")]
    pub r#type: i32,
    #[prost(string, tag = "3")]
    pub body: ::prost::alloc::string::String,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct EditorPageTemplate {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub title: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "3")]
    pub contents: ::prost::alloc::vec::Vec<Block>,
    #[prost(message, optional, tag = "4")]
    pub created_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "5")]
    pub updated_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum PageType {
    Editor = 0,
    Code = 1,
    Drawing = 2,
    QnA = 3,
    Recording = 4,
}
impl PageType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            PageType::Editor => "EDITOR",
            PageType::Code => "CODE",
            PageType::Drawing => "DRAWING",
            PageType::QnA => "QnA",
            PageType::Recording => "RECORDING",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "EDITOR" => Some(Self::Editor),
            "CODE" => Some(Self::Code),
            "DRAWING" => Some(Self::Drawing),
            "QnA" => Some(Self::QnA),
            "RECORDING" => Some(Self::Recording),
            _ => None,
        }
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum PropertyType {
    PropText = 0,
    PropSingleSelect = 1,
    PropMultiSelect = 2,
    PropNumber = 3,
    PropDateTime = 4,
    PropFile = 5,
    PropImage = 6,
    PropLink = 7,
    PropEmail = 8,
    PropPhone = 9,
    PropLocation = 10,
}
impl PropertyType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            PropertyType::PropText => "PROP_TEXT",
            PropertyType::PropSingleSelect => "PROP_SINGLE_SELECT",
            PropertyType::PropMultiSelect => "PROP_MULTI_SELECT",
            PropertyType::PropNumber => "PROP_NUMBER",
            PropertyType::PropDateTime => "PROP_DATE_TIME",
            PropertyType::PropFile => "PROP_FILE",
            PropertyType::PropImage => "PROP_IMAGE",
            PropertyType::PropLink => "PROP_LINK",
            PropertyType::PropEmail => "PROP_EMAIL",
            PropertyType::PropPhone => "PROP_PHONE",
            PropertyType::PropLocation => "PROP_LOCATION",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "PROP_TEXT" => Some(Self::PropText),
            "PROP_SINGLE_SELECT" => Some(Self::PropSingleSelect),
            "PROP_MULTI_SELECT" => Some(Self::PropMultiSelect),
            "PROP_NUMBER" => Some(Self::PropNumber),
            "PROP_DATE_TIME" => Some(Self::PropDateTime),
            "PROP_FILE" => Some(Self::PropFile),
            "PROP_IMAGE" => Some(Self::PropImage),
            "PROP_LINK" => Some(Self::PropLink),
            "PROP_EMAIL" => Some(Self::PropEmail),
            "PROP_PHONE" => Some(Self::PropPhone),
            "PROP_LOCATION" => Some(Self::PropLocation),
            _ => None,
        }
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum EditorBlockType {
    BlockText = 0,
    BlockCode = 1,
    BlockHeading = 2,
    BlockTable = 3,
    BlockList = 4,
    BlockFile = 5,
    BlockImage = 6,
    BlockTask = 7,
    BlockHabit = 8,
    BlockCuriosity = 9,
    BlockThought = 10,
    BlockReflection = 11,
    BlockConfusion = 12,
    BlockDoubt = 13,
    BlockIssue = 14,
}
impl EditorBlockType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            EditorBlockType::BlockText => "BLOCK_TEXT",
            EditorBlockType::BlockCode => "BLOCK_CODE",
            EditorBlockType::BlockHeading => "BLOCK_HEADING",
            EditorBlockType::BlockTable => "BLOCK_TABLE",
            EditorBlockType::BlockList => "BLOCK_LIST",
            EditorBlockType::BlockFile => "BLOCK_FILE",
            EditorBlockType::BlockImage => "BLOCK_IMAGE",
            EditorBlockType::BlockTask => "BLOCK_TASK",
            EditorBlockType::BlockHabit => "BLOCK_HABIT",
            EditorBlockType::BlockCuriosity => "BLOCK_CURIOSITY",
            EditorBlockType::BlockThought => "BLOCK_THOUGHT",
            EditorBlockType::BlockReflection => "BLOCK_REFLECTION",
            EditorBlockType::BlockConfusion => "BLOCK_CONFUSION",
            EditorBlockType::BlockDoubt => "BLOCK_DOUBT",
            EditorBlockType::BlockIssue => "BLOCK_ISSUE",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "BLOCK_TEXT" => Some(Self::BlockText),
            "BLOCK_CODE" => Some(Self::BlockCode),
            "BLOCK_HEADING" => Some(Self::BlockHeading),
            "BLOCK_TABLE" => Some(Self::BlockTable),
            "BLOCK_LIST" => Some(Self::BlockList),
            "BLOCK_FILE" => Some(Self::BlockFile),
            "BLOCK_IMAGE" => Some(Self::BlockImage),
            "BLOCK_TASK" => Some(Self::BlockTask),
            "BLOCK_HABIT" => Some(Self::BlockHabit),
            "BLOCK_CURIOSITY" => Some(Self::BlockCuriosity),
            "BLOCK_THOUGHT" => Some(Self::BlockThought),
            "BLOCK_REFLECTION" => Some(Self::BlockReflection),
            "BLOCK_CONFUSION" => Some(Self::BlockConfusion),
            "BLOCK_DOUBT" => Some(Self::BlockDoubt),
            "BLOCK_ISSUE" => Some(Self::BlockIssue),
            _ => None,
        }
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct WeeklyModel {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(uint32, tag = "2")]
    pub year: u32,
    #[prost(uint32, tag = "3")]
    pub week: u32,
    #[prost(message, repeated, tag = "4")]
    pub tasks_with_schedule: ::prost::alloc::vec::Vec<TaskWithSchedule>,
    #[prost(message, repeated, tag = "5")]
    pub habits_inprogress: ::prost::alloc::vec::Vec<InprogressHabit>,
    #[prost(string, repeated, tag = "6")]
    pub prompts: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(message, repeated, tag = "7")]
    pub weekly_records: ::prost::alloc::vec::Vec<DailyRecord>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TaskWithSchedule {
    #[prost(string, tag = "1")]
    pub task_id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub task_name: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "3")]
    pub task_schedules: ::prost::alloc::vec::Vec<TaskSchedule>,
    #[prost(bool, tag = "4")]
    pub fixed: bool,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TaskSchedule {
    #[prost(enumeration = "Week", tag = "1")]
    pub weekday: i32,
    #[prost(message, optional, tag = "2")]
    pub start_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "3")]
    pub end_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct InprogressHabit {
    #[prost(string, tag = "1")]
    pub habit_id: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub habit_icon: ::prost::alloc::string::String,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct DailyRecord {
    #[prost(enumeration = "Week", tag = "1")]
    pub weekday: i32,
    #[prost(string, tag = "2")]
    pub summary: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "3")]
    pub msgs: ::prost::alloc::vec::Vec<DailyMsg>,
    #[prost(message, repeated, tag = "4")]
    pub timer_records: ::prost::alloc::vec::Vec<TimerRecord>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct DailyMsg {
    #[prost(enumeration = "DailyMsgType", tag = "1")]
    pub msg_type: i32,
    #[prost(string, tag = "2")]
    pub related_task: ::prost::alloc::string::String,
    #[prost(string, tag = "3")]
    pub related_habit: ::prost::alloc::string::String,
    #[prost(string, tag = "4")]
    pub content: ::prost::alloc::string::String,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TimerRecord {
    #[prost(string, tag = "1")]
    pub id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag = "2")]
    pub cycles: ::prost::alloc::vec::Vec<TimerCycle>,
    #[prost(message, optional, tag = "3")]
    pub total_focus_time: ::core::option::Option<::prost_wkt_types::Duration>,
    #[prost(message, optional, tag = "4")]
    pub total_time: ::core::option::Option<::prost_wkt_types::Duration>,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TimerCycle {
    #[prost(message, optional, tag = "1")]
    pub start_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(message, optional, tag = "2")]
    pub end_at: ::core::option::Option<::prost_wkt_types::Timestamp>,
    #[prost(uint32, tag = "3")]
    pub focus_rate: u32,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum DailyMsgType {
    Text = 0,
    Question = 1,
    Answer = 2,
    Image = 3,
}
impl DailyMsgType {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            DailyMsgType::Text => "TEXT",
            DailyMsgType::Question => "QUESTION",
            DailyMsgType::Answer => "ANSWER",
            DailyMsgType::Image => "IMAGE",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "TEXT" => Some(Self::Text),
            "QUESTION" => Some(Self::Question),
            "ANSWER" => Some(Self::Answer),
            "IMAGE" => Some(Self::Image),
            _ => None,
        }
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum Week {
    Unknown = 0,
    Mon = 1,
    Tue = 2,
    Wed = 3,
    Thu = 4,
    Fri = 5,
    Sat = 6,
    Sun = 7,
}
impl Week {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            Week::Unknown => "UNKNOWN",
            Week::Mon => "MON",
            Week::Tue => "TUE",
            Week::Wed => "WED",
            Week::Thu => "THU",
            Week::Fri => "FRI",
            Week::Sat => "SAT",
            Week::Sun => "SUN",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "UNKNOWN" => Some(Self::Unknown),
            "MON" => Some(Self::Mon),
            "TUE" => Some(Self::Tue),
            "WED" => Some(Self::Wed),
            "THU" => Some(Self::Thu),
            "FRI" => Some(Self::Fri),
            "SAT" => Some(Self::Sat),
            "SUN" => Some(Self::Sun),
            _ => None,
        }
    }
}
