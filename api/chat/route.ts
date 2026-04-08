// Deprecated duplicate API route. This file is intentionally left blank to avoid conflict with src/app/api/chat/route.ts.
export async function GET() {
  return new Response(JSON.stringify({ error: "Deprecated route" }), { status: 410 });
}
export async function POST() {
  return new Response(JSON.stringify({ error: "Deprecated route" }), { status: 410 });
}
