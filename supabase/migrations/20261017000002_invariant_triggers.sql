-- ====================================================================
-- Geniusphere — Migration 002: Relational Invariant Triggers
-- Prevents last admin removal & enforces teacher-organization binding
-- ====================================================================

-- 1. Invariant Trigger: Prevent removal of the last institution_admin of an organization
CREATE OR REPLACE FUNCTION public.check_last_admin_removal()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    admin_count INTEGER;
BEGIN
    IF OLD.role = 'institution_admin' AND (TG_OP = 'DELETE' OR NEW.is_active = FALSE OR NEW.role != 'institution_admin') THEN
        SELECT COUNT(*) INTO admin_count
        FROM public.organization_memberships
        WHERE organization_id = OLD.organization_id 
          AND role = 'institution_admin' 
          AND is_active = TRUE 
          AND id != OLD.id;
          
        IF admin_count = 0 THEN
            RAISE EXCEPTION 'Cannot remove or deactivate the last active institution_admin of organization %', OLD.organization_id
            USING ERRCODE = '23514'; -- check_violation
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_last_admin_removal ON public.organization_memberships;
CREATE TRIGGER trg_prevent_last_admin_removal
BEFORE UPDATE OR DELETE ON public.organization_memberships
FOR EACH ROW EXECUTE FUNCTION public.check_last_admin_removal();

-- 2. Invariant Trigger: Verify teacher belongs to the classroom's organization with role 'teacher' or 'institution_admin'
CREATE OR REPLACE FUNCTION public.check_teacher_org_membership()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.organization_memberships
        WHERE organization_id = NEW.organization_id 
          AND user_id = NEW.teacher_id 
          AND role IN ('teacher', 'institution_admin')
          AND is_active = TRUE
    ) THEN
        RAISE EXCEPTION 'Classroom teacher % must be an active teacher or admin in organization %', NEW.teacher_id, NEW.organization_id
        USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_verify_classroom_teacher ON public.classrooms;
CREATE TRIGGER trg_verify_classroom_teacher
BEFORE INSERT OR UPDATE ON public.classrooms
FOR EACH ROW EXECUTE FUNCTION public.check_teacher_org_membership();
