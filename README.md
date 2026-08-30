# K.A. Agency – Contract Signing

A standalone page where a client fills in their details, picks a package,
reviews the full terms, types their name as an electronic signature, and
submits. On submit:

- A complete signed contract PDF is generated in the browser and downloaded
  to the client's device.
- A record (with the PDF attached) is emailed to K.A. Agency via Resend.

## Known limitation (by design, per your choice)

This is an **email-only record with no server-side lock enforcement**.
The "Sign & Submit" button disables the form for that browser session, but
there is no database, so nothing stops the same link from being reopened
and submitted again later. If you ever want a real, tamper-proof "signed
once, locked forever" record, that needs a database (e.g. Supabase) to
track signed status server-side — let me know if you want that added.

## Setup

1. Create a **new empty repository** on GitHub (no README/template), e.g.
   `ka-agency-contract`.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial contract signing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ka-agency-contract.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com), import the new GitHub repo as a
   new project, and deploy.
4. In the Vercel project's **Settings > Environment Variables**, add:
   - `RESEND_API_KEY` — the same key you already use for the inquiry form's
     Resend account.
5. Redeploy after adding the env var so it takes effect.

That's it — the deployed URL is what you send to a client to sign.

## Notes

- Emails only reliably deliver to `gemkam@gmail.com` while you're on
  Resend's free sandbox sender (`onboarding@resend.dev`) — same restriction
  as the inquiry form. If you want the client to also get an email copy
  directly (not just their local PDF download), you'll need to verify a
  domain in Resend, same as discussed for the inquiry form.
- The client always gets their own PDF copy via the browser download,
  regardless of the email step succeeding or failing.
