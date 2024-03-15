import './pages/index.css';
import {initialCards} from './scripts/cards.js'
import {createCard, deleteCard, likeCardHandler, cardsList, cardsCount} from "./components/card.js";
import {openPopup, closePopup} from "./components/modal.js";


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
})

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);


// функция добавления новой карточки на станицу (обработчик формы)
function addNewCardFormSubmit(evt) {
    evt.preventDefault(); 
    // const newCardInputName = document.querySelector('.popup__input_type_card-name');
    // const newCardInputUrl = document.querySelector('.popup__input_type_url');
    const newCard={};
    newCard.name = newCardInputName.value;
    newCard.link = newCardInputUrl.value;
    renderCard(createCard(newCard, deleteCard, likeCardHandler, showBigImage), 'before');
    evt.target.reset()
    closePopup()
}

//функция добавления карточки в отображенный список на странице
function renderCard (card, position='after') {
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


//функция для отображения сообщения об ошибке
const showInputError = (formElement, inputElement, errorMessage) => {
    //находим спан, в котором отобразим ошибку
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
   //добавляем класс полю ввода, чтобы оно подсвечивалось красным
    inputElement.classList.add('form__input_type_error');
    //вставляем в спан текст ошибки
    errorElement.textContent = errorMessage;
     //добавляем спану класс - чтобы отобразить, поменяв opacity с 0 до 1
    errorElement.classList.add('form__input-error_active');
  };

  
  //функция для скрытия сообщения об ошибке (передаем форму, поле ввода)
  const hideInputError = (formElement, inputElement) => {
    //находим спан, в котором скроем ошибку
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    //удаляем класс, который подсвечивает поле красным
    inputElement.classList.remove('form__input_type_error');
    //удаляем класс, с помощью которого ошибка отображается (убираем opacity в 0)
    errorElement.classList.remove('form__input-error_active');
    //сбрасываем для спана текст
    errorElement.textContent = '';
  };
  
  //функция для отображение валидности введенных данных (передаем форму, поле ввода)
  const checkInputValidity = (formElement, inputElement) => {
    //если в поле ввода есть ошибка валидности из-за несоответствия паттерну
    if (inputElement.validity.patternMismatch) {
        //поставим элементу кастомное сообщение об ошибке из дата-атрибута
    inputElement.setCustomValidity(inputElement.dataset.errorMessagePattern);
  } else {
    inputElement.setCustomValidity("");
  }
    //если введенные данные в поле ввода не валидные
    if (!inputElement.validity.valid) {
      //показываем ошибку (в какой форме, у какого элемента, какое сообщение)
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      //в противном случае скрываем ошибку (в какой форме, у какого поля ввода)
      hideInputError(formElement, inputElement);
    }
  };

  
  //функция для установки слушателей всем полям (принимает форму)
  const setEventListeners = (formElement) => {
    //собираем в массив все поля ввода из переданной формы
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    //находим кнопку для отправки формы
    const buttonElement = formElement.querySelector('.popup__button')

    //проверяем, не нужно ли заблокировать кнопку отправки формы
    toggleButtonState(inputList, buttonElement)
  //для каждого поля ввода на этой форме
    inputList.forEach((inputElement) => {
      //устанавливаем слушатель на событие  ввода в поле
      inputElement.addEventListener('input', function () {
        //в зависимости от состояния каждого поля воода, проверяем, не нужно ли заблокировать кнопку отпарвки формы
        toggleButtonState(inputList, buttonElement)
        //при вводе запускаем функцию проверки валидности в данной форме для данного поля ввода
        checkInputValidity(formElement, inputElement);
      });
    });
  };
  
  //функция запуска валидации всей формы
  function enableValidation () {
    //собираем в массив все формы
    const formList = Array.from(document.querySelectorAll('.popup__form'))

    //для каждой формы из массива
    formList.forEach(function(formElement) {
      //устанавливаем слушатель на событие отправки формы
      formElement.addEventListener('submit', function (evt) {
        //чтобы отменить стандартное поведение формы при отправке
        evt.preventDefault;
      })
      //для каждой формы запускаем функцию, которая устанавливает слушатели по событию ввода для каждого поля этой формы
      setEventListeners(formElement)
    })
  }

//функция
function hasInvalidInput (inputList) {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    })
  }
  
  //функция для проверки, не нужно ли заблокировать кнопку отправки формы(список полей формы, валидность которых проверяется, кнопка, которую блокируем)
  function toggleButtonState(inputList, buttonElement ) {
    //если хоть какое-то поле невалидно
    if (hasInvalidInput(inputList)) {
      // добавляем кнопке класс, делающий ее неактивной
      buttonElement.classList.add('button_inactive')
    }
    else {
      // в противном случае(все поля прошли проверку) удаляем этот класс
      buttonElement.classList.remove('button_inactive')
    }
  }

enableValidation()