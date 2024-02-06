// @todo: Темплейт карточки
//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;



// @todo: DOM узлы
//определим область со списком карточек
const cardsList=document.querySelector('.places__list');

//для показа надписи, когда нет ни одной карточки
const zeroPlaces = document.querySelector('.places-zero');

//добавим счетчик карточек, чтобы отслеживать, когда карточек нет
let cardsCount=0;

// @todo: Функция создания карточки
function createCard(card, anyFunction=deleteCard) {
    
    //клонируем содержимое template
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // наполним содержимым
    cardElement.querySelector('.card__image').src = card.link;
    cardElement.querySelector('.card__image').alt = card.name;
    cardElement.querySelector('.card__title').textContent = card.name;

    //добавим eventListner на клик по кнопке удаления
    cardElement.querySelector('.card__delete-button').addEventListener('click', () =>{
        anyFunction(cardElement);
    });
    return cardElement;
}
// @todo: Функция удаления карточки
const deleteCard = card => {
    card.remove();

    //понижаем счетчик карточек и проверяем, не пора ли отобразить надпись, что карточек нет
    cardsCount-=1;
    if (cardsCount===0) {
        zeroPlaces.classList.remove('hide-it');
    }
}


// @todo: Вывести карточки на страницу
//функция добавления карточки в список на странице
const listCard = card => {
    cardsList.append(card);
    cardsCount+=1;
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    listCard(createCard(item));
});



