# JewelOS
Jewellery SaaS product for MSME businesses

# JewelOS — Revised 3-Phase Plan
## Based on your Phase 1 requirements

---

## DELIVERY HEAD ASSESSMENT OF YOUR 7 REQUESTED P1 MODULES

| Module | Your Request | Decision | Reason |
|--------|-------------|----------|--------|
| Product Catalogue & Inventory | Phase 1 | ✅ P1-A — approved | Core foundation, medium complexity, low risk |
| Purchase & Procurement (B2B Inbound) | Phase 1 | ✅ P1-A — approved | Needed day one before selling, well-scoped |
| Sales POS & Billing Engine | Phase 1 | ✅ P1-A — approved (3 sprints) | Revenue engine, very high complexity — allocate full time |
| Customer CRM | Phase 1 | ✅ P1-A — approved | Straightforward, legally required KYC |
| All Savings Scheme Types | Phase 1 | ⚠️ P1-A: 3 of 4 types | FIXED_MONEY + DAILY_CHIT + FLEXIBLE in P1. Weight-accumulation → P2 (different accounting: grams ledger, not money ledger — must not be rushed) |
| Reports, Analytics & Dashboards | Phase 1 | ⚠️ Split: compliance reports P1, charts P3 | GSTR-1/3B + day book + gold P&L = P1 (legally mandatory). Recharts dashboards → P3 (zero value without 6 months of data) |
| Gold Loan / Brokerage | Phase 1 | 🔴 P1-B — legal gate required | Needs NBFC/money lending licence confirmation in writing before building. Start legal inquiry TODAY — runs parallel with P1-A. If confirmed by Month 3, live by Month 5. |

---

## REVISED PHASE 1 = 10 MODULES, 5 MONTHS

### PHASE 1-A — Months 1–4 (9 modules, Agents A1–A5)

**Sprint 1 — Weeks 1–2 · Agent A1 — Foundation**
- Full Prisma schema with ALL enums (PricingType, PurchaseType, TransactionType, SchemeType, UnitOfMeasure, StockCategory)
- NextAuth v5 phone OTP + RBAC middleware
- Responsive layout shell: sidebar desktop + bottom tab nav mobile
- Store Setup: business profile, branches, safe locker, live rate board, staff RBAC
- .cursor/rules with 14 constraints + seed data
- **Gate:** `npx prisma db push` ✓ · `npx tsc --noEmit` ✓ · git commit

**Sprint 2 — Weeks 3–4 · Agent A2 — Inventory & Procurement**
- Product catalogue: virtual scrolling, RFID/barcode, pricing_type respected in ALL calculations
- WEIGHT_BASED: price = net_weight × live_rate + making + stone. FIXED_MRP: price = supplier_mrp (no rate formula)
- Purchase Order: purchase_type (OUTRIGHT/CONSIGNMENT_INWARD/ADVANCE_BOOKING), unit_of_measure, wastage_pct
- GRN: flag-driven — skip scale entry for gifts (requires_weight_verification=false), mandatory for metal
- Supplier ledger: dual-column Rs. balance AND grams balance simultaneously
- Bullion raw material stock category + consumption tracking
- **Gate:** Add gold ring (WEIGHT_BASED) + gift frame (FIXED_MRP) → verify different pricing. PO → GRN → stock added. Supplier metal account shows gram balance.

**Sprint 3 — Weeks 5–8 · Agent A3 — Sales POS (3 sprint block)** ⭐ MOST CRITICAL
- Weeks 5–6: TransactionSession engine + POS layout + cart with per-line pricing + per-line GST
- Weeks 6–7: Exchange flow, net settlement direction logic (STORE_PAYS flip), KYC auto-triggers
- Weeks 7–8: Split payment modal, invoice PDF (A4+58mm thermal), WhatsApp PDF link, offline service worker + IndexedDB queue
- **Gate:** Manually test ALL 7 transaction combinations on real tablet:
  1. Buy gold only
  2. Buy mixed cart (gold + gifts — two different GST rates on one invoice)
  3. Sell gold only (KYC trigger at Rs.50,000)
  4. Exchange: old gold → new gold (same metal)
  5. Cross-metal exchange: sell gold → buy silver
  6. Exchange where store pays (old gold value > new purchase)
  7. Mixed visit: buy + repair drop-off + scheme payment
  - CA validates per-line GST JSON output before signing off

