# LearnX

A Java console-based learning management system.

## Features

- Admin management
- Student dashboard
- Trainer dashboard
- Course management
- Quiz and question management
- Result management
- MySQL database connectivity
- DAO-based database operations

## Technologies Used

- Java
- MySQL
- JDBC
- Git & GitHub

## Project Structure

```text
LearnX/
├── src/
│   ├── db/
│   ├── model/
│   ├── service/
│   ├── util/
│   └── Main.java
├── lib/
└── .gitignore

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/deepamehtre18-rgb/LearnX.git
cd LearnX

### 2. Compile the project

```powershell
javac -cp "lib/*" -d out (Get-ChildItem -Recurse src -Filter *.java).FullName

### 3. Run the application

```bash
java -cp "out;lib/*" Main

### 4. Database Setup

- Install MySQL.
- Create the required database and tables.
- Update the database credentials in DBConnection.java.
- Run the application using the command above.
