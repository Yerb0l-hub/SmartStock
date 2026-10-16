# SmartStock — First Client Pilot Guide (Kazakhstan)

## The simplest offer
Offer a **14-day free guided pilot** for one small store at a time. This is a setup and training service, **not** a paid SaaS subscription. Do not promise accounting, tax compliance, backups, or official fiscal receipts.

Live demo: https://smartstock-inventory-six.vercel.app

### Pilot scope
- One independent shop owner; they register their own account and retain their login.
- Add a small, non-sensitive sample catalog (10–20 products).
- Teach Add Product, Adjust Stock, Record Sale, Low Stock Alerts, Analytics, and CSV Export.
- Compare physical inventory against app quantities after trial transactions.
- Keep all test transactions clearly marked as test data.
- Request feedback on ease of use and missing features.

### Mandatory checks before real business data
- Test privacy with **two separate accounts**: each must only see its own records.
- Verify Supabase RLS policies, sales transaction integrity, and product deletion behavior.
- Validate recovery/backups and handling of interruptions.
- Test scanner on actual shop devices; browser BarcodeDetector may not be supported.
- Confirm printed PDF is an internal record **not a fiscal receipt**.
- Get permission before handling shop data. Never ask owners to share passwords.
- Remove test data before live use, if applicable.

### Suggested conversation
Сәлеметсіз бе! Мен шағын дүкендерге арналған SmartStock қойма есебі жүйесін жасап жатырмын. Тауар қалдығын, сатылымдарды және аналитиканы көрсетеді. Алғашқы дүкендерге 14 күндік тегін тест пен қысқа таныстыру ұсынамын. Қызық болса, 10 минуттық демо көрсетемін. Бұл әзірге пилот: ресми кассалық жүйені алмастырмайды.

### Sample pilot checklist
- [ ] Store owner agrees to trial and understands limitations.
- [ ] Shop creates its own account and confirms email.
- [ ] Demo tested using fictional sample products.
- [ ] Sales correctly reduce stock; alerts display.
- [ ] CSV exported and reviewed.
- [ ] Cross-account privacy and backup/recovery checked **before** entering actual business records.
- [ ] Feedback recorded with permission.
- [ ] Decision made whether to continue pilot or stop.

### Example pricing (not a verified market quote)
If the pilot succeeds, you can **propose** a one-time configuration and training fee of KZT 15,000–25,000, subject to the scope and support terms. No payments, subscriptions or legal contracts are implemented in SmartStock. Because the developer is under 18, involve a parent/guardian in any commercial agreement and payment arrangements.

## Portfolio metrics to record only after they happen
Number of shops in trials; number of items entered; time saved (if measured); bugs corrected from actual feedback. Never invent testimonials, customers or revenue.
