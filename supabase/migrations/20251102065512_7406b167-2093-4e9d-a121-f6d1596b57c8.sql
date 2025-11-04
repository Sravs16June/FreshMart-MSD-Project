-- Drop existing policy and recreate with WITH CHECK clause
DROP POLICY IF EXISTS "Users can update their own pending orders" ON public.orders;

CREATE POLICY "Users can update their own pending orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);