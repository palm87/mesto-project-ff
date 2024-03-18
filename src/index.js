import './pages/index.css';
import {initialCards} from './scripts/cards.js'
import {createCard, deleteCard, likeCardHandler, cardsList, cardsCount} from "./components/card.js";
import {openPopup, closePopup} from "./components/modal.js";
import {enableValidation, clearValidation, validationConfig} from "./components/validation.js"


//переменные для формы редактирования профиля
const formEditProfile = document.forms['edit-profile']; //форма
const editProfileButton = document.querySelector('.profile__edit-button'); //кнопка
const popupEditProfile = document.querySelector('.popup_type_edit'); //окно попапа
const profileName = document.querySelector('.profile__title'); //имя профиля
const profileNameInput = document.querySelector('.popup__input_type_name'); //строка ввода имени профиля
const profileDescription = document.querySelector('.profile__description'); //описание профиля
const profileDescriptionInput = document.querySelector('.popup__input_type_description'); //строка ввода описания профиля

//переменная для формы, из которой добавляется новое место
const formAddNewCard = document.forms['new-place'];
//переменная для попапа добавления новой карточки с местом
const popupAddNewCard = document.querySelector('.popup_type_new-card')
//переменная для кнопки добавления карточки с новым местом
const addNewCardButton = document.querySelector('.profile__add-button');
const newCardInputName = document.querySelector('.popup__input_type_card-name');
const newCardInputUrl = document.querySelector('.popup__input_type_url');


//переменные для попапа с большой картинкой
const popupImage = document.querySelector('.popup_type_image')
const poppedImage = document.querySelector('.popup__image')
const poppedImageCaption = document.querySelector('.popup__caption')
//-----------------------------------------ПОПАПЫ--------------------------------------------------

//функция для открытия картинки с местом в отдельном попапе
function showBigImage (evt){
    poppedImage.src=evt.target.src;
    poppedImage.alt=evt.target.alt
    poppedImageCaption.textContent=evt.target.alt
    openPopup(popupImage);  
}
//-----------------------------------------РЕДАКТИРОВАНИЕ ПРОФИЛЯ--------------------------------------------------
//слушатель для открытия попапа редактирования профиля
editProfileButton.addEventListener('click', function () {
    profileNameInput.value=profileName.textContent;
    profileDescriptionInput.value=profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig)
    openPopup(popupEditProfile); 
    
})

// функция для сохранения отредактированного профиля
function editProfileFormSubmit(evt) {
    evt.preventDefault(); 
    profileName.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup()
}

// обработчик формы отправки отредактированного профиля
formEditProfile.addEventListener('submit', editProfileFormSubmit);


//-----------------------------------------ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ--------------------------------------------------
//слушатель для открытия попапа создания новой карточки
addNewCardButton.addEventListener('click', function () {
    openPopup(popupAddNewCard);
    formAddNewCard.reset()
    clearValidation(formAddNewCard, validationConfig)
})

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);


// функция добавления новой карточки на станицу (обработчик формы)
function addNewCardFormSubmit(evt) {
    evt.preventDefault(); 
    const newCard={};
    newCard.name = newCardInputName.value;
    newCard.link = newCardInputUrl.value;
    renderCard(createCard(newCard, deleteCard, likeCardHandler, showBigImage), 'before');
    evt.target.reset()
    closePopup()
    
}

//функция добавления карточки в отображенный список на странице
function renderCard (card, position='before') {
    if (position==='before') {
        cardsList.prepend(card);
    }
    if (position==='after') {
        cardsList.append(card);
    }
    else cardsList.prepend(card);
    // cardsCount+=1;
    // checkCardsCount();
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    renderCard(createCard(item, deleteCard, likeCardHandler, showBigImage), 'after');
});


enableValidation(validationConfig)
