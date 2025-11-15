-- Fix duplicate matches before adding UNIQUE constraint
USE matrimony;

-- Step 1: Check for duplicates
SELECT user_id, matched_user_id, COUNT(*) as count
FROM matches
GROUP BY user_id, matched_user_id
HAVING count > 1;

-- Step 2: Remove duplicates (keeps the first one, deletes the rest)
-- This will keep only one match per user_id, matched_user_id pair
DELETE m1 FROM matches m1
INNER JOIN matches m2 
WHERE m1.match_id > m2.match_id 
AND m1.user_id = m2.user_id 
AND m1.matched_user_id = m2.matched_user_id;

-- Step 3: Verify no duplicates remain
SELECT user_id, matched_user_id, COUNT(*) as count
FROM matches
GROUP BY user_id, matched_user_id
HAVING count > 1;
-- Should return 0 rows

-- Step 4: Now you can add the UNIQUE constraint
ALTER TABLE matches 
ADD CONSTRAINT unique_match_pair UNIQUE (user_id, matched_user_id);

