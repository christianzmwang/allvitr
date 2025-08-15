import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createGunzip } from "node:zlib";
import { parser } from "stream-json/Parser";
import { streamArray } from "stream-json/streamers/StreamArray";
import { request } from "undici";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server key ONLY
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function upsertBatch(rows: any[]) {
  if (!rows.length) return;
  const payload = rows.map((e) => ({
    organisasjonsnummer: e.organisasjonsnummer,
    navn: e.navn,
    organisasjonsform: e.organisasjonsform ?? null,
    forretningsadresse: e.forretningsadresse ?? null,
    postadresse: e.postadresse ?? null,
    naeringskode1: e.naeringskode1 ?? null,
    registreringsdatoEnhetsregisteret: e.registreringsdatoEnhetsregisteret ?? null,
    konkurs: e.konkurs ?? null,
    underAvvikling: e.underAvvikling ?? null,
    raw: e,
  }));

  const { error } = await supabase
    .from("enheter")
    .upsert(payload, { onConflict: "organisasjonsnummer" })
    .select();
  if (error) throw error;
}

async function run() {
  console.log("Downloading HUGIN enheter totalbestand...");
  const res = await request("https://data.brreg.no/enhetsregisteret/api/enheter/lastned"); // gz JSON array

  const batch: any[] = [];
  const BATCH_SIZE = 1000;
  let total = 0;

  const body = (res.body as any)?.pipe ? (res.body as any) : Readable.fromWeb(res.body as any);

  await pipeline(
    body as any,
    createGunzip() as any,
    (parser() as any),
    (streamArray() as any),
    (async function* (source: AsyncIterable<any>) {
      for await (const { value } of source) {
        batch.push(value);
        if (batch.length >= BATCH_SIZE) {
          await upsertBatch(batch.splice(0, batch.length));
          total += BATCH_SIZE;
          console.log(`Imported ${total}...`);
        }
        yield;
      }
      if (batch.length) {
        await upsertBatch(batch);
        total += batch.length;
      }
    }) as any
  );

  console.log(`Import complete. Total rows: ${total}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


