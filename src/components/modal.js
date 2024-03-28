// функция для открытия попапов
export function openPopup(popupElement) {
    popupElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupByEsc); 

  }

 //функция для закрытия попапов 
export function closePopup() {
    //ищем открытый попап
    const popupOpenned = document.querySelector('.popup_is-opened')
    //закрываем его, убирая класс 
    popupOpenned.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupByEsc); 
  }

 //найдем все попапы 
const popups = document.querySelectorAll('.popup')
//на каждый попап повесим слушатель клика по оверлею и клику по крестику
popups.forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target.classList.contains('popup')) {
          closePopup()
        }
        if (evt.target.classList.contains('popup__close')) {
          closePopup()
        }
    })
  }
)

function closePopupByEsc(evt) { 
  if (evt.key === 'Escape') { 
      closePopup(); 
  } 
}
