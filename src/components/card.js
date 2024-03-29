import { changeData, getData, handleError } from './api';
import { closePopup, openPopup } from './modal';

//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

//определим область со списком карточек
export const cardsList = document.querySelector('.places__list');

const deleteConfirmationForm = document.forms['delete-confirmation']; //форма удаления карточки
const popupDeleteCard = document.querySelector('.popup_type_delete'); //попап удаления карточки

let cardToDelete;
let elementToDelete;

// функция создания карточки
export function createCard(
  cardData,
  currentProfileId,
  likeCardCallback,
  showBigImageCallback
) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true); //клонируем содержимое template
  const cardTitle = cardElement.querySelector('.card__title'); //название карточки
  const cardImage = cardElement.querySelector('.card__image'); //картинка карточки
  let cardLikesCount = cardElement.querySelector('.card__like-counter'); //счетчик лайков карточки
  const cardLikeButton = cardElement.querySelector('.card__like-button'); //кнопка лайка
  const deleteCardButton = cardElement.querySelector('.card__delete-button'); //кнопка удаления карточки

  // наполним содержимым
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardLikesCount.textContent = cardData.likes.length;

  //проверим, кто владелец карточки, если текущий пользователь - повесим слушатель,
  // в противном случае - уберем кнопку удаления
  if (!checkCardsOwner(cardData, currentProfileId)) {
    deleteCardButton.remove();
  }
  deleteCardButton.addEventListener('click', () => {
    cardToDelete = cardData;
    elementToDelete = cardElement;
    openPopup(popupDeleteCard);
  });

  //если мы уже лайкали карточку - рисуем сердечко
  if (didILikeIt(cardData, currentProfileId)) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }
  //слушатель лайка
  cardLikeButton.addEventListener('click', () => {
    likeCardCallback(
      cardData,
      cardLikeButton,
      currentProfileId,
      cardLikesCount
    );
  });

  //слушатель открытия попапа с большой картинкой по клику на картинку
  cardImage.addEventListener('click', showBigImageCallback);
  return cardElement;
}

//отправка формы подтверждения удаления карточки
deleteConfirmationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  deleteCard(cardToDelete);
  elementToDelete.remove();
  closePopup();
});

//функция удаления карточки
export function deleteCard(cardData) {
  changeData(`/cards/${cardData._id}`, {}, 'DELETE').catch(handleError);
}

export function likeCardHandler(
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
