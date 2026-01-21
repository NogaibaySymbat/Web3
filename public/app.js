const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const loadingEl = document.getElementById("loading");
const emptyEl = document.getElementById("emptyState");

const form = document.getElementById("blogForm");
const formTitle = document.getElementById("formTitle");
const editIdEl = document.getElementById("editId");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const authorEl = document.getElementById("author");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const refreshBtn = document.getElementById("refreshBtn");

const toastEl = document.getElementById("toast");

const modal = document.getElementById("confirmModal");
modal.hidden = true;
const modalCancel = document.getElementById("modalCancel");
const modalDelete = document.getElementById("modalDelete");

let deleteTargetId = null;

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  setTimeout(() => (toastEl.hidden = true), 2200);
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function api(path, options = {}) {
  const res = await fetch(path, options);
  const text = await res.text();

  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function loadBlogs() {
  loadingEl.hidden = false;
  emptyEl.hidden = true;
  listEl.innerHTML = "";

  try {
    const blogs = await api("/blogs");
    countEl.textContent = blogs.length;

    if (!blogs.length) {
      emptyEl.hidden = false;
      return;
    }

    listEl.innerHTML = blogs.map(b => `
      <article class="blog">
        <h3 class="blog__title">${escapeHtml(b.title)}</h3>
        <p class="blog__body">${escapeHtml(b.body)}</p>
        <div class="blog__meta">
          <span>By <b>${escapeHtml(b.author || "Anonymous")}</b></span>
          <span>${formatDate(b.updatedAt || b.createdAt)}</span>
        </div>
        <div class="blog__actions">
          <button class="btn smallBtn" data-action="edit" data-id="${b._id}">Edit</button>
          <button class="btn btn--danger smallBtn" data-action="delete" data-id="${b._id}">Delete</button>
        </div>
      </article>
    `).join("");

  } catch (err) {
    showToast(err.message);
  } finally {
    loadingEl.hidden = true;
  }
}

function setEditMode(blog) {
  editIdEl.value = blog._id;
  titleEl.value = blog.title || "";
  bodyEl.value = blog.body || "";
  authorEl.value = blog.author || "";

  formTitle.textContent = "Edit blog";
  submitBtn.textContent = "Save changes";
  cancelEditBtn.hidden = false;
}

function resetForm() {
  editIdEl.value = "";
  form.reset();
  formTitle.textContent = "Create a blog";
  submitBtn.textContent = "Create";
  cancelEditBtn.hidden = true;
}

function openModal(id) {
  deleteTargetId = id;
  modal.hidden = false;
}

function closeModal() {
  deleteTargetId = null;
  modal.hidden = true;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

listEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  try {
    if (action === "edit") {
      const blog = await api(`/blogs/${id}`);
      setEditMode(blog);
      showToast("Edit mode enabled");
    }

    if (action === "delete") {
      openModal(id);
    }
  } catch (err) {
    showToast(err.message);
  }
});

modalCancel.onclick = closeModal;
modalDelete.onclick = async () => {
  if (!deleteTargetId) return;
  try {
    await api(`/blogs/${deleteTargetId}`, { method: "DELETE" });
    showToast("Deleted");
    closeModal();
    loadBlogs();
    resetForm();
  } catch (err) {
    showToast(err.message);
  }
};

cancelEditBtn.onclick = () => {
  resetForm();
  showToast("Edit cancelled");
};

refreshBtn.onclick = loadBlogs;

form.onsubmit = async (e) => {
  e.preventDefault();

  const payload = {
    title: titleEl.value.trim(),
    body: bodyEl.value.trim(),
    author: authorEl.value.trim()
  };

  const id = editIdEl.value;

  try {
    if (!payload.title || !payload.body) {
      showToast("Title and Body are required");
      return;
    }

    if (!id) {
      await api("/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("Created");
    } else {
      await api(`/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showToast("Updated");
    }

    resetForm();
    loadBlogs();
  } catch (err) {
    showToast(err.message);
  }
};

loadBlogs();
