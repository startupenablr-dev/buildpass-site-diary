# API Endpoints Reference - Quick Guide for Postman

**Project:** Site Diary Management System  
**Last Updated:** October 22, 2025  
**Base URL:** `http://localhost:3000`

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [GraphQL Endpoints](#graphql-endpoints)
3. [REST Endpoints](#rest-endpoints)
4. [Sample Data from Current Dataset](#sample-data-from-current-dataset)
5. [Status Legend](#status-legend)

---

## Setup Instructions

### Starting the Server

```bash
cd /path/to/coding-test
yarn dev:web
```

Server will start at: `http://localhost:3000`

### Postman Collection Setup

**Recommended Collection Name:** `Site Diary API`

**Folder Structure:**

```
📁 Site Diary API
  ├── 📁 GraphQL
  │   ├── Get All Site Diaries
  │   ├── Get Single Site Diary
  │   └── Create Site Diary ⚠️
  └── 📁 REST
      ├── GET All Diaries
      ├── GET Diary by ID
      └── POST Create Diary ⚠️
```

---

## GraphQL Endpoints

### Base Configuration

**URL:** `http://localhost:3000/api/graphql`  
**Method:** `POST`  
**Headers:**

```
Content-Type: application/json
```

---

### 1. Get All Site Diaries ✅

**Request Body:**

```json
{
  "query": "query SiteDiaries { siteDiaries { id title date createdBy content weather { temperature description } attendees attachments } }"
}
```

**Or Formatted:**

```json
{
  "query": "query SiteDiaries {\n  siteDiaries {\n    id\n    title\n    date\n    createdBy\n    content\n    weather {\n      temperature\n      description\n    }\n    attendees\n    attachments\n  }\n}"
}
```

**Expected Response (200 OK):**

```json
{
  "data": {
    "siteDiaries": [
      {
        "id": "cm4lvx1rf00006fujdr7w5u9h",
        "title": "Test",
        "date": "2024-12-13",
        "createdBy": "John Doe",
        "content": "Site diary entry to discuss the activities of the day",
        "weather": {
          "temperature": 20,
          "description": "sunny"
        },
        "attendees": ["Jane Smith", "John Doe"],
        "attachments": [
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
      }
      // ... more entries
    ]
  }
}
```

---

### 2. Get Single Site Diary ✅

**Request Body:**

```json
{
  "query": "query SiteDiary($id: String!) { siteDiary(id: $id) { id title date createdBy content weather { temperature description } attendees attachments } }",
  "variables": {
    "id": "cm4lvx1rf00006fujdr7w5u9h"
  }
}
```

**Valid Test IDs:**

- `cm4lvx1rf00006fujdr7w5u9h` - John Doe's "Test" entry
- `cm4lvx1rf00007fujdr7w5u9i` - Jane Smith's "Progress Meeting"
- `cm4lvx1rf00008fujdr7w5u9j` - Mary Johnson's "Inspection Report"
- `cm4lvx1rf00009fujdr7w5u9k` - Robert Brown's "Safety Check"
- `cm4lvx1rf00010fujdr7w5u9l` - Jane Smith's "Weekly Summary"

**Expected Response (200 OK - Found):**

```json
{
  "data": {
    "siteDiary": {
      "id": "cm4lvx1rf00006fujdr7w5u9h",
      "title": "Test",
      "date": "2024-12-13",
      "createdBy": "John Doe",
      "content": "Site diary entry to discuss the activities of the day",
      "weather": {
        "temperature": 20,
        "description": "sunny"
      },
      "attendees": ["Jane Smith", "John Doe"],
      "attachments": [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    }
  }
}
```

**Expected Response (200 OK - Not Found):**

```json
{
  "data": {
    "siteDiary": null
  }
}
```

---

### 3. Create Site Diary ⚠️ (HAS BUG)

**⚠️ WARNING:** This endpoint returns success but **DOES NOT PERSIST DATA**. The entry will NOT appear in subsequent GET requests.

**Request Body (Minimal):**

```json
{
  "query": "mutation CreateSiteDiary($input: SiteDiaryInput!) { createSiteDiary(input: $input) { id title date createdBy } }",
  "variables": {
    "input": {
      "id": "postman-test-001",
      "date": "2025-10-22",
      "title": "Postman Test Entry",
      "createdBy": "Postman Tester"
    }
  }
}
```

**Current Schema Limitation:**  
Only these fields are accepted:

- `id` (String, required - but shouldn't be!)
- `date` (String, required)
- `title` (String, required)
- `createdBy` (String, required)

❌ NOT AVAILABLE: `content`, `weather`, `attendees`, `attachments`

**Expected Response (200 OK):**

```json
{
  "data": {
    "createSiteDiary": {
      "id": "postman-test-001",
      "title": "Postman Test Entry",
      "date": "2025-10-22",
      "createdBy": "Postman Tester"
    }
  }
}
```

**To Verify the Bug:**
After creating, run "Get All Site Diaries" - the new entry will NOT be there!

---

## REST Endpoints

### 4. Get All Site Diaries (Summary) ✅

**Method:** `GET`  
**URL:** `http://localhost:3000/api/site-diary`  
**Headers:** None

**Expected Response (200 OK):**

```json
[
  {
    "id": "cm4lvx1rf00006fujdr7w5u9h",
    "date": "2024-12-13",
    "title": "Test",
    "createdBy": "John Doe"
  },
  {
    "id": "cm4lvx1rf00007fujdr7w5u9i",
    "date": "2024-12-12",
    "title": "Progress Meeting",
    "createdBy": "Jane Smith"
  },
  {
    "id": "cm4lvx1rf00008fujdr7w5u9j",
    "date": "2024-12-11",
    "title": "Inspection Report",
    "createdBy": "Mary Johnson"
  },
  {
    "id": "cm4lvx1rf00009fujdr7w5u9k",
    "date": "2024-12-10",
    "title": "Safety Check",
    "createdBy": "Robert Brown"
  },
  {
    "id": "cm4lvx1rf00010fujdr7w5u9l",
    "date": "2024-12-09",
    "title": "Weekly Summary",
    "createdBy": "Jane Smith"
  }
]
```

**Note:** This endpoint returns only summary fields (id, date, title, createdBy). For full details, use the single diary endpoint.

---

### 5. Get Single Site Diary by ID ✅

**Method:** `GET`  
**URL:** `http://localhost:3000/api/site-diary/{id}`  
**Headers:** None

**Example URL:**

```
http://localhost:3000/api/site-diary/cm4lvx1rf00006fujdr7w5u9h
```

**Expected Response (200 OK - Success):**

```json
{
  "id": "cm4lvx1rf00006fujdr7w5u9h",
  "date": "2024-12-13",
  "weather": {
    "temperature": 20,
    "description": "sunny"
  },
  "createdBy": "John Doe",
  "title": "Test",
  "content": "Site diary entry to discuss the activities of the day",
  "attendees": ["Jane Smith", "John Doe"],
  "attachments": [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
}
```

**Expected Response (404 Not Found):**

```json
{
  "error": "Entry not found"
}
```

---

### 6. Create Site Diary ⚠️ (HAS BUG)

**⚠️ WARNING:** This endpoint validates and returns success but **DOES NOT PERSIST DATA**.

**Method:** `POST`  
**URL:** `http://localhost:3000/api/site-diary`  
**Headers:**

```
Content-Type: application/json
```

**Request Body (Minimal - Required Fields Only):**

```json
{
  "id": "rest-test-001",
  "date": "2025-10-22",
  "title": "REST API Test",
  "createdBy": "API Tester"
}
```

**Request Body (Complete - All Fields):**

```json
{
  "id": "rest-test-002",
  "date": "2025-10-22",
  "title": "Complete REST Test Entry",
  "createdBy": "Developer Name",
  "content": "This is a comprehensive test of the REST API endpoint. We're including all possible fields to verify the complete functionality.",
  "weather": {
    "temperature": 25,
    "description": "sunny"
  },
  "attendees": ["John Doe", "Jane Smith", "Mary Johnson"],
  "attachments": [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740",
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974"
  ]
}
```

**Expected Response (201 Created):**

```json
{
  "message": "Site diary created successfully",
  "siteDiary": {
    "id": "rest-test-001",
    "date": "2025-10-22",
    "title": "REST API Test",
    "createdBy": "API Tester",
    "content": null,
    "weather": null,
    "attendees": null,
    "attachments": null
  }
}
```

**Error Response (400 Bad Request - Missing Fields):**

```json
{
  "error": "Invalid request format",
  "errorMessage": "id, date, createdBy and title are required"
}
```

**To Verify the Bug:**
After creating, make a GET request to `/api/site-diary` - the new entry will NOT be in the list!

---

### 7. Update Site Diary ❌ (NOT IMPLEMENTED)

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/site-diary?id={id}`

**Status:** Not implemented yet. Will return 405 Method Not Allowed.

---

### 8. Delete Site Diary ❌ (NOT IMPLEMENTED)

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/site-diary?id={id}`

**Status:** Not implemented yet. Will return 405 Method Not Allowed.

---

## Sample Data from Current Dataset

The application comes pre-loaded with 5 sample entries:

### Entry 1: John Doe's Test

```json
{
  "id": "cm4lvx1rf00006fujdr7w5u9h",
  "date": "2024-12-13",
  "title": "Test",
  "createdBy": "John Doe",
  "content": "Site diary entry to discuss the activities of the day",
  "weather": {
    "temperature": 20,
    "description": "sunny"
  },
  "attendees": ["Jane Smith", "John Doe"],
  "attachments": [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
}
```

### Entry 2: Jane Smith's Progress Meeting

```json
{
  "id": "cm4lvx1rf00007fujdr7w5u9i",
  "date": "2024-12-12",
  "title": "Progress Meeting",
  "createdBy": "Jane Smith",
  "content": "Detailed discussion on project milestones",
  "weather": {
    "temperature": 18,
    "description": "cloudy"
  },
  "attendees": ["John Doe", "Mary Johnson"],
  "attachments": [
    "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
}
```

### Entry 3: Mary Johnson's Inspection Report

```json
{
  "id": "cm4lvx1rf00008fujdr7w5u9j",
  "date": "2024-12-11",
  "title": "Inspection Report",
  "createdBy": "Mary Johnson",
  "content": "Inspection of the northern site completed",
  "weather": {
    "temperature": 22,
    "description": "partly cloudy"
  },
  "attendees": ["Jane Smith", "Robert Brown"],
  "attachments": [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
}
```

### Entry 4: Robert Brown's Safety Check

```json
{
  "id": "cm4lvx1rf00009fujdr7w5u9k",
  "date": "2024-12-10",
  "title": "Safety Check",
  "createdBy": "Robert Brown",
  "content": "Conducted safety checks on all equipment",
  "weather": {
    "temperature": 16,
    "description": "rainy"
  },
  "attendees": ["John Doe", "Mary Johnson"],
  "attachments": []
}
```

### Entry 5: Jane Smith's Weekly Summary

```json
{
  "id": "cm4lvx1rf00010fujdr7w5u9l",
  "date": "2024-12-09",
  "title": "Weekly Summary",
  "createdBy": "Jane Smith",
  "content": "Summarised the weekly progress on the project",
  "weather": {
    "temperature": 19,
    "description": "windy"
  },
  "attendees": ["Jane Smith", "Robert Brown", "Mary Johnson"],
  "attachments": [
    "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]
}
```

### Data Location

All sample data is stored in: `apps/web/src/data/site-diary.ts`

**Important:** Data is in-memory and will reset when the server restarts!

---

## Status Legend

| Symbol | Status          | Description                    |
| ------ | --------------- | ------------------------------ |
| ✅     | Working         | Endpoint works as expected     |
| ⚠️     | Partial/Buggy   | Endpoint responds but has bugs |
| ❌     | Not Implemented | Endpoint does not exist        |

---

## Endpoint Summary Table

| #   | Endpoint             | Method | URL                    | Status | Issue           |
| --- | -------------------- | ------ | ---------------------- | ------ | --------------- |
| 1   | Get All (GraphQL)    | POST   | `/api/graphql`         | ✅     | None            |
| 2   | Get Single (GraphQL) | POST   | `/api/graphql`         | ✅     | None            |
| 3   | Create (GraphQL)     | POST   | `/api/graphql`         | ⚠️     | Doesn't persist |
| 4   | Get All (REST)       | GET    | `/api/site-diary`      | ✅     | None            |
| 5   | Get Single (REST)    | GET    | `/api/site-diary/[id]` | ✅     | None            |
| 6   | Create (REST)        | POST   | `/api/site-diary`      | ⚠️     | Doesn't persist |
| 7   | Update (REST)        | PUT    | `/api/site-diary?id=`  | ❌     | Not implemented |
| 8   | Delete (REST)        | DELETE | `/api/site-diary?id=`  | ❌     | Not implemented |
| 9   | Update (GraphQL)     | POST   | `/api/graphql`         | ❌     | Not implemented |
| 10  | Delete (GraphQL)     | POST   | `/api/graphql`         | ❌     | Not implemented |

---

## Testing Tips

### 1. Test GET Endpoints First

Start by testing the working GET endpoints to familiarize yourself with the data structure.

### 2. Verify the CREATE Bug

1. Use endpoint #3 or #6 to create a new entry
2. Get a success response
3. Use endpoint #1 or #4 to list all entries
4. Notice your new entry is NOT in the list (this is the bug!)

### 3. Use Valid IDs for Testing

When testing GET by ID, use one of the 5 valid IDs from the sample data.

### 4. Server Restart Resets Data

If you restart the server, any changes (if the bug were fixed) would be lost. Sample data will be restored.

### 5. GraphiQL Playground Alternative

Instead of Postman, you can also use the built-in GraphiQL interface at `http://localhost:3000/api/graphql` in your browser.

---

## Common Errors

### Error: Connection Refused

**Cause:** Server is not running  
**Fix:** Run `yarn dev:web` from project root

### Error: EADDRINUSE (Port Already in Use)

**Cause:** Port 3000 is already occupied  
**Fix:**

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Error: Module Not Found

**Cause:** Dependencies not installed  
**Fix:**

```bash
yarn install
```

### GraphQL Error: Cannot query field

**Cause:** Schema out of sync  
**Fix:**

```bash
cd apps/web
yarn grats && yarn codegen
```

---

## Quick Copy-Paste Examples

### GraphQL Get All (One-liner)

```json
{
  "query": "query { siteDiaries { id title date createdBy content weather { temperature description } attendees attachments } }"
}
```

### GraphQL Get Single (One-liner)

```json
{
  "query": "query($id:String!){siteDiary(id:$id){id title date createdBy content weather{temperature description}attendees attachments}}",
  "variables": { "id": "cm4lvx1rf00006fujdr7w5u9h" }
}
```

### GraphQL Create (One-liner)

```json
{
  "query": "mutation($input:SiteDiaryInput!){createSiteDiary(input:$input){id title date createdBy}}",
  "variables": {
    "input": {
      "id": "test-123",
      "date": "2025-10-22",
      "title": "Test",
      "createdBy": "Tester"
    }
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Update:** After fixing persistence bugs

For more details, see: `docs/guides/developer-onboarding.md`
