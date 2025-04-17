Here’s a comprehensive `README.md` for your **Bidirectional Data Ingestion Tool (ClickHouse ↔ Flat File)** — covering both the **Spring Boot backend** and the **React + Tailwind frontend**:

---

```markdown
# 📊 Bidirectional Data Ingestion Tool (ClickHouse ↔ Flat File)

A full-stack web application for **ingesting data between ClickHouse and flat files (CSV)**. Supports bidirectional data transfer with features like JWT auth, table/column discovery, joins, data previews, and file import/export.

---

## 🏗️ Tech Stack

| Layer       | Tech                         |
|-------------|------------------------------|
| Frontend    | React + Vite + Tailwind CSS  |
| Backend     | Spring Boot (Java)           |
| Database    | ClickHouse                   |
| Auth        | JWT-based authentication     |

---

## ✨ Features

### ✅ Backend (Spring Boot)
- 🔐 JWT-based login/authentication for ClickHouse
- 📋 List available ClickHouse tables and columns
- 🔎 Preview selected table data with column filters
- 🔗 Join multiple tables dynamically
- ⬇️ Export ClickHouse data to CSV
- ⬆️ Import CSV into ClickHouse
- 📈 Record count and ingestion progress

### 🎨 Frontend (React + Tailwind)
- 🔑 Auth UI (ClickHouse username/password/token)
- 🧩 Table & Column selector
- 👁️ Preview selected/joined data
- 📂 Export to CSV / Import CSV to table
- 🔄 Switch between ClickHouse → File and File → ClickHouse modes
- 🧭 Responsive UI with tabs & navigation

---

## 📁 Project Structure

```
bidirectional-data-ingestion/
├── backend/
│   └── src/
│       └── main/java/com/example/ingestion/
│           ├── controller/
│           ├── service/
│           ├── model/
│           └── config/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Backend Setup (Spring Boot)

1. **Prerequisites**: Java 17+, Maven, ClickHouse running

2. **Update ClickHouse credentials**:
   In `application.properties`:
   ```properties
   spring.datasource.url=jdbc:clickhouse://localhost:8123/default
   spring.datasource.username=default
   spring.datasource.password=
   ```

3. **Run the app**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **API available at**: `http://localhost:8080/api`

---

### 🖥️ Frontend Setup (React + Vite)

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open app**: `http://localhost:5173`

---

## 🔌 Key API Endpoints

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|-----------------------------------|
| POST   | `/api/auth/login`                | Authenticate with ClickHouse      |
| GET    | `/api/tables`                    | List all tables                   |
| GET    | `/api/columns?table={name}`      | Get columns of a table            |
| POST   | `/api/preview`                   | Preview data from table/columns   |
| POST   | `/api/join-preview`              | Preview join result               |
| POST   | `/api/export`                    | Export data to CSV                |
| POST   | `/api/import`                    | Import CSV into ClickHouse        |

---

## 📦 Sample `.env` (Frontend)

If you use environment variables:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🧪 Sample JSON Payloads

### 🔍 Preview Table
```json
POST /api/preview
{
  "table": "users",
  "columns": ["id", "name", "email"],
  "limit": 100
}
```

### 🔗 Join Preview
```json
POST /api/join-preview
{
  "baseTable": "orders",
  "joins": [
    {
      "joinTable": "customers",
      "baseColumn": "customer_id",
      "joinColumn": "id"
    }
  ],
  "columns": ["orders.id", "customers.name"],
  "limit": 50
}
```

---

## 🛡️ Security

- JWT token is issued upon login and attached to every request using an `Authorization: Bearer <token>` header.
- Backend validates token and manages ClickHouse sessions per user.

---

## 🧰 TODO / Future Enhancements

- [ ] Add user registration + role support
- [ ] Persistent upload history & logs
- [ ] CSV schema mapping before import
- [ ] Pagination support for previews
- [ ] Graphical join builder UI

---

## 🤝 Contributing

PRs are welcome! Please create an issue first for feature requests or bugs.

---

## 📄 License

MIT © 2025
```

---

Let me know if you'd like this split into two separate `README.md` files (frontend + backend), or want deploy instructions (e.g., Docker, GitHub Actions).
