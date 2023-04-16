//#region modal
const modal_newClient = document.getElementById('modalWindow_newClient');
const modal_editClient = document.getElementById('modalWindow_editClient');
const modal_deleteClient = document.getElementById('modalWindow_deleteClient');
const modalQueue = [];

let isNewClientActive = false;
let isEditClientActive = false;
let isDeleteClientActive = false;

function showModalClient(name, clientID = null) {
  //console.log(name);  
  if (name !== 'addClient' && name !== 'deleteClient' && name !== 'editClient') {
    return;
  }

  if (name === 'addClient') {
    isNewClientActive = true;
    modal_newClient.classList.add('modal-window--open');
    modal_newClient.querySelector('.modal').classList.add('modal--open');
    modalQueue.push('addClient');
  }
  else if (name === 'editClient') {
    isEditClientActive = true;
    history.pushState(null, null, `#${currentClientID}`);
    editModalSetData();
    modal_editClient.classList.add('modal-window--open');
    if (modalQueue.length === 0) {
      modalQueue.push('editClient');
    }
    
  }
  else if (name === 'deleteClient') {
    if (clientID !== null) {
      currentClientID = clientID;
    }
    if (modalQueue.length > 0) {
      modal_editClient.classList.remove('modal-window--open');
    }

    isDeleteClientActive = true;
    modal_deleteClient.classList.add('modal-window--open');
    modalQueue.push('deleteClient');
  }

  const timer = new Promise(resolve => setTimeout(resolve, 200));
  timer.then(() => {
    document.addEventListener('click', handleOutsideClick);
  })
}

function hideModalClient(name) {
  if (name !== 'addClient' && name !== 'deleteClient' && name !== 'editClient') {
    return;
  }

  if (name === 'addClient') {
    isNewClientActive = false;
    modal_newClient.classList.remove('modal-window--open');
    modal_newClient.querySelector('.modal').classList.remove('modal--open');
  }
  else if (name === 'editClient') {
    isEditClientActive = false;
    history.pushState(null, null, '/');
    modal_editClient.classList.remove('modal-window--open');
    const errFields = modal_editClient.querySelector('.footer-error');
    errFields.innerHTML = '';
  }
  else if (name === 'deleteClient') {
    isDeleteClientActive = false;
    modal_deleteClient.classList.remove('modal-window--open');
  }

  document.removeEventListener('click', handleOutsideClick);
  modalQueue.pop();
  if (modalQueue.length > 0) {
    showModalClient(modalQueue[modalQueue.length - 1]);
  }
}

function handleOutsideClick(event) {
  let result = recusiveClassCheck(event.composedPath(), 'modal_content');

  //console.log(result);
  if (!result) {
    hideModalClient(modalQueue[modalQueue.length - 1]);
  }
}

function recusiveClassCheck(target, className) {
  for (let i = 0; i < target.length; i++) {
    //console.log(target[i].nodeName);
    if (target[i].nodeName === '#document') {
      return false;
    }
    if (target[i].classList.contains(className)) {
      return true;
    }
  }
  return false;
}

function editModalSetData() {
  const header = modal_editClient.querySelector('.modal_content-title');

  header.innerHTML = `Изменить данные <span class=\"title-id\">ID: ${currentClientData.id}</span>`

  const fsurname = modal_editClient.querySelector('[name="surname"]');
  const fname = modal_editClient.querySelector('[name="name"]');
  const flastname = modal_editClient.querySelector('[name="lastname"]');

  fsurname.value = currentClientData.surname;
  fname.value = currentClientData.name;
  flastname.value = currentClientData.lastName ? currentClientData.lastName : "";

  const contactsUlElement = modal_editClient.querySelector('.contacts-space').querySelector(".contact-list");
  contactsUlElement.innerHTML = "";
  for (let item of currentClientData.contacts) {
    const contactElement = generateContactElement();
    contactElement.firstChild.value = item.type;
    contactElement.childNodes[1].value = item.value;

    contactsUlElement.appendChild(contactElement);
    //console.log(item);
  }
}
//#endregion



//#region headerSearch and sorting
const filterInput = document.querySelector('.search-form');
filterInput.addEventListener('input', (event) => {
  event.preventDefault();
  setTimeout(() => {
    const searchValue = event.target.value.toLowerCase();
    //console.log(searchValue);
    loadClients(searchValue);
  }, 300);
})

let sortedById = false;
let sortIdDirReverse = false;
let sortedByName = false;
let sortNameDirReverse = false;
let sortedByUpdatedAt = false;
let sortUpdatedAtDirReverse = false;
let sortedByCreatedAt = false;
let sortCreatedAtDirReverse = false;

