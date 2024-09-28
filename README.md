## About

### Idea

This project is backend part of real time drawing application. You can upload any image and draw on it in realtime with your friends!
Drawing data is stored at postgres as coords. Drawing data distribution between users done by pub-sub pattern, when real-time drawing coords stored at RAM with periodical DB saving. Images stored at S3.

### Requirements

S3, PostgresDB

## Installation

### Docker

```bash
$ docker run --restart=always --name cn-dashboard-api-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=postgres \
  -p 7070:5432 -d postgres
```

### Application

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
