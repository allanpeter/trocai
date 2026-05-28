import type { MetadataRoute } from 'next'

const BASE = 'https://www.trocai.app'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/faq`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/contato`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
  { url: `${BASE}/privacidade`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/termos`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/cookies`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(
      // Só traz profiles com bio preenchida OU pelo menos 1 troca — evita thin content no sitemap
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=username,created_at,bio,trades_count&order=created_at.desc&limit=1000`,
      {
        headers: {
          apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        next: { revalidate: 86400 },
      }
    )
    const profiles: { username: string; created_at: string; bio: string | null; trades_count: number }[] = await res.json()

    const profileRoutes: MetadataRoute.Sitemap = profiles
      .filter(p => p.bio || p.trades_count > 0)
      .map(p => ({
        url:             `${BASE}/profile/${p.username}`,
        lastModified:    new Date(p.created_at),
        changeFrequency: 'weekly',
        priority:        0.6,
      }))

    return [...STATIC_ROUTES, ...profileRoutes]
  } catch {
    return STATIC_ROUTES
  }
}
