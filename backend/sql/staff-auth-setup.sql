-- Run after creating staff accounts in Supabase Authentication.
-- Map each Auth user UUID to its approved staff role using the SQL below.

CREATE TABLE IF NOT EXISTS public.staff_auth_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('Director', 'Admin', 'Teacher')),
    display_name TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.staff_auth_roles
    ADD COLUMN IF NOT EXISTS display_name TEXT NOT NULL DEFAULT '';

ALTER TABLE public.staff_auth_roles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.staff_auth_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.staff_auth_roles TO authenticated;

DROP POLICY IF EXISTS "Staff can read own role" ON public.staff_auth_roles;
CREATE POLICY "Staff can read own role"
    ON public.staff_auth_roles
    FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- Add one row per staff Auth account, replacing the email with the account's
-- actual email and assigning only the role approved by the project owner:
-- INSERT INTO public.staff_auth_roles (user_id, role, display_name)
-- SELECT id, 'Director', 'Director Name'
-- FROM auth.users WHERE email = 'director@example.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

CREATE OR REPLACE FUNCTION public.list_staff_directory()
RETURNS TABLE(user_id UUID, display_name TEXT, role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.staff_auth_roles AS own_role
        WHERE own_role.user_id = (SELECT auth.uid())
    ) THEN
        RAISE EXCEPTION 'Only authenticated staff may view the staff directory';
    END IF;

    RETURN QUERY
    SELECT staff.user_id, staff.display_name, staff.role
    FROM public.staff_auth_roles AS staff
    ORDER BY staff.display_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_student_account(p_student_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.staff_auth_roles
        WHERE user_id = (SELECT auth.uid())
          AND role IN ('Director', 'Admin')
    ) THEN
        RAISE EXCEPTION 'Only an authenticated Director or Admin may delete student accounts';
    END IF;

    DELETE FROM public.users
    WHERE id = p_student_id
      AND role = 'Student';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Student account not found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_students_in_group(p_group_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.staff_auth_roles
        WHERE user_id = (SELECT auth.uid())
          AND role IN ('Director', 'Admin')
    ) THEN
        RAISE EXCEPTION 'Only an authenticated Director or Admin may delete student accounts';
    END IF;

    DELETE FROM public.users
    WHERE role = 'Student'
      AND group_name = p_group_name;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_student_account(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_students_in_group(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.list_staff_directory() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_student_account(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_students_in_group(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_staff_directory() TO authenticated;

-- Prevent direct table deletion from bypassing the role checks in the RPCs.
REVOKE DELETE ON public.users FROM PUBLIC, anon, authenticated;
