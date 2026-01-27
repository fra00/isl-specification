# Project: Social Media Platform

Api definition for social media platform

---

## api end point per social media platoform

## Domain Concepts

> **Reference**: Core entities (like **User**) are defined in `./api-shared-domain.isl.md`.

### Post

**Identity**: UUID
**Properties**:

- content: text (max 500 characters)
- authorId: reference to User
- createdAt: timestamp
  **Relationships**:
- Authored by one User (N:1)

---

## Component: CreatePostEndpoint

HTTP API endpoint for creating new posts.

### Role: Backend

### 📐 Interface

- **Method**: POST
- **Route**: /api/v1/posts
- **Authentication**: Required (Bearer token)
- **Content-Type**: application/json
- **Rate Limit**: 10 posts per minute per user

**Request Schema**:

```json
{
  "content": "string (1-500 characters)",
  "attachments": ["url"] (optional, max 4 images)
}
```

**Response Schema (Success - 201)**:

```json
{
  "post": {
    "id": "uuid",
    "content": "string",
    "createdAt": "ISO8601 timestamp"
  }
}
```

**Response Schema (Error - 4xx)**:

```json
{
  "error": {
    "code": "VALIDATION_ERROR | RATE_LIMIT_EXCEEDED | UNAUTHORIZED",
    "message": "string"
  }
}
```

---

### ⚡ Methods

#### handleRequest

**Signature:**

- **input**: HTTPRequest { headers, body }
- **output**: HTTPResponse { status, body }

**Contract**: Create new post after validating content and checking rate limits.

**Flow**:

1. **Authenticate**: Validate Bearer token. IF invalid → 401.
2. **Validate**: Check content length and attachment count. IF invalid → 400.
3. **Rate Limit**: Check user quota. IF exceeded → 429.
4. **Process**: Call `PostService.create()`.
5. **Respond**: Return 201 with created post data.

**🚨 Constraint**:

- MUST authenticate before processing
- MUST sanitize content (prevent XSS)
- MUST return appropriate HTTP status codes (201, 400, 401, 429)
- Response time MUST be < 300ms (p95)

**💡 Implementation Hint**:

```typescript
// Use middleware for cross-cutting concerns
router.post("/posts", authMiddleware, rateLimitMiddleware, controller.create);
```

**✅ Acceptance Criteria**:

- [ ] Returns 201 and post data on success
- [ ] Returns 400 if content is empty or too long
- [ ] Returns 401 if token is missing
- [ ] Returns 429 if rate limit exceeded

**🧪 Test Scenarios**:

1. **Success**: Valid token + content "Hello" → 201 Created
2. **Validation Error**: Content > 500 chars → 400 Bad Request
