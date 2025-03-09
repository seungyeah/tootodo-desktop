use chrono::Utc;
use prost_wkt_types::Timestamp;

pub trait TimestampExt {
    fn now() -> Self;
}

impl TimestampExt for Timestamp {
    fn now() -> Self {
        let datetime = Utc::now();
        Self {
            seconds: datetime.timestamp(),
            nanos: datetime.timestamp_subsec_nanos() as i32,
        }
    }
}