function sortById(prop, obj = null) {
  if (obj !== null) changeArrowDir(obj);

  sortedById = true;
  sortedByName = false;
  sortedByUpdatedAt = false;
  sortedByCreatedAt = false;

  sortBy(clientsList, prop, sortIdDirReverse, (a, b) => a - b);
  sortIdDirReverse = !sortIdDirReverse;
  renderTableBody();
}

function sortByName(prop, obj = null) {
  if (obj !== null) changeArrowDir(obj);

  sortedById = false;
  sortedByName = true;
  sortedByUpdatedAt = false;
  sortedByCreatedAt = false;

  sortBy(clientsList, prop, sortNameDirReverse, (a, b) => a.localeCompare(b));
  sortNameDirReverse = !sortNameDirReverse;
  renderTableBody();
}

function sortByUpdatedAt(prop, obj = null) {
  if (obj !== null) changeArrowDir(obj);

  sortedById = false;
  sortedByName = false;
  sortedByUpdatedAt = true;
  sortedByCreatedAt = false;

  sortUpdatedAtDirReverse = !sortUpdatedAtDirReverse;
  sortBy(clientsList, prop, sortUpdatedAtDirReverse, (a, b) => a - b);
  renderTableBody();
}

function sortByCreatedAt(prop, obj = null) {
  if (obj !== null) changeArrowDir(obj);

  sortedById = false;
  sortedByName = false;
  sortedByUpdatedAt = false;
  sortedByCreatedAt = true;

  sortCreatedAtDirReverse = !sortCreatedAtDirReverse;
  sortBy(clientsList, prop, sortCreatedAtDirReverse, (a, b) => a - b);
  renderTableBody();
}

function sortBy(data, prop, dir, comparator) {
  if (prop === 'updatedAt' || prop === 'createdAt') {
    data.sort(function (a, b) {
      const dateA = new Date(a[prop]);
      const dateB = new Date(b[prop]);
      return (dateA - dateB) * (dir ? 1 : -1);
    });
  }
  else if (prop === 'name') {
    data.sort((a, b) => comparator(a.name + ' ' + a.surname + ' ' + a.lastName, b.name + ' ' + b.surname + ' ' + b.lastName) * (dir ? 1 : -1));
  }
  else {
    data.sort((a, b) => comparator(Number(a[prop]), Number(b[prop])) * (dir ? 1 : -1));

    //}
  }
}

function changeArrowDir(obj) {
  const img = obj.querySelector('img:first-child');
  let strForCompare = img.src.replace('http://127.0.0.1:5500/', '');

  if (strForCompare === 'img/Arrow-up.svg') {
    img.src = 'img/Arrow-down.svg';
    img.alt = 'Сортировка по убыванию';
  }
  else {
    img.src = 'img/Arrow-up.svg';
    img.alt = 'Сортировка по возрастанию';
  }
}

//#endregion



//#region table
const tBody = document.getElementById('tableBody');

