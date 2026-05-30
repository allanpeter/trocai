/**
 * Seed script: populates trade_spots using OpenStreetMap Overpass API.
 * Fetches cafés, shopping centers, parks, libraries and universities
 * near the 50 largest Brazilian cities — no API key needed.
 *
 * Usage:
 *   npx tsx supabase/seed/spots-osm.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Rate-limit: adds a 1 s delay between Overpass requests to respect fair-use policy.
 */

;(globalThis as any).WebSocket = class {}

import { createClient } from '@supabase/supabase-js'
import * as fs   from 'fs'
import * as path from 'path'
import * as https from 'https'

// ---------------------------------------------------------------------------
// Target cities — top 50 Brazilian municipalities by population
// Each entry: [city_name, state_code, lat, lng]
// ---------------------------------------------------------------------------
const TARGET_CITIES: [string, string, number, number][] = [
  ['São Paulo',          'SP', -23.5505, -46.6333],
  ['Rio de Janeiro',     'RJ', -22.9068, -43.1729],
  ['Brasília',           'DF', -15.7942, -47.8825],
  ['Salvador',           'BA', -12.9714, -38.5014],
  ['Fortaleza',          'CE',  -3.7172, -38.5433],
  ['Belo Horizonte',     'MG', -19.9167, -43.9345],
  ['Manaus',             'AM',  -3.1190, -60.0217],
  ['Curitiba',           'PR', -25.4290, -49.2671],
  ['Recife',             'PE',  -8.0578, -34.8829],
  ['Porto Alegre',       'RS', -30.0277, -51.2287],
  ['Belém',              'PA',  -1.4558, -48.4902],
  ['Goiânia',            'GO', -16.6864, -49.2643],
  ['Guarulhos',          'SP', -23.4543, -46.5333],
  ['Campinas',           'SP', -22.9099, -47.0626],
  ['São Luís',           'MA',  -2.5297, -44.3028],
  ['São Gonçalo',        'RJ', -22.8266, -43.0539],
  ['Maceió',             'AL',  -9.6658, -35.7350],
  ['Duque de Caxias',    'RJ', -22.7856, -43.3117],
  ['Natal',              'RN',  -5.7945, -35.2110],
  ['Teresina',           'PI',  -5.0892, -42.8019],
  ['Campo Grande',       'MS', -20.4686, -54.6295],
  ['Nova Iguaçu',        'RJ', -22.7597, -43.4511],
  ['São Bernardo do Campo','SP',-23.6939,-46.5650],
  ['João Pessoa',        'PB',  -7.1195, -34.8450],
  ['Santo André',        'SP', -23.6639, -46.5383],
  ['Osasco',             'SP', -23.5322, -46.7919],
  ['Jaboatão dos Guararapes','PE',-8.1133,-35.0094],
  ['Ribeirão Preto',     'SP', -21.1767, -47.8208],
  ['Uberlândia',         'MG', -18.9186, -48.2772],
  ['Contagem',           'MG', -19.9317, -44.0536],
  ['Sorocaba',           'SP', -23.5015, -47.4526],
  ['Aracaju',            'SE', -10.9472, -37.0731],
  ['Feira de Santana',   'BA', -12.2664, -38.9663],
  ['Cuiabá',             'MT', -15.5989, -56.0949],
  ['Joinville',          'SC', -26.3044, -48.8456],
  ['Juiz de Fora',       'MG', -21.7642, -43.3503],
  ['Londrina',           'PR', -23.3045, -51.1696],
  ['Aparecida de Goiânia','GO',-16.8236,-49.2464],
  ['Ananindeua',         'PA',  -1.3656, -48.3725],
  ['Porto Velho',        'RO',  -8.7612, -63.9004],
  ['Serra',              'ES', -20.1286, -40.3078],
  ['Florianópolis',      'SC', -27.5954, -48.5480],
  ['Niterói',            'RJ', -22.8833, -43.1036],
  ['São João de Meriti',  'RJ',-22.8028,-43.3742],
  ['Belford Roxo',       'RJ', -22.7642, -43.3989],
  ['Macapá',             'AP',   0.0349, -51.0694],
  ['Mogi das Cruzes',    'SP', -23.5236, -46.1878],
  ['Caxias do Sul',      'RS', -29.1678, -51.1794],
  ['Diadema',            'SP', -23.6861, -46.6208],
  ['Boa Vista',          'RR',   2.8235, -60.6758],
]

