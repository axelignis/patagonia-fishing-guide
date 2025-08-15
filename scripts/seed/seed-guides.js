/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

async function main() {
  const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Get it from Supabase → Settings → API (Service role). Do NOT commit it.');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);
  const jsonPath = path.resolve(__dirname, '../src/data/guides.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const guides = JSON.parse(raw);

  // Ensure an owner user exists (one shared owner for seed data)
  const ownerEmail = process.env.SEED_OWNER_EMAIL || 'owner@patagonia.local';
  let ownerId = null;
  try {
    const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (list?.data?.users) {
      const found = list.data.users.find((u) => u.email === ownerEmail);
      if (found) ownerId = found.id;
    }
  } catch (e) {
    // ignore
  }
  if (!ownerId) {
    try {
      const created = await supabase.auth.admin.createUser({ email: ownerEmail, email_confirm: true });
      ownerId = created.data.user?.id || null;
    } catch (e) {
      console.error('Cannot create owner user:', e?.error?.message || e?.message);
    }
  }
  if (!ownerId) {
    console.error('Owner user id not available; aborting.');
    process.exit(1);
  }

  for (const g of guides) {
    const payload = {
      name: g.name,
      age: g.age,
      avatar_url: g.avatar,
      cover_url: g.coverImage,
      bio: g.bio,
      location: g.location,
      price_per_day: g.pricePerDay,
      rating: g.rating,
      total_reviews: g.totalReviews,
      languages: g.languages,
      specialties: g.specialties,
      user_id: ownerId,
    };
    const { error } = await supabase.from('guides').upsert(payload);
    if (error) {
      console.error('Error upserting guide', g.name, error.message);
    } else {
      console.log('Upserted guide', g.name);
    }
  }
}

main();


