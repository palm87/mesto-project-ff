// У вас по заданию нет данной кнопки, она вам не нужна, сосредоточьтесь на том, что дается в задании. 
// То, что сейчас мало нужно сделать - не означает, что в след работе будет меньше. 
// А через спринт у вас будет работа с сервером, тут уже точно никаких перезагрузок не получится

//Это очень плохой комментарий для ревьювера.

//И почитайте про использование setAttrubute для disabled https://stackoverflow.com/questions/7526601/setattributedisabled-false-changes-editable-attribute-to-false


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


//@todo: Функция создания карточки
function createCard(card, deleteCard) {
    
    //клонируем содержимое template
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    
    //переменные для полей карточки
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    

    // наполним содержимым
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;
    
    //добавим eventListner на клик по кнопке удаления
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
        deleteCard(cardElement);
    });

    //вариант с передачей Event
    // cardElement.querySelector('.card__delete-button').addEventListener('click', function (event){
    //     deleteOnEvent(event);
    // });

    
    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
    card.remove();
    //понижаем счетчик карточек и проверяем, не пора ли отобразить надпись, что карточек нет
    cardsCount-=1;
    checkCardsCount();
}

//функция удаления в случае передаи Event
// function deleteOnEvent(event) {
//     event.target.closest('.card').remove();
// }

// @todo: Вывести карточки на страницу
//функция добавления карточки в отображенный список на странице
const renderCard = card => {
    cardsList.append(card);
    cardsCount+=1;
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    renderCard(createCard(item, deleteCard));
});

//--------------------------EXTRA--------------------------------------------


//функция для обновления списка карточек - удаляет все загруженные и заново подргужает список из initialCards
function reloadCardList() {
    const allCards=document.querySelectorAll('.card')
    allCards.forEach((item) =>{
        item.remove()
    })
    cardsCount=0;
    initialCards.forEach((item) => {
        renderCard(createCard(item, deleteCard));
    });
    checkCardsCount();
    checkReloadButton();
}

//добавим обновление списка карточек по отдельно созданной кнопке 
reloadButton.addEventListener('click', reloadCardList);

//функция для проверки, сколько карточек отображается и не пора ли отобразить надпись, что карточек нет
function checkCardsCount () {
    zeroPlaces.classList.toggle('hide-it', cardsCount !== 0)
    checkReloadButton();
}

//если на данный момент все карточки из initialCards отображены - дизейблим кнопку

function checkReloadButton() {
    //ЭТО НЕ БУДЕТ РАБОТАТЬ https://stackoverflow.com/questions/7526601/setattributedisabled-false-changes-editable-attribute-to-false
    //reloadButton.setAttribute('disabled', cardsCount===initialCards.length)
    //ЭТО НЕ БУДЕТ РАБОТАТЬ https://stackoverflow.com/questions/7526601/setattributedisabled-false-changes-editable-attribute-to-false
    
    if (cardsCount===initialCards.length) {
        reloadButton.setAttribute('disabled', true)
    }

    else {
        reloadButton.removeAttribute('disabled');
    }
}