**Sprint 4 — Weeks 9–10 · Agent A4 — CRM + 3 Scheme Types**
- Customer 360: phone as primary UID, KYC, Aadhaar AES-256 encrypted, DOB/anniversary
- Fuzzy search by name and phone (handles Indian name variations)
- Loyalty tier: Bronze/Silver/Gold/Diamond — auto-calculate from lifetime_purchase_value
- FIXED_MONEY scheme (11+1): installment tracking, maturity alert, scheme redemption as BILL CREDIT (not payment mode)
- DAILY_CHIT scheme: field agent collection log, mobile-first collection UI, daily installment tracking
- FLEXIBLE scheme: variable installment amounts, maturity = sum of all installments + bonus rate
- **NOTE: WEIGHT_ACCUMULATION moves to Phase 2 — it has a separate grams ledger with fundamentally different accounting**
- **Gate:** Enroll in 11+1 → 5 installments → maturity alert fires → redeem at POS as bill credit. Enroll in daily chit → agent logs 7 daily collections → running total correct.

**Sprint 5 — Weeks 11–12 · Agent A5 — Finance & Compliance Reports**
- Double-entry auto-journal hooks: every sale/purchase/return/payment auto-posts
- Day book: pessimistic locking, open/close/approve workflow, cash denomination counter
- Pre-seeded jewellery chart of accounts: Gold Stock A/c, Silver Stock A/c, Making Charges Income, Wastage A/c
- GSTR-1 JSON (per-line HSN-wise) + GSTR-3B summary — **CA must verify before go-live**
- Gold stock P&L: Supabase Realtime subscription on MetalRate → auto-recompute unrealised gain/loss
- Basic reports: daily sales summary, stock ledger, supplier outstanding, Tally XML export
- **NOTE: Recharts executive dashboards → Phase 3. They need real data to be meaningful.**
- **Gate:** CA verifies GSTR-1 JSON ✓ · Day book open/close cycle tested ✓ · Gold P&L auto-updates on rate change ✓

**Sprint 6 — Weeks 13–14 · A2 extension — Inter-Branch Transfer**
- *Added by delivery head: if you have multiple branches from launch, stock must move between them*
- 3-state model: REQUESTED → IN_TRANSIT → RECEIVED
- Items in IN_TRANSIT are NOT in either branch's available stock (prevents double-counting)
- Transfer challan PDF + e-way bill data for interstate movements
- Branch manager approval + RFID scan confirmation at destination
- **Gate:** Transfer 5 items Branch A→B → disappears from A available stock but remains in company total → receive at B → company total unchanged.

**Sprint 7 — Weeks 15–16 · Integration, PWA & Pilot Launch**
- Full integration testing: every module working together
- PWA: service worker, offline POS queue, install prompt, Lighthouse PWA = 100
- Sentry error monitoring setup (free tier)
- Shadow pilot: 1 full week with a real jeweller doing their actual daily operations
- Fix all critical bugs from pilot
- **Gate:** 1 week shadow pilot with zero data-loss incidents ✓ · Phase 1-A go-live approved

---

### PHASE 1-B — Month 4–5 · Agent A7 — Gold Loan (CONDITIONAL)
*Runs parallel with Phase 1-A integration testing. Does NOT block Phase 1-A go-live.*

**PREREQUISITE:** Written legal/licensing confirmation must be received before first line of code.
**START THE LEGAL INQUIRY TODAY** — while Phase 1-A is being built.

If legal confirmation arrives by Month 3 → Gold Loan goes live by Month 5.
If legal takes longer → Phase 1-A still goes live on schedule. Gold Loan slides independently.

Modules:
- GoldLoan: principal, pledged gold (weight+purity), LTV ratio, locker allocation, admin fee, documentation charges
- InterestSchedule: monthly rate, due dates, overdue tracking, penalty calculation
- LoanRepayment: interest-first allocation, partial/full payments, outstanding balance
- PledgedItem: photo, weight, declared value, insurance reference
- Loan closure: zero-balance verify → locker release → closure certificate
- Default workflow: 30-day notice → 60-day legal notice → auction approval gate (owner must approve)
- KYC mandatory for ALL loan customers regardless of amount

---

## PHASE 2 — Months 6–9 (after 5+ paying customers on P1)

### Sprint 1 — Weeks 1–3: Weight-Accumulation Scheme (Agent A4 extension)
- grams_balance ledger per customer (not a money ledger — completely different accounting)
- Each installment = grams_purchased = installment_amount / today_MCX_rate
- At maturity: total_grams × current_rate = maturity value applied as bill credit
- Grams ledger reconciliation report for audits

