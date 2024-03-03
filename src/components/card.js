//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

//для показа надписи, когда нет ни одной карточки
const zeroPlaces = document.querySelector('.places-zero');

//определим область со списком карточек
export const cardsList=document.querySelector('.places__list');

//добавим счетчик карточек, чтобы отслеживать, когда нет ни одной карточки
export let cardsCount=0;

//@todo: Функция создания карточки
export function createCard(card, deleteCardCallback, likeCardCallback, showBigImageCallback) {
    
    //клонируем содержимое template
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    
    //переменные для полей карточки
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    
    // наполним содержимым
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;

    // //добавим eventListner на клик по кнопке удаления
    cardElement.addEventListener('click', (evt) => {
        if(evt.target.classList.contains('card__delete-button')) {
            deleteCardCallback(evt.currentTarget);
        }
    });   

    //найдем кнопку лайка и поставим на нее слушатель лайка
    const cardLikeButton = cardElement.querySelector('.card__like-button')
    cardLikeButton.addEventListener('click', likeCardCallback)

    //открытие попапа с большой картинкой по клику на картинку
    const openImageButton = cardElement.querySelector('.card__image')
    openImageButton.addEventListener('click', showBigImageCallback)

    return cardElement;
}

//функция удаления карточки
export function deleteCard(card) {
    card.remove();
    //понижаем счетчик карточек и проверяем, не пора ли отобразить надпись, что карточек нет
    cardsCount-=1;
    checkCardsCount();
}

export function likeCardHandler(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}

//функция для проверки, сколько карточек отображается и не пора ли отобразить надпись, что карточек нет
function checkCardsCount () {
    zeroPlaces.classList.toggle('hide-it', cardsCount !== 0)
}
