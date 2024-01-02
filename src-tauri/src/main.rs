#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod crud;

use crud::data::*;
use crud::person::*;
use crud::todo::*;

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(
            tauri::generate_handler![
                create_tables,
                fill_tables,
                person_insert,
                person_update,
                person_delete,
                person_select,
                todo_insert,
                todo_update,
                todo_delete,
                todo_select
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
