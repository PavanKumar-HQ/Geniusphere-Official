-- ====================================================================
-- Geniusphere — Migration 003: Hardened RLS Helpers & Complete Policies
-- Complete executable USING and WITH CHECK policies for all 11 tables
-- ====================================================================

-- 1. Check Organization Role with Active Invariant
CREATE OR REPLACE FUNCTION public.has_org_role(target_org_id UUID, required_role VARCHAR)
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.organization_memberships om
        JOIN public.organizations o ON o.id = om.organization_id
        WHERE om.organization_id = target_org_id 
          AND om.user_id = auth.uid() 
          AND om.role = required_role
          AND om.is_active = TRUE
          AND o.is_active = TRUE
    );
END;
$$;
ALTER FUNCTION public.has_org_role(UUID, VARCHAR) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.has_org_role(UUID, VARCHAR) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_org_role(UUID, VARCHAR) TO authenticated, service_role;

-- 2. Check Classroom Teacher Authority
CREATE OR REPLACE FUNCTION public.is_classroom_teacher(target_class_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.classrooms c
        WHERE c.id = target_class_id 
          AND c.teacher_id = auth.uid()
          AND c.is_active = TRUE
    );
END;
$$;
ALTER FUNCTION public.is_classroom_teacher(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_classroom_teacher(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_classroom_teacher(UUID) TO authenticated, service_role;

-- 3. Check Classroom Enrollment
CREATE OR REPLACE FUNCTION public.is_enrolled_student(target_class_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.classroom_enrollments ce
        JOIN public.classrooms c ON c.id = ce.classroom_id
        WHERE ce.classroom_id = target_class_id 
          AND ce.student_id = auth.uid()
          AND c.is_active = TRUE
    );
END;
$$;
ALTER FUNCTION public.is_enrolled_student(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_enrolled_student(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_enrolled_student(UUID) TO authenticated, service_role;

-- 4. Check Verified Guardian Authority
CREATE OR REPLACE FUNCTION public.is_verified_parent(target_student_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.parent_guardian_links pgl
        WHERE pgl.student_id = target_student_id 
          AND pgl.parent_user_id = auth.uid() 
          AND pgl.consent_status = 'verified'
    );
END;
$$;
ALTER FUNCTION public.is_verified_parent(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_verified_parent(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_verified_parent(UUID) TO authenticated, service_role;

-- 5. Check Teacher of Student Authority
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(target_student_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.classroom_enrollments ce
        JOIN public.classrooms c ON c.id = ce.classroom_id
        WHERE ce.student_id = target_student_id 
          AND c.teacher_id = auth.uid()
          AND c.is_active = TRUE
    );
END;
$$;
ALTER FUNCTION public.is_teacher_of_student(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_teacher_of_student(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_student(UUID) TO authenticated, service_role;

-- 6. Check Platform Superadmin Authority
CREATE OR REPLACE FUNCTION public.is_platform_superadmin()
RETURNS BOOLEAN LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.users u
        WHERE u.id = auth.uid() 
          AND u.is_superadmin = TRUE
    );
END;
$$;
ALTER FUNCTION public.is_platform_superadmin() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.is_platform_superadmin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_superadmin() TO authenticated, service_role;

-- ====================================================================
-- RLS POLICIES FOR ALL 11 TABLES
-- ====================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_guardian_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- 1. ORGANIZATIONS
DROP POLICY IF EXISTS org_select ON public.organizations;
CREATE POLICY org_select ON public.organizations FOR SELECT TO authenticated
USING (is_active = TRUE OR public.is_platform_superadmin());

DROP POLICY IF EXISTS org_insert ON public.organizations;
CREATE POLICY org_insert ON public.organizations FOR INSERT TO authenticated
WITH CHECK (public.is_platform_superadmin());

DROP POLICY IF EXISTS org_update ON public.organizations;
CREATE POLICY org_update ON public.organizations FOR UPDATE TO authenticated
USING (public.has_org_role(id, 'institution_admin') OR public.is_platform_superadmin())
WITH CHECK (public.has_org_role(id, 'institution_admin') OR public.is_platform_superadmin());

DROP POLICY IF EXISTS org_delete ON public.organizations;
CREATE POLICY org_delete ON public.organizations FOR DELETE TO authenticated
USING (public.is_platform_superadmin());

-- 2. USERS
DROP POLICY IF EXISTS users_select ON public.users;
CREATE POLICY users_select ON public.users FOR SELECT TO authenticated
USING (
    id = auth.uid() 
    OR public.is_teacher_of_student(id)
    OR public.is_verified_parent(id)
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS users_update ON public.users;
CREATE POLICY users_update ON public.users FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.is_platform_superadmin())
WITH CHECK (id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS users_insert ON public.users;
CREATE POLICY users_insert ON public.users FOR INSERT TO authenticated
WITH CHECK (public.is_platform_superadmin());

DROP POLICY IF EXISTS users_delete ON public.users;
CREATE POLICY users_delete ON public.users FOR DELETE TO authenticated
USING (public.is_platform_superadmin());

-- 3. ORGANIZATION MEMBERSHIPS
DROP POLICY IF EXISTS org_mem_select ON public.organization_memberships;
CREATE POLICY org_mem_select ON public.organization_memberships FOR SELECT TO authenticated
USING (
    user_id = auth.uid() 
    OR public.has_org_role(organization_id, 'institution_admin')
    OR public.has_org_role(organization_id, 'teacher')
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS org_mem_insert ON public.organization_memberships;
CREATE POLICY org_mem_insert ON public.organization_memberships FOR INSERT TO authenticated
WITH CHECK (
    public.has_org_role(organization_id, 'institution_admin')
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS org_mem_update ON public.organization_memberships;
CREATE POLICY org_mem_update ON public.organization_memberships FOR UPDATE TO authenticated
USING (
    public.has_org_role(organization_id, 'institution_admin')
    OR public.is_platform_superadmin()
)
WITH CHECK (
    public.has_org_role(organization_id, 'institution_admin')
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS org_mem_delete ON public.organization_memberships;
CREATE POLICY org_mem_delete ON public.organization_memberships FOR DELETE TO authenticated
USING (
    user_id = auth.uid() 
    OR public.has_org_role(organization_id, 'institution_admin')
    OR public.is_platform_superadmin()
);

-- 4. PARENT GUARDIAN LINKS
DROP POLICY IF EXISTS pgl_select ON public.parent_guardian_links;
CREATE POLICY pgl_select ON public.parent_guardian_links FOR SELECT TO authenticated
USING (student_id = auth.uid() OR parent_user_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS pgl_insert ON public.parent_guardian_links;
CREATE POLICY pgl_insert ON public.parent_guardian_links FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS pgl_update ON public.parent_guardian_links;
CREATE POLICY pgl_update ON public.parent_guardian_links FOR UPDATE TO authenticated
USING (parent_user_id = auth.uid() OR public.is_platform_superadmin())
WITH CHECK (parent_user_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS pgl_delete ON public.parent_guardian_links;
CREATE POLICY pgl_delete ON public.parent_guardian_links FOR DELETE TO authenticated
USING (public.is_platform_superadmin());

-- 5. CLASSROOMS
DROP POLICY IF EXISTS classrooms_select ON public.classrooms;
CREATE POLICY classrooms_select ON public.classrooms FOR SELECT TO authenticated
USING (
    teacher_id = auth.uid() 
    OR public.is_enrolled_student(id)
    OR public.has_org_role(organization_id, 'institution_admin')
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS classrooms_insert ON public.classrooms;
CREATE POLICY classrooms_insert ON public.classrooms FOR INSERT TO authenticated
WITH CHECK (
    (public.has_org_role(organization_id, 'teacher') AND teacher_id = auth.uid())
    OR public.has_org_role(organization_id, 'institution_admin')
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS classrooms_update ON public.classrooms;
CREATE POLICY classrooms_update ON public.classrooms FOR UPDATE TO authenticated
USING (teacher_id = auth.uid() OR public.has_org_role(organization_id, 'institution_admin') OR public.is_platform_superadmin())
WITH CHECK (teacher_id = auth.uid() OR public.has_org_role(organization_id, 'institution_admin') OR public.is_platform_superadmin());

DROP POLICY IF EXISTS classrooms_delete ON public.classrooms;
CREATE POLICY classrooms_delete ON public.classrooms FOR DELETE TO authenticated
USING (teacher_id = auth.uid() OR public.has_org_role(organization_id, 'institution_admin') OR public.is_platform_superadmin());

-- 6. CLASSROOM ENROLLMENTS
DROP POLICY IF EXISTS enroll_select ON public.classroom_enrollments;
CREATE POLICY enroll_select ON public.classroom_enrollments FOR SELECT TO authenticated
USING (
    student_id = auth.uid() 
    OR public.is_classroom_teacher(classroom_id)
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS enroll_insert ON public.classroom_enrollments;
CREATE POLICY enroll_insert ON public.classroom_enrollments FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() OR public.is_classroom_teacher(classroom_id) OR public.is_platform_superadmin());

DROP POLICY IF EXISTS enroll_delete ON public.classroom_enrollments;
CREATE POLICY enroll_delete ON public.classroom_enrollments FOR DELETE TO authenticated
USING (student_id = auth.uid() OR public.is_classroom_teacher(classroom_id) OR public.is_platform_superadmin());

-- 7. COURSES
DROP POLICY IF EXISTS courses_select ON public.courses;
CREATE POLICY courses_select ON public.courses FOR SELECT TO authenticated
USING (is_published = TRUE OR public.is_platform_superadmin());

DROP POLICY IF EXISTS courses_insert ON public.courses;
CREATE POLICY courses_insert ON public.courses FOR INSERT TO authenticated
WITH CHECK (public.is_platform_superadmin());

DROP POLICY IF EXISTS courses_update ON public.courses;
CREATE POLICY courses_update ON public.courses FOR UPDATE TO authenticated
USING (public.is_platform_superadmin())
WITH CHECK (public.is_platform_superadmin());

DROP POLICY IF EXISTS courses_delete ON public.courses;
CREATE POLICY courses_delete ON public.courses FOR DELETE TO authenticated
USING (public.is_platform_superadmin());

-- 8. LABS
DROP POLICY IF EXISTS labs_select ON public.labs;
CREATE POLICY labs_select ON public.labs FOR SELECT TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published = TRUE)
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS labs_insert ON public.labs;
CREATE POLICY labs_insert ON public.labs FOR INSERT TO authenticated
WITH CHECK (public.is_platform_superadmin());

DROP POLICY IF EXISTS labs_update ON public.labs;
CREATE POLICY labs_update ON public.labs FOR UPDATE TO authenticated
USING (public.is_platform_superadmin())
WITH CHECK (public.is_platform_superadmin());

DROP POLICY IF EXISTS labs_delete ON public.labs;
CREATE POLICY labs_delete ON public.labs FOR DELETE TO authenticated
USING (public.is_platform_superadmin());

-- 9. ASSIGNMENTS
DROP POLICY IF EXISTS assign_select ON public.assignments;
CREATE POLICY assign_select ON public.assignments FOR SELECT TO authenticated
USING (
    public.is_enrolled_student(classroom_id) 
    OR public.is_classroom_teacher(classroom_id)
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS assign_insert ON public.assignments;
CREATE POLICY assign_insert ON public.assignments FOR INSERT TO authenticated
WITH CHECK (public.is_classroom_teacher(classroom_id) OR public.is_platform_superadmin());

DROP POLICY IF EXISTS assign_update ON public.assignments;
CREATE POLICY assign_update ON public.assignments FOR UPDATE TO authenticated
USING (public.is_classroom_teacher(classroom_id) OR public.is_platform_superadmin())
WITH CHECK (public.is_classroom_teacher(classroom_id) OR public.is_platform_superadmin());

DROP POLICY IF EXISTS assign_delete ON public.assignments;
CREATE POLICY assign_delete ON public.assignments FOR DELETE TO authenticated
USING (public.is_classroom_teacher(classroom_id) OR public.is_platform_superadmin());

-- 10. SUBMISSIONS
DROP POLICY IF EXISTS sub_select ON public.submissions;
CREATE POLICY sub_select ON public.submissions FOR SELECT TO authenticated
USING (
    student_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND public.is_classroom_teacher(a.classroom_id))
    OR public.is_verified_parent(student_id)
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS sub_insert ON public.submissions;
CREATE POLICY sub_insert ON public.submissions FOR INSERT TO authenticated
WITH CHECK (
    student_id = auth.uid() 
    AND EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND public.is_enrolled_student(a.classroom_id))
);

DROP POLICY IF EXISTS sub_update ON public.submissions;
CREATE POLICY sub_update ON public.submissions FOR UPDATE TO authenticated
USING (FALSE);

DROP POLICY IF EXISTS sub_delete ON public.submissions;
CREATE POLICY sub_delete ON public.submissions FOR DELETE TO authenticated
USING (FALSE);

-- 11. AUDIT EVENTS
DROP POLICY IF EXISTS audit_select ON public.audit_events;
CREATE POLICY audit_select ON public.audit_events FOR SELECT TO authenticated
USING (
    (organization_id IS NOT NULL AND public.has_org_role(organization_id, 'institution_admin'))
    OR public.is_platform_superadmin()
);

DROP POLICY IF EXISTS audit_insert ON public.audit_events;
CREATE POLICY audit_insert ON public.audit_events FOR INSERT TO authenticated
WITH CHECK (actor_id = auth.uid());

DROP POLICY IF EXISTS audit_update ON public.audit_events;
CREATE POLICY audit_update ON public.audit_events FOR UPDATE TO authenticated
USING (FALSE);

DROP POLICY IF EXISTS audit_delete ON public.audit_events;
CREATE POLICY audit_delete ON public.audit_events FOR DELETE TO authenticated
USING (FALSE);
