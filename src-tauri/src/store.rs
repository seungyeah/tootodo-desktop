use rocksdb::{
    BoundColumnFamily, ColumnFamilyDescriptor, DBWithThreadMode, MultiThreaded, Options,
};
use std::sync::Arc;

use crate::error::{AppError, DBError, Result};

pub struct AppDB {
    db: Arc<DBWithThreadMode<MultiThreaded>>,
}

impl AppDB {
    const CF_NAMES: &'static [&'static str] = &["note", "weekly", "task"];

    pub fn new(path: &str) -> Result<Self> {
        let db_opts = Self::create_db_options();
        let cf_descriptors = Self::create_cf_descriptors();

        let db = Arc::new(
            DBWithThreadMode::<MultiThreaded>::open_cf_descriptors(&db_opts, path, cf_descriptors)
                .map_err(|e| AppError::DB(DBError::RocksDBError(e.to_string())))?,
        );

        Ok(Self { db })
    }

    fn create_db_options() -> Options {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.create_missing_column_families(true);
        opts
    }

    fn create_cf_descriptors() -> Vec<ColumnFamilyDescriptor> {
        Self::CF_NAMES
            .iter()
            .map(|name| ColumnFamilyDescriptor::new(*name, Options::default()))
            .collect()
    }

    fn get_cf_handler(&self, cf_name: &str) -> Result<Arc<BoundColumnFamily>> {
        self.db
            .cf_handle(cf_name)
            .ok_or_else(|| DBError::ColumnFamilyNotFound(cf_name.to_string()).into())
    }

    pub fn put(&self, cf_name: &str, key: &[u8], value: &[u8]) -> Result<()> {
        let cf = self.get_cf_handler(cf_name)?;
        self.db
            .put_cf(&cf, key, value)
            .map_err(|e| AppError::DB(DBError::RocksDBError(e.to_string())))?;
        Ok(())
    }

    pub fn get(&self, cf_name: &str, key: &[u8]) -> Result<Option<Vec<u8>>> {
        let cf = self.get_cf_handler(cf_name)?;
        self.db
            .get_cf(&cf, key)
            .map_err(|e| AppError::DB(DBError::RocksDBError(e.to_string())))
    }

    pub fn delete(&self, cf_name: &str, key: &[u8]) -> Result<()> {
        let cf = self.get_cf_handler(cf_name)?;
        self.db
            .delete_cf(&cf, key)
            .map_err(|e| AppError::DB(DBError::RocksDBError(e.to_string())))?;
        Ok(())
    }

    pub fn fetch<T>(&self, cf_name: &str) -> Result<Vec<(String, T)>>
    where
        T: prost::Message + Default,
    {
        let cf = self.get_cf_handler(cf_name)?;
        let iter = self.db.iterator_cf(&cf, rocksdb::IteratorMode::Start);

        iter.map(|item| {
            let (key, value) =
                item.map_err(|e| AppError::DB(DBError::RocksDBError(e.to_string())))?;
            let key_str = String::from_utf8(key.to_vec())
                .map_err(|e| AppError::DB(DBError::KeyDecodeError(e.to_string())))?;
            let decoded = T::decode(&value[..])
                .map_err(|e| AppError::DB(DBError::ValueDecodeError(e.to_string())))?;

            Ok((key_str, decoded))
        })
        .collect()
    }
}
