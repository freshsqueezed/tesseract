# @freshsqueezed/tesseract

**Tesseract** is a lightweight, modular TypeScript framework for building intelligent, LLM-powered agents using tasks, tools, flows, and memory.

Built for flexibility and developer joy — with zero magic.

---

## ✨ Features

- ✅ Minimal, composable architecture
- 🧩 Flows of typed \`Task\`s for reasoning and logic
- 🔧 Plug-and-play \`Tool\`s (API integrations, logic modules)
- 🧠 Memory system (in-memory or pluggable)
- 🤖 LLM abstraction with OpenAI support out of the box
- 💡 Natural \`agent.run('do something')\` interface
- 📦 Fully typed, framework-agnostic

---

## 📦 Installation

```bash
npm install @freshsqueezed/tesseract

# or

yarn add @freshsqueezed/tesseract
```

---

## 🚀 Quick Start

### 1. Define a Tool

```ts
import { Tool } from '@freshsqueezed/tesseract';
import { z } from 'zod';
import { google } from 'googleapis';

// --- Action Enum ---
export enum CalendarAction {
  CheckAvailability = 'checkAvailability',
  CreateEvent = 'createEvent',
}

// --- Google Calendar OAuth2 Setup ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
);

oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN!,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// --- Payload Schemas ---

const CheckAvailabilityPayload = z.object({
  action: z.literal(CalendarAction.CheckAvailability),
  payload: z.object({
    date: z.string(), // YYYY-MM-DD
    time: z.string(), // HH:mm
    durationMinutes: z.number().default(30),
  }),
});

const CreateEventPayload = z.object({
  action: z.literal(CalendarAction.CreateEvent),
  payload: z.object({
    title: z.string(),
    date: z.string(),
    time: z.string(),
    durationMinutes: z.number().default(30),
    attendees: z.array(z.string()).optional(),
  }),
});

// --- Combined Input Schema ---
const CalendarRequestSchema = z.union([
  CheckAvailabilityPayload,
  CreateEventPayload,
]);

// --- Inferred Input Type ---
export type CalendarRequest = z.infer<typeof CalendarRequestSchema>;

// --- Tool Implementation ---

export const calendarTool = new Tool<CalendarRequest, any>({
  name: 'google_calendar',
  description: 'Check availability and create events with Google Calendar',
  variables: CalendarRequestSchema,
  handler: async ({ input }) => {
    switch (input.action) {
      case CalendarAction.CheckAvailability: {
        const { date, time, durationMinutes } = input.payload;
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + durationMinutes * 60_000);

        const res = await calendar.freebusy.query({
          requestBody: {
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            items: [{ id: 'primary' }],
          },
        });

        const busy = res.data.calendars?.primary?.busy ?? [];
        return { available: busy.length === 0 };
      }

      case CalendarAction.CreateEvent: {
        const { title, date, time, durationMinutes, attendees } = input.payload;
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + durationMinutes * 60_000);

        const event = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: title,
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() },
            attendees: attendees?.map((email) => ({ email })) ?? [],
          },
        });

        return {
          status: 'success',
          eventId: event.data.id,
          htmlLink: event.data.htmlLink,
        };
      }

      default:
        throw new Error(`Unhandled action: ${input.action}`);
    }
  },
});
```

---

### 2. Define Tasks

```ts
import { Task } from '@freshsqueezed/tesseract';

const extractDetails = new Task({
  name: 'extract_details',
  description: 'Parse natural language into event data',
  systemPrompt: 'Extract event details and return JSON',
  handler: async ({ input, context }) => {
    const result = await context.llm.generate(context.taskPrompt!, input);
    return JSON.parse(result);
  },
});

const createEvent = new Task({
  name: 'create_event',
  description: 'Create a calendar event',
  handler: async ({ input, context }) => {
    return context.getTool('google_calendar').run({
      action: 'createEvent',
      payload: input,
    });
  },
});
```

---

### 3. Compose a Flow

```ts
import { Flow } from '@freshsqueezed/tesseract';

const scheduleFlow = new Flow('default', [extractDetails, createEvent]);
```

---

### 4. Create the Agent

```ts
import {
  Agent,
  Context,
  LLM,
  InMemoryCache,
  Flow,
  ToolRegistry,
} from '@freshsqueezed/tesseract';

const context = new Context({
  llm: new LLM({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4o',
    temperature: 0.1,
    systemPrompt: 'You are a helpful scheduling assistant.',
  }),
  memory: new InMemoryCache(),
  tools: new ToolRegistry({
    google_calendar: calendarTool,
  }),
  config: { debug: true },
});

const agent = new Agent({
  name: 'Schedule Assistant',
  description: 'Helps schedule events via natural language.',
  context,
  flows: [scheduleFlow],
});

await agent.run('Schedule lunch with Sam at noon tomorrow');
```

---

## 🧠 Core Concepts

| Concept        | Description                                        |
| -------------- | -------------------------------------------------- |
| `Tool`         | An encapsulated capability (e.g. calendar API)     |
| `Task`         | A logical unit of reasoning or action              |
| `Flow`         | A sequence of tasks with shared context            |
| `Agent`        | The orchestrator that holds memory, LLM, and flows |
| `Context`      | Runtime environment passed to every task           |
| `LLM`          | Abstraction over OpenAI-compatible LLMs            |
| `Memory`       | Key-value store (in-memory or pluggable)           |
| `ToolRegistry` | Lookup tools by name with type safety              |

---

## 🧪 Built-in Memory (Pluggable)

```ts
import { InMemoryCache } from '@freshsqueezed/tesseract';

const memory = new InMemoryCache();
await memory.set('last_event', { title: 'Lunch' });
```

---

## 🔌 LLM Provider Support

- ✅ OpenAI (default)
- 🔜 Anthropic, Local, Custom (via plugin)

---

## 📁 Recommended Project Structure

```
src/
├── agents/
│ └── scheduleAgent.ts
├── tasks/
│ ├── extractDetails.ts
│ └── createEvent.ts
├── tools/
│ └── calendarTool.ts
```

---

## 🛠️ Extending

- Build custom memory (e.g. Redis, Pinecone)
- Create new LLM backends (just implement \`LLMProvider\`)
- Add your own \`ToolRegistry\` methods (\`.list()\`, \`.has()\`, etc.)
- Write reusable \`Flow\` libraries for your use cases

---

## 📣 Feedback or Contributions

> DM us or contribute on GitHub:  
> https://github.com/freshsqueezed/tesseract

We’re building this to be the **SvelteKit of AI agents** — focused, flexible, and delightful.

---
