# imem.ai MCP Server

Voice-enabled AI memory server built on MemPalace. Provides MCP tools for semantic search, voice queries, and memory management.

## Features

- 🔍 **Semantic Search** - Natural language memory search
- 🎤 **Voice Queries** - Send audio, get text + audio responses
- 📥 **Import** - Claude, ChatGPT, Gemini exports
- 📊 **Stats** - Palace overview and analytics
- 🧠 **Built on MemPalace** - 96.6% recall accuracy

## Installation

```bash
npm install
npm run build
```

## Setup

1. Install MemPalace:
```bash
pip install mempalace
mempalace init ~/my-palace
```

2. Set OpenAI API key (for voice):
```bash
export OPENAI_API_KEY=sk-...
```

3. Add to Claude Code:
```bash
claude mcp add imem -- node /path/to/imem-mcp-server/build/index.js
```

## MCP Tools

### `imem_search`
Search memories semantically.

```json
{
  "query": "What did I decide about the API?",
  "wing": "projects",
  "limit": 5
}
```

### `imem_voice_query`
Voice-enabled search.

```json
{
  "audio_base64": "...",  // WebM, MP3, or WAV
  "return_audio": true
}
```

Returns:
```json
{
  "query": "transcribed text",
  "text_response": "search results",
  "audio_response_base64": "..."
}
```

### `imem_import`
Import conversation exports.

```json
{
  "file_path": "~/Downloads/claude_export.json",
  "source": "claude",
  "wing": "projects"
}
```

### `imem_add_memory`
Manually add a memory.

```json
{
  "content": "Decided to use PostgreSQL",
  "title": "Database choice",
  "wing": "projects",
  "room": "architecture"
}
```

### `imem_get_stats`
Get palace statistics.

### `imem_list_wings`
List all wings.

## Web UI

See `../imem-web` for the web interface that connects to this MCP server.

## iOS App

See `../imem-ios` for the iOS app (coming soon).

## Architecture

```
┌─────────────┐
│  imem.ai    │  Web / iOS
│    UI       │
└──────┬──────┘
       │
       v
┌─────────────┐
│  imem MCP   │  This server
│   Server    │  (Voice + Tools)
└──────┬──────┘
       │
       v
┌─────────────┐
│  MemPalace  │  Core memory engine
│  (Python)   │  (ChromaDB + SQLite)
└─────────────┘
```

## Development

```bash
npm run dev  # Watch mode
npm run build
npm start
```

## Environment Variables

```bash
OPENAI_API_KEY=sk-...           # For voice (Whisper + TTS)
MEMPALACE_PALACE_PATH=~/palace  # MemPalace path (optional)
```

## License

MIT
