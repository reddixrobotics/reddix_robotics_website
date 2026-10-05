(async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient('', '');
  const { data, error } = await supabase.from('Enrollment').select('*, Workshop(*)');
  console.log("Error:", error);
  console.log("Data:", data);
})();
