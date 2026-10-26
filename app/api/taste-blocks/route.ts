import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not configured' }),
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch latest 6 image blocks from taste/collected channel
    const { data, error } = await supabase
      .from('blocks')
      .select('id, type, content_url, arena_id')
      .eq('type', 'image')
      .not('content_url', 'is', null)
      .order('arena_id', { ascending: false })
      .limit(6)

    if (error) throw error

    return new Response(JSON.stringify({ blocks: data || [] }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Failed to fetch taste blocks:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch blocks', blocks: [] }),
      { status: 500 }
    )
  }
}
