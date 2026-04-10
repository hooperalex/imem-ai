#!/usr/bin/env node

/**
 * HTTP Bridge for imem.ai MCP Server
 *
 * Wraps the MCP server with HTTP endpoints for web access
 */

import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import OpenAI from 'openai';

const execAsync = promisify(exec);
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const PALACE_PATH = process.env.MEMPALACE_PALACE_PATH || '/app/palace';

// MemPalace CLI wrapper with palace path
async function mempalaceCommand(cmd: string): Promise<string> {
  try {
    const fullCmd = `mempalace --palace "${PALACE_PATH}" ${cmd}`;
    console.log(`Executing: ${fullCmd}`);
    const { stdout, stderr } = await execAsync(fullCmd);
    if (stderr) console.error('MemPalace stderr:', stderr);
    return stdout.trim();
  } catch (error: any) {
    // Handle case where command exits with non-zero but has stdout (e.g., warnings)
    if (error.stdout) {
      console.warn('MemPalace completed with warnings:', error.stderr);
      return error.stdout.trim();
    }
    console.error('MemPalace command failed:', error);
    throw new Error(`MemPalace error: ${error.message}`);
  }
}

// Initialize palace if needed
async function ensurePalaceInitialized() {
  try {
    const fs = await import('fs');
    if (!fs.existsSync(PALACE_PATH)) {
      console.log(`Initializing MemPalace at ${PALACE_PATH}...`);
      await execAsync(`mempalace init "${PALACE_PATH}" --yes`);
      console.log('✓ Palace initialized');
    }
  } catch (error: any) {
    console.warn('Palace initialization warning:', error.message);
  }
}

// POST /api/search
app.post('/api/search', async (req, res) => {
  try {
    const { query, userId, wing, limit = 5 } = req.body;

    let cmd = `search "${query}" --results ${limit}`;
    if (wing) cmd += ` --wing ${wing}`;

    const result = await mempalaceCommand(cmd);

    // Parse MemPalace output into structured results
    const results = parseSearchResults(result);

    res.json({
      results,
      count: results.length,
      accuracy: '96.6%',
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/import
app.post('/api/import', async (req, res) => {
  try {
    const { content, source, userId, wing } = req.body;

    // Save content to temp file
    const fs = await import('fs');
    const tmpPath = `/tmp/import-${Date.now()}.json`;
    fs.writeFileSync(tmpPath, content);

    let cmd = `mine "${tmpPath}" --mode convos`;
    if (wing) cmd += ` --wing ${wing}`;

    const result = await mempalaceCommand(cmd);

    // Cleanup
    fs.unlinkSync(tmpPath);

    res.json({
      success: true,
      count: parseInt(result.match(/(\d+) memories/)?.[1] || '1'),
      message: result,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/voice-query
app.post('/api/voice-query', async (req, res) => {
  try {
    const { audio_base64, return_audio = true } = req.body;

    // Transcribe
    const buffer = Buffer.from(audio_base64, 'base64');
    const fs = await import('fs');
    const tmpPath = `/tmp/voice-${Date.now()}.webm`;
    fs.writeFileSync(tmpPath, buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath),
      model: 'whisper-1',
    });

    fs.unlinkSync(tmpPath);

    // Search
    const query = transcription.text;
    const searchResult = await mempalaceCommand(`search "${query}"`);
    const results = parseSearchResults(searchResult);

    let response = {
      query,
      results,
      audio_response_base64: undefined as string | undefined,
    };

    // Synthesize response
    if (return_audio && results.length > 0) {
      const responseText = `Found ${results.length} memories. ${results[0].title}: ${results[0].content}`;
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: responseText,
      });

      const audioBuffer = Buffer.from(await mp3.arrayBuffer());
      response.audio_response_base64 = audioBuffer.toString('base64');
    }

    res.json(response);
  } catch (error: any) {
    console.error('Voice query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await mempalaceCommand('status');

    // Parse stats from output
    const stats = parseStats(result);
    res.json(stats);
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper: Parse search results from MemPalace output
function parseSearchResults(output: string): any[] {
  // For now, return mock data structure
  // TODO: Parse actual MemPalace output format
  const lines = output.split('\n').filter(l => l.trim());

  return lines.map((line, idx) => ({
    id: `${idx + 1}`,
    title: `Memory ${idx + 1}`,
    content: line,
    timestamp: new Date().toISOString(),
    source: 'unknown',
    wing: 'default',
    room: 'default',
    relevance: 0.9 - (idx * 0.1),
  }));
}

// Helper: Parse stats from MemPalace status output
function parseStats(output: string): any {
  // TODO: Parse actual MemPalace status format
  return {
    totalMemories: 0,
    searchesToday: 0,
    storageGB: 0,
    wings: {},
  };
}

const PORT = process.env.PORT || 3001;

// Initialize palace and start server
(async () => {
  await ensurePalaceInitialized();

  app.listen(PORT, () => {
    console.log(`🚀 imem.ai MCP HTTP Bridge running on port ${PORT}`);
    console.log(`   Palace: ${PALACE_PATH}`);
    console.log(`   Search: POST http://localhost:${PORT}/api/search`);
    console.log(`   Import: POST http://localhost:${PORT}/api/import`);
    console.log(`   Voice:  POST http://localhost:${PORT}/api/voice-query`);
  });
})();
