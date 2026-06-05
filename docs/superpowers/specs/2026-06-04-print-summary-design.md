# Print Summary Design

## Goal

Add a "Print Summary" button to the bottom of the Home Sale Calculator that triggers `window.print()`, producing a dark on-brand PDF of the calculated results.

## Approach

**Option B — hidden print component.** A `<PrintSummary>` component renders alongside the calculator, invisible on screen, and becomes the only thing visible when printing. The screen UI is completely untouched. This avoids the unreliability of restyling `<input>` elements in `@media print` and gives full control over the print layout.

## Architecture

All changes are confined to `src/App.jsx`. No new files, no new dependencies.

**Two additions to `App.jsx`:**

1. `PrintSummary` component — a new functional component defined in the same file. Receives calculated values as props. Renders a purpose-built dark-themed print layout. Hidden on screen via `display: none`, shown in print via `@media print { .print-only { display: block } }`.

2. "Print Summary" button — rendered at the bottom of `HomeSaleCalculator`, below the profit card. Calls `window.print()`. Only rendered when `numSale > 0`.

No new state. `PrintSummary` reads the same derived values already computed in `HomeSaleCalculator`: `numSale`, `numMortgage`, `totalExpenses`, `netProfit`, and the filtered enabled expenses list.

## PrintSummary Component

**Props:**
- `salePrice: number` — raw numeric sale price
- `mortgageBalance: number` — raw numeric mortgage balance
- `enabledExpenses: array` — pre-filtered array of `{ label, amount, type, value }` objects; computed in `HomeSaleCalculator` before passing down. Only includes expenses where `enabled === true` and `calcExpenseAmount(e) > 0`.
- `netProfit: number`
- `totalExpenses: number`

**Layout (top to bottom):**
1. Header row — "Real Estate" label + "Home Sale / Profit Calculator" title on the left; "PREPARED ON / [date]" on the right. Date is `new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })` evaluated at render time.
2. Two-column figures — Sale Price card, Mortgage Payoff card.
3. Expenses block — one row per enabled expense with amount > 0; label + percentage annotation if `type === "percent"`; amount in red.
4. Net profit card — large profit figure + return-on-sale percentage.
5. Disclaimer — "Estimates only. Consult a real estate professional for exact figures."

**Colors and fonts** match the app exactly: `#0f0e0c` background, `#f0ede8` text, `rgba(255,200,80,...)` gold accents, `#6ee7b7` / `#f87171` for profit/loss, DM Mono / Playfair Display loaded from Google Fonts (already in the `<style>` block in the app).

## Print CSS

Injected into the existing `<style>` tag inside `HomeSaleCalculator`'s return:

```css
@media print {
  .screen-only { display: none !important; }
  .print-only  { display: block !important; }
  body, html   { background: #0f0e0c !important; margin: 0; }
  @page        { margin: 20mm; }
}
.print-only { display: none; }
```

The top-level calculator `<div>` gets `className="screen-only"`. `PrintSummary`'s root `<div>` gets `className="print-only"`. Both are siblings at the root of `HomeSaleCalculator`'s return, wrapped in a fragment.

`print-color-adjust: exact` and `-webkit-print-color-adjust: exact` are set on the `PrintSummary` root so browsers render the dark background and colors rather than stripping them.

## Print Summary Button

Positioned below the profit card, right-aligned, only when `numSale > 0`:

```jsx
{numSale > 0 && (
  <button
    onClick={() => window.print()}
    style={{
      display: "block",
      marginTop: "16px",
      marginLeft: "auto",
      background: "rgba(255,200,80,0.08)",
      border: "1px solid rgba(255,200,80,0.3)",
      borderRadius: "10px",
      padding: "10px 20px",
      fontFamily: "'DM Mono', monospace",
      fontSize: "12px",
      color: "rgba(255,200,80,0.8)",
      letterSpacing: "0.06em",
      cursor: "pointer",
    }}
  >
    ↓ Print Summary
  </button>
)}
```

## What Does Not Appear in Print

- Sale price and mortgage balance inputs
- Expense editor rows (label input, type dropdown, value input, toggle, remove button)
- Preset chip buttons and "Add Custom Expense" button
- The "Return on sale" inline label is reproduced in `PrintSummary` as static text

## Deployment

After implementation: `git add src/App.jsx && git commit`, then `git push`. The existing GitHub Actions workflow builds and deploys automatically.

## Out of Scope

- Custom property address field (not requested)
- Notes/assumptions field (not requested)
- PDF generation library (browser print-to-PDF is sufficient)
- Print preview modal
