# Menning er skattstofn — kynning + reiknivél

Next.js app. Ein síða: kynningarslæður efst (skrolla niður), reiknivélin neðst.

## Keyra heima
```bash
npm install
npm run dev      # http://localhost:3000
```

## Setja á Vercel — tvær leiðir

### A) Gegnum vefinn (einfaldast)
1. Settu þessa möppu á GitHub (nýtt repo).
2. Farðu á https://vercel.com → "Add New… → Project" → veldu repoið.
3. Vercel þekkir Next.js sjálfkrafa. Smelltu "Deploy". Búið.

### B) Gegnum skipanalínu
```bash
npm i -g vercel
vercel            # fylgdu leiðbeiningum, fyrsta sinn tengir verkefnið
vercel --prod     # setur í loftið á .vercel.app slóð
```

## Breyta efni
- Kynningarslæður: `components/Kynning.js` (fylkið `slides`).
- Reiknivél og allir útreikningar: `components/Reiknivel.js`.
- Forsendur 2026 (VSK, gjöld) eru efst í `Reiknivel.js`.

## Stækka seinna
Til að geyma marga viðburði í gagnagrunni: bættu við Vercel Postgres eða KV,
og API-route undir `app/api/`. Strúktúrinn er tilbúinn fyrir það.