function renderTableRow(client) {
  const tr = document.createElement("tr");

  tr.innerHTML =
    `
    <td class="table-data-id">${client.id}</td>
    <td class="table-data-name">${client.name} ${client.surname} ${client.lastName ? '' + client.lastName : ''}</td>
    <td class="table-data-created">${formateDate(client.createdAt)} <span class="td-time">${formateTime(client.createdAt)}</span></td>
    <td class="table-data-updated">${formateDate(client.updatedAt)} <span class="td-time">${formateTime(client.updatedAt)}</span></td>
    <td class="table-data-contacts">    
    </td>
    <td class="table-data-buttons">
    <div class="action-buttons">
      <svg class="svg-edit-person" width="13" height="13" viewBox="0 0 13 13" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10.5V13H2.5L9.87333 5.62662L7.37333 3.12662L0 10.5ZM11.8067 3.69329C12.0667 3.43329 12.0667 3.01329 11.8067
           2.75329L10.2467 1.19329C9.98667 0.933291 9.56667 0.933291 9.30667 1.19329L8.08667 
           2.41329L10.5867 4.91329L11.8067 3.69329Z" fill="#9873FF" />
      </svg>
      <button class="btn-table-edit">Изменить</button>
     </div>
     <div class="action-buttons">
       <svg class="svg-delete-person" width="16" height="16" viewBox="0 0 16 16" fill="none"
         xmlns="http://www.w3.org/2000/svg">
         <g opacity="0.7" clip-path="url(#clip0_224_889)">
           <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354
              12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154
              5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
             fill="#F06A4D" />
         </g>
         <defs>
           <clipPath id="clip0_224_889">
             <rect width="16" height="16" fill="white" />
           </clipPath>
         </defs>
       </svg>
       <button class="btn-table-delete" > Удалить</button>
     </div>
    </td>
  `;

  //#region contacts
  const contacts = tr.querySelector('.table-data-contacts');

  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-reset', 'table-contacts-list');

  for (let i = 0; i < client.contacts.length; i++) {
    if (i === 4) {
      const showAllButton = document.createElement('button');
      showAllButton.classList.add('btn-show-all-contacts', 'data-icon', 'data-icon--empty');
      showAllButton.textContent = "+" + Number(client.contacts.length - 4);

      showAllButton.addEventListener('click', () => {
        showAllButton.classList.add('hide');
        const contactsList = ulElement.querySelectorAll('.table-contacts-list-element');
        for (let i = 0; i < contactsList.length; i++) {
          contactsList[i].classList.remove('hide');
        }
      })

      ulElement.appendChild(showAllButton);
      tippy(showAllButton, {
        content: 'Показать все контакты',
      });
    }

    const liElement = document.createElement('li');
    liElement.classList.add('table-contacts-list-element');
    if (i >= 4)
      liElement.classList.add('hide');

    const divElement = document.createElement('div');
    const getType = function () {
      switch (client.contacts[i].type) {
        case 'Телефон': return ['data-icon--phone', 'data-icon'];
        case 'Email': return ['data-icon--email', 'data-icon'];
        case 'Facebook': return ['data-icon--facebook', 'data-icon'];
        case 'VK': return ['data-icon--vk', 'data-icon'];
        default: return ['data-icon--person', 'data-icon'];
      }
    }

    divElement.classList.add(...getType());

    liElement.appendChild(divElement);
    ulElement.appendChild(liElement);

    tippy(divElement, {
      content: `<span class="highlight">${client.contacts[i].type}</span>: ${client.contacts[i].value}`,
      allowHTML: true,
    });
  }


  contacts.appendChild(ulElement);
  //#endregion


  //
  const editButts = tr.querySelectorAll('.action-buttons');
  editButts[0].addEventListener('click', async (e) => {
    e.preventDefault();
    await getClient(client.id);
    showModalClient('editClient');
  })
  editButts[1].addEventListener('click', (e) => {
    showModalClient('deleteClient', client.id);
  })


  return tr;
}

function renderTableBody() {
  tBody.innerHTML = ''; // очищаем таблицу перед заполнением
  clientsList.forEach(client => {
    const tr = renderTableRow(client);
    tBody.appendChild(tr);
  })
}

function formateDate(date) {
  return new Date(date).toLocaleDateString();
}

function formateTime(date) {
  return new Date(date).toLocaleTimeString().slice(0, -3);
}

//#endregion

//#region validator
let formNew = document.querySelector('.form-newclient');
let forEdit = document.querySelector('.form-editclient');

const formNewFields = [
  {
    fsurname: formNew.querySelector('[name="surname"]'),
    fname: formNew.querySelector('[name="name"]'),
    flastname: formNew.querySelector('[name="lastname"]')
  },
]

const formEditFields = [
  {
    fsurname: forEdit.querySelector('[name="surname"]'),
    fname: forEdit.querySelector('[name="name"]'),
    flastname: forEdit.querySelector('[name="lastname"]')
  },
]

const fakePlaceholderLastname = document.getElementById('fakePlaceholderLastname');

// newForm
const validatorNewForm = new JustValidate('.form-newclient', { silent: true, showSuccess: false, });
validatorNewForm.onFail(function (errors) {
  console.log(errors);
  const contactsSpace = document.getElementById('modalWindow_newClient').querySelector('.contacts-space');
  const errFields = document.getElementById('modalWindow_newClient').querySelector('.footer-error');
  errFields.innerHTML = '';
  Object.keys(errors).forEach(function (key) {
    if (errors[key].isValid === false) {
      const p = document.createElement('p');
      p.innerHTML = `${errors[key].errorMessage}`;
      errFields.appendChild(p);
    }
  });
  errFields.classList.remove('hide');
  contactsSpace.classList.add('no-margin');
})

validatorNewForm.onSuccess(function (event) {
})

