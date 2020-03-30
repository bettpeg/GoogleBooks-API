const booksList = document.querySelector('#books-list');
let books = [];
const bookTitle = document.querySelector('#book-title');
const bookInfo = document.querySelector('#book-info');

const request = fetch('https://www.googleapis.com/books/v1/volumes?q=world+war+ii').then(response => response.json());

function createBooksList(books) {

    books.forEach(item => {
	
		const listItem = document.createElement('a');
		listItem.setAttribute('href', '');
		listItem.classList.add('list-group-item');
		listItem.innerText = item.volumeInfo.title;

		booksList.appendChild(listItem);
	});
}

request.then(response => {
	books = response.items;
	createBooksList(books);
});

booksList.addEventListener('click', function(event) {
	event.preventDefault();

	if (!event.target.classList.contains('list-group-item')) {
		return;
    }

    const bookName = event.target.innerText;

    const bookItem = books.find((item) => {
       return item.volumeInfo.title === bookName;
    });

    console.log(bookItem);

    bookTitle.innerText = `${bookItem.volumeInfo.authors} -- ${bookName}:${bookItem.volumeInfo.subtitle}`;
    bookInfo.innerHTML = `<div class="book-information row">
        <img src="${bookItem.volumeInfo.imageLinks.thumbnail}" alt="book-thumbnail" class="col-xs-4">
        <dl class="col-xs-8">
            <dt>Publisher</dt>
            <dd>${bookItem.volumeInfo.publisher}</dd>
            <dt>Published Date</dt>
            <dd>${bookItem.volumeInfo.publishedDate}</dd>
            <dt>Summary</dt>
            <dd id="book-summary">${bookItem.volumeInfo.description}</dd>
        </dl>
    </div>
    <div class="row for-buttons">
        <div class="col-xs-3">
            <div class="dropdown">
                <button class="btn btn-info dropdown-toggle btn-download" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Download
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                    <li id="download-pdf"><a href="${bookItem.accessInfo.pdf.acsTokenLink}" target="_blank" alt="Download PDF">PDF</a></li>
                    <li id="download-epub"><a href="${bookItem.accessInfo.epub.acsTokenLink}" target="_blank" alt="Download Epub">Epub</a></li>
                </ul>
            </div>
        </div>
        <div class="col-xs-3">       
            <button type="button" class="btn btn-info more-btn"><a href="${bookItem.volumeInfo.infoLink}" target="_blank">View more</a></button>
        </div>
    </div>`;

    const bookSummary = document.querySelector('#book-summary');
    if (bookItem.volumeInfo.description === undefined) {
        bookSummary.innerText = 'None';
    }

    const pdfBtn = document.querySelector('#download-pdf');
    const epubBtn = document.querySelector('#download-epub');

    if (bookItem.accessInfo.pdf.isAvailable === false) {
        pdfBtn.classList += 'disabled';
    } 
    if (bookItem.accessInfo.epub.isAvailable === false) {
        epubBtn.classList += 'disabled';
    }
});