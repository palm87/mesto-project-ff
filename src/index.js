import './pages/index.css';
import {initialCards} from './scripts/cards.js'
import {createCard, deleteCard, likeCardHandler, cardsList, cardsCount} from "./components/card.js";
import {openPopup, closePopup} from "./components/modal.js";
import {enableValidation, clearValidation, validationConfig} from "./components/validation.js"
import {getData, changeData, getHead, handleError, uriBook} from './components/api.js';

//--------------------------------ПЕРЕМЕННЫЕ ДЛЯ ПРОФИЛЯ-----------------------

const editProfileButton = document.querySelector('.profile__edit-button'); //кнопка открытия попапа редактирования профиля
const popupEditProfile = document.querySelector('.popup_type_edit'); //попап с формой редактирования профиля
const formEditProfile = document.forms['edit-profile']; //форма редактирования профиля
const profileName = document.querySelector('.profile__title'); //имя профиля
const profileDescription = document.querySelector('.profile__description'); //описание профиля
const profileAvatar = document.querySelector('.profile__image') //картинка аватара
const profileNameInput = document.querySelector('.popup__input_type_name'); //строка ввода имени профиля
const profileDescriptionInput = document.querySelector('.popup__input_type_description'); //строка ввода описания профиля
// const profileId = 0; //id профиля
const avatarEditForm = document.forms['avatar'] //форма редактирования аватара
const popupNewAvatar = document.querySelector('.popup_type_avatar') //попап с формой редактирования аватара
const newAvatarInputUrl = document.querySelector('.popup__input_avatar_url'); //строка ввода ссылки нового аватара


//-------------------------ПЕРЕМЕННЫЕ ДЛЯ КАРТОЧЕК--------
const popupAddNewCard = document.querySelector('.popup_type_new-card') //попап добавления новой карточки
const formAddNewCard = document.forms['new-place']; //форма добавления новой карточки
const addNewCardButton = document.querySelector('.profile__add-button'); //кнопка добавления карточки с новым местом
const newCardInputName = document.querySelector('.popup__input_type_card-name'); //строка ввода названия карточки
const newCardInputUrl = document.querySelector('.popup__input_type_url'); //строка ввода ссылки на картинку
const deleteConfirmationForm = document.forms['delete-confirmation'] //форма удаления карточки
const popupDeleteCard = document.querySelector('.popup__delete-confirmation') //попап




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
// получение данных о профиле
getProfileInfo(uriBook.currentProfile)

//слушатель для открытия попапа редактирования профиля
editProfileButton.addEventListener('click', function () {
    profileNameInput.value=profileName.textContent;
    profileDescriptionInput.value=profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig)
    openPopup(popupEditProfile); 
})


// слушатель кнопки открытия попапа редактирования аватара профиля
profileAvatar.addEventListener('click', function() {
    openPopup(popupNewAvatar)
} )

//слушатель формы редактирования аватара
avatarEditForm.addEventListener('submit', function(evt) {
    evt.preventDefault(); 
    const newUrl = newAvatarInputUrl.value
    const body = {avatar: newUrl}
    changeData(uriBook.currentAvatar, body, 'PATCH')
        .then(profileData => {
            profileAvatar.style = `background-image: url('${profileData.avatar}')`
        })
        .catch(handleError)
    closePopup()
});

// ф-ия отрисовки и получения данных профиля
function getProfileInfo(uri) {
    getData(uri)
    .then(data => {
        profileName.textContent = data.name
        profileDescription.textContent=data.about
        profileAvatar.style = `background-image: url('${data.avatar}')`;
    })
}

// ф-ия сохранения отредактированного профиля
function editProfileFormSubmit(evt) {
    evt.preventDefault(); 
    const body={name: profileNameInput.value,
    about: profileDescriptionInput.value
    }
    changeData(uriBook.currentProfile, body, 'PATCH')
        .then(result => {
            profileName.textContent=result.name
            profileDescription.textContent=result.about
        })
        .catch(handleError)

    closePopup()
}

// обработчик формы редактирования профиля
formEditProfile.addEventListener('submit', editProfileFormSubmit);


//-----------------------------------------ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ--------------------------------------------------
//слушатель для открытия попапа создания новой карточки
addNewCardButton.addEventListener('click', function () {
    // clearValidation(formAddNewCard, validationConfig)
    formAddNewCard.reset()
    openPopup(popupAddNewCard);
})

// обраотчик формы сохранения новой карточки
function addNewCardFormSubmit(evt) {
    evt.preventDefault(); 
    const newCard={};
    newCard.name = newCardInputName.value;
    newCard.link = newCardInputUrl.value;

    changeData(uriBook.allCards, newCard, 'POST')
        .then(cardData => {
            renderLoading(true)
            renderCard(createCard(cardData, cardData.owner._id, deleteCard, likeCardHandler, showBigImage))
        evt.target.reset()
        
        closePopup()

        })
        .catch(handleError)
        .finally(renderLoading(false)) 

}

// слушатель отправки формы сохранения новой карточки
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);    

//функция добавления карточки в отображенный список на странице с возможностью указать позицию(добавляем в конец или в начало списка)
function renderCard (card, position='before') {
    if (position==='before') {
        cardsList.prepend(card);
    }
    if (position==='after') {
        cardsList.append(card);
    }
    else cardsList.prepend(card);
}


// загрузим с сервера имеющиеся карточки, для этого сделаем 2 запроса: массив имеющихся карточек 
// и данные о текущем пользователе
Promise.all([getData(uriBook.allCards), getData(uriBook.currentProfile)])
    .then(data =>{
        const dataCards=data[0]
        const dataProfile=data[1]
        dataCards.forEach(
            (card) => {
            renderCard(createCard(card, dataProfile._id, deleteCard, likeCardHandler, showBigImage), 'after')})
        })
    .catch(handleError)

// отрисовка "Сохранение..." на кнопке в процессе отправки данных
function renderLoading(isLoading) {
        //найдем открытый попап
        const opennedPopup = document.querySelector('.popup_is-opened')
        //найдем в этом попапе кнопку сохранения
        const submitButton = opennedPopup.querySelector('.popup__button')
        if(isLoading) {
            submitButton.textContent="Сохранение..."
        }
        else {
            submitButton.textContent="Сохранить"
        }
      }

// включение валидации полей
enableValidation(validationConfig)