// editForm
const validatorEditForm = new JustValidate('.form-editclient', { silent: true, showSuccess: false, errorsContainer: document.getElementById('modalWindow_editClient').querySelector('.footer-error'), });
validatorEditForm.onFail(function (errors) {
  const contactsSpace = document.getElementById('modalWindow_editClient').querySelector('.contacts-space');
  const errFields = document.getElementById('modalWindow_editClient').querySelector('.footer-error');
  errFields.innerHTML = '';
  Object.keys(errors).forEach(function (key) {
    if (errors[key].isValid === false) {
      const p = document.createElement('p');
      p.innerHTML = `${errors[key].errorMessage}`;
      errFields.appendChild(p);
    }
  });
  errFields.classList.remove('hide');
  contactsSpace.classList.add('no-margin');
})

validatorEditForm.onSuccess(function (event) {
  const contactsUlElement = document.getElementById('modalWindow_editClient').querySelector(".contact-list");
  const contactsList = contactsUlElement.children;
  const contacts = [];
  for (let item of contactsList) {
    //console.log(item);
    const newCon = {
      type: item.firstElementChild.value,
      value: item.children[1].value,
    };
    contacts.push(newCon);
  }

  const client = {
    name: formEditFields[0].fname.value,
    surname: formEditFields[0].fsurname.value,
    lastName: formEditFields[0].flastname.value,
    contacts: contacts,
  };
  editClient(client);
})

function addValidatorCheckFields(validator, fields) {
  validator.addField(fields[0].fsurname, [
    {
      rule: 'required',
      errorMessage: 'Фамилия обязательна для заполнения',
    },
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Cлишком мало символов в поле Фамилия'
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Слишком много символов в поле Фамилия'
    },
  ]);
  validator.addField(fields[0].fname, [
    {
      rule: 'required',
      errorMessage: 'Имя обязательно для заполнения',
    },
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Cлишком мало символов в поле Имя'
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Слишком много символов в поле Имя'
    },
  ])
  validator.addField(fields[0].flastname, [
    {
      rule: 'maxLength',
      value: 20,
      errorMessage: 'Слишком много символов в поле Отчество'
    },
  ])
}

function addValidatorCheckContacts(validator, contactsList) {
  for (let item of contactsList) {
    validator.addField(item.childNodes[1], [
      {
        rule: 'required',
        errorMessage: 'Поле контакта обязательно для заполнения',
      }
    ])
  }
}

const newClientValidate = modal_newClient.querySelector('.btn-savecontact');
newClientValidate.addEventListener('click', function (event) {
  event.preventDefault();

  const contactsList = document.getElementById('modalWindow_newClient').querySelector(".contact-list").children;
  if (contactsList.length !== 0) {
    addValidatorCheckContacts(validatorNewForm, contactsList);
  }

  validatorNewForm.revalidate().then(isValid => {
    if (isValid) {
      handleRevalidationSuccess();
    }
  });
})

function handleRevalidationSuccess() {
  const contactsUlElement = document.getElementById('modalWindow_newClient').querySelector(".contact-list");
  const contactsList = contactsUlElement.children;
  const contacts = [];
  for (let item of contactsList) {
    //console.log(item);
    const newCon = {
      type: item.firstElementChild.value,
      value: item.children[1].value,
    };
    contacts.push(newCon);
  }

  const client = {
    name: formNewFields[0].fname.value,
    surname: formNewFields[0].fsurname.value,
    lastName: formNewFields[0].flastname.value,
    contacts: contacts,
  };

  addClient(client);
}

function validatEditForm() {
  const contactsList = document.getElementById('modalWindow_editClient').querySelector(".contact-list").children;
  if (contactsList.length !== 0) {
    addValidatorCheckContacts(validatorEditForm, contactsList);
  }

  validatorEditForm.revalidate().then(isValid => {
    history.pushState(null, null, '/');
  });
}

function hideFakePlaceholder() {
  if (flastname.value !== '') {
    fakePlaceholderLastname.classList.remove('show');
  }
  else {
    fakePlaceholderLastname.classList.add('show');
  }
}
//#endregion

//#region contactsList
function addNewContact(modalWindow) {
  const contactsSpace = modalWindow.querySelector('.contacts-space');
  const contactsUlElement = contactsSpace.querySelector(".contact-list");
  const contactsList = contactsUlElement.children;

  if (contactsList.length < 10) {
    const contactElement = generateContactElement();
    contactsUlElement.appendChild(contactElement);
  }
}

