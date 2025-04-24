# @freshsqueezed/tesseract

**Tesseract** is a lightweight, modular TypeScript framework for building intelligent, LLM-powered agents using tasks, tools, flows, and memory.

---

## 🚀 Example Usage

```ts
import 'dotenv/config';
import z from 'zod';
import {
  Agent,
  Data,
  InMemoryStore,
  LLM,
  Context,
  Tool,
  ToolRegistry,
} from '@freshsqueezed/tesseract';
import { JSONFilePreset } from 'lowdb/node';

const db = await JSONFilePreset('db.json', {
  messages: [],
} as Data);

const store = new InMemoryStore({ db });

const registry = new ToolRegistry({
  get_weather: new Tool({
    name: 'get_weather',
    description: 'use this tool to get the weather.',
    parameters: z.object({
      reasoning: z.string().describe('Why did you pick this tool?'),
    }),
    handler: async () => {
      return 'Hot, 90 deg';
    },
  }),
});

const llm = new LLM({
  model: 'gpt-4o-mini',
});

const agent = new Agent({
  name: 'Joe',
  description: 'Average Joe AI assistant',
  context: new Context({
    llm,
    store,
    registry,
  }),
});

const response = await agent.run('Hows the weather in CO?');

console.log(response?.pop());

// response:
// {
//   role: 'assistant',
//   content: 'The current weather in Colorado is hot, with a temperature of 90 degrees. If you need more specific information or a forecast, let me know!',
//   refusal: null,
//   annotations: []
// }
```

---

## 🧩 Key Concepts

- **Agent**: The core loop that handles reasoning, tool use, and message flow.
- **Tool**: A callable function the agent can use (e.g., weather API, calculator).
- **ToolRegistry**: A collection of available tools.
- **LLM**: The interface to the OpenAI model.
- **Store**: Memory storage to maintain conversation context.
- **Context**: Binds together the LLM, memory, and tools into a runtime environment.

---

## 📦 Installation

```bash
npm install @freshsqueezed/tesseract zod lowdb
```

Make sure to set your OpenAI API key in an `.env` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

---

## ✍️ Authoring Your Own Tools

You can create tools by defining:

- A `name`
- A `description`
- A `zod` schema for `parameters`
- An `async handler` function

Tools will be selected by the LLM automatically based on input intent.

---

## 🧠 Memory

The memory system can persist messages using `lowdb` or any other backend. This helps keep track of context across turns.

---

## 🛠️ Development

- Node.js 18+ recommended
- Uses native `fetch` for API calls
- Fully ESM compatible

---

## 🧪 Example Output

```
Executing: get_weather
Executed: get_weather
The weather in NY is: Hot, 90 deg.
```
