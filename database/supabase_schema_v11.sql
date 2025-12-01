-- Migration v11: Add split_to array and update expense types
ALTER TABLE expenses ADD COLUMN split_to TEXT[] DEFAULT NULL;

-- Comment
COMMENT ON COLUMN expenses.split_to IS 'Array of user IDs to split the expense with. NULL means everyone.';
