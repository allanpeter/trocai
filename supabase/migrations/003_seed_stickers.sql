-- ============================================================
-- trocai.app — Real Panini FIFA World Cup 2026 stickers
-- 980 total: 20 intro/museum + 48 teams × 20 (badge + photo + 18 players)
-- Re-runnable: deletes existing rows for this album first
-- ============================================================

-- Add Panini sticker code column (MEX1, BRA5, FWC3, etc.)
alter table public.stickers add column if not exists code text;

-- Update album total
update public.albums
set total_stickers = 980
where id = '00000000-0000-0000-0000-000000000001';

-- Clear any placeholder stickers from a previous run
delete from public.stickers
where album_id = '00000000-0000-0000-0000-000000000001';

do $$
declare
  v_album uuid := '00000000-0000-0000-0000-000000000001';
  v_num   int  := 1;

  -- 48 qualified teams in album order: (3-letter code, Portuguese name)
  v_codes text[] := ARRAY[
    'MEX','RSA','KOR','CZE','CAN','BIH','QAT','SUI',
    'BRA','MAR','HAI','SCO','USA','PAR','AUS','TUR',
    'GER','CUW','CIV','ECU','NED','JPN','SWE','TUN',
    'BEL','EGY','IRN','NZL','ESP','CPV','KSA','URU',
    'FRA','SEN','IRQ','NOR','ARG','ALG','AUT','JOR',
    'POR','COD','UZB','COL','ENG','CRO','GHA','PAN'
  ];
  v_names text[] := ARRAY[
    'México',             'África do Sul',        'Coreia do Sul',       'República Checa',
    'Canadá',             'Bósnia e Herzegovina', 'Qatar',               'Suíça',
    'Brasil',             'Marrocos',             'Haiti',               'Escócia',
    'EUA',                'Paraguai',             'Austrália',           'Turquia',
    'Alemanha',           'Curaçao',              'Costa do Marfim',     'Equador',
    'Países Baixos',      'Japão',                'Suécia',              'Tunísia',
    'Bélgica',            'Egipto',               'Irão',                'Nova Zelândia',
    'Espanha',            'Cabo Verde',           'Arábia Saudita',      'Uruguai',
    'França',             'Senegal',              'Iraque',              'Noruega',
    'Argentina',          'Argélia',              'Áustria',             'Jordânia',
    'Portugal',           'Congo RD',             'Uzbequistão',         'Colômbia',
    'Inglaterra',         'Croácia',              'Gana',                'Panamá'
  ];

  v_i int;
  v_j int;
begin
  -- ── Introdução (seq 1–9): sticker "00" + FWC1–FWC8 ──────
  insert into public.stickers (album_id, number, code, name, team, is_rare) values
    (v_album, 1, '00',   'Logotipo Panini',  'Introdução', true),
    (v_album, 2, 'FWC1', 'Emblema Oficial',  'Introdução', true),
    (v_album, 3, 'FWC2', 'Mascote Oficial',  'Introdução', true),
    (v_album, 4, 'FWC3', 'Slogan Oficial',   'Introdução', false),
    (v_album, 5, 'FWC4', 'Bola Oficial',     'Introdução', false),
    (v_album, 6, 'FWC5', 'Canadá',           'Introdução', false),
    (v_album, 7, 'FWC6', 'México',           'Introdução', false),
    (v_album, 8, 'FWC7', 'EUA',              'Introdução', false),
    (v_album, 9, 'FWC8', 'Cidades-Sede',     'Introdução', false);
  v_num := 10;

  -- ── FIFA Museum (seq 10–20): FWC9–FWC19, campeões históricos ──
  insert into public.stickers (album_id, number, code, name, team, is_rare) values
    (v_album, 10, 'FWC9',  'Itália 1934 & 1938',           'FIFA Museum', false),
    (v_album, 11, 'FWC10', 'Brasil 1950',                  'FIFA Museum', false),
    (v_album, 12, 'FWC11', 'Alemanha Ocidental 1954',      'FIFA Museum', false),
    (v_album, 13, 'FWC12', 'Brasil 1958 & 1962',           'FIFA Museum', false),
    (v_album, 14, 'FWC13', 'Inglaterra 1966',              'FIFA Museum', false),
    (v_album, 15, 'FWC14', 'Brasil 1970',                  'FIFA Museum', false),
    (v_album, 16, 'FWC15', 'Alemanha 1974, Arg. 1978',     'FIFA Museum', false),
    (v_album, 17, 'FWC16', 'Itália 1982, Argentina 1986',  'FIFA Museum', false),
    (v_album, 18, 'FWC17', 'Alemanha 1990, Brasil 1994',   'FIFA Museum', false),
    (v_album, 19, 'FWC18', 'França 1998, Brasil 2002',     'FIFA Museum', false),
    (v_album, 20, 'FWC19', 'Itália 2006, Esp. 2010, Ale. 2014, Fra. 2018, Arg. 2022', 'FIFA Museum', false);
  v_num := 21;

  -- ── 48 equipas × 20 figurinhas (seq 21–980) ─────────────
  -- [CODE]1  = Escudo (foil, rare)
  -- [CODE]2  = Foto da Equipa
  -- [CODE]3…[CODE]20 = Jogador 1…18
  for v_i in 1..48 loop
    -- Badge (foil)
    insert into public.stickers (album_id, number, code, name, team, is_rare)
    values (v_album, v_num, v_codes[v_i] || '1', 'Escudo', v_names[v_i], true);
    v_num := v_num + 1;

    -- Team photo
    insert into public.stickers (album_id, number, code, name, team, is_rare)
    values (v_album, v_num, v_codes[v_i] || '2', 'Foto da Equipa', v_names[v_i], false);
    v_num := v_num + 1;

    -- 18 players
    for v_j in 3..20 loop
      insert into public.stickers (album_id, number, code, name, team, is_rare)
      values (v_album, v_num, v_codes[v_i] || v_j, 'Jogador ' || (v_j - 2), v_names[v_i], false);
      v_num := v_num + 1;
    end loop;
  end loop;

  raise notice 'Seeded % stickers for Copa do Mundo 2026 (expected 980)', v_num - 1;
end $$;
