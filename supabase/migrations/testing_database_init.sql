-- ====================================================================
-- REDDIX ROBOTICS: TESTING DATABASE INITIALIZATION SCRIPT
-- Environment: Testing (Separate Supabase Project)
-- Note: Contains only schemas, tables, indexes, RLS and functions. Zero data.
-- ====================================================================

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('ORDER_PLACED', 'ADVANCE_PAYMENT_RECEIVED', 'ORDER_CONFIRMED', 'PROCESSING', 'PRODUCTION', 'QUALITY_CHECK', 'READY_FOR_DISPATCH', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'INSTALLATION_SCHEDULED', 'INSTALLATION_COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'FULLY_PAID', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PaymentType" AS ENUM ('ADVANCE', 'BALANCE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "CareerStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ApplicationType" AS ENUM ('JOB', 'INTERNSHIP', 'GENERAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ApplicationStatus" AS ENUM ('RECEIVED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "WorkshopStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "RegistrationStatus" AS ENUM ('CONFIRMED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'READ', 'RESPONDED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecretEncrypted" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AdminSession" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TwoFactorAuth" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFactorAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "features" TEXT[],
    "technicalSpecifications" JSONB,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "advanceAmount" DOUBLE PRECISION NOT NULL,
    "remainingAmount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'ORDER_PLACED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "requirements" TEXT[],
    "responsibilities" TEXT[],
    "status" "CareerStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Internship" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "stipend" TEXT,
    "requirements" TEXT[],
    "status" "CareerStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Application" (
    "id" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "jobId" TEXT,
    "internshipId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Workshop" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "WorkshopStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkshopRegistration" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkshopRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "linkedInUrl" TEXT,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "profilePhoto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "category" TEXT NOT NULL,
    "technologies" TEXT[],
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Contractor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "website" TEXT,
    "contactInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CompanyInformation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aboutContent" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdminSession_adminId_idx" ON "AdminSession"("adminId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdminSession_tokenHash_idx" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PasswordResetToken_adminId_idx" ON "PasswordResetToken"("adminId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TwoFactorAuth_adminId_key" ON "TwoFactorAuth"("adminId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TwoFactorAuth_adminId_idx" ON "TwoFactorAuth"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Internship_status_idx" ON "Internship"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Application_type_idx" ON "Application"("type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Workshop_status_idx" ON "Workshop"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkshopRegistration_workshopId_idx" ON "WorkshopRegistration"("workshopId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopRegistration" ADD CONSTRAINT "WorkshopRegistration_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;



-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ShipmentStatus" AS ENUM ('CREATED', 'READY_TO_SHIP', 'PICKUP_REQUESTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_ATTEMPT', 'RETURNED_TO_ORIGIN', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "FeaturedProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "courier" TEXT NOT NULL DEFAULT 'DELHIVERY',
    "awbNumber" TEXT,
    "trackingUrl" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "authStatus" TEXT NOT NULL DEFAULT 'AUTHENTICATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "FeaturedProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "projectUrl" TEXT,
    "status" "FeaturedProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Journey" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UpcomingProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpcomingProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkshopMedia" (
    "sectionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "posterUrl" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'video',
    "altText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopMedia_pkey" PRIMARY KEY ("sectionKey")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkshopProgramStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "mediaKey" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopProgramStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable LMS Enrollment
CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "course_id" TEXT REFERENCES "Workshop"("id") ON DELETE SET NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Additional Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Shipment_orderId_key" ON "Shipment"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Shipment_awbNumber_key" ON "Shipment"("awbNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "UserSession_tokenHash_key" ON "UserSession"("tokenHash");
CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_userId_productId_key" ON "CartItem"("userId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS "WorkshopProgramStep_mediaKey_key" ON "WorkshopProgramStep"("mediaKey");

-- Additional Foreign Keys
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;


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




-- Enable RLS on Prisma Migrations if present
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_prisma_migrations') THEN
    EXECUTE 'ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public._prisma_migrations FROM anon, authenticated';
  END IF;
END $$;

-- Function: Assign User Role
CREATE OR REPLACE FUNCTION public.assign_user_role(target_email text, target_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role text;
BEGIN
  caller_role := (auth.jwt() -> 'app_metadata' ->> 'role');
  IF caller_role != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Forbidden: Only SUPER_ADMIN can assign roles.';
  END IF;

  IF target_role NOT IN ('TEACHER', 'ADMIN', 'CONTENT_MANAGER', 'USER') THEN
    RAISE EXCEPTION 'Invalid role specified.';
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', target_role)
  WHERE email = target_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found.', target_email;
  END IF;

  RETURN true;
END;
$$;

-- Function: Get Teachers
CREATE OR REPLACE FUNCTION public.get_teachers()
RETURNS TABLE(id uuid, email character varying, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role text;
BEGIN
  caller_role := (auth.jwt() -> 'app_metadata' ->> 'role');
  IF caller_role != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Access Denied: Only SUPER_ADMIN can view teachers.';
  END IF;

  RETURN QUERY
  SELECT u.id, u.email::varchar, u.created_at
  FROM auth.users u
  WHERE u.raw_app_meta_data->>'role' = 'TEACHER'
  ORDER BY u.created_at DESC;
END;
$$;

-- Function: Get LMS Student Details (Secure RPC)
CREATE OR REPLACE FUNCTION public.get_lms_student_details()
RETURNS TABLE (
  enrollment_id uuid,
  student_email text,
  course_title text,
  status text,
  enrolled_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  caller_role text;
BEGIN
  caller_role := (auth.jwt() -> 'app_metadata' ->> 'role');
  IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
    RAISE EXCEPTION 'Access Denied: Only administrators can view student details.';
  END IF;

  RETURN QUERY
  SELECT 
    e.id AS enrollment_id,
    u.email::text AS student_email,
    COALESCE(w.title, 'General Course')::text AS course_title,
    e.status::text,
    e.created_at AS enrolled_at
  FROM "Enrollment" e
  JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN "Workshop" w ON e.course_id = w.id
  ORDER BY e.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_lms_student_details() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_teachers() TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(text, text) TO authenticated;

-- Enable RLS on Enrollment table
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollment_admin_all" ON "Enrollment"
AS PERMISSIVE FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "enrollment_student_select" ON "Enrollment"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

