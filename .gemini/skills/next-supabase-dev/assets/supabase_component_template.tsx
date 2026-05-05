'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function SupabaseComponent() {
  const [data, setData] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: result } = await supabase
        .from('table_name')
        .select('*');
      if (result) setData(result);
    };

    fetchData();
  }, [supabase]);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{JSON.stringify(item)}</div>
      ))}
    </div>
  );
}
