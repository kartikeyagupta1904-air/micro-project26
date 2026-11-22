require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 24 || /^(replace-this|generate-a-new)/.test(JWT_SECRET)) {
  console.error('Set JWT_SECRET in .env to a random string at least 24 characters long (not the example text).');
  process.exit(1);
}
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5500').split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '100kb' }));

const db = new Database(
process.env.DB_path||
path.join(__dirname, 'granthalaya.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roll TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('lib','stu')),
  department TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 1 CHECK(total >= 0),
  available INTEGER NOT NULL DEFAULT 1 CHECK(available >= 0 AND available <= total),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL REFERENCES books(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  issued_on TEXT NOT NULL,
  due_on TEXT NOT NULL,
  returned_on TEXT,
  fine REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_loans_student ON loans(student_id);
CREATE INDEX IF NOT EXISTS idx_loans_book ON loans(book_id);
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM books').get().n;
if (count === 0) {
  const seedBooks = [
    ['Introduction to Algorithms','T. H. Cormen',4],['The C++ Programming Language','B. Stroustrup',3],
    ['Database System Concepts','A. Silberschatz',3],['Wings of Fire','A. P. J. Abdul Kalam',5],
    ['Discrete Mathematics','K. H. Rosen',2],['Operating System Concepts','A. Silberschatz',3],
    ['Let Us C','Y. Kanetkar',6],['Computer Networks','A. S. Tanenbaum',2]
  ];
  const ins = db.prepare('INSERT INTO books(title,author,total,available) VALUES(?,?,?,?)');
  db.transaction(() => seedBooks.forEach(([t,a,n]) => ins.run(t,a,n,n)))();
}
const adminRoll = String(process.env.ADMIN_ROLL || 'LIB2026').toUpperCase();
if (!db.prepare('SELECT id FROM users WHERE roll=?').get(adminRoll)) {
  const adminPw = process.env.ADMIN_PASSWORD || '';
  if (adminPw.length < 8) { console.error('Set ADMIN_PASSWORD in .env (at least 8 characters) to create the first librarian account.'); process.exit(1); }
  db.prepare('INSERT INTO users(roll,name,role,department,password_hash) VALUES(?,?,?,?,?)')
    .run(adminRoll, process.env.ADMIN_NAME || 'Librarian', 'lib', 'Library', bcrypt.hashSync(adminPw, 12));
}

const asyncRoute = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
const safeUser = u => ({ id:u.id, roll:u.roll, name:u.name, role:u.role, department:u.department });
function auth(req,res,next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error:'Please log in to continue.' }); }
}
function librarian(req,res,next) {
  if (req.user.role !== 'lib') return res.status(403).json({ error:'Librarian access required.' });
  next();
}
function positiveInt(value) { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : null; }
function datePlusDays(days) { const d = new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
function calculatedFine(dueOn, returnedOn = new Date().toISOString().slice(0,10)) {
  const late = Math.max(0, Math.floor((new Date(returnedOn+'T00:00:00Z') - new Date(dueOn+'T00:00:00Z')) / 86400000));
  return late * 2;
}

app.get('/api/health', (req,res) => res.json({ ok:true, service:'Granthalaya API' }));
const attempts = new Map();
function loginLimiter(req,res,next) {
  const key = req.ip, rec = attempts.get(key);
  if (rec && rec.until > Date.now()) return res.status(429).json({ error:'Too many sign-in attempts. Try again in a few minutes.' });
  res.on('finish', () => {
    const r = attempts.get(key) || { n:0, until:0 };
    if (res.statusCode === 401) { r.n++; if (r.n >= 5) { r.n = 0; r.until = Date.now() + 5*60*1000; } attempts.set(key, r); }
    else if (res.statusCode < 400) attempts.delete(key);
  });
  next();
}
app.post('/api/auth/login', loginLimiter, (req,res) => {
  const roll = String(req.body?.roll || '').trim().toUpperCase();
  const password = String(req.body?.password || '');
  if (!roll || !password) return res.status(400).json({ error:'Roll number and password are required.' });
  const user = db.prepare('SELECT * FROM users WHERE upper(roll)=?').get(roll);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error:'Invalid roll number or password.' });
  const token = jwt.sign({ id:user.id, roll:user.roll, role:user.role, name:user.name }, JWT_SECRET, { expiresIn:'8h' });
  res.json({ token, user:safeUser(user) });
});
app.get('/api/auth/me', auth, (req,res) => {
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!user) return res.status(401).json({ error:'Account no longer exists.' });
  res.json({ user:safeUser(user) });
});
app.post('/api/auth/change-password', auth, (req,res) => {
  const current = String(req.body?.currentPassword || '');
  const next = String(req.body?.newPassword || '');
  if (next.length < 8 || !/\d/.test(next) || !/[a-zA-Z]/.test(next)) return res.status(400).json({ error:'New password must be at least 8 characters, with letters and numbers.' });
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!user || !bcrypt.compareSync(current, user.password_hash)) return res.status(400).json({ error:'Current password is incorrect.' });
  db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(bcrypt.hashSync(next,12), user.id);
  res.json({ message:'Password changed. Log in again with your new password.' });
});

