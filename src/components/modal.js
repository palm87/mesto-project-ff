// функция для открытия попапов
export function openPopup(popupElement) {
  popupElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupByEsc);
}

//функция для закрытия попапов
export function closePopup() {
  //ищем открытый попап
  const popupOpenned = document.querySelector('.popup_is-opened');
  //закрываем его, убирая класс
  popupOpenned.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupByEsc);
}



// фунция закрытия попапа по клику (для передачи в слушатель)
function closePopupByEsc(evt) {
  if (evt.key === 'Escape') {
    closePopup();
  }
}
