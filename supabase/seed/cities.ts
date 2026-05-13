/**
 * Seed script: imports all ~5570 Brazilian municipalities from the
 * kelvins/municipios-brasileiros dataset (MIT licence) into the `cities` table.
 *
 * Usage:
 *   npx tsx supabase/seed/cities.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (service role key is needed to bypass RLS on insert).
 */

// Seed script doesn't use Realtime — stub WebSocket so Node < 22 doesn't error
;(globalThis as any).WebSocket = class {}

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CSV_URL =
  'https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/csv/municipios.csv'

const STATE_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
  PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
}

// Capital cities by IBGE code
const CAPITALS = new Set([
  '1200401', // Rio Branco (AC)
  '2704302', // Maceió (AL)
  '1600303', // Macapá (AP)
  '1302603', // Manaus (AM)
  '2927408', // Salvador (BA)
  '2304400', // Fortaleza (CE)
  '5300108', // Brasília (DF)
  '3205309', // Vitória (ES)
  '5208707', // Goiânia (GO)
  '2111300', // São Luís (MA)
  '5103403', // Cuiabá (MT)
  '5002704', // Campo Grande (MS)
  '3106200', // Belo Horizonte (MG)
  '1501402', // Belém (PA)
  '2507507', // João Pessoa (PB)
  '4106902', // Curitiba (PR)
  '2611606', // Recife (PE)
  '2211001', // Teresina (PI)
  '3304557', // Rio de Janeiro (RJ)
  '2408102', // Natal (RN)
  '4314902', // Porto Alegre (RS)
  '1100205', // Porto Velho (RO)
  '1400100', // Boa Vista (RR)
  '4205407', // Florianópolis (SC)
  '3550308', // São Paulo (SP)
  '2800308', // Aracaju (SE)
  '1721000', // Palmas (TO)
])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    }).on('error', reject)
  })
}

interface City {
  id: string
  name: string
  state_code: string
  state_name: string
  lat: number
  lng: number
  is_capital: boolean
}

function parseCsv(raw: string): City[] {
  const lines = raw.trim().split('\n')
  // header: codigo_ibge,nome,latitude,longitude,capital,codigo_uf,uf
  const cities: City[] = []

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',')
    if (parts.length < 7) continue

    const [id, name, latStr, lngStr, , , uf] = parts
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)

    if (!id || !name || isNaN(lat) || isNaN(lng)) continue

    const state_code = uf.trim().toUpperCase()
    cities.push({
      id:         id.trim(),
      name:       name.trim(),
      state_code,
      state_name: STATE_NAMES[state_code] ?? state_code,
      lat,
      lng,
      is_capital: CAPITALS.has(id.trim()),
    })
  }

  return cities
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Load env vars from .env.local
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8')
    for (const line of env.split('\n')) {
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

  console.log('Fetching municipalities CSV…')
  const raw    = await fetchText(CSV_URL)
  const cities = parseCsv(raw)
  console.log(`Parsed ${cities.length} cities`)

  // Upsert in batches of 500
  const BATCH = 500
  let inserted = 0

  for (let i = 0; i < cities.length; i += BATCH) {
    const batch = cities.slice(i, i + BATCH)
    const { error } = await supabase
      .from('cities')
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      console.error(`Batch ${i / BATCH + 1} failed:`, error.message)
      process.exit(1)
    }
    inserted += batch.length
    process.stdout.write(`\r${inserted}/${cities.length} inserted…`)
  }

  console.log(`\nDone! ${inserted} cities seeded.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
