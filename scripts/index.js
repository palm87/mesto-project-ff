// @todo: Темплейт карточки
//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
//определим область со списком карточек
const cardsList=document.querySelector('.places__list');

//для показа надписи, когда нет ни одной карточки
const zeroPlaces = document.querySelector('.places-zero');

//кнопка для перезагрузки списка карточек
const reloadButton = document.querySelector('.profile__reload-button');

//добавим счетчик карточек, чтобы отслеживать, когда нет ни одной карточки
let cardsCount=0;


// @todo: Функция создания карточки
function createCard(card, anyFunction = deleteCard) {
    
    //клонируем содержимое template
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // наполним содержимым
    cardElement.querySelector('.card__image').src = card.link;
    cardElement.querySelector('.card__image').alt = card.name;
    cardElement.querySelector('.card__title').textContent = card.name;

    //добавим eventListner на клик по кнопке удаления
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
        deleteCard(cardElement);
    });
    return cardElement;
}
// @todo: Функция удаления карточки
function deleteCard(card) {
    card.remove();

    //понижаем счетчик карточек и проверяем, не пора ли отобразить надпись, что карточек нет
    cardsCount-=1;
    checkCardsCount();
}

// @todo: Вывести карточки на страницу
//функция добавления карточки в отображенный список на странице
const listCard = card => {
    cardsList.append(card);
    cardsCount+=1;
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    listCard(createCard(item));
});


//функция для обновления списка карточек - удаляет все загруженные и заново подргужает список из initialCards
function reloadCardList() {
    const allCards=document.querySelectorAll('li')
    allCards.forEach((item) =>{
        item.remove()
    })
    cardsCount=0;
    initialCards.forEach((item) => {
        listCard(createCard(item));
    });
    checkCardsCount();
    checkReloadButton();
}

//добавим обновление списка карточек по отдельно созданной кнопке 
reloadButton.addEventListener('click', reloadCardList);

//функция для проверки, сколько карточек отображается и не пора ли отобразить надпись, что карточек нет
function checkCardsCount () {
    if (cardsCount===0) {
        zeroPlaces.classList.remove('hide-it');
    }
    else {
        zeroPlaces.classList.add('hide-it');
    }
    checkReloadButton();
    
}

function checkReloadButton() {
    if (cardsCount===initialCards.length) {
        reloadButton.setAttribute('disabled', true)
    }

    else {
        reloadButton.removeAttribute('disabled');
    }
}

