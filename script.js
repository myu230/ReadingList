const library = document.querySelector('.book__list');
let myLibrary = [];

class Book{
    constructor(title, author, pages, read, rating) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.rating = rating;
    }
}

loadData();
if (myLibrary.length == 0){
    myLibrary.push(new Book("Matilda", "Roald Dahl", "232", true, "5"));
}

DisplayLibrary();

function AddBookToLibrary(book) {
    myLibrary.push(book);
}

function DisplayLibrary(){
    saveData();
    
    library.innerHTML = '';
    let toAdd = document.createDocumentFragment();

    for (let i = 0; i < myLibrary.length; i++){
     
        const newBook = document.createElement('div');
        const newTitle  = document.createElement('div');
        const newAuthor  = document.createElement('div');
        const newPages  = document.createElement('div');
        const newRead  = document.createElement('div');
        const newClose = document.createElement('div');
        let status = '';
    
        newBook.className = 'book';
        newBook.id = i;

        newTitle.className = 'title';
        newTitle.textContent = myLibrary[i].title;

        newAuthor.className = 'author';
        newAuthor.textContent = "By: " +myLibrary[i].author;

        newPages.className = 'page';
        newPages.textContent = "Pages: " +myLibrary[i].pages;

        newRead.className = 'read';
        if (myLibrary[i].read)
        {
            status = '<i class="uit uit-check-square"></i>';
            newBook.classList.add('completed');
        }else{
            status = '<i class="uit uit-square-full"></i>';
        }
        newRead.innerHTML = status;

        newClose.className = 'close close__icon';
        newClose.innerHTML = '<i class="uit uit-multiply"></i>';

        newBook.appendChild(newTitle);
        newBook.appendChild(newAuthor);
        newBook.appendChild(newPages);
        newBook.appendChild(newRead);
        newBook.appendChild(newClose);

        toAdd.appendChild(newBook);
    }

    library.appendChild(toAdd);

    const readButton = document.querySelectorAll('.read');
    readButton.forEach(readbtn => readbtn.addEventListener('click', changeRead));

    const closeButton = document.querySelectorAll('.close');
    closeButton.forEach(closebtn => closebtn.addEventListener('click', delBook));
}

function changeRead(e){
    const num = e.target.parentNode.parentNode.id;
    myLibrary[num].read = !myLibrary[num].read;

    DisplayLibrary();
}

function delBook(e){
    const num = e.target.parentNode.parentNode.id;
    let removedItems = myLibrary.splice(num, 1);

    DisplayLibrary();
}

// modal

const modal = document.querySelector('.book__modal');
const modalbtn = document.querySelector('.modal__button');
const modalclose = document.querySelector('.modal__close');
const form = document.querySelector('.book__form');

// When the user clicks on the button, open the modal
modalbtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
modalclose.onclick = function() {
  modal.style.display = "none";
}

// show a message with a type of the input
function showMessage(input, message, type) {
	// get the small element and set the message
	const msg = input.parentNode.querySelector("small");
	msg.innerText = message;
	// update the class for the input
	input.className = type ? "success" : "error";
	return type;
}

function showError(input, message) {
	return showMessage(input, message, false);
}

function showSuccess(input) {
	return showMessage(input, "", true);
}

function hasValue(input, message) {
	if (input.value.trim() === "") {
		return showError(input, message);
	}
	return showSuccess(input);
}

function validatePages(input, requiredMsg, invalidMsg) {
	// check if the value is not empty
	if (!hasValue(input, requiredMsg)) {
		return false;
	}
	// validate email format
	const pageRegex =  /^\d+$/;

	const cpages = input.value.trim();
	if (!pageRegex.test(cpages)) {
		return showError(input, invalidMsg);
	}
	return true;
}

const TITLE_REQUIRED = "Please enter the title of the book";
const AUTHOR_REQUIRED = "Please enter the author of the book";
const PAGES_REQUIRED = "Please enter the number of pages in the book";
const PAGES_INVALID = "Please enter a valid page number";

form.addEventListener('submit', (event) => {
    // stop form submission
    event.preventDefault();

    let ftitle = form.elements["ftitle"];
    let fauthor = form.elements["fauthor"];
    let fpages = form.elements["fpages"];
    let fcheck = form.elements["fread"];
    let fread = false;
    
    if (fcheck.checked){
        fread = true;
    }else{
        fread = false;
    }

    let titleValid = hasValue(ftitle, TITLE_REQUIRED);
    let authorValid = hasValue(fauthor, AUTHOR_REQUIRED);
	let pagesValid = validatePages(fpages, PAGES_REQUIRED, PAGES_INVALID);
	// if valid, submit the form.

	if (titleValid && authorValid && pagesValid) {
        AddBookToLibrary(new Book(ftitle.value, fauthor.value, fpages.value, fread));
        DisplayLibrary();
        modal.style.display = "none";
        form.reset();
	}
});

function saveData(){
    localStorage.setItem("key_library", JSON.stringify(myLibrary));

}

function loadData(){
    let reLib = localStorage.getItem("key_library");
    if (reLib.length > 0) {
        myLibrary = JSON.parse(reLib);
        
    } else {
        myLibrary = [];
    }
}
