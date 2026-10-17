import { describe, it, expect } from 'vitest';
import { newDb } from 'pg-mem';
import fs from 'fs';
import path from 'path';

describe('Database Migrations (PostgreSQL Engine Verification)', () => {
  it('executes Migration 001 (Core Schema) cleanly in pg-mem', () => {
    const memDb = newDb();
    memDb.public.registerFunction({
      name: 'gen_random_uuid',
      implementation: () => crypto.randomUUID(),
    });
    
    // Read Migration 001
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261017000001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // pg-mem doesn't simulate GRANT/REVOKE syntax by default, so we remove those two lines for schema DDL verification
    const ddl = sql
      .split('\n')
      .filter((line) => !line.trim().startsWith('REVOKE') && !line.trim().startsWith('GRANT'))
      .join('\n');

    expect(() => {
      memDb.public.none(ddl);
    }).not.toThrow();

    // Verify tables exist
    const tables = memDb.public.many(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `);
    const tableNames = tables.map((t: any) => t.table_name);
    
    expect(tableNames).toContain('organizations');
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('organization_memberships');
    expect(tableNames).toContain('parent_guardian_links');
    expect(tableNames).toContain('classrooms');
    expect(tableNames).toContain('classroom_enrollments');
    expect(tableNames).toContain('courses');
    expect(tableNames).toContain('labs');
    expect(tableNames).toContain('assignments');
    expect(tableNames).toContain('submissions');
    expect(tableNames).toContain('audit_events');
  });

  it('enforces table foreign key constraints and check constraints in pg-mem', () => {
    const memDb = newDb();
    memDb.public.registerFunction({
      name: 'gen_random_uuid',
      implementation: () => crypto.randomUUID(),
    });
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261017000001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    const ddl = sql
      .split('\n')
      .filter((line) => !line.trim().startsWith('REVOKE') && !line.trim().startsWith('GRANT'))
      .join('\n');
    memDb.public.none(ddl);

    // 1. Insert organization
    const org = memDb.public.one(`
      INSERT INTO organizations (name, slug, org_type) 
      VALUES ('Delhi Public Tech School', 'dpts-delhi', 'school')
      RETURNING id;
    `);
    expect(org.id).toBeDefined();

    // 2. Reject invalid org_type via CHECK constraint
    expect(() => {
      memDb.public.none(`
        INSERT INTO organizations (name, slug, org_type)
        VALUES ('Bad Org', 'bad-slug', 'invalid_type');
      `);
    }).toThrow();

    // 3. Insert User
    const user = memDb.public.one(`
      INSERT INTO users (email, full_name, date_of_birth, is_minor, account_status)
      VALUES ('student@dpts.edu', 'Aarav Patel', '2010-08-20', true, 'active')
      RETURNING id;
    `);
    expect(user.id).toBeDefined();

    // 4. Reject duplicate email (UNIQUE constraint)
    expect(() => {
      memDb.public.none(`
        INSERT INTO users (email, full_name, date_of_birth)
        VALUES ('student@dpts.edu', 'Clone Patel', '2010-08-20');
      `);
    }).toThrow();

    // 5. Insert organization membership with foreign keys
    const mem = memDb.public.one(`
      INSERT INTO organization_memberships (organization_id, user_id, role)
      VALUES ('${org.id}', '${user.id}', 'learner')
      RETURNING id;
    `);
    expect(mem.id).toBeDefined();

    // 6. Enforce Foreign Key (non-existent org)
    expect(() => {
      memDb.public.none(`
        INSERT INTO organization_memberships (organization_id, user_id, role)
        VALUES ('00000000-0000-0000-0000-000000000000', '${user.id}', 'learner');
      `);
    }).toThrow();
  });
});
