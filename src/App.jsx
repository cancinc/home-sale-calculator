import { useState } from "react";

const formatCurrency = (val) => {
  if (val === "" || val === null || val === undefined) return "";
  const num = parseFloat(val);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const parseCurrency = (val) => {
  if (!val) return "";
  return val.toString().replace(/[$,]/g, "");
};

const CurrencyInput = ({ value, onChange, placeholder, className = "" }) => {
  const [focused, setFocused] = useState(false);

  const displayVal = focused
    ? parseCurrency(value)
    : value
    ? formatCurrency(parseFloat(parseCurrency(value)))
    : "";

  return (
    <input
      type="text"
      inputMode="numeric"
      value={focused ? parseCurrency(value) : displayVal}
      placeholder={focused ? "" : placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => onChange(parseCurrency(e.target.value))}
      className={className}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "8px",
        color: "#f0ede8",
        padding: "10px 14px",
        fontSize: "14px",
        fontFamily: "'DM Mono', monospace",
        width: "100%",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
      }}
      onMouseOver={(e) => (e.target.style.borderColor = "rgba(255,200,80,0.5)")}
      onMouseOut={(e) =>
        (e.target.style.borderColor = focused
          ? "rgba(255,200,80,0.8)"
          : "rgba(255,255,255,0.12)")
      }
    />
  );
};

const PRESET_EXPENSES = [
  { label: "Agent Commission (6%)", type: "percent", value: 6 },
  { label: "Closing Costs (2%)", type: "percent", value: 2 },
  { label: "Transfer Tax (1%)", type: "percent", value: 1 },
  { label: "Home Warranty", type: "fixed", value: 500 },
  { label: "Staging", type: "fixed", value: 2000 },
];

