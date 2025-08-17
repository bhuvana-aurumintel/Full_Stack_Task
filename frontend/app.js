
let BASE_URL = "https://fd74b6fdb022.ngrok-free.app";
const itemsList = document.getElementById("items");
const form = document.getElementById("item-form");
const statusEl = document.getElementById("status");

function setStatus(msg) { statusEl.textContent = msg || ""; }

async function fetchItems() {
  setStatus("Loading...");
  try {
    const res = await fetch(`${BASE_URL}/items`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderItems(data);
    setStatus("");
  } catch (err) {
    console.error(err);
    setStatus("Failed to load items. Check backend URL / CORS / ngrok.");
  }
}

function renderItems(items) {
  itemsList.innerHTML = "";
  if (!items.length) {
    itemsList.innerHTML = "<li>No items yet. Add one above!</li>";
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="name">#${item.id} — ${item.name}</div>
      <div class="desc">${item.description ?? ""}</div>
    `;
    itemsList.appendChild(li);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  if (!name) { setStatus("Please enter a name."); return; }

  setStatus("Saving...");
  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || null }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    // Refresh list
    await fetchItems();
    form.reset();
    setStatus("Item added!");
    setTimeout(() => setStatus(""), 1000);
  } catch (err) {
    console.error(err);
    setStatus(`Failed to add item: ${err.message}`);
  }
});

// boot
fetchItems();

