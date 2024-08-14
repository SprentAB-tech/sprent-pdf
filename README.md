# Idea: Using a third party as a backoffice

Airtable can be talked to via an OpenAPI: https://github.com/TheF1rstPancake/AirtableOpenAPICustomBlock

Notion doesn't have this, but has great functionality: https://www.notion.so/b8a77a6b1ae144be992b6c59c2acbb3f?v=5eeb4cd3370f49fe9c9a00c5d1bb5c4c . If we'd have the same for notion (or just use Airtable) we can connect anything to notion and create our own frontend even!

The frontend would just be a thin layer with a "Sign In to Notion" loginwall in front. The frontend, however, not be the backoffice itself. This would be notion. However, it would allow to have API-coupled actions to fill datapoints, and allow for tools such as PDF creation.

TODO:

1. ✅ Convert all sprent data into CSVs or JSON (use Claude and Schema.md)

2. ✅ Import CSVs/JSON into the tables, either using CSV import (if it works) or through the API

3. ✅ Make a simple React + Vite + Vercel project (https://vercel.com/docs/frameworks/vite)

4. ✅ Add form prefilled with ?id=, to submit an ID and fetch the housing object, setting ?id=xxx as well

5. ✅ Deploy this at https://pdf.sprent.com with a secret admin password in front (later to be replaced with notion OAuth2)

6. Create an ActionSchema OAuth client for Notion: https://developers.notion.com

7. Get an access token for Sprent

8. Use https://www.actionschema.com/reference.html?openapiUrl=https://openapi.actionschema.com/notion.json#/operations/queryDatabase to retrieve the entire housing object

9. Validate the media uploaded to Notion are accessible for us on the outside.

10. Validate the relations are accessible.

11. Pull in the PDF renderer into the React app, making it standalone functional for the pulled in housing object.

# Notion Supabase Import

Convert relations into Notion relations: For each relation we had, use the Notion API and set the right Notion relation, two sided in most cases.

For now, do this manually just for Sprent (and prove it's possible in the first place)

OAuth2 with supabase turning it into a notion workspace and vice versa would be insanely useful.

# Notion OpenAPI Creator

Besides using my own Notion OpenAPI, every Notion Workspace deserves its own OpenAPI, so we can build a frontend to the CMS that is Notion. Take inspiration from https://github.com/TheF1rstPancake/AirtableOpenAPICustomBlock (Also test this)

Now I want Screenless to be linked with a webhook custom to Sprent (api.sprent.com/submitMeeting) that uses the Notion API to insert the meeting connected to the right person, company, etc.

# How to create a staging environment?

We can probably create a copy of the workspace as a test environment.