export default function HomeSaleCalculator() {
  const [salePrice, setSalePrice] = useState("");
  const [mortgageBalance, setMortgageBalance] = useState("");
  const [expenses, setExpenses] = useState([
    { id: 1, label: "Agent Commission", type: "percent", value: "6", enabled: true },
    { id: 2, label: "Closing Costs", type: "percent", value: "2", enabled: true },
  ]);
  const [nextId, setNextId] = useState(3);

  const numSale = parseFloat(parseCurrency(salePrice)) || 0;
  const numMortgage = parseFloat(parseCurrency(mortgageBalance)) || 0;

  const calcExpenseAmount = (exp) => {
    if (!exp.enabled) return 0;
    const val = parseFloat(exp.value) || 0;
    if (exp.type === "percent") return (numSale * val) / 100;
    return val;
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + calcExpenseAmount(e), 0);
  const netProfit = numSale - numMortgage - totalExpenses;

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: nextId, label: "New Expense", type: "fixed", value: "0", enabled: true },
    ]);
    setNextId(nextId + 1);
  };

  const addPreset = (preset) => {
    setExpenses([
      ...expenses,
      {
        id: nextId,
        label: preset.label,
        type: preset.type,
        value: preset.value.toString(),
        enabled: true,
      },
    ]);
    setNextId(nextId + 1);
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const toggleExpense = (id) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)));
  };

  const profitColor =
    netProfit > 0 ? "#6ee7b7" : netProfit < 0 ? "#f87171" : "#f0ede8";
  const profitLabel =
    netProfit > 0 ? "NET PROFIT" : netProfit < 0 ? "NET LOSS" : "BREAK EVEN";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0e0c",
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(255,200,80,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(100,200,150,0.05) 0%, transparent 60%)",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f0ede8",
        padding: "32px 16px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: rgba(255,200,80,0.8) !important; }
        input::placeholder { color: rgba(240,237,232,0.25); }
        select option { background: #1a1916; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .expense-row:hover .remove-btn { opacity: 1 !important; }
        .preset-chip:hover { background: rgba(255,200,80,0.15) !important; border-color: rgba(255,200,80,0.5) !important; }
        .add-btn:hover { background: rgba(255,200,80,0.12) !important; }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(255,200,80,0.7)",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Real Estate
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.1,
              color: "#f0ede8",
            }}
          >
            Home Sale
            <br />
            <span style={{ color: "rgba(255,200,80,0.9)" }}>Profit Calculator</span>
          </h1>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "rgba(255,200,80,0.6)",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Core Figures
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "rgba(240,237,232,0.5)",
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                }}
              >
                Sale Price
              </label>
              <CurrencyInput value={salePrice} onChange={setSalePrice} placeholder="$0" />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "rgba(240,237,232,0.5)",
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                }}
              >
                Mortgage Balance
              </label>
              <CurrencyInput value={mortgageBalance} onChange={setMortgageBalance} placeholder="$0" />
            </div>
          </div>

          {numSale > 0 && numMortgage > 0 && (
            <div
              style={{
                marginTop: "16px",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "rgba(240,237,232,0.45)" }}>Gross equity</span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: "#f0ede8" }}>
                {formatCurrency(numSale - numMortgage)}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "rgba(255,200,80,0.6)",
                textTransform: "uppercase",
              }}
            >
              Expenses & Deductions
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#f87171" }}>
              -{formatCurrency(totalExpenses)}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="expense-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr 90px 80px 28px",
                  gap: "8px",
                  alignItems: "center",
                  opacity: exp.enabled ? 1 : 0.4,
                  transition: "opacity 0.2s",
                }}
              >
                <button
                  onClick={() => toggleExpense(exp.id)}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "4px",
                    border: `1.5px solid ${exp.enabled ? "rgba(255,200,80,0.7)" : "rgba(255,255,255,0.2)"}`,
                    background: exp.enabled ? "rgba(255,200,80,0.2)" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  {exp.enabled && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="rgba(255,200,80,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </button>

                <input
                  type="text"
                  value={exp.label}
                  onChange={(e) => updateExpense(exp.id, "label", e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    color: "#f0ede8",
                    padding: "8px 10px",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    width: "100%",
                  }}
                />

                <select
                  value={exp.type}
                  onChange={(e) => updateExpense(exp.id, "type", e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    color: "rgba(240,237,232,0.6)",
                    padding: "8px 6px",
                    fontSize: "12px",
                    fontFamily: "'DM Mono', monospace",
                    outline: "none",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <option value="fixed">$ Fixed</option>
                  <option value="percent">% of Sale</option>
                </select>

                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={exp.value}
                    onChange={(e) => updateExpense(exp.id, "value", e.target.value)}
                    min="0"
                    step={exp.type === "percent" ? "0.1" : "100"}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "6px",
                      color: "#f0ede8",
                      padding: "8px 10px",
                      paddingRight: exp.type === "percent" ? "22px" : "10px",
                      fontSize: "13px",
                      fontFamily: "'DM Mono', monospace",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                  {exp.type === "percent" && (
                    <span
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(255,200,80,0.5)",
                        fontSize: "12px",
                        pointerEvents: "none",
                      }}
                    >
                      %
                    </span>
                  )}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeExpense(exp.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#f87171",
                    opacity: 0,
                    transition: "opacity 0.15s",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              className="add-btn"
              onClick={addExpense}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "rgba(240,237,232,0.6)",
                padding: "7px 14px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s",
              }}
            >
              + Custom Expense
            </button>
            {PRESET_EXPENSES.slice(2).map((p, i) => (
              <button
                key={i}
                className="preset-chip"
                onClick={() => addPreset(p)}
                style={{
                  background: "rgba(255,200,80,0.06)",
                  border: "1px solid rgba(255,200,80,0.2)",
                  borderRadius: "8px",
                  color: "rgba(255,200,80,0.7)",
                  padding: "7px 12px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.03em",
                  transition: "all 0.2s",
                }}
              >
                + {p.label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${netProfit > 0 ? "rgba(110,231,183,0.25)" : netProfit < 0 ? "rgba(248,113,113,0.25)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "16px",
            padding: "28px 24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
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
                  fontSize: "clamp(32px, 7vw, 48px)",
                  fontWeight: 700,
                  color: profitColor,
                  lineHeight: 1,
                }}
              >
                {numSale > 0 ? formatCurrency(Math.abs(netProfit)) : "—"}
              </div>
            </div>

            {numSale > 0 && (
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(240,237,232,0.35)",
                    marginBottom: "4px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Return on sale
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "20px",
                    color: profitColor,
                  }}
                >
                  {numSale > 0 ? ((netProfit / numSale) * 100).toFixed(1) + "%" : "—"}
                </div>
              </div>
            )}
          </div>

          {numSale > 0 && (
            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                { label: "Sale Price", val: numSale, color: "#f0ede8" },
                { label: "Mortgage Payoff", val: -numMortgage, color: "#f87171" },
                ...expenses
                  .filter((e) => e.enabled && calcExpenseAmount(e) > 0)
                  .map((e) => ({
                    label: e.label,
                    val: -calcExpenseAmount(e),
                    color: "#f87171",
                    sub: e.type === "percent" ? `${e.value}% of sale` : null,
                  })),
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "rgba(240,237,232,0.45)" }}>
                    {row.label}
                    {row.sub && (
                      <span style={{ fontSize: "11px", marginLeft: "6px", opacity: 0.5 }}>
                        ({row.sub})
                      </span>
                    )}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: row.color }}>
                    {row.val >= 0 ? "+" : ""}
                    {formatCurrency(row.val)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "11px",
            color: "rgba(240,237,232,0.2)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Estimates only. Consult a real estate professional for exact figures.
        </div>
      </div>
    </div>
  );
}