app.get('/api/dashboard', auth, (req,res) => {
  const books = db.prepare('SELECT COUNT(*) n FROM books').get().n;
  const copies = db.prepare('SELECT COALESCE(SUM(total),0) n FROM books').get().n;
  const available = db.prepare('SELECT COALESCE(SUM(available),0) n FROM books').get().n;
  const activeLoans = db.prepare('SELECT COUNT(*) n FROM loans WHERE returned_on IS NULL').get().n;
  const students = db.prepare("SELECT COUNT(*) n FROM users WHERE role='stu'").get().n;
  const overdue = db.prepare("SELECT COUNT(*) n FROM loans WHERE returned_on IS NULL AND due_on < date('now')").get().n;
  res.json({ books, copies, available, activeLoans, students, overdue });
});

app.get('/api/books', auth, (req,res) => {
  const q = `%${String(req.query.q || '').trim()}%`;
  const rows = db.prepare(`SELECT b.*, (SELECT COUNT(*) FROM loans l WHERE l.book_id=b.id AND l.returned_on IS NULL) AS borrowed
    FROM books b WHERE b.title LIKE ? OR b.author LIKE ? OR CAST(b.id AS TEXT) LIKE ? ORDER BY b.title`).all(q,q,q);
  res.json({ books:rows });
});
app.post('/api/books', auth, librarian, (req,res) => {
  const title = String(req.body?.title || '').trim(), author = String(req.body?.author || '').trim();
  const total = Number(req.body?.total);
  if (!title || !author || !Number.isInteger(total) || total < 1) return res.status(400).json({ error:'Title, author, and a positive whole-number copy count are required.' });
  const info = db.prepare('INSERT INTO books(title,author,total,available) VALUES(?,?,?,?)').run(title,author,total,total);
  res.status(201).json({ book:db.prepare('SELECT * FROM books WHERE id=?').get(info.lastInsertRowid) });
});
app.patch('/api/books/:id', auth, librarian, (req,res) => {
  const id = positiveInt(req.params.id), book = id && db.prepare('SELECT * FROM books WHERE id=?').get(id);
  if (!book) return res.status(404).json({ error:'Book not found.' });
  const title = req.body?.title === undefined ? book.title : String(req.body.title).trim();
  const author = req.body?.author === undefined ? book.author : String(req.body.author).trim();
  const total = req.body?.total === undefined ? book.total : Number(req.body.total);
  const borrowed = book.total - book.available;
  if (!title || !author || !Number.isInteger(total) || total < borrowed) return res.status(400).json({ error:'Details are invalid. Total copies cannot be less than copies currently on loan.' });
  db.prepare('UPDATE books SET title=?,author=?,total=?,available=? WHERE id=?').run(title,author,total,total-borrowed,id);
  res.json({ book:db.prepare('SELECT * FROM books WHERE id=?').get(id) });
});
app.delete('/api/books/:id', auth, librarian, (req,res) => {
  const id = positiveInt(req.params.id), book = id && db.prepare('SELECT * FROM books WHERE id=?').get(id);
  if (!book) return res.status(404).json({ error:'Book not found.' });
  if (db.prepare('SELECT 1 FROM loans WHERE book_id=? LIMIT 1').get(id)) return res.status(409).json({ error:'This book has loan history and cannot be deleted. Set its total copies to 0 instead.' });
  db.prepare('DELETE FROM books WHERE id=?').run(id); res.json({ message:'Book deleted.' });
});

app.get('/api/students', auth, librarian, (req,res) => {
  const q = `%${String(req.query.q || '').trim()}%`;
  const students = db.prepare(`SELECT u.id,u.roll,u.name,u.department,
    (SELECT COUNT(*) FROM loans l WHERE l.student_id=u.id AND l.returned_on IS NULL) active_loans
    FROM users u WHERE u.role='stu' AND (u.roll LIKE ? OR u.name LIKE ? OR u.department LIKE ?) ORDER BY u.name`).all(q,q,q);
  res.json({ students });
});
app.post('/api/students', auth, librarian, (req,res) => {
  const roll = String(req.body?.roll || '').trim().toUpperCase();
  const name = String(req.body?.name || '').trim();
  const department = String(req.body?.department || '').trim();
  const password = String(req.body?.password || '');
  if (!roll || !name || password.length < 8) return res.status(400).json({ error:'Roll, name, and a password of at least 8 characters are required.' });
  try {
    const info = db.prepare("INSERT INTO users(roll,name,role,department,password_hash) VALUES(?,?,'stu',?,?)")
      .run(roll,name,department,bcrypt.hashSync(password,12));
    res.status(201).json({ student:safeUser(db.prepare('SELECT * FROM users WHERE id=?').get(info.lastInsertRowid)) });
  } catch (e) { if (String(e.code).includes('CONSTRAINT')) return res.status(409).json({ error:'That roll number already exists.' }); throw e; }
});
app.patch('/api/students/:id', auth, librarian, (req,res) => {
  const id = positiveInt(req.params.id), student = id && db.prepare("SELECT * FROM users WHERE id=? AND role='stu'").get(id);
  if (!student) return res.status(404).json({ error:'Student not found.' });
  const name = req.body?.name === undefined ? student.name : String(req.body.name).trim();
  const department = req.body?.department === undefined ? student.department : String(req.body.department).trim();
  if (!name) return res.status(400).json({ error:'Name is required.' });
  db.prepare('UPDATE users SET name=?,department=? WHERE id=?').run(name,department,id);
  res.json({ student:safeUser(db.prepare('SELECT * FROM users WHERE id=?').get(id)) });
});

