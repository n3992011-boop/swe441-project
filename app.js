// BUG (KAN-4 Technical Debt): No code organization — all logic in global scope,
// no separation of concerns, no modules or classes.

let books = [];
let nextId = 1;

// BUG (KAN-7 Story): No localStorage — books are lost on every page refresh.
// Fix: load from localStorage on startup and save on every change.

function renderBooks(list) {
    const grid = document.getElementById('book-list');

    if (list.length === 0) {
        grid.innerHTML = '<p class="empty-state">No books yet. Add your first book!</p>';
        return;
    }

    // BUG (KAN-5 Security): User input injected via innerHTML without sanitization.
    // A title like <img src=x onerror=alert(1)> will execute arbitrary JavaScript.
    grid.innerHTML = list.map(book => `
        <div class="book-card" data-id="${book.id}">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <span class="genre-badge">${book.genre}</span>
            <div class="book-actions">
                <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
    // BUG (KAN-2 Story): No "Mark as Read" button — read/unread feature is entirely missing.
}

function addBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const genre = document.getElementById('genre').value;

    if (!title || !author || !genre) {
        alert('Please fill in all fields');
        return;
    }

    books.push({ id: nextId++, title, author, genre, read: false });

    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').value = '';

    document.getElementById('book-count').textContent = books.length + ' books';
    renderBooks(books);
}

function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    document.getElementById('book-count').textContent = books.length + ' books';
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

// BUG (KAN-8 Change-Request): No dark mode support.

document.getElementById('add-btn').addEventListener('click', addBook);
document.getElementById('search').addEventListener('input', filterBooks);
document.getElementById('filter-genre').addEventListener('change', filterBooks);

renderBooks(books);
