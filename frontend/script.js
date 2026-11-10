// If this page is opened from the FastAPI server (port 8000), use relative URLs.
// Otherwise (file://, Live Server, etc.) point at the local API directly.
const API_BASE = location.port === "8000" ? "" : "http://127.0.0.1:8000";

const form = document.getElementById("form");
const result = document.getElementById("result");
const button = document.getElementById("submit");
const fields = ["MedInc", "HouseAge", "Population"];

function showResult(html, isError = false) {
  result.className = isError ? "error" : "";
  result.innerHTML = html;
  result.hidden = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate inputs
  let valid = true;
  const payload = {};
  for (const id of fields) {
    const el = document.getElementById(id);
    const raw = el.value.trim();
    const num = Number(raw);
    const bad = raw === "" || Number.isNaN(num) || (id === "HouseAge" && !Number.isInteger(num));
    el.classList.toggle("invalid", bad);
    if (bad) valid = false;
    payload[id] = num;
  }
  if (!valid) {
    showResult('<p class="message">Fill in all fields. House age must be a whole number.</p>', true);
    return;
  }

  button.disabled = true;
  button.textContent = "Predicting…";

  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      const detail = Array.isArray(data.detail)
        ? data.detail.map((d) => `${d.loc.slice(-1)}: ${d.msg}`).join("; ")
        : "The server rejected the input.";
      showResult(`<p class="message">${detail}</p>`, true);
      return;
    }

    // The model predicts in units of $100,000
    const dollars = data.prediction * 100000;
    const formatted = dollars.toLocaleString("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    });
    showResult(`
      <p class="label">Estimated median price</p>
      <p class="value">${formatted}</p>
      <p class="note">Raw model output: ${data.prediction.toFixed(4)}</p>
    `);
  } catch (err) {
    showResult('<p class="message">Can\'t reach the API. Make sure the server is running on port 8000.</p>', true);
  } finally {
    button.disabled = false;
    button.textContent = "Predict price";
  }
});