app.get('/api/loans', auth, (req,res) => {
  const where = req.user.role === 'lib' ? '' : 'WHERE l.student_id=?';
  const rows = req.user.role === 'lib'
    ? db.prepare(`SELECT l.*,b.title book_title,b.author book_author,u.roll student_roll,u.name student_name FROM loans l JOIN books b ON b.id=l.book_id JOIN users u ON u.id=l.student_id ORDER BY l.id DESC`).all()
    : db.prepare(`SELECT l.*,b.title book_title,b.author book_author,u.roll student_roll,u.name student_name FROM loans l JOIN books b ON b.id=l.book_id JOIN users u ON u.id=l.student_id WHERE l.student_id=? ORDER BY l.id DESC`).all(req.user.id);
  res.json({ loans:rows.map(l => ({...l, fine:l.returned_on ? l.fine : calculatedFine(l.due_on), overdue:!l.returned_on && l.due_on < new Date().toISOString().slice(0,10)})) });
});
app.post('/api/loans', auth, librarian, (req,res) => {
  const bookId = positiveInt(req.body?.bookId), roll = String(req.body?.roll || '').trim().toUpperCase();
  const book = bookId && db.prepare('SELECT * FROM books WHERE id=?').get(bookId);
  const student = db.prepare("SELECT * FROM users WHERE upper(roll)=? AND role='stu'").get(roll);
  if (!book) return res.status(404).json({ error:'Book not found.' });
  if (!student) return res.status(404).json({ error:'Student not found.' });
  if (book.available < 1) return res.status(409).json({ error:'No copies of this book are available.' });
  const active = db.prepare('SELECT COUNT(*) n FROM loans WHERE student_id=? AND returned_on IS NULL').get(student.id).n;
  if (active >= 3) return res.status(409).json({ error:'A student may hold no more than 3 books at a time.' });
  const already = db.prepare('SELECT 1 FROM loans WHERE student_id=? AND book_id=? AND returned_on IS NULL').get(student.id,book.id);
  if (already) return res.status(409).json({ error:'This student already has this book on loan.' });
  const issued = new Date().toISOString().slice(0,10), due = datePlusDays(14);
  const loanId = db.transaction(() => {
    const info = db.prepare('INSERT INTO loans(book_id,student_id,issued_on,due_on) VALUES(?,?,?,?)').run(book.id,student.id,issued,due);
    db.prepare('UPDATE books SET available=available-1 WHERE id=?').run(book.id); return info.lastInsertRowid;
  })();
  res.status(201).json({ loan:db.prepare('SELECT l.*,b.title book_title,u.roll student_roll,u.name student_name FROM loans l JOIN books b ON b.id=l.book_id JOIN users u ON u.id=l.student_id WHERE l.id=?').get(loanId) });
});
app.post('/api/loans/:id/return', auth, librarian, (req,res) => {
  const id = positiveInt(req.params.id), loan = id && db.prepare('SELECT * FROM loans WHERE id=?').get(id);
  if (!loan) return res.status(404).json({ error:'Loan record not found.' });
  if (loan.returned_on) return res.status(409).json({ error:'This book has already been returned.' });
  const returned = new Date().toISOString().slice(0,10), fine = calculatedFine(loan.due_on,returned);
  db.transaction(() => {
    db.prepare('UPDATE loans SET returned_on=?,fine=? WHERE id=?').run(returned,fine,id);
    db.prepare('UPDATE books SET available=available+1 WHERE id=?').run(loan.book_id);
  })();
  res.json({ message:'Book returned.', returnedOn:returned, fine });
});
app.get('/api/reports/summary', auth, librarian, (req,res) => {
  const loans = db.prepare(`SELECT COUNT(*) total, SUM(CASE WHEN returned_on IS NULL THEN 1 ELSE 0 END) active,
    SUM(CASE WHEN returned_on IS NULL AND due_on < date('now') THEN 1 ELSE 0 END) overdue,
    COALESCE(SUM(fine),0) collected_fines FROM loans`).get();
  res.json({ ...loans, topBooks:db.prepare(`SELECT b.title,COUNT(l.id) loans FROM loans l JOIN books b ON b.id=l.book_id GROUP BY b.id ORDER BY loans DESC LIMIT 5`).all() });
});

app.use((req,res) => res.status(404).json({ error:'API route not found.' }));
app.use((err,req,res,next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error:'Unexpected server error.' });
});
app.listen(PORT, () => console.log(`Granthalaya API running at http://localhost:${PORT}`));
