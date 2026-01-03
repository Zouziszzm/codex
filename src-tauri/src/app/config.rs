pub struct Config {
    pub database_url: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            database_url: "sqlite:nocturne.db".to_string(),
        }
    }
}
