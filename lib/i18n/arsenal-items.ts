import type { StackItem } from "@/lib/i18n/types";

/* ---------------------------------------------------------------------------
 * The arsenal's contents, shared by every locale.
 *
 * Product names do not translate — « Rails » is Rails in French and in English
 * — and each one now carries an icon slug beside it. Duplicating the pair in
 * both dictionaries meant a stack added to one locale, or an icon fixed in one
 * locale, would silently drift from the other. The GROUP TITLES do translate,
 * so those stay in `fr.ts` / `en.ts`; only the items live here.
 *
 * `icon` is present only where an official mark exists: shipped by
 * `simple-icons`, vendored from the release that last carried it (AWS,
 * Heroku), or normalised from the brand's own published mark (Scalingo,
 * Langfuse) — all recorded in `scripts/gen-stack-icons.mjs`. OpenAI, pgvector,
 * RSpec and Llama have none, and none was drawn for them: `Arsenal.tsx`
 * renders those as label-only chips, which reads as a decision where a grey
 * placeholder square would read as a broken image.
 *
 * React Native points at `react` deliberately. Its official mark IS the React
 * atom — same shapes, same blue — so this is one brand with two names, not an
 * approximation standing in for a missing logo.
 * ------------------------------------------------------------------------ */

export const ARSENAL_ITEMS = {
  backend: [
    { label: "Rails", icon: "rubyonrails" },
    { label: "NestJS", icon: "nestjs" },
    { label: "FastAPI", icon: "fastapi" },
    { label: "Node.js", icon: "nodedotjs" },
    { label: "Sidekiq", icon: "sidekiq" },
    { label: "GraphQL", icon: "graphql" },
    { label: "RSpec" },
    { label: "Rubocop", icon: "rubocop" },
  ],
  data: [
    { label: "PostgreSQL", icon: "postgresql" },
    { label: "Redis", icon: "redis" },
  ],
  frontend: [
    { label: "Next.js", icon: "nextdotjs" },
    { label: "React", icon: "react" },
    { label: "TypeScript", icon: "typescript" },
    { label: "Tailwind CSS", icon: "tailwindcss" },
    { label: "MUI", icon: "mui" },
    { label: "shadcn/ui", icon: "shadcnui" },
  ],
  mobile: [
    { label: "React Native", icon: "react" },
    { label: "Expo", icon: "expo" },
  ],
  infra: [
    { label: "Scalingo", icon: "scalingo" },
    { label: "Heroku", icon: "heroku" },
    { label: "Vercel", icon: "vercel" },
    { label: "AWS", icon: "amazonwebservices" },
    { label: "Docker", icon: "docker" },
    { label: "GitHub Actions", icon: "githubactions" },
  ],
  llms: [
    { label: "OpenAI" },
    { label: "Anthropic", icon: "anthropic" },
    { label: "Mistral", icon: "mistralai" },
    { label: "Llama" },
  ],
  orchestration: [
    { label: "LangChain", icon: "langchain" },
    { label: "LangGraph", icon: "langgraph" },
    { label: "Langfuse", icon: "langfuse" },
    { label: "pgvector" },
  ],
  devtools: [
    { label: "Claude Code", icon: "claudecode" },
    { label: "Cursor", icon: "cursor" },
    { label: "MCP", icon: "modelcontextprotocol" },
  ],
} as const satisfies Record<string, readonly StackItem[]>;
