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

6. ✅ Create an access_token for Notion for sprent: https://developers.notion.com / https://www.notion.so/profile/integrations

7. ✅ Use https://www.actionschema.com/reference.html?openapiUrl=https://openapi.actionschema.com/notion.json#/operations/queryDatabase to retrieve the entire housing object.

8. ✅ Validate the media uploaded to Notion are accessible for us on the outside.

9. ✅ Validate the relations are accessible.

10. ✅ Validate that I can update a Media URL and also a Relation UUID based on an ID found. Use https://developers.notion.com/reference/patch-page

# Make PDF Renderer

🚫 Create Notion OpenAPI so I have an SDK for projects + housings + companies + people

- For prod
- For staging

Pull in the PDF renderer into the React app, making it standalone functional for the pulled-in housing object. Here, fix the images shown so they show nicely.
