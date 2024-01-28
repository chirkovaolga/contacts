//Константы сервера
const SERVER_URL = `http://localhost:3000`;
const SERVER_API_CLIENTS = `/api/clients`;
const SERVER_API = `/api/client`;

//Функции для работы с сервером
//Добавление клиента на сервер
async function serverAddClient(object) {
    let response = await fetch(SERVER_URL + SERVER_API_CLIENTS, {
        method: 'POST',
        body: JSON.stringify(object),
        headers: { 'Content-Type': 'application/json' },
    });

    let data = await response.json();

    return data
}

//Получение массива с данными клиентов
async function serverGetClients() {
    let response = await fetch(SERVER_URL + SERVER_API_CLIENTS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    let data = await response.json();

    return data
}

//Удаление клиента
async function serverDeleteClient(id) {
    let response = await fetch(
        SERVER_URL + SERVER_API_CLIENTS + '/' + id, {
        method: 'DELETE',
    });

    let data = await response.json();

    return data
}

//Получение данных одного клиента
async function serverGetOneClient(id) {
    let response = await fetch(SERVER_URL + SERVER_API_CLIENTS + '/' + id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    let data = await response.json();

    return data
}

//Перезапись данных клиента
async function serverEditClient(object, id) {
    try {
        let response = await fetch(SERVER_URL + SERVER_API_CLIENTS + '/' + id, {
            method: 'PATCH',
            body: JSON.stringify(object),
            headers: { 'Content-Type': 'application/json' },
        });

        let data = await response.json();

        return data
    } catch {
        return
    }
}

//Функция создания элемента
function getElement(name, classList, text) {
    const element = document.createElement(name);
    element.classList.add(classList);
    element.textContent = text;

    return element
}

document.addEventListener('DOMContentLoaded', async function () {

    //Создание header и добавление в него элементов
    const header = getElement('header', 'header');
    const headerBox = getElement('div', 'container');
    headerBox.classList.add('header__container');

    const headerLink = getElement('a', 'header__link');
    headerLink.href = "#";

    const headerLogo = getElement('img', 'header__logo');
    headerLogo.src = 'img/logo.svg';
    headerLogo.alt = 'Логотип Скиллбас';

    const headerInp = getElement('input', 'header__input');
    headerInp.type = 'text';
    headerInp.placeholder = 'Введите запрос';

    headerLink.append(headerLogo)
    headerBox.append(headerLink, headerInp);
    header.append(headerBox);
    document.body.append(header);

    //Создание main и добавление в него элементов
    const main = getElement('main', 'main');
    const mainBox = getElement('div', 'container');

    const section = getElement('section', 'section');

    const title = getElement('h2', 'title', 'Клиенты');

    const table = getElement('table', 'table');
    table.rules = "rows";

    const thead = getElement('thead', 'thead');
    const tr = getElement('tr', 'thead__row');
    const tableId = getElement('th', 'thead__header', 'ID');
    tableId.classList.add('thead__header-sort');
    const tableFullName = getElement('th', 'thead__header', 'Фамилия Имя Отчество');
    tableFullName.classList.add('thead__header-sort');
    tableFullName.classList.add('thead__header-fullname');
    const tableDate = getElement('th', 'thead__header', 'Дата и время создания');
    tableDate.classList.add('thead__header-date');
    tableDate.classList.add('thead__header-sort');
    const tableChanges = getElement('th', 'thead__header', 'Последние изменения');
    tableChanges.classList.add('thead__header-changes');
    tableChanges.classList.add('thead__header-sort');
    const tableContacts = getElement('th', 'thead__header', 'Контакты');
    const tableActions = getElement('th', 'thead__header', 'Действия');

    function addArrow(elem) {
        elem.insertAdjacentHTML("beforeend", `<svg class="thead__svg" width="12" height="12" viewBox="0 -3 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7" clip-path="url(#clip0_224_711)">
        <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/>
        </g><defs><clipPath id="clip0_224_711"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>`);
    }
    addArrow(tableId);
    addArrow(tableFullName);
    addArrow(tableDate);
    addArrow(tableChanges);

    const tbody = getElement('tbody', 'tbody');

    tr.append(tableId, tableFullName, tableDate, tableChanges, tableContacts, tableActions);
    thead.append(tr);
    table.append(thead, tbody);

    const firstLoading = getElement('div', 'first-loading');

    const addBtnBox = getElement('div', 'add-box');
    const addBtn = getElement('button', 'add-box__btn', 'Добавить клиента');
    addBtnBox.append(addBtn);

    //Создание модального окна для кнопки "Изменить"
    const modalChange = createModalWindow('Изменить данные', 'Удалить клиента', 'surnameInpEdit', 'nameInpEdit', 'lastnameInpEdit', 'selectEdit', 'selectInpEdit', 'modalContactsEdit', 'formEdit', 'modalBtnEdit', 'errorBoxEdit', 'endBtnEdit');

    //Создание модального окна и добавление его в mainBox
    const modalAdd = createModalWindow('Новый клиент', 'Отмена', 'surnameInp', 'nameInp', 'lastnameInp', 'select', 'selectInp', 'modalContacts', 'formAdd', 'modalBtnAdd', 'errorBox', 'endBtnAdd');

    //Создание модального окна удаления
    // const modalDelete = createModalDelete();

    section.append(title, table);
    mainBox.append(section, firstLoading, addBtnBox, modalChange, modalAdd);
    main.append(mainBox);
    document.body.append(main);

    //Создание массива с клиентами
    let clientsList = [];

    let serverData = await serverGetClients();

    if (serverData) {
        clientsList = serverData;
    }

    //Функция вывода одного клиента (одной строки таблицы)
    function getClientItem(obj) {
        const tableRow = getElement('tr', 'tbody__row');
        tableRow.id = obj.id;

        //Вывод ID
        const idCell = getElement('td', 'tbody__data');
        idCell.classList.add('tbody__data-id')
        idCell.textContent = obj.id.substr(0, 6);

        //Вывод ФИО
        const fullNameCell = getElement('td', 'tbody__data');
        fullNameCell.textContent = `${obj.surname} ${obj.name} ${obj.lastName}`

        //Вывод даты и времени создания
        const dateCell = getElement('td', 'tbody__data');
        const spanLeftDate = getElement('span', 'tbody__span-data-left');
        const spanRightDate = getElement('span', 'tbody__span-data-right');

        const dateObj = new Date(obj.createdAt);

        //Преобразование даты к нужному формату
        function getDateObj(object) {
            let dayOfDate = object.getDate();
            let monthOfDate = object.getMonth() + 1;
            let yearOfDate = object.getFullYear();

            if (dayOfDate < 10) {
                dayOfDate = `0${String(dayOfDate)}`
            }
            if (monthOfDate < 10) {
                monthOfDate = `0${String(monthOfDate)}`
            }
            if (yearOfDate < 10) {
                yearOfDate = `0${String(yearOfDate)}`
            }

            let dateString = `${dayOfDate}.${monthOfDate}.${yearOfDate}`;

            return dateString
        }

        const timeObj = new Date(obj.createdAt);

        //Преобразование времени к нужному формату
        function getTimeObj(obj) {
            let hoursOfDate = obj.getHours();
            let minutesOfDate = obj.getMinutes();

            if (hoursOfDate < 10) {
                hoursOfDate = `0${String(hoursOfDate)}`;
            }
            if (minutesOfDate < 10) {
                minutesOfDate = `0${String(minutesOfDate)}`;
            }

            let timeString = `${hoursOfDate}:${minutesOfDate}`;

            return timeString
        }

        spanLeftDate.textContent = getDateObj(dateObj);
        spanRightDate.textContent = getTimeObj(timeObj);

        dateCell.append(spanLeftDate, spanRightDate);

        //Вывод даты и времени изменения
        const changeCell = getElement('td', 'tbody__data');
        const spanLeftChange = getElement('span', 'tbody__span-data-left');
        const spanRightChange = getElement('span', 'tbody__span-data-right');

        const dateObjChange = new Date(obj.updatedAt);
        const timeObjChange = new Date(obj.updatedAt);

        spanLeftChange.textContent = getDateObj(dateObjChange);
        spanRightChange.textContent = getTimeObj(timeObjChange);

        changeCell.append(spanLeftChange, spanRightChange);

        //Вывод контактов
        const contactsCell = getElement('td', 'tbody__data');

        const contactsList = getElement('ul', 'contacts');
        for (let i = 0; i < obj.contacts.length; i++) {
            const contact = getElement('li', 'contacts__item');

            if (i > 3) {
                contact.classList.add('contacts__item-none');
            }

            const oneContact = obj.contacts[i];

            //Вставка svg в зависимости от типа контакта
            function checkTypeContact(text, svg) {
                if (oneContact.type === text) {
                    const svgImg = svg;
                    contact.insertAdjacentHTML("afterbegin", svgImg);
                }
            };

            const phoneIcon = checkTypeContact('Телефон', `<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7"><circle cx="8" cy="8" r="8" fill="#9873FF"/>
            <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
            </g></svg>`);

            const emailIcon = checkTypeContact('Email', `<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
            </svg>`);

            const vkIcon = checkTypeContact('Vk', `<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7"><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
            </g></svg>`);

            const facebookIcon = checkTypeContact('Facebook', `<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7"><path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
            </g></svg>`);

            const anotherIcon = checkTypeContact('Другое', `<svg class="contacts__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
            </g></svg>`);

            const contactsClue = getElement('div', 'tbody__box-clue');
            const spanType = getElement('span', 'tbody__span-type', `${oneContact.type}: `);
            let spanValue;

            if (oneContact.type === 'Email' || oneContact.type === 'Vk' || oneContact.type === 'Facebook') {
                spanValue = getElement('a', 'tbody__link-value', `${oneContact.value}`);
                spanValue.href = `${oneContact.value}`;
            } else {
                spanValue = getElement('span', 'tbody__span-value', `${oneContact.value}`);
            }

            contactsClue.append(spanType, spanValue);
            contact.append(contactsClue);
            contactsList.append(contact);
        }

        //Скрытие, если контактов больше четырех, создание кнопки-счетчика
        if (obj.contacts.length > 4) {
            const contactsCount = getElement('li', 'contacts__item-count');
            let count = obj.contacts.length - 4;
            contactsCount.textContent = `+${count}`;
            contactsList.append(contactsCount);

            contactsCount.addEventListener('click', () => {
                const items = contactsList.childNodes;

                for (let item of items) {
                    item.classList.remove('contacts__item-none');
                };

                contactsCount.classList.add('contacts__item-none');
            })
        }

        contactsCell.append(contactsList);

        //Вывод действий
        const btnCell = getElement('td', 'tbody__data');
        const btnBox = getElement('div', 'tbody__box');

        const changeBtn = getElement('button', 'tbody__btn-change', 'Изменить');
        const deleteBtn = getElement('button', 'tbody__btn-delete', 'Удалить');

        //Слушатель событий - кнопка "Изменить"
        changeBtn.addEventListener('click', async function () {
            window.location.hash = obj.id;
        })

        //Удаление клиента при клике на кнопку "Удалить"
        deleteBtn.addEventListener('click', async function () {
            const modalDelete = createModalDelete(obj.id);
            modalDelete.classList.add('open');
        })

        btnBox.append(changeBtn, deleteBtn);
        btnCell.append(btnBox);

        tableRow.append(idCell, fullNameCell, dateCell, changeCell, contactsCell, btnCell)
        return tableRow
    }

    //Функция для заполнения модального окна изменения
    function fillModal(obj) {
        modalChange.classList.add('open');

        //Добавление ID к заголовку модального окна
        const spanId = document.getElementById('modalSpanId');
        spanId.textContent = `ID: ${obj.id.substr(0, 6)}`;

        //Заполнение форм модального окна (при клике на кнопку "Изменить")
        const clientNameEdit = document.getElementById('nameInpEdit');
        clientNameEdit.value = obj.name;
        const clientSurnameEdit = document.getElementById('surnameInpEdit');
        clientSurnameEdit.value = obj.surname;
        const clientLastnameEdit = document.getElementById('lastnameInpEdit');
        clientLastnameEdit.value = obj.lastName;

        const contactsAllEdit = obj.contacts;
        const modalContactsBox = document.getElementById('modalContactsEdit');

        //Заполнение селектов контактами
        if (!document.querySelector('#selectEdit') > 0) {
            if (!contactsAllEdit.length < 1) {
                modalContactsBox.classList.add('modal__contacts-padding');
            }

            for (let i = 0; i < contactsAllEdit.length; i++) {
                const selectBoxEdit = createSelect('selectEdit', 'selectInpEdit');
                modalContactsBox.prepend(selectBoxEdit);

                const contactsSelect = document.querySelector('#selectEdit');
                const contactsSelectInp = document.querySelector('#selectInpEdit');

                contactsSelect.value = contactsAllEdit[i].type;
                contactsSelectInp.value = contactsAllEdit[i].value;

                //Удаление маски, если тип контакта не "Телефон"
                if (contactsSelect.value !== 'Телефон') {
                    Inputmask.remove(contactsSelectInp)
                    contactsSelectInp.value = contactsAllEdit[i].value;
                }
            };
        }

        const formEdit = document.getElementById('formEdit');
        const endBtnEdit = document.getElementById('endBtnEdit');


        //Слушатель события сохранения формы с измененными данными клиента
        formEdit.addEventListener('submit', async function (e) {
            e.preventDefault();

            if(obj.id === '') {
                return
            }

            if (validation('nameInpEdit', 'surnameInpEdit', '#selectInpEdit', 'errorBoxEdit')) {
                const ClientObjData = saveClient('nameInpEdit', 'surnameInpEdit', 'lastnameInpEdit', '#selectEdit', '#selectInpEdit');

                await saveEditClient(ClientObjData, obj.id);

                //Очистка инпутов модального окна
                cleanInp();
                window.location.hash = '';
                obj.id = '';

                //Очистка блока с ошибкой
                const error = document.getElementById('errorBoxEdit');
                error.innerHTML = '';

                //Закрытие модального окна
                modalChange.classList.remove('open');
            }
        })

        //Слушатель события кнопки "Удалить клиента" в модальном окне "Изменить клиента"
        endBtnEdit.addEventListener('click', async function () {

            if(obj.id === '') {
                return
            }
            modalChange.classList.remove('open');
            const modalDelete = createModalDelete(obj.id);
            modalDelete.classList.add('open');

            window.location.hash = '';
            obj.id = '';
        })
    }

    //Функция для рендера таблицы
    function renderClientsTable(arr) {
        for (let i = 0; i < arr.length; i++) {
            let clientRow = getClientItem(arr[i]);
            tbody.append(clientRow);
        }
    }

    //Функция создания модального окна удаления
    function createModalDelete(id) {
        const modalDelete = getElement('div', 'modal');
        modalDelete.id = 'modalDelete' + id;
        const box = getElement('div', 'modal__box');
        box.classList.add('modal__box-delete');
        const title = getElement('h3', 'modal__title', 'Удалить клиента');
        title.classList.add('modal__title-delete');
        const closeBtn = getElement('button', 'modal__close-btn');
        const descr = getElement('p', 'modal__descr', 'Вы действительно хотите удалить данного клиента?');
        const btnBox = getElement('div', 'modal__btn-box');
        const deleteBtn = getElement('button', 'modal__btn-save', 'Удалить');
        deleteBtn.id = 'modalDeleteBtn';
        deleteBtn.type = 'button';
        const cancelBtn = getElement('button', 'modal__btn-cancel', 'Отмена');

        //Закрытие модального окна при клике на крестик
        closeBtn.addEventListener('click', () => {
            modalDelete.remove();
        })

        //Закрытие модального окна при клике на Esc
        mainBox.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modalDelete.remove();
            }
        })

        //Закрытие модального окна при клике мышью вне модального окна
        box.addEventListener('click', event => {
            event._isClickWithInModal = true;
            modalDelete.remove();

        })
        modalDelete.addEventListener('click', event => {
            if (event._isClickWithInModal) return;
            event.currentTarget.classList.remove('open');
            modalDelete.remove();
        })

        //Закрытие модального окна при клике на кнопку "Отмена"
        cancelBtn.addEventListener('click', () => {
            modalDelete.remove();
        })

        //Удаление клиента при клике на "Удалить"

        deleteBtn.addEventListener('click', async function () {

            await serverDeleteClient(id);

            const deleteRow = document.getElementById(id);

            deleteRow.remove();
            modalDelete.remove();
        })

        btnBox.append(deleteBtn, cancelBtn)
        box.append(title, closeBtn, descr, btnBox);
        modalDelete.append(box);

        mainBox.append(modalDelete);

        return modalDelete;
    }

    //Функция создания модального окна
    function createModalWindow(title, text, idInpSurname, idInpName, idInpLastName, selectName, selectInpName, modalId, form, modalBtnId, errorBox, endBtn) {
        const modal = getElement('div', 'modal');
        const modalBox = getElement('div', 'modal__box');
        const modalCloseBtn = getElement('button', 'modal__close-btn');
        const modalTitle = getElement('h3', 'modal__title', title);
        const modalSpan = getElement('span', 'modal__span-id');
        modalSpan.id = 'modalSpanId';
        const modalForm = getElement('form', 'modal__form');
        modalForm.id = form;
        modalForm.setAttribute('novalidate', true);
        const modalInpBox = getElement('div', 'modal__inp-box');

        const modalInpSurname = createModalInp('Фамилия', idInpSurname);
        const modalInpName = createModalInp('Имя', idInpName);
        const modalInpLastname = createModalInp('Отчество', idInpLastName);

        const modalAddBox = getElement('div', 'modal__contacts');
        modalAddBox.id = modalId;
        const modalAddBtnBox = getElement('div', 'modal__contacts-box');
        const modalAddContacts = getElement('button', 'modal__contacts-btn', 'Добавить контакт');
        modalAddContacts.insertAdjacentHTML("afterbegin", `<svg class="modal__contacts-svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99998 3.66683C6.63331 3.66683 6.33331 3.96683 6.33331 4.3335V6.3335H4.33331C3.96665 6.3335 3.66665 6.6335 3.66665 7.00016C3.66665 7.36683 3.96665 7.66683 4.33331 7.66683H6.33331V9.66683C6.33331 10.0335 6.63331 10.3335 6.99998 10.3335C7.36665 10.3335 7.66665 10.0335 7.66665 9.66683V7.66683H9.66665C10.0333 7.66683 10.3333 7.36683 10.3333 7.00016C10.3333 6.6335 10.0333 6.3335 9.66665 6.3335H7.66665V4.3335C7.66665 3.96683 7.36665 3.66683 6.99998 3.66683ZM6.99998 0.333496C3.31998 0.333496 0.333313 3.32016 0.333313 7.00016C0.333313 10.6802 3.31998 13.6668 6.99998 13.6668C10.68 13.6668 13.6666 10.6802 13.6666 7.00016C13.6666 3.32016 10.68 0.333496 6.99998 0.333496ZM6.99998 12.3335C4.05998 12.3335 1.66665 9.94016 1.66665 7.00016C1.66665 4.06016 4.05998 1.66683 6.99998 1.66683C9.93998 1.66683 12.3333 4.06016 12.3333 7.00016C12.3333 9.94016 9.93998 12.3335 6.99998 12.3335Z" fill="#9873FF"/>
        </svg>`);

        //Создания блока для выведения ошибок
        const error = getElement('div', 'error-box');
        error.id = errorBox;

        const modalBtnBox = getElement('div', 'modal__btn-box');
        const modalBtnSave = getElement('button', 'modal__btn-save', 'Сохранить');
        modalBtnSave.id = modalBtnId;
        const modalBtnBoxCancel = getElement('div', 'modal__btn-box');
        const modalBtnCancel = getElement('button', 'modal__btn-cancel', text);
        modalBtnCancel.id = endBtn;


        //Слушатель события на кнопке "Добавить контакт"
        let counter = 0;

        modalAddContacts.addEventListener('click', function (e) {
            e.preventDefault();

            const selectArr = document.querySelectorAll('.modal__select-form');

            counter++;

            if (counter > 9 || selectArr.length > 8) {
                modalAddContacts.classList.add('contacts__item-none');
            }

            let select = createSelect(selectName, selectInpName);
            modalAddBox.classList.add('modal__contacts-padding');

            modalAddBox.append(select, modalAddBtnBox);
        })

        //Закрытие модального окна при клике на крестик
        modalCloseBtn.addEventListener('click', function () {
            modal.classList.remove('open');
            cleanInp();
            window.location.hash = '';
        })

        //Закрытие модального окна при клике на Esc
        mainBox.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('open');
                cleanInp();
                window.location.hash = '';
            }
        })

        //Закрытие модального окна при клике мышью вне модального окна
        modalBox.addEventListener('click', event => {
            event._isClickWithInModal = true;
        })
        modal.addEventListener('click', event => {
            if (event._isClickWithInModal) return;
            event.currentTarget.classList.remove('open');
            cleanInp();
            window.location.hash = '';
        })

        modalInpBox.append(modalInpSurname, modalInpName, modalInpLastname)
        modalBtnBox.append(modalBtnSave);
        modalBtnBoxCancel.append(modalBtnCancel);
        modalAddBtnBox.append(modalAddContacts);
        modalAddBox.append(modalAddBtnBox);
        modalForm.append(modalInpBox, modalAddBox, error, modalBtnBox);
        modalBox.append(modalCloseBtn, modalTitle, modalSpan, modalForm, modalBtnBoxCancel);
        modal.append(modalBox);

        return modal
    }

    //Закрытие модального окна создания при клике на кнопку "Отмена"
    document.getElementById('endBtnAdd').addEventListener('click', () => {
        modalAdd.classList.remove('open');
        cleanInp();
        window.location.hash = '';
    })

    //Слушатель событий - сохранение нового клиента
    document.getElementById('formAdd').addEventListener('submit', async function (e) {
        e.preventDefault();

        if (validation('nameInp', 'surnameInp', '#selectInp', 'errorBox')) {
            const ClientObjData = saveClient('nameInp', 'surnameInp', 'lastnameInp', '#select', '#selectInp');
            saveNewClient(ClientObjData);

            //Очистка инпутов модального окна
            cleanInp();

            //Закрытие модального окна
            modalAdd.classList.remove('open');
        }
    })


    //Функция сбора информации из инпутов, создание объекта клиента
    function saveClient(name, surname, lastname, select, selectInp) {
        const clientName = document.getElementById(name).value.trim();
        const clientSurname = document.getElementById(surname).value.trim();
        const clientLastname = document.getElementById(lastname).value.trim();

        const contactsAll = [];
        const contactsSelectArr = document.querySelectorAll(select);
        const contactsSelectInpArr = document.querySelectorAll(selectInp);

        for (let i = 0; i < contactsSelectArr.length; i++) {
            const contactValue = contactsSelectArr[i].value;
            const contactInpValue = contactsSelectInpArr[i].value;

            const contactsSelect = {
                type: contactValue,
                value: contactInpValue,
            };

            contactsAll.push(contactsSelect);
        }

        const newClient = {
            name: clientName,
            surname: clientSurname,
            lastName: clientLastname,
            contacts: contactsAll,
        };

        return newClient
    }

    //Функция для сохранения на сервере нового клиента
    async function saveNewClient(obj) {
        let serverDataObj = await serverAddClient(obj);

        clientsList.push(serverDataObj);

        let newClient = getClientItem(serverDataObj);
        tbody.append(newClient);
    }

    //Функция для сохранения на сервере изменений о замена строки таблицы
    async function saveEditClient(obj, id) {

        const newClientData = await serverEditClient(obj, id);

        let row = document.getElementById(newClientData.id);
        const newRow = getClientItem(newClientData);

        row.replaceWith(newRow);
    }

    //Функция очистки инпутов в модальном окне
    function cleanInp() {
        document.getElementById('nameInp').value = '';
        document.getElementById('surnameInp').value = '';
        document.getElementById('lastnameInp').value = '';
        const selectBox = document.querySelectorAll('.modal__select-form');

        for (let i = 0; i < selectBox.length; i++) {
            selectBox[i].remove();
        }

        let box = document.querySelectorAll('.modal__contacts');
        for (let i = 0; i < box.length; i++) {
            box[i].classList.remove('modal__contacts-padding');
        }

        const errorAdd = document.getElementById('errorBox');
        const errorEdit = document.getElementById('errorBoxEdit');
        errorAdd.innerHTML = '';
        errorEdit.innerHTML = '';

        document.getElementById('nameInp').classList.remove('input-error');
        document.getElementById('surnameInp').classList.remove('input-error');
        document.getElementById('nameInpEdit').classList.remove('input-error');
        document.getElementById('surnameInpEdit').classList.remove('input-error');
    }

    //Функция создания input для модального окна
    function createModalInp(text, idName) {
        const modalContainer = getElement('div', 'text-field');
        const modalInp = getElement('input', 'text-field__inp');
        modalInp.type = 'text';
        modalInp.required = true;
        modalInp.id = idName;
        const modalLabel = getElement('label', 'text-field__placeholder', text);

        if (text === 'Фамилия' || text === 'Имя') {
            modalLabel.classList.add('asterisk');
        }

        modalContainer.append(modalInp, modalLabel)
        return modalContainer
    }

    //Функция создания селектов (после нажатия на кнопку "Добавить контакты")
    function createSelect(selectIdName, selectInpIdName) {
        const selectForm = getElement('form', 'modal__select-form');
        const select = getElement('select', 'modal__select');
        select.id = selectIdName;
        const selectInp = getElement('input', 'modal__input');
        selectInp.id = selectInpIdName;

        //Значение placeholder в зависимости от ширины экрана
        if (document.documentElement.clientWidth > 767) {
            selectInp.placeholder = "Введите данные контакта";
        } else {
            selectInp.placeholder = "Введите данные";
        }

        const selectBtn = getElement('button', 'modal__btn');
        selectBtn.insertAdjacentHTML("afterbegin", `<svg class="modal__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_224_6681)">
            <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
            </g><defs><clipPath id="clip0_224_6681"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`);

        const optionsPhone = getElement('option', 'modal__option', 'Телефон');
        optionsPhone.value = 'Телефон';
        const optionsEmail = getElement('option', 'modal__option', 'Email');
        optionsEmail.value = 'Email';
        const optionsFacebook = getElement('option', 'modal__option', 'Facebook');
        optionsFacebook.value = 'Facebook';
        const optionsVk = getElement('option', 'modal__option', 'Vk');
        optionsVk.value = 'Vk';
        const optionsAnother = getElement('option', 'modal__option', 'Другое');
        optionsAnother.value = 'Другое';

        //Удаление строки контакта
        selectBtn.addEventListener('click', () => {
            const selectArr = document.querySelectorAll(`#${selectIdName}`);
            const modalContacts = document.querySelector('#modalContacts');
            const modalContactsEdit = document.querySelector('#modalContactsEdit');

            selectForm.remove();

            if (selectArr.length === 1) {
                modalContacts.classList.remove('modal__contacts-padding');
                modalContactsEdit.classList.remove('modal__contacts-padding');
            }
        })

        //Маска для телефона
        if (selectInp.value === '') {
            let im = new Inputmask("+7 (999)-999-99-99");
            im.mask(selectInp);
        } else {
            Inputmask.remove(selectInp)
        }

        function onChange() {
            const value = select.value;

            if (value === 'Email' || value === 'Facebook' || value === 'Vk' || value === 'Другое') {
                Inputmask.remove(selectInp)
            }

        }
        select.onchange = onChange;
        onChange();

        select.append(optionsPhone, optionsEmail, optionsFacebook, optionsVk, optionsAnother);
        selectForm.append(select, selectInp, selectBtn);

        return selectForm
    }

    //Создаем слушатель для кнопки "Добавить клиента"
    addBtn.addEventListener('click', function () {
        modalAdd.classList.add('open')
    })

    //Фильтрация списка клиентов
    function filterArray(arr, value) {
        const filterClientList = arr.filter(client => `${client.surname.toLowerCase()} ${client.name.toLowerCase()} ${client.lastName.toLowerCase()}`.includes(value.toLowerCase()));

        return filterClientList
    }

    headerInp.addEventListener('input', async function () {
        let clientsListFilter = [];
        let serverData = await serverGetClients();
        clientsListFilter = serverData;

        let newClientsListFilter = [...clientsListFilter];

        if (headerInp.value !== '') newClientsListFilter = filterArray(clientsListFilter, headerInp.value);

        setTimeout(() => {
            tbody.innerHTML = '';
            renderClientsTable(newClientsListFilter);
        }, 300);
    })

    //Сортировка списка клиентов

    const svgArrowId = document.querySelectorAll('.thead__svg');

    const svgId = svgArrowId[0];
    svgId.classList.add('thead__svg_arrow-up')
    const svgFullname = svgArrowId[1];
    const svgDate = svgArrowId[2];
    const svgChanges = svgArrowId[3];

    function sortClients(arr, prop, dir = false, svg) {
        let result = arr.sort(function (a, b) {
            let direction = dir === false ? a[prop] < b[prop] : a[prop] > b[prop];
            if (direction === true) return -1;
        });

        if (dir === false) {
            svg.classList.add('thead__svg_arrow-up');
        } else {
            svg.classList.remove('thead__svg_arrow-up');
        }

        return result
    }

    let directionTo = true;

    //Сортировка по ID клиента
    tableId.addEventListener('click', () => {

        const sortClientList = sortClients([...clientsList], 'id', directionTo = !directionTo, svgId);
        tbody.innerHTML = '';
        renderClientsTable(sortClientList);
    })

    //Сортировка по ФИО
    tableFullName.addEventListener('click', () => {

        const sortClientList = sortClients([...clientsList], 'surname', directionTo = !directionTo, svgFullname);
        tbody.innerHTML = '';
        renderClientsTable(sortClientList);
    })

    //Сортировка по дате создания
    tableDate.addEventListener('click', () => {

        const sortClientList = sortClients([...clientsList], 'createdAt', directionTo = !directionTo, svgDate);
        tbody.innerHTML = '';
        renderClientsTable(sortClientList);
    })

    //Сортировка по дате изменения
    tableChanges.addEventListener('click', () => {

        const sortClientList = sortClients([...clientsList], 'updatedAt', directionTo = !directionTo, svgChanges);
        tbody.innerHTML = '';
        renderClientsTable(sortClientList);
    })

    //Валидация (проверка) формы
    function validation(nameInput, surnameInput, selectInput, errorBox) {

        let result = true;

        const name = document.getElementById(nameInput);
        const surname = document.getElementById(surnameInput);
        const selects = document.querySelectorAll(selectInput);
        const error = document.getElementById(errorBox);

        if (surname.value === '') {
            error.textContent = 'Ошибка: Введите фамилию';
            surname.classList.add('input-error');
            result = false;
        }
        if (name.value === '') {
            error.textContent = 'Ошибка: Введите имя';
            name.classList.add('input-error');
            result = false;
        }
        if (surname.value === '' && name.value === '') {
            error.textContent = 'Ошибка: Введите фамилию и имя';
            result = false;
        }

        selects.forEach(select => {
            if (select.value === '') {
                error.textContent = 'Ошибка: Заполните контакт';
                select.classList.add('select-error')
                result = false;
            }
        })

        name.addEventListener('input', () => {
            name.classList.remove('input-error');
        });

        surname.addEventListener('input', () => {
            surname.classList.remove('input-error');
        });

        selects.forEach(select => {
            select.addEventListener('input', () => {
                select.classList.remove('input-error');
            })
        });

        return result
    }

    //Функция для сортировки таблицы по умолчанию
    function sortClientsDefault(arr, prop, dir = false) {
        let result = arr.sort(function (a, b) {
            let direction = dir === false ? a[prop] < b[prop] : a[prop] > b[prop];
            if (direction === true) return -1;
        });

        return result
    }

    //Отрисовка таблицы при запуске
    function firstBoot() {

        firstLoading.insertAdjacentHTML("beforeend", `<svg class="loading" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 20C2 29.941 10.059 38 20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C17.6755 2 15.454 2.4405 13.414 3.243" stroke="#9873FF" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>`);

        setTimeout(() => {
            firstLoading.remove();
            table.classList.add('table-margin');
            const arrDefaultById = sortClientsDefault(clientsList, 'id', false);
            renderClientsTable(arrDefaultById);
        }, 1000);
    }

    firstBoot();

    window.addEventListener('hashchange', async function () {

        if (window.location.hash === '') {
            return
        }

        const hashId = window.location.hash;
        const id = hashId.substring(1);


        let objClient = await serverGetOneClient(id);

        fillModal(objClient);
    })
})





