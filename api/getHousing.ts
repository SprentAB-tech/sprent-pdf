export const GET = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const id = params.get("id");
  const adminPassword = params.get("adminPassword");

  if (!process.env.ADMIN_SECRET || adminPassword !== process.env.ADMIN_SECRET) {
    return new Response("Unauthorized", { status: 403 });
  }

  return new Response(
    JSON.stringify({
      message: `Hello, housing! Let's look up ${id} with ${process.env.NOTION_SECRET}`,
      id,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
