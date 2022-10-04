const book = [];
const RENDER_EVENT = 'book-render';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date(); 
}

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;

    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, title, author, year, false);
    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT)); 
    saveData();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookTitle, bookAuthor, bookYear);

    const actionClass = document.createElement('div');
    actionClass.classList.add('action');
    container.append(actionClass);

    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('blue');
        undoButton.innerText = 'Belum selesai di Baca';

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            alert(`Data anda Sudah Berhasil di Hapus`);
        });

        actionClass.append(undoButton, trashButton);

    } else {
        const completedButton = document.createElement('button');
        completedButton.classList.add('green');
        completedButton.innerText = 'Sudah selesai di Baca';

        completedButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });
        

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            alert(`Data anda Sudah Berhasil di Hapus`);
        });

        actionClass.append(completedButton, trashButton);

    }
    return container;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of book) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in book) {
        if (book[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function check(){    
    document.getElementById("inputBookIsComplete").addEventListener("click", checkFunction);
    function checkFunction() {
        const a = document.getElementById("bookSubmit");
        a.innerHTML = `Masukkan Buku ke rak <b> Sudah Selesai dibaca </b>`;
        return true;
    }       
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser yang anda gunakan tidak mendukung WebStorage');
      return false;
    }
    return true;  
  }

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const bookData of data) {
        book.push(bookData);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

document.addEventListener(RENDER_EVENT, function () {
    console.log(book);
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const a = check();
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event){    
        if (a === true){
            isCompleted = true;
            document.dispatchEvent(new Event(RENDER_EVENT));
        } else {
            addBook();
            
        }
        event.preventDefault();       
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

document.getElementById('searchBook').addEventListener('submit', function (event) {

    event.preventDefault();
    const search = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookItem = document.querySelectorAll('.book_item > h3');
  
    for (books of bookItem) {
      if (books.innerText.toLowerCase().includes(search)) {
        books.parentElement.style.display = "block";
      } else {
        books.parentElement.style.display = "none";
      }
    }
  });  