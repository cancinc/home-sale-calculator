# Print Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Print Summary" button that produces a dark on-brand PDF of the calculated results via `window.print()`.

**Architecture:** A `PrintSummary` component renders alongside the calculator as a sibling (React fragment), hidden on screen via `.print-only { display: none }`, shown in print via `@media print`. The existing calculator div gets `className="screen-only"` and is hidden in print. No new files, no new dependencies.

**Tech Stack:** React 19, Vite 8, inline styles (existing pattern), `@media print` CSS, `window.print()`.

---

## File Map

| File | Change |
|---|---|
| `src/App.jsx` | (1) Add `PrintSummary` component. (2) Add print CSS to `<style>` tag. (3) Add `enabledExpenses` derived value. (4) Wrap return in fragment + add `className="screen-only"` to main div. (5) Add `<PrintSummary>` at start of fragment. (6) Add Print button between profit card and disclaimer. |

---

### Task 1: Add the `PrintSummary` component

**Files:**
- Modify: `src/App.jsx` — insert new component between `PRESET_EXPENSES` (line 68) and `export default function HomeSaleCalculator` (line 70)

No test framework is installed and this component is pure rendering markup, so verification is a build check.

- [ ] **Step 1: Insert `PrintSummary` above `HomeSaleCalculator` in `src/App.jsx`**

Add the following block after the closing `];` of `PRESET_EXPENSES` on line 68, before the blank line and `export default function HomeSaleCalculator()`:

```jsx
function PrintSummary({ salePrice, mortgageBalance, enabledExpenses, netProfit, totalExpenses }) {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const profitColor = netProfit > 0 ? "#6ee7b7" : netProfit < 0 ? "#f87171" : "#f0ede8";
  const profitLabel = netProfit > 0 ? "NET PROFIT" : netProfit < 0 ? "NET LOSS" : "BREAK EVEN";

  return (
    <div
      className="print-only"
      style={{
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        background: "#0f0e0c",
        color: "#f0ede8",
        fontFamily: "'DM Sans', sans-serif",
        padding: "0",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "20px",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "rgba(255,200,80,0.7)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Real Estate
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#f0ede8",
              lineHeight: 1.1,
            }}
          >
            Home Sale
            <br />
            <span style={{ color: "rgba(255,200,80,0.9)" }}>Profit Calculator</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              color: "rgba(240,237,232,0.35)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Prepared on
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px",
              color: "rgba(240,237,232,0.6)",
              marginTop: "3px",
            }}
          >
            {date}
          </div>
        </div>
      </div>

      {/* Core figures */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "rgba(255,200,80,0.6)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Sale Price
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 700 }}>
            {formatCurrency(salePrice)}
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "rgba(255,200,80,0.6)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Mortgage Payoff
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "20px", fontWeight: 700 }}>
            {formatCurrency(mortgageBalance)}
          </div>
        </div>
      </div>

      {/* Expenses */}
      {enabledExpenses.length > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "rgba(255,200,80,0.6)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Expenses & Deductions
          </div>
          {enabledExpenses.map((exp, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                paddingBottom: i < enabledExpenses.length - 1 ? "10px" : 0,
                marginBottom: i < enabledExpenses.length - 1 ? "10px" : 0,
                borderBottom:
                  i < enabledExpenses.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <span style={{ color: "rgba(240,237,232,0.5)" }}>
                {exp.label}
                {exp.type === "percent" && (
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "11px",
                      marginLeft: "6px",
                      opacity: 0.6,
                    }}
                  >
                    ({exp.value}% of sale)
                  </span>
                )}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#f87171" }}>
                -{formatCurrency(exp.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Net profit */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          border: `1px solid ${
            netProfit > 0
              ? "rgba(110,231,183,0.25)"
              : netProfit < 0
              ? "rgba(248,113,113,0.25)"
              : "rgba(255,255,255,0.1)"
          }`,
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: profitColor,
              opacity: 0.6,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            {profitLabel}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "42px",
              fontWeight: 700,
              color: profitColor,
              lineHeight: 1,
            }}
          >
            {formatCurrency(Math.abs(netProfit))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              color: "rgba(240,237,232,0.35)",
              marginBottom: "4px",
            }}
          >
            Return on sale
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "22px", color: profitColor }}>
            {salePrice > 0 ? ((netProfit / salePrice) * 100).toFixed(1) + "%" : "—"}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          color: "rgba(240,237,232,0.2)",
        }}
      >
        Estimates only. Consult a real estate professional for exact figures.
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build still passes**

```bash
npm run build 2>&1 | tail -8
```

Expected: `✓ built in ...ms` with no errors. If there's a JSX syntax error, fix it before continuing.

---

### Task 2: Wire `PrintSummary` into `HomeSaleCalculator`, add print CSS, add button

**Files:**
- Modify: `src/App.jsx` — five targeted edits described below

- [ ] **Step 1: Add print CSS to the `<style>` tag**

In `src/App.jsx`, find the `<style>` tag (line ~143). The string currently ends with:

```
        .add-btn:hover { background: rgba(255,200,80,0.12) !important; }
      `}
```

