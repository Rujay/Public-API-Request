const search = document.querySelector('div .search-container');
const gallery = document.getElementById('gallery');

fetch ('https://randomuser.me/api/?nat=gb&results=12')
        .then(response => response.json())
        .then(data => data.results)
        .then(employees => generateEmployeeInfo(employees))
        .catch(err => console.log(err));

// create search section
search.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    </form>`);

const searchInput = document.getElementById('search-input');

//create modal html and append to DOM
let modalHtml = `
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src=""  alt="profile picture">
            <h3 class="modal-name cap" id="modal-name"></h3>
            <p class="modal-text" id="modal-email"></p>
            <p class="modal-text cap" id="modal-city"></p>
            <hr>
            <p class="modal-text" id="modal-phone"></p>
            <p class="modal-text" id="modal-address"></p>
            <p class="modal-text" id="modal-dob"></p>
        </div>
    </div>

    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    </div>
`;
gallery.insertAdjacentHTML('afterend', modalHtml);

//Event listener to close the modal pop-up
const closeBtn = document.querySelector("#modal-close-btn");
const modalWindow = document.querySelector('.modal-container');
modalWindow.style.display = 'none';

closeBtn.onclick = function(){
  modalWindow.style.display = "none";
}
window.onclick = function(e){
  if(e.target == modalWindow){
    modalWindow.style.display = "none"
  }
}

/**
* Creates the html with the employees info and append it to the DOM. Also calls the searchName function.
* @param {array} An array of employees information generated by the fetch API
*/
function generateEmployeeInfo (employees) {
    
    let html = '';

    const employee = employees.forEach((employee, index) => {
        html = `
        <div class="card" data-value = ${index}>
            <div class="card-img-container">
                <img class="card-img" src=${employee.picture.medium} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
        `;
        
        gallery.insertAdjacentHTML('beforeend', html);    
    });
    modalListener(employees);
    
    const cards = document.querySelectorAll('.card');
    const names = document.querySelectorAll('.card-name');
    
    searchName(cards, names);
    
}

/**
* Dynamically adds the employee's information to the modal
* @param {array} employee - An array of employees information generated by the fetch API
* @param {number} index - The index number of the employee whose information is being added to the modal
*/
function createModal(employee, index) {
    const img = document.querySelector('.modal-info-container img');
    const name = document.getElementById('modal-name');
    const email = document.getElementById('modal-email');
    const city = document.getElementById('modal-city');
    const phone = document.getElementById('modal-phone');
    const address = document.getElementById('modal-address');
    const dob = document.getElementById('modal-dob');
    const modalBtn = document.querySelector('.modal-btn-container');
    
    img.src = employee.picture.large;
    name.textContent = `${employee.name.first} ${employee.name.last}`;
    email.textContent = employee.email;
    city.textContent = employee.location.city;
    phone.textContent = formatPhoneNumber(employee.telephone);
    address.textContent = `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}`;
    dob.textContent = `Birthday: ${formatDOB(employee.dob.date)}`;

    modalBtn.setAttribute('data-value',`${index}`);
}

/**
* Formats the telephone number of the employees
* @param {number} The telephone number of the employees
*/
// code taken from https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript/41318684
function formatPhoneNumber (phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}

/**
* Formats the date of birth of the employees
* @param {string} A string containing the date of birth of the employees
*/
// code taken from: https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
function formatDOB(dob) {
      const date = new Date(dob);
      let birthday;
  
      date.setDate(date.getDate() + 20);
  
      birthday = ('0' + (date.getMonth()+1)).slice(-2) + '/'
                  + ('0' + date.getDate()).slice(-2) + '/'
                  + date.getFullYear();
  
      return birthday;
}

/**
* Creates the html with the employees info and append it to the DOM. Also calls the searchName function.
* @param {array} employee - An array of employees information generated by the fetch API
*/
function modalListener(employee) {
    const modalBtn = document.querySelector('.modal-btn-container');

    gallery.addEventListener('click', (e) => {
        let card = e.target.closest('.card');
        let i = card.getAttribute('data-value');
        createModal(employee[i], i);
        modalWindow.style.display = 'block';  
    });

    modalBtn.addEventListener('click', (e) => {
        let i = parseInt(e.target.closest('.modal-btn-container').getAttribute('data-value'));
        if (e.target === document.getElementById('modal-next')) {
            if (i < employee.length - 1) {
                i+=1;
                createModal(employee[i], i);
            }
            
        } else if (e.target === document.getElementById('modal-prev')){
            if (i > 0) {
                i-=1;
                createModal(employee[i], i);
            }
        }
    })
}

/**
* Search for employee by name
* @param {array} cards - An array the html cards with the employees info
* @param {array} names - An array of the html element containing the names of the employees
*/
function searchName (cards, names) {   
    searchInput.addEventListener('keyup', () => {
        for (let i = 0; i < cards.length; i++) {
            if (searchInput.value.length !== 0 && !names[i].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
                cards[i].style.display = 'none';
            } else if (searchInput.value.length === 0 || names[i].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
                cards[i].style.display = 'flex';      
            }
        }
    })   
} 
