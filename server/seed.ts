import { query, withTransaction } from './db';
import { ALL_CANONICAL_COURSES } from '../src/data/canonical-curriculum';
import { APPROVED_LABS } from '../src/data/approved-labs';

export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Checking and seeding initial production records...');

  await withTransaction(async (client) => {
    // 1. Organization: Delhi Public Tech School
    const orgRes = await client.query(`
      INSERT INTO public.organizations (name, slug, org_type, is_active)
      VALUES ('Delhi Public Tech School', 'dpts-delhi', 'school', TRUE)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
    `);
    const orgId = orgRes.rows[0].id;

    // 2. Canonical Users
    const usersToSeed = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'learner@geniusphere.tech',
        fullName: 'Pavan Kumar',
        dob: '2004-05-15',
        isMinor: false,
        isSuperadmin: false,
        role: 'learner',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'aarav.student@dpts.edu',
        fullName: 'Aarav Patel',
        dob: '2010-08-20',
        isMinor: true,
        isSuperadmin: false,
        role: 'learner',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'dr.sharma@dpts.edu',
        fullName: 'Dr. Sharma',
        dob: '1982-03-12',
        isMinor: false,
        isSuperadmin: false,
        role: 'teacher',
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'sunita.patel@gmail.com',
        fullName: 'Sunita Patel',
        dob: '1984-11-22',
        isMinor: false,
        isSuperadmin: false,
        role: 'guardian',
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'principal.verma@dpts.edu',
        fullName: 'Principal Verma',
        dob: '1975-01-09',
        isMinor: false,
        isSuperadmin: false,
        role: 'institution_admin',
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        email: 'admin@geniusphere.tech',
        fullName: 'Platform Superadmin',
        dob: '1990-01-01',
        isMinor: false,
        isSuperadmin: true,
        role: 'curriculum_author',
      },
    ];

    for (const u of usersToSeed) {
      await client.query(
        `INSERT INTO public.users (id, email, full_name, date_of_birth, is_minor, is_superadmin, account_status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')
         ON CONFLICT (email) DO UPDATE 
         SET full_name = EXCLUDED.full_name, is_superadmin = EXCLUDED.is_superadmin`,
        [u.id, u.email, u.fullName, u.dob, u.isMinor, u.isSuperadmin]
      );

      // Organization membership
      if (u.role !== 'guardian') {
        await client.query(
          `INSERT INTO public.organization_memberships (organization_id, user_id, role, is_active)
           VALUES ($1, $2, $3, TRUE)
           ON CONFLICT (organization_id, user_id, role) DO NOTHING`,
          [orgId, u.id, u.role]
        );
      }

      // Initialize user progress record
      await client.query(
        `INSERT INTO public.user_progress (user_id, xp, current_streak, last_active_at)
         VALUES ($1, 100, 3, NOW())
         ON CONFLICT (user_id) DO NOTHING`,
        [u.id]
      );
    }

    // 3. Parent-Guardian Link (Sunita Patel -> Aarav Patel)
    await client.query(
      `INSERT INTO public.parent_guardian_links (student_id, parent_user_id, parent_email, consent_status, consent_method)
       VALUES ($1, $2, $3, 'verified', 'school_proxy_pilot')
       ON CONFLICT (student_id, parent_email) DO NOTHING`,
      [
        '22222222-2222-2222-2222-222222222222',
        '44444444-4444-4444-4444-444444444444',
        'sunita.patel@gmail.com',
      ]
    );

    // 4. Canonical Courses
    const courseMap = new Map<string, string>(); // slug -> id
    for (const c of ALL_CANONICAL_COURSES) {
      const res = await client.query(
        `INSERT INTO public.courses (title, slug, domain, is_published)
         VALUES ($1, $2, $3, TRUE)
         ON CONFLICT (slug) DO UPDATE 
         SET title = EXCLUDED.title, is_published = TRUE
         RETURNING id, slug`,
        [c.title, c.slug, c.domain]
      );
      courseMap.set(res.rows[0].slug, res.rows[0].id);
    }

    // Default primary course for lab FK
    const defaultCourseId = courseMap.get('cybersecurity-basics') || Array.from(courseMap.values())[0];

    // 5. Approved Labs
    const labMap = new Map<string, string>();
    for (const l of APPROVED_LABS) {
      const res = await client.query(
        `INSERT INTO public.labs (course_id, title, lab_type, challenge_spec, max_score)
         VALUES ($1, $2, 'conceptual_quiz', $3, 100)
         RETURNING id, title`,
        [
          defaultCourseId,
          l.title,
          JSON.stringify({ slug: l.slug, difficulty: (l as any).difficulty_level || (l as any).difficulty || 'beginner' }),
        ]
      );
      labMap.set(l.slug, res.rows[0].id);
    }

    // 6. Classroom: Grade 10 Cybersecurity
    const classRes = await client.query(
      `INSERT INTO public.classrooms (organization_id, teacher_id, name, join_code, join_code_expires_at, is_active)
       VALUES ($1, $2, 'Grade 10 Cybersecurity', 'CYBER26X', NOW() + INTERVAL '180 days', TRUE)
       ON CONFLICT (join_code) DO UPDATE SET name = EXCLUDED.name
       RETURNING id;
      `,
      [orgId, '33333333-3333-3333-3333-333333333333']
    );

    const classroomId = classRes.rows[0]?.id;

    if (classroomId) {
      // Enroll Aarav in classroom
      await client.query(
        `INSERT INTO public.classroom_enrollments (classroom_id, student_id)
         VALUES ($1, $2)
         ON CONFLICT (classroom_id, student_id) DO NOTHING`,
        [classroomId, '22222222-2222-2222-2222-222222222222']
      );

      // Create Assignment: Defensive Web Security Lab
      const labId = Array.from(labMap.values())[0];
      if (labId) {
        const assignRes = await client.query(
          `INSERT INTO public.assignments (classroom_id, lab_id, due_date, max_score, max_attempts)
           VALUES ($1, $2, NOW() + INTERVAL '7 days', 100, 5)
           RETURNING id;
          `,
          [classroomId, labId]
        );

        const assignmentId = assignRes.rows[0]?.id;
        if (assignmentId) {
          // Create verified submission for Aarav
          await client.query(
            `INSERT INTO public.submissions (assignment_id, student_id, attempt_number, submitted_query, submission_hash, passed, score, sync_status)
             VALUES ($1, $2, 1, 'SELECT * FROM security_headers WHERE hsts = TRUE', 'hash_sec_aarav_95', TRUE, 95, 'SERVER_CONFIRMED')
             ON CONFLICT (assignment_id, student_id, attempt_number) DO NOTHING`,
            [assignmentId, '22222222-2222-2222-2222-222222222222']
          );
        }
      }
    }
  });

  console.log('[Seed] Production database seeding completed successfully');
}
