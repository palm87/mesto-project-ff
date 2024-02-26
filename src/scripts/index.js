// @todo: Темплейт карточки
//получим template для создания карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
//определим область со списком карточек
const cardsList=document.querySelector('.places__list');

//-----------------------------------------ПОПАПЫ--------------------------------------------------

// функция для открытия попапов
function openPopup(popupElement) {
    popupElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', escClosePopup);
    
    //вешаем на крестик открывшегося попапа обработчик клика
    const popupCloseButton = popupElement.querySelector('.popup__close')
    popupCloseButton.addEventListener('click', closePopup)
  }
 
//функция для закрытия попапов 
  function closePopup() {
    //ищем открытый попап
    const popupOpenned = document.querySelector('.popup_is-opened')
    //закрываем его
    popupOpenned.classList.remove('popup_is-opened');
    //снимаем слушатель клика по кнопке esc
    document.removeEventListener('keydown', escClosePopup);
  }

//слушатель клика по оверлею
function overlayClickHandler(evt) {
    if (evt.target.classList.contains('popup')) {
        closePopup();
    }
}
document.addEventListener('click', overlayClickHandler);

// функция закрытия попапа по нажатию на клавишу Esc
function escClosePopup(evt) {
    if (evt.key === 'Escape') {
        closePopup();
    }
}



//-----------------------------------------РЕДАКТИРОВАНИЕ ПРОФИЛЯ--------------------------------------------------
//переменные для формы редактирования профиля
const formEditProfile = document.forms['edit-profile'];
const editProfileButton = document.querySelector('.profile__edit-button');

//переменые для попапа с редактированием профиля
const popupEditProfile = document.querySelector('.popup_type_edit');
const profileName = document.querySelector('.profile__title');
const profileNameInput = document.querySelector('.popup__input_type_name');
const profileDescription = document.querySelector('.profile__description');
const profileDescriptionInput = document.querySelector('.popup__input_type_description');

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
//переменная формы для добавления новой карточки
const formAddNewCard = document.forms['new-place'];

//переменная для попапа добавления новой карточки
const popupAddNewCard = document.querySelector('.popup_type_new-card')

//переменная для кнопки добавления карточки
const addNewCardButton = document.querySelector('.profile__add-button');

//слушатель для открытия попапа создания новой карточки
addNewCardButton.addEventListener('click', function () {
    openPopup(popupAddNewCard);
})


// функция добавления новой карточки
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

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);



//слушатель лайка карточки
// cardsList.addEventListener('click', likeCardHandler)

//функция лайка карточки
function likeCardHandler(evt) {
    if(evt.target.classList.contains('card__like-button')) {
        evt.target.classList.toggle('card__like-button_is-active');
      }
}

//для показа надписи, когда нет ни одной карточки
const zeroPlaces = document.querySelector('.places-zero');

//добавим счетчик карточек, чтобы отслеживать, когда нет ни одной карточки
let cardsCount=0;


//@todo: Функция создания карточки
function createCard(card, deleteCard, likeCardHandler) {
    
    //клонируем содержимое template
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    
    //переменные для полей карточки
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');
    
    // наполним содержимым
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;

    // //добавим eventListner на клик по кнопке удаления
    cardElement.addEventListener('click', (evt) => {
        if(evt.target.classList.contains('card__delete-button')) {
            deleteCard(evt.currentTarget);
        }
    });   

    cardsList.addEventListener('click', likeCardHandler)

    //открытие попапа по клику на картинку
    const openImageButton = cardElement.querySelector('.card__image')
    const popupImage = document.querySelector('.popup_type_image')
    
    // console.log(popupImage)
    openImageButton.addEventListener('click', function(evt) {
        const poppedImage = document.querySelector('.popup__image')
        const poppedImageCaption = document.querySelector('.popup__caption')
        console.log(evt.target)
        poppedImage.src=evt.target.src;
        poppedImageCaption.textContent=evt.target.alt
        openPopup(popupImage);
        
        
    })


    
    // cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
    //     deleteCard(cardElement);
    // });    
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
function renderCard (card, position='after') {
    console.log(position)
    if (position==='before') {
        cardsList.prepend(card);
    }
    if (position==='after') {
        cardsList.append(card);
    }
    else cardsList.prepend(card);
    cardsCount+=1;
    checkCardsCount();
}

// наполним страницу имеющимся массивом карточек из card.js
initialCards.forEach((item) => {
    renderCard(createCard(item, deleteCard, likeCardHandler), 'after');
});

//--------------------------EXTRA--------------------------------------------

//функция для проверки, сколько карточек отображается и не пора ли отобразить надпись, что карточек нет
function checkCardsCount () {
    zeroPlaces.classList.toggle('hide-it', cardsCount !== 0)
}

