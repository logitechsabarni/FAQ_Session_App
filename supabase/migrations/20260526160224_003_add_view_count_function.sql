/*
  # Add View Count Increment Function

  Creates a database function to atomically increment the view count of an FAQ.
  This function is called from the frontend when viewing an FAQ.
*/

CREATE OR REPLACE FUNCTION increment_view_count(faq_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE faqs
  SET view_count = view_count + 1
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
