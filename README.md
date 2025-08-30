# Machine Configurator (Vue 3 + Pinia + PrimeVue 4)

A small webapp to configure machine settings per **profile**.  
Left side shows a list of profiles and machines; right side lets you edit **Product Type (A–F)**, **Piece Count (0–10,000)**,
and **Tolerance (0.01–0.05)** for each machine. 
All settings are persisted to `localStorage` (described further down). Includes **Save**, **Load** and **Reset** actions.

---

## Live Demo

👉 **Demo:** https://maschinesettings.netlify.app/
---

## Features

- ✅ **Profiles:** adding/removing/switching profiles;
- ✅ **Machine settings:** Product Type, Piece Count, Tolerance.
- ✅ **Persistence:** stored locally via `localStorage` (single-key snapshot). For simplicity, no backend.
- ✅ **Initialization:** first run creates **Default** profile + **4** default machines.
---

## Tech Stack

- **Vue 3** (script setup, Composition API)
- **Pinia** (state management)
- **PrimeVue v4** + **@primeuix/themes**
- **Vite** (dev server & build)
- **localStorage** (persistence)

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 20 (LTS recommended)
- **npm** ≥ 10

### Installation
Git clone or download this repo:
```bash
# 1) Clone the repo
git clone https://github.com/jakobOB/MachineSettings.git
```

Go to the project directory and install dependencies:
```bash
# 2) Install dependencies
npm install or npm i
```

### Run (development)

```bash
npm run dev
```

### Build (production)

```bash
npm run build
```

---

## Project Structure

```
binder-co/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.js
   ├─ App.vue
   ├─ styles.css
   ├─ components/
        ├─ FormFields.vue       # reusable form fields (Product Type, Piece Count, Tolerance)
   ├─ services/
        ├─ storageService.js    # localStorage service + defaults/bootstrap
```

---


## How It Works

### User Interface
A user can select a profile from the left sidebar. The machines for that profile are displayed below. For each machine,
the user can edit the settings on the right side. THe user can save the settings, or reset the values to default values.
It is possible to add a new profile for which all machines are initialized with default values. A profile can be deleted as well.
The profiles with their machine settings are persisted to `localStorage`. This is used as a simple way to store data locally without a backend.
To store the data correctly on the machine, another storage would be needed. 
A possible way would be to use a backend with a database to access the machine settings from different devices.

### Storage model (single-key snapshot)
All app state is serialized into one `localStorage` key.  
This is used for simplicity since no backend is involved. Even though it may not be secure, no sensitive data is stored.

The data stored in `localStorage` looks like this:
```json
{
  "profiles": [
    {id: "profileId1", name: "Profile 1"},
    {id: "profileId2", name: "Profile 2"},
    ...
  ]
  "settings": {
    "profileId1": {
      "machineId1": {productType: "A", pieceCount: 100, tolerance: 0.02},
      "machineId2": {productType: "B", pieceCount: 200, tolerance: 0.03}
    },
    "profileId2": {
      "machineId1": {productType: "C", pieceCount: 300, tolerance: 0.01},
      "machineId2": {productType: "B", pieceCount: 200, tolerance: 0.03}
    },
    ...
  },
}
```

---
## License

MIT