### Sprint 2 — Weeks 4–6: Repair & Job Work Service (Agent A6)
- Job card: mandatory weight_in, 2+ photos, karigar assignment, stage tracker
- Weight reconciliation: weight_in vs (weight_out + wastage_filings) — variance needs manager approval
- Karigar gold outstanding balance = liability in Finance module balance sheet
- Repair billing on delivery: 18% GST on labour (different from 3% on jewellery sale)
- Job work outward: JobWorkOrder model, GST challan, 1-year deadline flag at 11 months

### Sprint 3 — Weeks 7–9: Custom Make-to-Order (Agent A6 extension)
- Custom order: design photo upload, rate lock (LOCKED/FLOATING), advance receipt
- Production stages: design_approval→casting→polishing→stone_setting→QC→delivery
- Final billing: actual_weight × locked_rate + making + stone − advance_paid

### Sprint 4 — Weeks 10–12: Supplier Intelligence (Agent A2 extension)
- Supplier scorecard: avg rate vs MCX benchmark, rejection rate, lead time history
- Making charge trend per manufacturer for annual negotiation
- Best supplier recommendation on PO creation

---

## PHASE 3 — Months 10–15 (after 15+ customers, 6+ months historical data)

### Sprint 1: Executive Dashboards & Analytics (Agent A9)
- Build ONLY after 6+ months of real data — zero value before this
- Recharts: revenue trend, category mix donut, gold rate correlation dual-axis
- Stock ageing: 0-30/31-90/91-180/180+ day buckets, slow-mover auto-flag
- Gold rate P&L: unrealised gain/loss on all unsold stock at today's rate
- Customer LTV, scheme maturity calendar, karigar productivity, GSTR reconciliation

### Sprint 2: B2B Trade Portal (Agent A8)
- Dealer accounts: trade price list, credit limit, payment terms
- Consignment outward: SENT→SOLD→RETURNED + ageing alerts
- Dealer metal account: grams balance (not just Rs.) + monetary settlement
- Wholesale GST invoice (B2B format) + credit limit auto-hold

### Sprint 3: Marketing & Online Catalogue (Agent A9 extension)
- WhatsApp campaign engine: segments by tier/maturity/dormancy, template manager
- Online product catalogue: live pricing via SSR with 5-min revalidation
- BOPIS: order online → branch notification → pickup confirmation
- Festive bulk orders: corporate coins, wedding sets, instalment billing
- Customer jewellery storage: locker, item photos, annual fee, access log

---

## 9 AGENT SUMMARY

| Agent | Name | Phase | Key Modules |
|-------|------|-------|-------------|
| A1 | Foundation | P1-A Wk 1–2 | Schema, auth, layout, store setup |
| A2 | Inventory & Procurement | P1-A Wk 3–4 + P1 ext + P2 | Product catalogue, GRN, supplier ledger, inter-branch |
| A3 | Sales POS & Billing | P1-A Wk 5–8 ⭐ | TransactionSession, all transaction types, per-line GST, invoices |
| A4 | CRM & Schemes | P1-A Wk 9–10 + P2 | Customer 360, KYC, loyalty, 3 scheme types P1, weight-accum P2 |
| A5 | Finance & Reports | P1-A Wk 11–12 | Double-entry, day book, GSTR-1/3B, gold P&L, Tally export |
| A7 | Gold Loan & Storage | P1-B Month 4–5 | Gold loan, interest, pledged locker, default workflow |
| A6 | Repair & Custom Orders | P2 | Job cards, karigar, weight reconciliation, custom orders |
| A8 | B2B Trade Portal | P3 | Dealer accounts, consignment outward, dealer metal accounts |
| A9 | Analytics & Marketing | P3 | Recharts dashboards, WhatsApp campaigns, online catalogue |

---

## 3 THINGS TO DO THIS WEEK (before writing any code)

1. **Start legal inquiry on Gold Loan** — Contact a CA or legal advisor today. Ask specifically about NBFC licence and state money lending licence requirements for your state. This is the only thing that can cause Phase 1-B to slip.

2. **Confirm metal rate data source** — Manual entry is the simplest Phase 1 approach. IBJA daily (free, updates once/day) is Phase 2. MCX live feed (paid) is Phase 3. Decide before Agent A1 builds the rate board.

3. **Find a jewellery-specialist CA** — You need someone who can verify the per-line GST output from Agent A3 before go-live. The GST calculation must be correct before the first real invoice is issued.