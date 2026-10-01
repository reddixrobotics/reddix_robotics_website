-- RLS SNAPSHOT BEFORE PHASE 6B

CREATE OR REPLACE FUNCTION public.current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    'ANONYMOUS'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(VARIADIC roles text[])
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
  SELECT public.current_user_role() = ANY(roles);
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
  SELECT public.current_user_role() IN (
    'SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_authenticated()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
  SELECT auth.uid() IS NOT NULL;
$function$
;

CREATE POLICY "admin_self_select" ON "public"."Admin"
AS PERMISSIVE FOR SELECT
TO public
USING (is_admin())
;

CREATE POLICY "admin_superadmin_all" ON "public"."Admin"
AS PERMISSIVE FOR ALL
TO public
USING (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text]))
WITH CHECK (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text]))
;

CREATE POLICY "adminsession_admin_select" ON "public"."AdminSession"
AS PERMISSIVE FOR SELECT
TO public
USING (is_admin())
;

CREATE POLICY "adminsession_superadmin_delete" ON "public"."AdminSession"
AS PERMISSIVE FOR DELETE
TO public
USING (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text]))
;

CREATE POLICY "application_admin_delete" ON "public"."Application"
AS PERMISSIVE FOR DELETE
TO public
USING (is_admin())
;

CREATE POLICY "application_admin_select" ON "public"."Application"
AS PERMISSIVE FOR SELECT
TO public
USING (is_admin())
;

CREATE POLICY "application_admin_update" ON "public"."Application"
AS PERMISSIVE FOR UPDATE
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "application_public_insert" ON "public"."Application"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true)
;

CREATE POLICY "auditlog_admin_select" ON "public"."AuditLog"
AS PERMISSIVE FOR SELECT
TO public
USING (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text, 'ADMIN'::text]))
;

CREATE POLICY "cartitem_admin_all" ON "public"."CartItem"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "cartitem_user_delete" ON "public"."CartItem"
AS PERMISSIVE FOR DELETE
TO public
USING (((auth.uid())::text = "userId"))
;

CREATE POLICY "cartitem_user_insert" ON "public"."CartItem"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (((auth.uid())::text = "userId"))
;

CREATE POLICY "cartitem_user_select" ON "public"."CartItem"
AS PERMISSIVE FOR SELECT
TO public
USING (((auth.uid())::text = "userId"))
;

CREATE POLICY "cartitem_user_update" ON "public"."CartItem"
AS PERMISSIVE FOR UPDATE
TO public
USING (((auth.uid())::text = "userId"))
WITH CHECK (((auth.uid())::text = "userId"))
;

CREATE POLICY "companyinfo_admin_all" ON "public"."CompanyInformation"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "companyinfo_public_select" ON "public"."CompanyInformation"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "contactmessage_admin_delete" ON "public"."ContactMessage"
AS PERMISSIVE FOR DELETE
TO public
USING (is_admin())
;

CREATE POLICY "contactmessage_admin_select" ON "public"."ContactMessage"
AS PERMISSIVE FOR SELECT
TO public
USING (is_admin())
;

CREATE POLICY "contactmessage_admin_update" ON "public"."ContactMessage"
AS PERMISSIVE FOR UPDATE
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "contactmessage_public_insert" ON "public"."ContactMessage"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true)
;

CREATE POLICY "contractor_admin_all" ON "public"."Contractor"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "contractor_public_select" ON "public"."Contractor"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "employee_admin_all" ON "public"."Employee"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "employee_public_select" ON "public"."Employee"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "featuredproject_admin_all" ON "public"."FeaturedProject"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "featuredproject_public_select" ON "public"."FeaturedProject"
AS PERMISSIVE FOR SELECT
TO public
USING ((status = 'PUBLISHED'::"FeaturedProjectStatus"))
;

CREATE POLICY "internship_admin_all" ON "public"."Internship"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "internship_public_select" ON "public"."Internship"
AS PERMISSIVE FOR SELECT
TO public
USING ((status = 'PUBLISHED'::"CareerStatus"))
;

CREATE POLICY "job_admin_all" ON "public"."Job"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "job_public_select" ON "public"."Job"
AS PERMISSIVE FOR SELECT
TO public
USING ((status = 'PUBLISHED'::"CareerStatus"))
;

CREATE POLICY "journey_admin_all" ON "public"."Journey"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "journey_public_select" ON "public"."Journey"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "order_admin_all" ON "public"."Order"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "order_user_select" ON "public"."Order"
AS PERMISSIVE FOR SELECT
TO public
USING (((auth.uid())::text = "customerId"))
;

