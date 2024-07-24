# ThrottleTester

## Description

ThrottleTester is a Next.js project that implements client-server data fetch logic with specific requirements for concurrency and rate limiting. The project demonstrates handling multiple asynchronous HTTP requests efficiently while adhering to concurrency and rate limits.

## Features

- Display an input field for setting the concurrency and rate limit (number from 0 to 100).
- A "Start" button to initiate the requests.
- Disable the "Start" button upon initiation.
- Send 1000 asynchronous HTTP requests to the server's `/api` endpoint.
- Use the input value as:
  - Concurrency limit: Number of active requests at any given time.
  - Requests per second limit.
- Server-side logic to handle requests with random delay and rate limiting.
- Render server response indices immediately after each response.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/iNikolas/throttle-tester.git
cd throttle-tester
```
