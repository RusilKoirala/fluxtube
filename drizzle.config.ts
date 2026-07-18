import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'libsql://moviee-rusil.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQzNTY2OTEsImlkIjoiMDE5ZjczZjAtNTAwMS03NmFiLTg3NDUtZTJjM2Q4ZWE5OTAxIiwia2lkIjoiY1FJT2VnTWRPb1A0eEM0X1VGV2lrTTZUMjE2QjF4dnc5eGRCZFlNcG1LRSIsInJpZCI6IjM2YWU1NWMzLTgzODEtNDgyMC05NGZhLTczMTUyYzhlZDRhOCJ9.8nY_G-QDvkwkZKnWzC_QfRZLfjKQ0TZ68W-McUxNfCXh_tpQi1nDF8090wYLoyey7urwKn7-xJcPqd8EYJ4IDg',
  },
});
