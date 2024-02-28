import './pages/index.css';
import {initialCards} from './scripts/cards.js'
import {createCard, deleteCard, likeCardHandler,renderCard} from "./components/card.js";
import {openPopup, closePopup} from "./components/modal.js";


// @todo: DOM узлы


//переменные для формы редактирования профиля
const formEditProfile = document.forms['edit-profile'];
const editProfileButton = document.querySelector('.profile__edit-button');

//переменые для попапа с редактированием профиля
const popupEditProfile = document.querySelector('.popup_type_edit');
const profileName = document.querySelector('.profile__title');
const profileNameInput = document.querySelector('.popup__input_type_name');
const profileDescription = document.querySelector('.profile__description');
const profileDescriptionInput = document.querySelector('.popup__input_type_description');

//переменная формы для добавления новой карточки
const formAddNewCard = document.forms['new-place'];

//переменная для попапа добавления новой карточки
const popupAddNewCard = document.querySelector('.popup_type_new-card')

//переменная для кнопки добавления карточки
const addNewCardButton = document.querySelector('.profile__add-button');





//-----------------------------------------ПОПАПЫ--------------------------------------------------
//функция для слушателя клика по оверлею
function overlayClickHandler(evt) {
    if (evt.target.classList.contains('popup')) {
        closePopup();
    }
}

document.addEventListener('click', overlayClickHandler);

//-----------------------------------------РЕДАКТИРОВАНИЕ ПРОФИЛЯ--------------------------------------------------
//слушатель для открытия попапа редактирования профиля
editProfileButton.addEventListener('click', function () {
    profileNameInput.value=profileName.textContent;
    profileDescriptionInput.value=profileDescription.textContent;
    openPopup(popupEditProfile); 
})

// функция для сохранения отредактированного профиля
function editProfileFormSubmit(evt) {
    evt.preventDefault(); 
    profileName.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup()
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formEditProfile.addEventListener('submit', editProfileFormSubmit);


//-----------------------------------------ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ--------------------------------------------------
//слушатель для открытия попапа создания новой карточки
addNewCardButton.addEventListener('click', function () {
    openPopup(popupAddNewCard);
})

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);


// функция добавления новой карточки на станицу (обработчик формы)
function addNewCardFormSubmit(evt) {
    evt.preventDefault(); 
    const newCardInputName = document.querySelector('.popup__input_type_card-name');
    const newCardInputUrl = document.querySelector('.popup__input_type_url');
    const newCard={};
    newCard.name = newCardInputName.value;
    newCard.link = newCardInputUrl.value;
    renderCard(createCard(newCard, deleteCard), 'before');
    newCardInputName.value='';
    newCardInputUrl.value='';
    closePopup()
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    renderCard(createCard(item, deleteCard, likeCardHandler), 'after');
});

//--------------------------EXTRA--------------------------------------------