// Overpass amenity types mapped to our spot types
const AMENITY_MAP: Record<string, string> = {
  cafe:        'cafeteria',
  library:     'biblioteca',
  university:  'universidade',
  marketplace: 'mercado',
}

const SHOP_MAP: Record<string, string> = {
  mall:         'shopping',
  supermarket:  'mercado',
}

const LEISURE_MAP: Record<string, string> = {
  park: 'parque',
}

// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

function postText(url: string, body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj  = new URL(url)
    const payload = `data=${encodeURIComponent(body)}`
    const options = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent':     'trocai-seed-script/1.0',
      },
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

interface OsmElement {
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags: Record<string, string>
}

async function fetchSpotsNear(lat: number, lng: number, radiusM = 8000): Promise<OsmElement[]> {
  const query = `
[out:json][timeout:15];
(
  node["amenity"~"cafe|library|university|marketplace"]["name"](around:${radiusM},${lat},${lng});
  way["amenity"~"cafe|library|university|marketplace"]["name"](around:${radiusM},${lat},${lng});
  node["shop"~"mall|supermarket"]["name"](around:${radiusM},${lat},${lng});
  way["shop"~"mall|supermarket"]["name"](around:${radiusM},${lat},${lng});
  node["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  way["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
);
out center 8;
`.trim()

  const raw = await postText('https://overpass-api.de/api/interpreter', query)
  const json = JSON.parse(raw)
  return json.elements ?? []
}

function resolveType(el: OsmElement): string | null {
  const amenity = el.tags.amenity
  const shop    = el.tags.shop
  const leisure = el.tags.leisure
  if (amenity && AMENITY_MAP[amenity]) return AMENITY_MAP[amenity]
  if (shop    && SHOP_MAP[shop])       return SHOP_MAP[shop]
  if (leisure && LEISURE_MAP[leisure]) return LEISURE_MAP[leisure]
  return null
}

// ---------------------------------------------------------------------------

async function main() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  let totalInserted = 0

  for (const [cityName, stateCode, lat, lng] of TARGET_CITIES) {
    console.log(`\nFetching spots for ${cityName}, ${stateCode}…`)

    let elements: OsmElement[]
    try {
      elements = await fetchSpotsNear(lat, lng)
    } catch (err) {
      console.warn(`  Overpass error for ${cityName}: ${err}. Skipping.`)
      await sleep(2000)
      continue
    }

    const rows = elements
      .map(el => {
        const type = resolveType(el)
        if (!type) return null
        const elLat = el.lat ?? el.center?.lat
        const elLng = el.lon ?? el.center?.lon
        if (!elLat || !elLng) return null
        const name = el.tags.name?.trim()
        if (!name || name.length < 3) return null

        const osmId = String(el.id)

        return {
          name,
          type,
          address:    el.tags['addr:street']
            ? `${el.tags['addr:street']}${el.tags['addr:housenumber'] ? ', ' + el.tags['addr:housenumber'] : ''}`
            : null,
          city_name:  cityName,
          state_code: stateCode,
          lat: elLat,
          lng: elLng,
          verified:   false,
          osm_id:     osmId,
        }
      })
      .filter(Boolean) as Record<string, unknown>[]

    if (rows.length === 0) {
      console.log(`  No spots found.`)
      await sleep(1000)
      continue
    }

    const { error } = await supabase
      .from('trade_spots')
      .upsert(rows as any, { onConflict: 'osm_id', ignoreDuplicates: true })

    if (error) {
      console.warn(`  Insert error for ${cityName}: ${error.message}`)
    } else {
      console.log(`  Upserted ${rows.length} spots`)
      totalInserted += rows.length
    }

    await sleep(1000)
  }

  console.log(`\nDone. ~${totalInserted} spots processed across ${TARGET_CITIES.length} cities.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
