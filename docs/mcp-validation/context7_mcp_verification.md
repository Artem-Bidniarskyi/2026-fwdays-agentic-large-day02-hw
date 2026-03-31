# Context7 MCP - Connection Verification

**Date:** 2026-03-31
**Server Version:** Context7 v2.1.6
**Package:** @upstash/context7-mcp

## 1. MCP Server Configuration

From `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

## 2. Server Initialization Response

```json
{
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": { "listChanged": true }
    },
    "serverInfo": {
      "name": "Context7",
      "version": "2.1.6",
      "websiteUrl": "https://context7.com",
      "description": "Context7 provides up-to-date documentation and code examples for libraries and frameworks."
    }
  }
}
```

## 3. Available Tools

The server exposes two tools:

| Tool | Description |
|------|-------------|
| `resolve-library-id` | Resolves a package/product name to a Context7-compatible library ID |
| `query-docs` | Retrieves up-to-date documentation and code examples for any library |

## 4. Test Query 1: resolve-library-id

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "resolve-library-id",
    "arguments": {
      "query": "React hooks documentation",
      "libraryName": "react"
    }
  }
}
```

**Response (top results):**

| Library | ID | Code Snippets | Reputation | Benchmark Score |
|---------|----|---------------|------------|-----------------|
| React | /reactjs/react.dev | 2781 | High | 84.95 |
| React | /websites/react_dev | 5724 | High | 89.84 |
| React | /websites/react_dev_reference | 2517 | High | 83.45 |
| React | /facebook/react | 3493 | High | 59.41 |

## 5. Test Query 2: query-docs

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "query-docs",
    "arguments": {
      "libraryId": "/reactjs/react.dev",
      "query": "How to use useState hook"
    }
  }
}
```

**Response (documentation snippets returned):**

### Snippet 1: Implement useState Hook for State Management
Source: `reactjs/react.dev` — tutorial-tic-tac-toe.md

```javascript
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

### Snippet 2: Basic Counter with useState
Source: `reactjs/react.dev` — introducing-react-dev.md

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

### Snippet 3: Declare State Variable with useState
Source: `reactjs/react.dev` — learn/index.md

```javascript
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
}
```

### Snippet 4: State — a component's memory
Source: `reactjs/react.dev` — adding-interactivity.md

> You can add state to a component with a `useState` Hook. Hooks are special functions that let your components use React features. The `useState` Hook lets you declare a state variable. It takes the initial state and returns a pair of values: the current state, and a state setter function that lets you update it.

## 6. Conclusion

Context7 MCP server (v2.1.6) is **installed, running, and fully operational**. Both tools (`resolve-library-id` and `query-docs`) successfully returned valid responses with real documentation content from the React library.