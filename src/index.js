import './pages/index.css';
import {
  createCard,
  cardToDelete,
  elementToDelete
} from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';
import {
  enableValidation,
  clearValidation,
} from './components/validation.js';
import { getData, changeData, handleError, uriBook } from './components/api.js';


const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
  };
  

//--------------------------------ПЕРЕМЕННЫЕ ДЛЯ ПРОФИЛЯ-----------------------

const editProfileButton = document.querySelector('.profile__edit-button'); //кнопка открытия попапа редактирования профиля
const popupEditProfile = document.querySelector('.popup_type_edit'); //попап с формой редактирования профиля
const formEditProfile = document.forms['edit-profile']; //форма редактирования профиля
const profileName = document.querySelector('.profile__title'); //имя профиля
const profileDescription = document.querySelector('.profile__description'); //описание профиля
const profileAvatar = document.querySelector('.profile__image'); //картинка аватара
const profileNameInput = document.querySelector('.popup__input_type_name'); //строка ввода имени профиля
const profileDescriptionInput = document.querySelector(
  '.popup__input_type_description'
); //строка ввода описания профиля
const avatarEditForm = document.forms['avatar']; //форма редактирования аватара
const popupNewAvatar = document.querySelector('.popup_type_avatar'); //попап с формой редактирования аватара
const newAvatarInputUrl = document.querySelector('.popup__input_avatar_url'); //строка ввода ссылки нового аватара

//-------------------------ПЕРЕМЕННЫЕ ДЛЯ КАРТОЧЕК--------

const cardsList = document.querySelector('.places__list'); //область со списком карточек
const popupAddNewCard = document.querySelector('.popup_type_new-card'); //попап добавления новой карточки
const formAddNewCard = document.forms['new-place']; //форма добавления новой карточки
const addNewCardButton = document.querySelector('.profile__add-button'); //кнопка добавления карточки с новым местом
const newCardInputName = document.querySelector('.popup__input_type_card-name'); //строка ввода названия карточки
const newCardInputUrl = document.querySelector('.popup__input_type_url'); //строка ввода ссылки на картинку
const deleteConfirmationForm = document.forms['delete-confirmation']; //форма удаления карточки
const popupDeleteCard = document.querySelector('.popup_type_delete'); //попап

//переменные для попапа с большой картинкой
const popupImage = document.querySelector('.popup_type_image');
const poppedImage = document.querySelector('.popup__image');
const poppedImageCaption = document.querySelector('.popup__caption');
//-----------------------------------------ПОПАПЫ--------------------------------------------------

//функция для открытия картинки с местом в отдельном попапе
function showBigImage(evt) {
  poppedImage.src = evt.target.src;
  poppedImage.alt = evt.target.alt;
  poppedImageCaption.textContent = evt.target.alt;
  openPopup(popupImage);
}
//-----------------------------------------РЕДАКТИРОВАНИЕ ПРОФИЛЯ--------------------------------------------------

//слушатель для открытия попапа редактирования профиля
editProfileButton.addEventListener('click', function () {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openPopup(popupEditProfile);
});

// слушатель кнопки открытия попапа редактирования аватара профиля
profileAvatar.addEventListener('click', function () {
    avatarEditForm.reset();
    clearValidation(avatarEditForm, validationConfig);
    openPopup(popupNewAvatar);
});

//слушатель отправки формы редактирования аватара
avatarEditForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  renderLoading(true)
  const newUrl = newAvatarInputUrl.value;
  const body = { avatar: newUrl };
  changeData(uriBook.currentAvatar, body, 'PATCH')
    .then((profileData) => {
      profileAvatar.style = `background-image: url('${profileData.avatar}')`;
    })
    .then(() =>  {
        renderLoading(false)
        closePopup()})
    .catch(handleError)
});



// ф-ия сохранения отредактированного профиля
function editProfileFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true);
  const body = {
    name: profileNameInput.value,
    about: profileDescriptionInput.value,
  };
  changeData(uriBook.currentProfile, body, 'PATCH')
    .then((result) => {
      profileName.textContent = result.name;
      profileDescription.textContent = result.about;
    })
    .then(() =>  {
        renderLoading(false)
        closePopup()})
    .catch(handleError)

}

// обработчик формы редактирования профиля
formEditProfile.addEventListener('submit', editProfileFormSubmit);

