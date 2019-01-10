# One Chat Room

A real-time demo application written with [Node.js](https://nodejs.org/en/), [Vue](https://vuejs.org/) and [Socket.io](https://socket.io/):
one chat room where anyone can post messages.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Run in development mode](#run-in-development-mode)
  - [Run in production mode](#run-in-production-mode)
- [Configuration](#configuration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Installation

### Requirements

* [Node.js](https://nodejs.org) 10.x
  * [Installation](https://nodejs.org/en/download/package-manager/)
* [MongoDB](https://www.mongodb.com/) 3+
  * [Installation](https://docs.mongodb.com/manual/administration/install-community/)

### Setup

* Clone the repository
* Install dependencies

  ```
  cd /path/to/application
  npm install
  ```
* Set up environment variables for [configuration](#configuration) if needed.

### Run in development mode

```
cd /path/to/application
npm run dev
```

### Run in production mode

```
cd /path/to/application
npm start
```



## Configuration

The following environment variables can be set to customize the application's behavior:

Variable             | Default value                       | Description
:---                 | :---                                | :---
`BASE_URL`           | *none*                              | Base URL at which the application is deployed.
`DATABASE_URL`       | `mongodb://localhost/one-chat-room` | [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/).
`MONGODB_URI`        | *none*                              | Same as and takes precedence over `DATABASE_URL`.
`MAX_MESSAGE_LENGTH` | 500                                 | Maximum number of characters allowed in a message.
`MAX_MESSAGES`       | 10000                               | Maximum number of messages the application will store before deleting the oldest ones.
`PORT`               | 3000                                | Port on which to listen to.
