# 🧠 Tesseract — Tool-Using AI Agent Framework

Tesseract is a lightweight agent framework for building AI assistants powered by OpenAI's function calling and tool use APIs. It's designed to make tool-augmented reasoning simple, modular, and expressive — whether you're working with a single tool or a full suite.

---

## 📦 Installation

```bash
npm install @freshsqueezed/tesseract
```

---

## 🚀 Quickstart

```ts
import 'dotenv/config';
import {
  Agent,
  Data,
  InMemoryStore,
  LLM,
  Context,
  ToolRegistry,
} from '@freshsqueezed/tesseract';
import { JSONFilePreset } from 'lowdb/node';
import { dadJoke, generateImage, reddit } from './tools';

const main = async () => {
  const defaultData: Data = { messages: [] };

  const db = await JSONFilePreset('db.json', defaultData);

  const agent = new Agent({
    name: 'Joe',
    description: 'Average Joe AI assistant',
    context: new Context({
      llm: new LLM({
        model: 'gpt-4o-mini',
      }),
      registry: new ToolRegistry({
        tools: [dadJoke, reddit, generateImage],
      }),
      store: new InMemoryStore({
        db,
      }),
    }),
  });

  const response = await agent.run(
    'Make me a meme image from a random dad joke',
  );

  console.log(response?.pop());
};

main();
```

---

## 🛠 Define Your Tools

Here's an example tool that uses OpenAI's image generation:

```ts
import { Tool } from '@freshsqueezed/tesseract';
import * as z from 'zod';

export const generateImage = new Tool({
  name: 'generate_image',
  description: 'Generate an image.',
  parameters: z.object({
    prompt: z.string().describe('Prompt for the image generation.'),
    reasoning: z.string().describe('Why this tool was selected.'),
  }),
  handler: async ({ toolArgs, context }) => {
    const response = await context.llm.generateImage({
      model: 'dall-e-3',
      prompt: toolArgs.prompt,
      n: 1,
      size: '1024x1024',
    });

    return response.data[0].url;
  },
});
```

---

## 💾 Memory & Storage

Tesseract supports multiple memory backends. This example uses `lowdb` for persistent storage via `InMemoryStore`.

---

## 🧪 Coming Soon

- Web tool runners
- Built-in search, summarization, image parsing tools
- CLI and REPL interface

---

Made with 🍊 by Fresh Squeezed Labs
