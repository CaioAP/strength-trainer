-- Create public bucket for exercise tutorial videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-tutorials', 'exercise-tutorials', true)
ON CONFLICT (id) DO NOTHING;

-- Admins can upload tutorial videos
CREATE POLICY "Admins can upload exercise tutorials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exercise-tutorials'
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public can read tutorial videos
CREATE POLICY "Public can view exercise tutorials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exercise-tutorials');

-- Admins can delete tutorial videos
CREATE POLICY "Admins can delete exercise tutorials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'exercise-tutorials'
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
