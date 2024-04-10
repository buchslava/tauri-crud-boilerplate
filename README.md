# Tauri CRUD Boilerplate

Run

```
git clone https://github.com/buchslava/tauri-crud-boilerplate
cd devto-article
git checkout devto-article
npm ci
```

and afrer

```
npm run tauri dev
```

or

```
npm run tauri build
```

and find the following (on MacOS).

* An installer-based (dmg) app in `./src-tauri/target/release/bundle/dmg` if you want to run the installer.
* Or just the app in `./src-tauri/target/release/bundle/macos` if you want to run the app directly.

If you use another platform, the result should also be present in `./src-tauri/target/release/bundle`.
