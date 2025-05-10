```markdown
![](http://143.42.108.232/pvt/Noroff-64.png)

# Noroff – Backend Development Year 1

## Server - Course Assignment 1 (V2)

### CENSUS APPLICATION

This is a backend application that allows an **admin** to manage participant details and save data into a **MySQL cloud database**.

- Cloud database: [Aiven.io](https://aiven.io)
- Deployment platform: [Render](https://render.com)
- Example deployment link:

```bash
<your-render-link>
```

---

## 📋 Table of Contents

1. Installation
2. Environment Setup (.env)
3. Dependencies & Libraries
4. Node.js Version
5. Database Configuration
6. Render Frontend Testing
7. Postman API Testing
8. Deployment
9. Additional Notes

---

## 1. 🔧 Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd <project-folder>
```

2. Navigate into the project folder:

```bash
cd "path/to/your/folder"
```

3. Install all required dependencies:

```bash
npm install
```

Or manually install any dependency:

```bash
npm install package_name@version
```

---

## 2. 🛠️ Environment Variables

Create a `.env` file in the root directory using the provided `env_example` as a guide.

```env
HOST=
ADMIN_USERNAME=
ADMIN_PASSWORD=
DATABASE_NAME=
DATABASE_PORT=
DIALECT="mysql"
DIALECTMODEL="mysql2"
PORT="3000"
```

> 🔐 Make sure `.env` is listed in your `.gitignore` file.

---

## 3. 📦 Dependencies & Libraries

Here are some key libraries used:

- `bcrypt` – Password hashing
- `body-parser` – Request parsing
- `bootstrap` – Frontend styling
- `cookie-parser` – Cookie handling
- `dotenv` – Load environment vars
- `ejs` – Template engine
- `express` – Web framework
- `express-session` – Session management
- `mysql2` – MySQL client
- `passport` – Authentication
- `sequelize` – ORM
- `morgan`, `debug`, `http-errors`, `jquery`

See `package.json` for full versions.

---

## 4. 🔢 Node.js Version

Developed with:

```bash
Node.js v22.2.0
```

Check your version:

```bash
node -v
```

---

## 5. 🗄️ Database Configuration (Aiven)

Steps to connect:

1. Ensure your `.env` file is correct.
2. In `app.js`, find the line:

```js
db.sequelize.sync({ force: false });
```

If needed (initial setup or reset), temporarily change it to:

```js
db.sequelize.sync({ force: true });
```

> ⚠️ Remember to change it back to `false` after the first run.

Start the app:

```bash
npm start
```

Create admin user in MySQL:

```sql
INSERT INTO Admins (username, password) VALUES ('admin', 'P4ssword');
```

Verify:

```sql
SELECT * FROM defaultdb.Admins;
```

---

## 6. 🌐 Frontend Testing (Render)

1. Open your deployed link:

```bash
<your-render-link>
```

2. Log in using:

```
Username: admin
Password: P4ssword
```

3. After login:
   - Manage participants (Add/Edit/Delete)
   - View Home and Work details
   - Email is the unique identifier (cannot be edited)

---

## 7. 🔍 Postman API Testing

Set Headers:

| Key          | Value            |
|--------------|------------------|
| username     | admin            |
| password     | P4ssword         |
| Content-Type | application/json |

Ensure Body is set to **raw** and **JSON**.

### Available Endpoints

1. **POST** `/participants/add` – Add participant
2. **GET** `/participants` – Get all participants
3. **GET** `/participants/personal` – Get personal info
4. **GET** `/participants/:email` – Get one by email
5. **DELETE** `/participants/:email` – Delete by email
6. **PUT** `/participants/:email` – Update by email
7. **GET** `/participants/work/:email` – Get work info
8. **GET** `/participants/home/:email` – Get home info

#### Example PUT Body:

```json
{
  "personalInfo": {
    "firstname": "test",
    "lastname": "tester",
    "dob": "1994-02-21"
  },
  "home": {
    "country": "Norway",
    "city": "Oslo"
  },
  "work": {
    "companyname": "testcompany",
    "salary": 999,
    "currency": "NOK"
  }
}
```

#### Example POST Body:

```json
{
  "email": "test2@example.com",
  "personalInfo": {
    "firstname": "Test",
    "lastname": "Tester",
    "dob": "1977-08-21"
  },
  "work": {
    "companyname": "testcompany",
    "salary": 153,
    "currency": "NOK"
  },
  "home": {
    "country": "Norway",
    "city": "Oslo"
  }
}
```

---

## 8. 🚀 Deployment

- Hosted on [Render](https://render.com)
- Connected to GitHub for continuous deployment

```bash
<your-render-link>
```

---

## 9. 📝 Additional Notes

- Ensure an Admin exists before accessing endpoints.
- All routes are protected – no signup, only admin login.
- Use provided `.env_example` to configure environment.
- Always use exact Aiven credentials for local and production use.
```
