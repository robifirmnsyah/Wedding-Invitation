# Fynna & Pipin — Mahogany Romance

Wedding invitation for **5 January 2027**, Yang Garden, Bandung. Customer content lives in `config/wedding.json`. The public page uses `src/components/MahoganyInvitation.tsx` and `src/app/mahogany.css` with `src/app/mahogany-reference.css`.

## Run

Node.js 22 or newer:

```sh
npm ci
npm run dev
npm run build
```

The cover accepts `?to=Nama%20Tamu`. Add `&id=ABCDE` for a registered guest's RSVP. Audio starts only after opening the invitation. Calendar dates use explicit WIB offsets. Photos come from the customer Drive folder; the customer's supplied MP3 is used unchanged.

## Customer data isolation

This project deliberately does **not** read the previous customer's `GOOGLE_*`, Supabase or `ADMIN_PASSWORD` environment variables. Before enabling live RSVP/admin/guestbook, configure the variables in `.env.example` with a **new** spreadsheet and separate admin credentials. Never commit actual secrets.

Required tabs and header rows:

| Tab                    | Columns                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Fynna Pipin Guests     | Kode Undangan, Nama, Jumlah, Kategori, Pihak, Tipe Kontak, Kontak, Status RSVP, Ucapan, Dibuat Pada, Diperbarui Pada |
| Fynna Pipin Categories | ID, Nama, Pihak, Warna                                                                                               |
| Fynna Pipin Wishes     | ID, Nama, Ucapan, Kehadiran, Verified, Dibuat Pada, Replies                                                          |

Grant the configured service account access to that new spreadsheet. `Replies` holds a JSON array. Sheet writes use RAW mode so user messages cannot become spreadsheet formulas. There is no in-memory success fallback: an unavailable sheet produces a visible unavailable/error state and a 503 response. No sample guest data is seeded.

Admin login is `/admin/login`. Use a strong unique `FYNNA_PIPIN_ADMIN_PASSWORD` and a random `FYNNA_PIPIN_SESSION_SECRET` of at least 32 characters. Sessions are signed, expire after eight hours, and use an HttpOnly cookie. Configure hosting rate limits for the admin login and public write endpoints before distributing the invitation widely.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain for social sharing. On Vercel the deployment URL is used when no site URL is supplied.

## Assets

New generated art is in `public/assets/mahogany`: curtains, satin fabric, florals, oval portrait frame and envelope. The revised envelope uses separate CSS layers for its flap, pocket and wax seal, revealing the generated lace card. Lettering is live text. The reference revision adds a candlelit stage, cascading orchids and continuous dark drapery; see `docs/REFERENCE-REVISION.md` for the comparison and prompts. Florals and portrait frames preserve alpha. All production art and customer photos are optimized WebP. `docs/ASSET-PROMPTS.md` records the generation prompts.

The older unused section components remain available as implementation history but are not rendered. Old customer photos, QR codes, music and icon assets are removed from public hosting.

## Verification

Run `npm run build` for production compilation, lint and type checks. Run `node --test tests/customer-config.test.mjs tests/admin-session.test.mjs` for customer details, calendar times and asset references. Browser checks cover opening the envelope, personalized guest names, music, gallery dialog, account-copy controls, responsive layout, reduced motion and unavailable-backend handling.