function generateContactElement() {
  const contactElement = document.createElement('li');
  contactElement.classList.add('contact-element');

  const selectElement = document.createElement('select');
  selectElement.classList.add('btn-dropdown-button-content');
  selectElement.setAttribute('name', 'contacts');

  const contactTypes = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое'];
  for (let i = 0; i < contactTypes.length; i++) {
    const optionElement = document.createElement('option');
    optionElement.classList.add('btn-dropdown-contact-item');
    optionElement.textContent = contactTypes[i];
    selectElement.appendChild(optionElement);
  }
  selectElement.value = 'Другое';

  const inputElement = document.createElement('input');
  inputElement.classList.add('contact-form-input');
  inputElement.setAttribute('type', 'text');
  inputElement.setAttribute('placeholder', 'Введите данные контакта');
  inputElement.required = true;

  selectElement.addEventListener('change', function (event) {
    changeInputType(event);
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn-deletecontact');
  deleteButton.addEventListener('click', function (event) {
    deleteContact(event);
  })

  contactElement.appendChild(selectElement);
  contactElement.appendChild(inputElement);
  contactElement.appendChild(deleteButton);

  return contactElement;
}

function changeInputType(event) {
  const parentElement = event.target.parentElement;
  const im = new Inputmask("+7(999)999-99-99");
  const imEmail = new Inputmask({
    alias: "email",
    placeholder: "",
    showMaskOnFocus: true,
    showMaskOnHover: false,
    clearIncomplete: true,
  });
  switch (event.target.value) {
    case 'Телефон': {
      parentElement.childNodes[1].value = '';
      parentElement.childNodes[1].type = 'tel';
      parentElement.childNodes[1].placeholder = 'Введите телефон';
      im.mask(parentElement.childNodes[1]);
      break;
    }
    case 'Email': {
      if (parentElement.childNodes[1].inputmask) {
        parentElement.childNodes[1].inputmask.remove();
      }
      parentElement.childNodes[1].value = '';
      parentElement.childNodes[1].placeholder = 'Введите Введите e-mail';
      imEmail.mask(parentElement.childNodes[1]);
      break;
    }
    default: {
      if (parentElement.childNodes[1].inputmask) {
        parentElement.childNodes[1].inputmask.remove();
      }
      parentElement.childNodes[1].value = '';
      parentElement.childNodes[1].setAttribute('type', 'text');
      parentElement.childNodes[1].setAttribute('placeholder', 'Введите данные контакта');
      break;
    }
  }
}

function deleteContact(event) {
  const contactElement = event.target.closest('.contact-element');
  if (contactElement) {
    contactElement.remove();
  }
}

//#endregion

//#region clientsDatabase
let clientsList = [];
let currentClientID = null;
let currentClientData = null;

const DATABASE_ADRESS = 'http://localhost:3000';

async function loadClients(filter = '') {
  const responce = await fetch(`${DATABASE_ADRESS}/api/clients?search=${filter}`, {
    method: 'GET',
  })
  if (responce.status === 200) {
    clientsList = await responce.json();
    //console.log(clientsList);

    sortById("id", document.querySelector('.table-header-cell--id'));
    renderTableBody();
    document.querySelector('.preloader-indicator').classList.add('hide');
    document.querySelector('.table').classList.add('table-margin');
  }
  else {
    clientsList = [];
    renderTableBody();
    //console.log(responce.status);
  }
}

async function addClient(client) {
  const responce = await fetch(DATABASE_ADRESS + '/api/clients/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  })
}

async function getClient(clientID) {
  await fetch(DATABASE_ADRESS + '/api/clients/' + clientID, {
    method: 'GET',
  }).then(response => response.json())
    .then(data => {
      currentClientData = data;
      currentClientID = currentClientData.id;

    })
}

async function editClient(client) {
  const responce = await fetch(DATABASE_ADRESS + '/api/clients/' + currentClientData.id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  })
}

async function deleteClient() {
  if (currentClientID === null) {
    return;
  }

  const responce = await fetch(DATABASE_ADRESS + '/api/clients/' + currentClientID, {
    method: 'DELETE',
  })
}
//#endregion



function handleHashChange() {
  const clientId = window.location.hash;
  if (clientId) {
    console.log(clientId);
    return clientId;
  }
  else {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();
  loadClients();

  addValidatorCheckFields(validatorNewForm, formNewFields);
  addValidatorCheckFields(validatorEditForm, formEditFields);

  modal_newClient.querySelector('.btn-addcontact').addEventListener('click', () => addNewContact(modal_newClient));
  modal_editClient.querySelector('.btn-addcontact').addEventListener('click', () => addNewContact(modal_editClient));

  let id = handleHashChange();
  if (id !== null && typeof id !== undefined) {
    id = id.replace('#', '');
    await getClient(id);
    showModalClient('editClient');
  }
});