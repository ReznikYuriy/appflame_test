# 🧪 Running the Project

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

## 2. Create a `.env` file

Use `.env.example` as a reference and create a `.env` file in the root of the project:

```bash
cp .env.example .env
```

## 3. Run unit & e2e tests

To execute **unit and e2e tests**, run:

```bash
docker compose -f docker-compose.test.yaml up --build --abort-on-container-exit
```

## 4. Run the application

To start the application:

```bash
docker compose up --build
```

## 5. Access the API

After the application has started, open your browser and go to:

```
http://localhost:3000/api/
```

This is the main API entry point.
