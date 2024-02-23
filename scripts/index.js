// @todo: Темплейт карточки
//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
//определим область со списком карточек
const cardsList=document.querySelector('.places__list');

//-----------------------------------------ПОПАПЫ--------------------------------------------------
//переменная для оверлея (чтобы в дальнейшем закрывать попап по клику на оверлей)
const popup = document.querySelector('.popup')

//переменная для кнопки закрытия попапа
const popupCloseButton = document.querySelector(".popup__close")

//закрытие попапа по клику на оверлей
// popup.addEventListener('click', function(evt) {
//     closePopup(evt.target)
// })
popup.addEventListener('click', function(evt) {
    closePopup(popup)
})



// функция для открытия попапов
function openPopup(popupElement) {
    popupElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', escClosePopup);

  }
 
 //функция для закрытия попапов 
function closePopup(popupElement) {
    popupElement.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', escClosePopup);
    
  }
//закрытие попапа редактирования профиля по клику на крестик
popupCloseButton.addEventListener('click', function(evt) {
    closePopup(popupEditProfile);
    document.removeEventListener('keydown', escClosePopup);
   
})

// функция закрытия попапа по нажатию на клавишу Esc
function escClosePopup(evt) {
    if (evt.key === 'Escape') {
        closePopup(popup);
    }
}
//-----------------------------------------РЕДАКТИРОВАНИЕ ПРОФИЛЯ--------------------------------------------------
//переменная для формы редактирования профиля
const formEditProfile = document.forms['edit-profile'];


//переменные для заполнения значений по умолчанию в форме редактирования профиля
//переменная для хранения имени профиля
const profileName = document.querySelector('.profile__title');
//заполняем инпут попапа для введения имени значением из профиля
const profileNameInput = document.querySelector('.popup__input_type_name');
profileNameInput.value=profileName.textContent;

//переменная для хранения описания профиля
const profileDescription = document.querySelector('.profile__description');
//заполняем инпут попапа для введения описания значением из профиля
const profileDescriptionInput = document.querySelector('.popup__input_type_description');
profileDescriptionInput.value=profileDescription.textContent;

//переменная для кнопки редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');

//слушатель для открытия попапа редактирования профиля
editProfileButton.addEventListener('click', function () {
    openPopup(popupEditProfile);
    document.addEventListener('keydown', escClosePopup);
})


//переменная для попапа с редактированием профиля
const popupEditProfile = document.querySelector('.popup_type_edit');

// функция редактирование профиля
function handleFormSubmit(evt) {
    evt.preventDefault(); 
    profileName.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup(popupEditProfile)
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formEditProfile.addEventListener('submit', handleFormSubmit);


//-----------------------------------------ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ--------------------------------------------------
//переменная формы для добавления новой карточки
const formAddNewPlace = document.forms['new-place'];

//переменная для попапа добавления новой карточки
const popupAddNewCard = document.querySelector('.popup_type_new-card')


//переменная для кнопки добавления карточки
const addNewCardButton = document.querySelector('.profile__add-button');

//слушатель для открытия попапа редактирования профиля
addNewCardButton.addEventListener('click', function () {
    openPopup(popupAddNewCard);
    document.addEventListener('keydown', escClosePopup);
})







//для показа надписи, когда нет ни одной карточки
const zeroPlaces = document.querySelector('.places-zero');

//добавим счетчик карточек, чтобы отслеживать, когда нет ни одной карточки
let cardsCount=0;


//@todo: Функция создания карточки
function createCard(card, deleteCard) {
    
    //клонируем содержимое template
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    
    //переменные для полей карточки
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    
    // наполним содержимым
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;
    
    //добавим eventListner на клик по кнопке удаления
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
        deleteCard(cardElement);
    });    
    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(card) {
    card.remove();
    //понижаем счетчик карточек и проверяем, не пора ли отобразить надпись, что карточек нет
    cardsCount-=1;
    checkCardsCount();
}

// @todo: Вывести карточки на страницу
//функция добавления карточки в отображенный список на странице
const renderCard = card => {
    cardsList.append(card);
    cardsCount+=1;
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    renderCard(createCard(item, deleteCard));
});

//--------------------------EXTRA--------------------------------------------

//функция для проверки, сколько карточек отображается и не пора ли отобразить надпись, что карточек нет
function checkCardsCount () {
    zeroPlaces.classList.toggle('hide-it', cardsCount !== 0)
}

