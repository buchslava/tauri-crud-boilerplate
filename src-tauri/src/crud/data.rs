use sqlx::{ SqlitePool };

#[path = "../util/db.rs"]
mod db;

#[tauri::command]
pub async fn create_tables() -> Result<String, String> {
    let db_url = db::get_database();
    db::create(&db_url).await;
    let db = SqlitePool::connect(&db_url).await.unwrap();
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS person (\
            id INTEGER PRIMARY KEY NOT NULL,\
            name VARCHAR(250) NOT NULL);"
    )
        .execute(&db).await
        .unwrap();

    let result = sqlx
        ::query(
            "CREATE TABLE IF NOT EXISTS todo (\
                id INTEGER PRIMARY KEY NOT NULL,\
                date VARCHAR(20) NOT NULL,\
                notes TEXT,\
                person_id INTEGER NOT NULL,\
                completed INTEGER NOT NULL,\
                FOREIGN KEY(person_id) REFERENCES person(id));"
        )
        .execute(&db).await;

    if result.is_err() {
        db.close().await;
        return Err(format!("{:?}", result.err()));
    }

    db.close().await;
    Ok("Data structure is ready.".to_string())
}

#[tauri::command]
pub async fn fill_tables() -> Result<String, String> {
    let db_url = db::get_database();
    let db = SqlitePool::connect(&db_url).await.unwrap();

    let sql = vec![
        "INSERT INTO person (id, name) VALUES(1, 'Jack Smith')",
        "INSERT INTO todo (id, notes, date, person_id, completed) VALUES(1, 'Sell the car', '2024-01-30', 1, 0)",
        "INSERT INTO todo (id, notes, date, person_id, completed) VALUES(2, 'Book a hotel', '2024-01-11', 1, 0)",
        "INSERT INTO person (id, name) VALUES(2, 'Mary Woodstock')",
        "INSERT INTO todo (id, notes, date, person_id, completed) VALUES(3, 'Fitness', '2025-01-30', 2, 0)"
    ];
    for query in sql {
        let result = sqlx::query(query).execute(&db).await;
        if result.is_err() {
            db.close().await;
            return Err(format!("{:?}", result.err()));
        }
    }
    db.close().await;
    Ok("Test content is ready.".to_string())
}
