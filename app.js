// ─── State ────────────────────────────────────────────────────────────────────

let books = loadBooks();
let nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
let editingId = null;

// ─── Storage ──────────────────────────────────────────────────────────────────

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const stored = localStorage.getItem('books');
    return stored ? JSON.parse(stored) : [];
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderBooks(list) {
    const grid = document.getElementById('book-list');

    if (list.length === 0) {
        grid.innerHTML = '<p class="empty-state">No books yet. Add your first book!</p>';
        return;
    }

    // BUG (KAN-19 Security Fix): User input injected via innerHTML without sanitization.
    grid.innerHTML = list.map(book => `
        <div class="book-card ${book.read ? 'read' : ''}" data-id="${book.id}">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <span class="genre-badge">${book.genre}</span>
            <div class="book-actions">
                <button class="btn-read" onclick="toggleRead(${book.id})">${book.read ? 'Unmark' : 'Mark as Read'}</button>
                <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateBookCount() {
    document.getElementById('book-count').textContent = books.length + ' books';
}

// ─── Book Operations ──────────────────────────────────────────────────────────

function addBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const genre = document.getElementById('genre').value;

    if (!title || !author || !genre) {
        alert('Please fill in all fields');
        return;
    }

    if (editingId !== null) {
        const book = books.find(b => b.id === editingId);
        if (book) { book.title = title; book.author = author; book.genre = genre; }
        editingId = null;
        document.getElementById('add-btn').textContent = 'Add Book';
    } else {
        books.push({ id: nextId++, title, author, genre, read: false });
    }

    saveBooks();
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').value = '';
    updateBookCount();
    renderBooks(books);
}

function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    editingId = id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('genre').value = book.genre;
    document.getElementById('add-btn').textContent = 'Update Book';
}

function toggleRead(id) {
    const book = books.find(b => b.id === id);
    if (book) book.read = !book.read;
    saveBooks();
    renderBooks(books);
}

function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    saveBooks();
    updateBookCount();
    renderBooks(books);
}

function filterBooks() {
    const search = document.getElementById('search').value.toLowerCase();
    const genre = document.getElementById('filter-genre').value;

    const filtered = books.filter(book => {
        const matchTitle = book.title.toLowerCase().includes(search);
        const matchGenre = genre === '' || book.genre === genre;
        return matchTitle && matchGenre;
    });

    renderBooks(filtered);
}

// ─── Event Handlers ───────────────────────────────────────────────────────────

document.getElementById('add-btn').addEventListener('click', addBook);
document.getElementById('search').addEventListener('input', filterBooks);
document.getElementById('filter-genre').addEventListener('change', filterBooks);
document.getElementById('dark-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.getElementById('dark-toggle').textContent =
        document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ─── Init ─────────────────────────────────────────────────────────────────────

updateBookCount();
renderBooks(books);
