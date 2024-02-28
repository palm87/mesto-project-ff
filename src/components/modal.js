// функция для открытия попапов
export function openPopup(popupElement) {
    popupElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupByEsc);
    
    //вешаем на крестик открывшегося попапа обработчик клика
    const popupCloseButton = popupElement.querySelector('.popup__close')
    popupCloseButton.addEventListener('click', closePopup)
  }

 //функция для закрытия попапов 
export function closePopup() {
    //ищем открытый попап
    const popupOpenned = document.querySelector('.popup_is-opened')
    //закрываем его, убирая класс 
    popupOpenned.classList.remove('popup_is-opened');
    //снимаем слушатель клика по кнопке esc
    document.removeEventListener('keydown', closePopupByEsc);
  }
  
export function closePopupByEsc(evt) {
    if (evt.key === 'Escape') {
        closePopup();
    }
}