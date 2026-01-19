-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES FOR REVA CHALETS
-- Run this in Supabase SQL Editor to enable RLS
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chalet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Partner" ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- USER TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON "User" FOR SELECT
USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (auth.uid()::text = id);

-- Allow signup (insert)
CREATE POLICY "Enable insert for signup"
ON "User" FOR INSERT
WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- CHALET TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Anyone can view chalets (public listings)
CREATE POLICY "Chalets are viewable by everyone"
ON "Chalet" FOR SELECT
USING (true);

-- Hosts can create their own chalets
CREATE POLICY "Hosts can create chalets"
ON "Chalet" FOR INSERT
WITH CHECK (auth.uid()::text = "ownerId");

-- Hosts can update their own chalets
CREATE POLICY "Hosts can update own chalets"
ON "Chalet" FOR UPDATE
USING (auth.uid()::text = "ownerId");

-- Hosts can delete their own chalets
CREATE POLICY "Hosts can delete own chalets"
ON "Chalet" FOR DELETE
USING (auth.uid()::text = "ownerId");

-- ═══════════════════════════════════════════════════════════════
-- BOOKING TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON "Booking" FOR SELECT
USING (auth.uid()::text = "userId");

-- Hosts can view bookings for their chalets
CREATE POLICY "Hosts can view bookings for their chalets"
ON "Booking" FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "Chalet"
        WHERE "Chalet".id = "Booking"."chaletId"
        AND "Chalet"."ownerId" = auth.uid()::text
    )
);

-- Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
ON "Booking" FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
ON "Booking" FOR UPDATE
USING (
    auth.uid()::text = "userId"
    AND status = 'PENDING'
);

-- ═══════════════════════════════════════════════════════════════
-- REVIEW TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
ON "Review" FOR SELECT
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON "Review" FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON "Review" FOR UPDATE
USING (auth.uid()::text = "userId");

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON "Review" FOR DELETE
USING (auth.uid()::text = "userId");

-- ═══════════════════════════════════════════════════════════════
-- PARTNER TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Anyone can view active partners
CREATE POLICY "Active partners are viewable by everyone"
ON "Partner" FOR SELECT
USING ("isActive" = true);

-- Only admins can manage partners (handled at application level)
-- For now, disable insert/update/delete for all users via RLS
CREATE POLICY "No public partner management"
ON "Partner" FOR ALL
USING (false);
