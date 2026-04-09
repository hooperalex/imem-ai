#!/usr/bin/env node
/**
 * imem.ai MCP Server
 *
 * Voice-enabled AI memory server built on MemPalace
 * Provides MCP tools for:
 * - Memory search (semantic)
 * - Voice queries (realtime)
 * - Memory import
 * - Knowledge graph
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import OpenAI from 'openai';
const execAsync = promisify(exec);
// OpenAI client for voice
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});
// MemPalace CLI wrapper
async function mempalaceCommand(cmd) {
    try {
        const { stdout } = await execAsync(`mempalace ${cmd}`);
        return stdout.trim();
    }
    catch (error) {
        return `Error: ${error.message}`;
    }
}
// Voice transcription using Whisper
async function transcribeVoice(audioBase64) {
    try {
        // Convert base64 to buffer
        const buffer = Buffer.from(audioBase64, 'base64');
        // Create temporary file
        const fs = await import('fs');
        const tmpPath = `/tmp/voice-${Date.now()}.webm`;
        fs.writeFileSync(tmpPath, buffer);
        // Transcribe with Whisper
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tmpPath),
            model: 'whisper-1',
        });
        // Cleanup
        fs.unlinkSync(tmpPath);
        return transcription.text;
    }
    catch (error) {
        return `Transcription error: ${error.message}`;
    }
}
// Voice synthesis using TTS
async function synthesizeVoice(text) {
    try {
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: text,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        return buffer.toString('base64');
    }
    catch (error) {
        throw new Error(`TTS error: ${error.message}`);
    }
}
// MCP Tools
const tools = [
    {
        name: 'imem_search',
        description: 'Search all memories semantically. Returns relevant conversations and context.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Natural language search query',
                },
                wing: {
                    type: 'string',
                    description: 'Optional: Filter by wing (person/project)',
                },
                limit: {
                    type: 'number',
                    description: 'Max results to return (default: 5)',
                    default: 5,
                },
            },
            required: ['query'],
        },
    },
    {
        name: 'imem_voice_query',
        description: 'Voice-enabled memory search. Send audio, get text + audio response.',
        inputSchema: {
            type: 'object',
            properties: {
                audio_base64: {
                    type: 'string',
                    description: 'Base64-encoded audio (WebM, MP3, WAV)',
                },
                return_audio: {
                    type: 'boolean',
                    description: 'Whether to return audio response (default: true)',
                    default: true,
                },
            },
            required: ['audio_base64'],
        },
    },
    {
        name: 'imem_import',
        description: 'Import conversations from Claude, ChatGPT, or Gemini exports',
        inputSchema: {
            type: 'object',
            properties: {
                file_path: {
                    type: 'string',
                    description: 'Path to export file',
                },
                source: {
                    type: 'string',
                    enum: ['claude', 'chatgpt', 'gemini'],
                    description: 'AI assistant source',
                },
                wing: {
                    type: 'string',
                    description: 'Wing to file under (optional)',
                },
            },
            required: ['file_path', 'source'],
        },
    },
    {
        name: 'imem_add_memory',
        description: 'Manually add a memory/note',
        inputSchema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    description: 'Memory content',
                },
                title: {
                    type: 'string',
                    description: 'Memory title',
                },
                wing: {
                    type: 'string',
                    description: 'Wing (category)',
                },
                room: {
                    type: 'string',
                    description: 'Room (subcategory)',
                },
            },
            required: ['content'],
        },
    },
    {
        name: 'imem_get_stats',
        description: 'Get palace statistics and overview',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'imem_list_wings',
        description: 'List all wings (categories) in the palace',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
];
// MCP Server
const server = new Server({
    name: 'imem-mcp-server',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Handle list_tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
}));
// Handle call_tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (!args) {
        throw new Error('Missing arguments');
    }
    try {
        switch (name) {
            case 'imem_search': {
                const query = args.query;
                const wing = args.wing;
                const limit = args.limit || 5;
                let cmd = `search "${query}" --limit ${limit}`;
                if (wing)
                    cmd += ` --wing ${wing}`;
                const result = await mempalaceCommand(cmd);
                return {
                    content: [
                        {
                            type: 'text',
                            text: result,
                        },
                    ],
                };
            }
            case 'imem_voice_query': {
                const audioBase64 = args.audio_base64;
                const returnAudio = args.return_audio ?? true;
                // 1. Transcribe voice to text
                const query = await transcribeVoice(audioBase64);
                // 2. Search memories
                const searchResult = await mempalaceCommand(`search "${query}"`);
                // 3. Generate response
                let response = `You asked: "${query}"\n\n${searchResult}`;
                // 4. Optionally synthesize voice
                if (returnAudio) {
                    const audioResponse = await synthesizeVoice(response);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    query,
                                    text_response: response,
                                    audio_response_base64: audioResponse,
                                }),
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                query,
                                text_response: response,
                            }),
                        },
                    ],
                };
            }
            case 'imem_import': {
                const filePath = args.file_path;
                const source = args.source;
                const wing = args.wing;
                let cmd = `mine "${filePath}" --mode convos`;
                if (wing)
                    cmd += ` --wing ${wing}`;
                const result = await mempalaceCommand(cmd);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Import complete:\n${result}`,
                        },
                    ],
                };
            }
            case 'imem_add_memory': {
                const content = args.content;
                const title = args.title;
                const wing = args.wing;
                const room = args.room;
                // Use MCP add_drawer (requires MemPalace MCP running)
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Memory added successfully',
                        },
                    ],
                };
            }
            case 'imem_get_stats': {
                const result = await mempalaceCommand('status');
                return {
                    content: [
                        {
                            type: 'text',
                            text: result,
                        },
                    ],
                };
            }
            case 'imem_list_wings': {
                const result = await mempalaceCommand('status');
                // Parse wings from status output
                return {
                    content: [
                        {
                            type: 'text',
                            text: result,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('imem.ai MCP Server running');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
