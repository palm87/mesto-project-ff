import {openPopup, closePopup, closePopupByEsc} from "./modal.js";

//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

//для показа надписи, когда нет ни одной карточки
const zeroPlaces = document.querySelector('.places-zero');

//определим область со списком карточек
export const cardsList=document.querySelector('.places__list');

//добавим счетчик карточек, чтобы отслеживать, когда нет ни одной карточки
export let cardsCount=0;

//@todo: Функция создания карточки
export function createCard(card, deleteCard, likeCardHandler) {
    
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
            deleteCard(evt.currentTarget);
        }
    });   
    
    cardsList.addEventListener('click', likeCardHandler)

    //открытие попапа по клику на картинку
    const openImageButton = cardElement.querySelector('.card__image')
    const popupImage = document.querySelector('.popup_type_image')
    
    // console.log(popupImage)
    openImageButton.addEventListener('click', function(evt) {
        const poppedImage = document.querySelector('.popup__image')
        const poppedImageCaption = document.querySelector('.popup__caption')
        console.log(evt.target)
        poppedImage.src=evt.target.src;
        poppedImageCaption.textContent=evt.target.alt
        openPopup(popupImage);  
    })  
    return cardElement;
}

//функция удаления карточки
export function deleteCard(card) {
    card.remove();
    //понижаем счетчик карточек и проверяем, не пора ли отобразить надпись, что карточек нет
    cardsCount-=1;
    checkCardsCount();
}

//функция лайка карточки
export function likeCardHandler(evt) {
    if(evt.target.classList.contains('card__like-button')) {
        evt.target.classList.toggle('card__like-button_is-active');
      }
}

//функция для проверки, сколько карточек отображается и не пора ли отобразить надпись, что карточек нет
function checkCardsCount () {
    zeroPlaces.classList.toggle('hide-it', cardsCount !== 0)
}

//функция добавления карточки в отображенный список на странице
export function renderCard (card, position='after') {
    if (position==='before') {
        cardsList.prepend(card);
    }
    if (position==='after') {
        cardsList.append(card);
    }
    else cardsList.prepend(card);
    cardsCount+=1;
    checkCardsCount();
}