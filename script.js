const books = [];
const RENDERING = 'rendering';
const WEB_STORAGE_KEY = 'BOOKSHELF-APPS';
const EVENT_SAVE = 'book-save';

const generateId = () => {
  return +new Date();
};

const generateBook = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const cariBuku = (idBuku) => {
  for (const buku of books) {
    if (buku.id === idBuku) {
      return buku;
    }
  }
  return null;
};

const supportWebStorage = () => {
  if (typeof Storage === undefined) {
    alert('Browser anda tidak support local storage');
    return false;
  }
  return true;
};

const saveToLocalStorage = () => {
  if (supportWebStorage()) {
    const konversiKeString = JSON.stringify(books);
    localStorage.setItem(WEB_STORAGE_KEY, konversiKeString);
    document.dispatchEvent(new Event(EVENT_SAVE));
  }
};

const pindahSudahBaca = (idBuku) => {
  const pil_buku = cariBuku(idBuku);
  if (pil_buku == null) return;
  pil_buku.isComplete = true;
  document.dispatchEvent(new Event(RENDERING));
  saveToLocalStorage();
};

document.addEventListener(EVENT_SAVE, function () {
  console.log(localStorage.getItem(WEB_STORAGE_KEY));
});

document.addEventListener(RENDERING, function () {
  console.log(books);
  const yangBelumDibaca = document.getElementById('list');
  yangBelumDibaca.innerHTML = '';
  const yangSudahDibaca = document.getElementById('readlist');
  yangSudahDibaca.innerHTML = '';

  for (const buku of books) {
    const tiapBuku = tampilBuku(buku);
    if (!buku.isComplete) {
      yangBelumDibaca.append(tiapBuku);
    } else {
      yangSudahDibaca.append(tiapBuku);
    }
  }
});

const tambahBuku = () => {
  const isiJudul = document.getElementById('judul').value;
  const isiPenulis = document.getElementById('penulis').value;
  const isiTahun = document.getElementById('tahun').value;
  const generatedID = generateId();
  const book = generateBook(generatedID, isiJudul, isiPenulis, isiTahun, false);
  books.push(book);
  document.dispatchEvent(new Event(RENDERING));
  saveToLocalStorage();
};

const cariIndeksBuku = (idBuku) => {
  for (const indeks in books) {
    if (books[indeks].id === idBuku) {
      return indeks;
    }
  }
  return -1;
};

const hapusBuku = (idBuku) => {
  const buku_pil = cariIndeksBuku(idBuku);
  if (buku_pil === -1) return;
  books.splice(buku_pil, 1);
  document.dispatchEvent(new Event(RENDERING));
  saveToLocalStorage();
};

const pindahBelumDibaca = (idBuku) => {
  const buku_pil = cariBuku(idBuku);
  if (buku_pil == null) return;
  buku_pil.isComplete = false;
  document.dispatchEvent(new Event(RENDERING));
  saveToLocalStorage();
};

const tampilBuku = (book) => {
  const judulnya = document.createElement('h3');
  judulnya.innerText = book.title;
  const authornya = document.createElement('p');
  authornya.innerText = book.author;
  const tahunnya = document.createElement('p');
  tahunnya.innerText = book.year;

  const awal = document.createElement('div');
  awal.classList.add('starter');
  awal.append(judulnya, authornya, tahunnya);

  const tombol = document.createElement('div');
  tombol.classList.add('tombol');

  const lemariBuku = document.createElement('div');
  lemariBuku.classList.add('lemari-buku', 'list-item');
  lemariBuku.append(awal, tombol);
  lemariBuku.setAttribute('id', `buku-${book.id}`);

  if (book.isComplete) {
    const tombolUndo = document.createElement('button');
    tombolUndo.classList.add('taskbtn');
    tombolUndo.innerHTML = 'Undo';
    tombolUndo.setAttribute('id', 'tombolUndo');
    tombolUndo.addEventListener('click', function () {
      pindahBelumDibaca(book.id);
    });
    tombol.append(tombolUndo);
  } else {
    const tombolSudahBaca = document.createElement('button');
    tombolSudahBaca.innerHTML = 'Mark as read';
    tombolSudahBaca.setAttribute('id', 'tombolSudahBaca');
    tombolSudahBaca.classList.add('taskbtn');
    tombolSudahBaca.addEventListener('click', function () {
      pindahSudahBaca(book.id);
    });
    tombol.append(tombolSudahBaca);
  }

  const tombolHapus = document.createElement('button');
  tombolHapus.classList.add('taskbtn');
  tombolHapus.innerHTML = 'Delete';
  tombolHapus.setAttribute('id', 'tombolHapus');
  tombolHapus.addEventListener('click', function () {
    let text;
    if (confirm('Yakin ingin menghapus??') == true) {
      hapusBuku(book.id);
    }
    return;
  });
  tombol.append(tombolHapus);

  return lemariBuku;
};

const muatDataDariPenyimpanan = () => {
  const tiapData = localStorage.getItem(WEB_STORAGE_KEY);
  let db = JSON.parse(tiapData);
  if (db !== null) {
    for (const book of db) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDERING));
};

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    tambahBuku();
  });
  if (supportWebStorage()) {
    muatDataDariPenyimpanan();
  }
});

const search_eng = document.getElementById('searching');
const pencarianBuku = (e) => {
  const search_eng = e.target.value.toLowerCase();
  let listItem = document.querySelectorAll('.list-item');

  listItem.forEach((item) => {
    const contentItem = item.firstChild.textContent.toLowerCase();
    if (contentItem.indexOf(search_eng) != -1) {
      item.setAttribute('style', 'display: flex;');
    } else {
      item.setAttribute('style', 'display : none !important');
    }
  });
};

search_eng.addEventListener('keyup', pencarianBuku);
