# SmartStock Android and Google Play checklist

Current app is a **mobile-installable PWA prototype**, not yet a Google Play APK/AAB and not published on Play.

## Test the mobile web app
1. Open https://smartstock-inventory-six.vercel.app in Chrome on Android.
2. Choose browser menu → Add to Home screen / Install app (if available).
3. Test Google login, adding a product, import, camera support, sale, receipt, and offline connectivity handling.

## Publishing to Google Play
1. Prepare a suitable Android build. Options: Trusted Web Activity via Bubblewrap/PWABuilder or a Capacitor Android wrapper. **Do not claim Google Play publication before uploading and approval.**
2. Generate actual PNG launcher icons and appropriate adaptive icon assets in 192px and 512px sizes (the web manifest currently uses an SVG icon only). Add screenshots, privacy policy, and support contact.
3. For Trusted Web Activity, add Android Digital Asset Links at `/.well-known/assetlinks.json` with the **real signed APK certificate SHA-256** and final package ID. Never invent this fingerprint.
4. Test signing, Google OAuth redirect, camera/BarcodeDetector support, file imports, downloads, and printing on Android.
5. Review Google Play policies for account deletion, privacy, data safety, financial/account information, and app quality; complete declarations honestly.
6. Use a Play Console developer account owned or managed by an eligible adult/organization, as required by local and platform rules, with parent/guardian assistance where needed.
7. Test with a private/internal track before production release.

### Security before commercial launch
Independently validate Supabase row-level security with two accounts, transaction integrity, backup/recovery, privacy documentation, and real-shop compliance. Printable transaction slips are **not fiscal receipts**.
