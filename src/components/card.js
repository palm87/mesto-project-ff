//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

// const popupDeleteCard = document.querySelector('.popup_type_delete'); //попап удаления карточки

export let cardToDelete;
export let elementToDelete;

// функция создания карточки
export function createCard(
  cardData,
  currentProfileId,
  likeCardCallback,
  showBigImageCallback, 
  openPopupCallback,
  checkCardsOwnerCallback,
  didILikeItCallback,
  popupDeleteCardParam
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
  if (!checkCardsOwnerCallback(cardData, currentProfileId)) {
    deleteCardButton.remove();
  }

  deleteCardButton.addEventListener('click', () => {
    cardToDelete = cardData;
    elementToDelete = cardElement;
    openPopupCallback(popupDeleteCardParam);
  });

  //если мы уже лайкали карточку - рисуем сердечко
  if (didILikeItCallback(cardData, currentProfileId)) {
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