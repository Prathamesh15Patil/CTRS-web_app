import { neon } from '@neondatabase/serverless';

export const sql = neon(
  'postgresql://neondb_owner:npg_0a4lThCtJDRd@ep-nameless-rice-amuvg9q7-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require'
);