CREATE POLICY "orderitem_admin_all" ON "public"."OrderItem"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "orderitem_user_select" ON "public"."OrderItem"
AS PERMISSIVE FOR SELECT
TO public
USING ((EXISTS ( SELECT 1
   FROM "Order" o
  WHERE ((o.id = "OrderItem"."orderId") AND ((auth.uid())::text = o."customerId")))))
;

CREATE POLICY "payment_admin_select" ON "public"."Payment"
AS PERMISSIVE FOR SELECT
TO public
USING (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text, 'ADMIN'::text, 'ORDER_MANAGER'::text]))
;

CREATE POLICY "payment_user_select" ON "public"."Payment"
AS PERMISSIVE FOR SELECT
TO public
USING ((EXISTS ( SELECT 1
   FROM "Order" o
  WHERE ((o.id = "Payment"."orderId") AND ((auth.uid())::text = o."customerId")))))
;

CREATE POLICY "product_admin_all" ON "public"."Product"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "product_public_select" ON "public"."Product"
AS PERMISSIVE FOR SELECT
TO public
USING ((availability = true))
;

CREATE POLICY "productimage_admin_all" ON "public"."ProductImage"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "productimage_public_select" ON "public"."ProductImage"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "project_admin_all" ON "public"."Project"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "project_public_select" ON "public"."Project"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "shipment_admin_select" ON "public"."Shipment"
AS PERMISSIVE FOR SELECT
TO public
USING (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text, 'ADMIN'::text, 'ORDER_MANAGER'::text]))
;

CREATE POLICY "shipment_admin_update" ON "public"."Shipment"
AS PERMISSIVE FOR UPDATE
TO public
USING (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text, 'ADMIN'::text, 'ORDER_MANAGER'::text]))
WITH CHECK (has_role(VARIADIC ARRAY['SUPER_ADMIN'::text, 'ADMIN'::text, 'ORDER_MANAGER'::text]))
;

CREATE POLICY "upcomingproject_admin_all" ON "public"."UpcomingProject"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "upcomingproject_public_select" ON "public"."UpcomingProject"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "user_admin_all" ON "public"."User"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "user_self_select" ON "public"."User"
AS PERMISSIVE FOR SELECT
TO public
USING ((((auth.uid())::text = id) OR is_admin()))
;

CREATE POLICY "usersession_admin_all" ON "public"."UserSession"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "usersession_user_select" ON "public"."UserSession"
AS PERMISSIVE FOR SELECT
TO public
USING (((auth.uid())::text = "userId"))
;

CREATE POLICY "wishlistitem_admin_all" ON "public"."WishlistItem"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "wishlistitem_user_delete" ON "public"."WishlistItem"
AS PERMISSIVE FOR DELETE
TO public
USING (((auth.uid())::text = "userId"))
;

CREATE POLICY "wishlistitem_user_insert" ON "public"."WishlistItem"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (((auth.uid())::text = "userId"))
;

CREATE POLICY "wishlistitem_user_select" ON "public"."WishlistItem"
AS PERMISSIVE FOR SELECT
TO public
USING (((auth.uid())::text = "userId"))
;

CREATE POLICY "workshop_admin_all" ON "public"."Workshop"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "workshop_public_select" ON "public"."Workshop"
AS PERMISSIVE FOR SELECT
TO public
USING ((status = 'PUBLISHED'::"WorkshopStatus"))
;

CREATE POLICY "workshopmedia_admin_all" ON "public"."WorkshopMedia"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "workshopmedia_public_select" ON "public"."WorkshopMedia"
AS PERMISSIVE FOR SELECT
TO public
USING (("isActive" = true))
;

CREATE POLICY "workshopprogramstep_admin_all" ON "public"."WorkshopProgramStep"
AS PERMISSIVE FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "workshopprogramstep_public_select" ON "public"."WorkshopProgramStep"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
;

CREATE POLICY "workshopreg_admin_delete" ON "public"."WorkshopRegistration"
AS PERMISSIVE FOR DELETE
TO public
USING (is_admin())
;

CREATE POLICY "workshopreg_admin_select" ON "public"."WorkshopRegistration"
AS PERMISSIVE FOR SELECT
TO public
USING (is_admin())
;

CREATE POLICY "workshopreg_admin_update" ON "public"."WorkshopRegistration"
AS PERMISSIVE FOR UPDATE
TO public
USING (is_admin())
WITH CHECK (is_admin())
;

CREATE POLICY "workshopreg_public_insert" ON "public"."WorkshopRegistration"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true)
;

