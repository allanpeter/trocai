import type { MetadataRoute } from 'next'

const BASE = 'https://www.trocai.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
  ]

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=username,created_at&order=created_at.desc&limit=1000`,
      {
        headers: {
          apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        next: { revalidate: 3600 },
      }
    )
    const profiles: { username: string; created_at: string }[] = await res.json()

    const profileRoutes: MetadataRoute.Sitemap = profiles.map(p => ({
      url:             `${BASE}/profile/${p.username}`,
      lastModified:    new Date(p.created_at),
      changeFrequency: 'weekly',
      priority:        0.6,
    }))

    return [...staticRoutes, ...profileRoutes]
  } catch {
    return staticRoutes
  }
}
