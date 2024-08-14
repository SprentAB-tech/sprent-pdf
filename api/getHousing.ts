function parseNotionPage(notionPage) {
  const properties = notionPage.properties;
  const parsedProperties = {};

  function parseProperty(property) {
    switch (property.type) {
      case "title":
      case "rich_text":
        return property[property.type].map((item) => item.plain_text).join(" ");
      case "number":
        return property.number;
      case "select":
        return property.select?.name || null;
      case "multi_select":
        return property.multi_select.map((item) => item.name);
      case "date":
        return property.date?.start || null;
      case "checkbox":
        return property.checkbox;
      case "url":
        return property.url;
      case "email":
        return property.email;
      case "phone_number":
        return property.phone_number;
      case "files":
        return property.files.map(
          (file) => file.file?.url || file.external?.url,
        );
      case "relation":
        return property.relation.map((item) => item.id);
      case "formula":
        return parseProperty({
          type: property.formula.type,
          [property.formula.type]: property.formula[property.formula.type],
        });
      case "rollup":
        return parseProperty({
          type: property.rollup.type,
          [property.rollup.type]: property.rollup[property.rollup.type],
        });
      case "people":
        return property.people.map((person) => ({
          id: person.id,
          name: person.name,
          avatar_url: person.avatar_url,
        }));
      case "created_time":
      case "last_edited_time":
        return property[property.type];
      case "created_by":
      case "last_edited_by":
        return {
          id: property[property.type].id,
          object: property[property.type].object,
        };
      default:
        console.warn(`Unknown property type: ${property.type}`);
        return null;
    }
  }

  for (const [key, value] of Object.entries(properties)) {
    parsedProperties[key] = parseProperty(value);
  }

  return {
    $metadata: {
      id: notionPage.id,
      created_time: notionPage.created_time,
      last_edited_time: notionPage.last_edited_time,
      created_by: notionPage.created_by,
      last_edited_by: notionPage.last_edited_by,
      cover: notionPage.cover,
      icon: notionPage.icon,
      parent: notionPage.parent,
      archived: notionPage.archived,
      url: notionPage.url,
    },
    ...parsedProperties,
  };
}

const updateNotionPage = (
  pageId: string,
  properties: { [key: string]: any },
) => {
  const apiKey = process.env.NOTION_SECRET;

  const url = `https://api.notion.com/v1/pages/${pageId}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };

  const data = {
    properties,
  };

  return fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  }).then((response) => response.json() as Promise<{ object: "page" }>);
};

// List all databases
async function listDatabases() {
  const response = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_SECRET}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      query: "Housings",
      filter: {
        value: "database",
        property: "object",
      },
    }),
  });

  return await response.json();
}

// Get one housing by "id"
async function getHousingById(databaseId, housingId) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_SECRET}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          or: [
            {
              property: "id",
              number: { equals: housingId },
            },
          ],
        },
      }),
    },
  );

  return await response.json();
}

export const GET = async (request: Request) => {
  const params = new URL(request.url).searchParams;
  const id = params.get("id");
  const adminPassword = params.get("adminPassword");

  if (!process.env.ADMIN_SECRET || adminPassword !== process.env.ADMIN_SECRET) {
    return new Response("Unauthorized", { status: 403 });
  }

  if (!id || isNaN(Number(id))) {
    return new Response("Invalid id", { status: 422 });
  }

  try {
    // List databases

    console.time("1");
    const databases = await listDatabases();
    console.timeEnd("1");

    // Assuming the first database in the results is the one we want
    if (databases.results && databases.results.length > 0) {
      const databaseId = databases.results[0].id;

      console.time("2");
      // Get housing with id 1525
      const housingList = await getHousingById(databaseId, Number(id));
      console.timeEnd("2");
      const firstHousing = housingList.results?.[0];

      if (firstHousing.object !== "page") {
        throw new Error("No housing found");
      }

      const result = parseNotionPage(firstHousing);

      return new Response(JSON.stringify({ result, firstHousing }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      throw new Error("No databases found");
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
};