Replace that closing line with:

```
        .add-btn:hover { background: rgba(255,200,80,0.12) !important; }
        .print-only { display: none; }
        @media print {
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
          body, html { background: #0f0e0c !important; margin: 0; }
          @page { margin: 20mm; }
        }
      `}
```

- [ ] **Step 2: Add `enabledExpenses` derived value**

In `src/App.jsx`, find these two lines (line ~89–90):

```js
  const totalExpenses = expenses.reduce((sum, e) => sum + calcExpenseAmount(e), 0);
  const netProfit = numSale - numMortgage - totalExpenses;
```

Add `enabledExpenses` immediately after `netProfit`:

```js
  const totalExpenses = expenses.reduce((sum, e) => sum + calcExpenseAmount(e), 0);
  const netProfit = numSale - numMortgage - totalExpenses;
  const enabledExpenses = expenses
    .filter((e) => e.enabled && calcExpenseAmount(e) > 0)
    .map((e) => ({ label: e.label, amount: calcExpenseAmount(e), type: e.type, value: e.value }));
```

- [ ] **Step 3: Wrap the return in a fragment and add `PrintSummary`**

Find the `return (` at line ~131. The opening of the return currently reads:

```jsx
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0e0c",
```

Replace it with:

```jsx
  return (
    <>
      <PrintSummary
        salePrice={numSale}
        mortgageBalance={numMortgage}
        enabledExpenses={enabledExpenses}
        netProfit={netProfit}
        totalExpenses={totalExpenses}
      />
      <div
        className="screen-only"
        style={{
          minHeight: "100vh",
          background: "#0f0e0c",
```

- [ ] **Step 4: Close the fragment at the end of the return**

Find the two closing lines at the very end of the return (line ~594–595):

```jsx
    </div>
  );
```

Replace with:

```jsx
    </div>
    </>
  );
```

- [ ] **Step 5: Add the Print Summary button**

Find the closing `</div>` of the profit card followed immediately by the disclaimer div (line ~580–582):

```jsx
        </div>

        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
```

Insert the button between them:

```jsx
        </div>

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

        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
```

- [ ] **Step 6: Verify the build passes**

```bash
npm run build 2>&1 | tail -8
```

Expected: `✓ built in ...ms` — no errors.

- [ ] **Step 7: Manual print test**

```bash
npm run dev
```

Open `http://localhost:5173/home-sale-calculator/` in a browser.

1. Enter a sale price (e.g. `650000`) and mortgage balance (e.g. `320000`).
2. Confirm the "↓ Print Summary" button appears below the profit card.
3. Click the button. The print dialog opens.
4. Verify: only the dark-themed summary is visible — not the calculator inputs. Confirm the "Prepared on" date appears top-right. Confirm expenses are listed. Confirm the net profit figure matches the calculator.
5. Save as PDF and open it to confirm dark background and colors render correctly (not stripped out).
6. Kill the dev server (`Ctrl-C`).

- [ ] **Step 8: Commit and push**

```bash
git add src/App.jsx
git commit -m "feat: add print summary with dark on-brand PDF output"
git push
```

Expected: GitHub Actions run triggers. The existing workflow builds and deploys automatically — no extra steps needed.
