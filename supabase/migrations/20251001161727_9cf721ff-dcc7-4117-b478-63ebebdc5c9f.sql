-- Function to increment car views
CREATE OR REPLACE FUNCTION public.increment_car_views(car_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.cars
  SET views = views + 1
  WHERE id = car_id;
END;
$$;