//-----------------------------------------ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ--------------------------------------------------
//слушатель для открытия попапа создания новой карточки
addNewCardButton.addEventListener('click', function () {
  formAddNewCard.reset();
  clearValidation(formAddNewCard, validationConfig);
  openPopup(popupAddNewCard);
});

// обработчик формы сохранения новой карточки
function addNewCardFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true);
  const newCard = {};
  newCard.name = newCardInputName.value;
  newCard.link = newCardInputUrl.value;

  changeData(uriBook.allCards, newCard, 'POST')
    .then((cardData) => {
      renderLoading(true);
      renderCard(
        createCard(cardData, cardData.owner._id, likeCardHandler, showBigImage, openPopup, checkCardsOwner,didILikeIt, popupDeleteCard)
      );
      evt.target.reset();
    })
    .then(() =>  {
        renderLoading(false)
        closePopup()})
    .catch(handleError)
}

// слушатель отправки формы сохранения новой карточки
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);

//функция добавления карточки в отображенный список на странице с возможностью указать позицию(добавляем в конец или в начало списка)
function renderCard(card, position = 'before') {
  if (position === 'before') {
    cardsList.prepend(card);
  }
  if (position === 'after') {
    cardsList.append(card);
  } else cardsList.prepend(card);
}

// отрисовка "Сохранение..." на кнопке в процессе отправки данных
function renderLoading(isLoading) {
  //найдем открытый попап
  const opennedPopup = document.querySelector('.popup_is-opened');
  //найдем в этом попапе кнопку сохранения
  const submitButton = opennedPopup.querySelector('.popup__button');
  if (isLoading) {
    submitButton.textContent = 'Сохранение...';
  } else {
    submitButton.textContent = 'Сохранить';
  }
}



// загрузим с сервера имеющиеся карточки, для этого сделаем 2 запроса: массив имеющихся карточек
// и данные о текущем пользователе
Promise.all([getData(uriBook.allCards), getData(uriBook.currentProfile)])
  .then((data) => {
    const dataCards = data[0];
    const dataProfile = data[1];
    dataCards.forEach((card) => {
      renderCard(
        createCard(card, dataProfile._id, likeCardHandler, showBigImage, openPopup, checkCardsOwner, didILikeIt, popupDeleteCard),
        'after'
      );
    });
    profileName.textContent = dataProfile.name;
    profileDescription.textContent = dataProfile.about;
    profileAvatar.style = `background-image: url('${dataProfile.avatar}')`;
  })
  .catch(handleError);

  // повесим на все попапы слушатели кликов по оверлею и крестику
const allPopups = document.querySelectorAll('.popup');
allPopups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closePopup();
    }
    if (evt.target.classList.contains('popup__close')) {
      closePopup();
    }
  });
});


//отправка формы подтверждения удаления карточки
deleteConfirmationForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    deleteCard(cardToDelete)
    })


const cardTemplate = document.querySelector('#card-template').content;

function deleteCard(cardData) {
    changeData(`/cards/${cardData._id}`, {}, 'DELETE')
    .then(result => {
        elementToDelete.remove();
        closePopup()
    })
    .catch(handleError)
  }

function likeCardHandler(
  cardData,
  cardLikeButton,
  currentProfileId,
  cardLikesCount
) {
  const cardId = cardData._id;
  if (didILikeIt(cardData, currentProfileId)) {
    changeLikesCount(cardId, 'DELETE', cardLikesCount, cardData);
  } else {
    changeLikesCount(cardId, 'PUT', cardLikesCount, cardData);
  }
  cardLikeButton.classList.toggle('card__like-button_is-active');
}

// функция для проверки, является ли текущий пользователь владельцем карточки
function checkCardsOwner(card, currentProfileId) {
  return currentProfileId === card.owner._id;
}

// функция для проверки, ставился ли мной лайк для данной карточки
function didILikeIt(card, currentProfileId) {
  const idsLiked = card.likes.map((user) => user._id);
  return idsLiked.some(function (id) {
    return id == currentProfileId;
  });
}

// функция для отрисовки количества лайков
function changeLikesCount(cardId, method, cardLikesCount, cardData) {
  changeData(`/cards/likes/${cardId}`, {}, method)
    .then((result) => {
      cardLikesCount.textContent = result.likes.length;
      cardData.likes = result.likes;
    })
    .catch(handleError);
}

// включение валидации полей
enableValidation(validationConfig);