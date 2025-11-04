-- Add missing columns to existing profiles table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
    ALTER TABLE public.profiles ADD COLUMN address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Create storage bucket for profile avatars (if doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  END IF;
END $$;

-- Storage policies for avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Avatar images are publicly accessible'
  ) THEN
    EXECUTE 'CREATE POLICY "Avatar images are publicly accessible"
      ON storage.objects FOR SELECT
      USING (bucket_id = ''avatars'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload their own avatar'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can upload their own avatar"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = ''avatars'' AND
        auth.uid()::text = (storage.foldername(name))[1]
      )';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own avatar'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own avatar"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = ''avatars'' AND
        auth.uid()::text = (storage.foldername(name))[1]
      )';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own avatar'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can delete their own avatar"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = ''avatars'' AND
        auth.uid()::text = (storage.foldername(name))[1]
      )';
  END IF;
END $$;