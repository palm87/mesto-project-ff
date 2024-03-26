import './pages/index.css';
import {initialCards} from './scripts/cards.js'
import {createCard, deleteCard, likeCardHandler, cardsList, cardsCount} from "./components/card.js";
import {openPopup, closePopup} from "./components/modal.js";
import {enableValidation, clearValidation, validationConfig} from "./components/validation.js"
import {getData, changeData, getHead, handleError} from './components/api.js';


//переменные для формы редактирования профиля
const formEditProfile = document.forms['edit-profile']; //форма
const editProfileButton = document.querySelector('.profile__edit-button'); //кнопка для открытия попапа редактирования профиля
const popupEditProfile = document.querySelector('.popup_type_edit'); //попап с формой редактирования профиля
const profileName = document.querySelector('.profile__title'); //имя профиля
const profileDescription = document.querySelector('.profile__description'); //описание профиля
const profileNameInput = document.querySelector('.popup__input_type_name'); //строка ввода имени профиля
const profileDescriptionInput = document.querySelector('.popup__input_type_description'); //строка ввода описания профиля
const profileId = 0; //id профиля

//редактирование аватара
const profileAvatar = document.querySelector('.profile__image') //картинка аватара
const avatarEditForm = document.forms['avatar'] //форма редактирования аватара
const popupNewAvatar = document.querySelector('.popup_type_avatar') //попап с формой аватара
const newAvatarInputUrl = document.querySelector('.popup__input_avatar_url'); //строка ввода ссылки нового аватара

//переменная для формы, из которой добавляется новое место
const formAddNewCard = document.forms['new-place'];
//переменная для попапа добавления новой карточки с местом
const popupAddNewCard = document.querySelector('.popup_type_new-card')
//переменная для кнопки добавления карточки с новым местом
const addNewCardButton = document.querySelector('.profile__add-button');
const newCardInputName = document.querySelector('.popup__input_type_card-name');
const newCardInputUrl = document.querySelector('.popup__input_type_url');

//подтверждение удаления карточки
const deleteConfirmationForm = document.forms['delete-confirmation'] //форма
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
//слушатель для открытия попапа редактирования профиля
editProfileButton.addEventListener('click', function () {
    profileNameInput.value=profileName.textContent;
    profileDescriptionInput.value=profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig)
    openPopup(popupEditProfile); 
})


//попап редактирования аватара профиля
profileAvatar.addEventListener('click', function() {
    openPopup(popupNewAvatar)
} )

avatarEditForm.addEventListener('submit', function(evt) {
    evt.preventDefault(); 
    const newUrl = newAvatarInputUrl.value
    const body = {avatar: newUrl}
    changeData('/users/me/avatar', body, 'PATCH')
        .then(profileData => {
            profileAvatar.style = `background-image: url('${profileData.avatar}')`
        })
        .catch(handleError)
    closePopup()
});

//заполняем профиль даными с сервера
getData('/users/me')
    .then(data => {
        profileName.textContent = data.name
        profileDescription.textContent=data.about
        profileAvatar.style = `background-image: url('${data.avatar}')`;

    })

// функция для сохранения отредактированного профиля
function editProfileFormSubmit(evt) {
    evt.preventDefault(); 
    const body={name: profileNameInput.value,
    about: profileDescriptionInput.value
    }
    changeData('/users/me', body, 'PATCH')
        .then(result => {
            profileName.textContent=result.name
            profileDescription.textContent=result.about
        })
        .catch(handleError)

    closePopup()
}

// обработчик формы отправки отредактированного профиля
formEditProfile.addEventListener('submit', editProfileFormSubmit);


//-----------------------------------------ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ--------------------------------------------------
//слушатель для открытия попапа создания новой карточки
addNewCardButton.addEventListener('click', function () {
    // clearValidation(formAddNewCard, validationConfig)
    formAddNewCard.reset()
    openPopup(popupAddNewCard);
    
    
})

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formAddNewCard.addEventListener('submit', addNewCardFormSubmit);


// функция добавления новой карточки на страницу (обработчик формы)
function addNewCardFormSubmit(evt) {
    evt.preventDefault(); 
    const newCard={};
    newCard.name = newCardInputName.value;
    newCard.link = newCardInputUrl.value;

    getHead(newCardInputUrl.value)
    .then(data => {
        if(data.includes('image')) {
            changeData('/cards', newCard, 'POST')
                .then(cardData => {
                renderLoading(true)
                renderCard(createCard(cardData, cardData.owner._id, deleteCard, likeCardHandler, showBigImage))
                evt.target.reset()
                closePopup()
            })  
            .catch(handleError)
            .finally(renderLoading(false))  
    }
        else {
        console.log("ERROR")
        }   })
        .catch(handleError)
        
            // .finally(renderLoading(false))
        }

    // changeData('/cards', newCard, 'POST')
    //     .then(cardData => {
    //         renderCard(createCard(cardData, cardData.owner._id, deleteCard, likeCardHandler, showBigImage), 'before')
    // })
    //     .catch(handleError)
    // evt.target.reset()
    // closePopup()


    // getHead(newCardInputUrl.value)
    //     .then(data => {
    //     if(data.includes('image')) {
    //         changeData('/cards', newCard, 'POST')
    //             .then(cardData => {
    //                 renderLoading(true)
    //                 renderCard(createCard(cardData, cardData.owner._id, deleteCard, likeCardHandler, showBigImage))
    //                 evt.target.reset()
    //                 closePopup()
    //             })  
    //             .catch(handleError)
    //             .finally(renderLoading(false))
  
            
    //     }
    //     else {
    //         console.log("ERROR")
    //     }})
    //     .catch(handleError)
  

    

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

// // функция добавления карточки в отображенный список на странице 
// function renderCard (cardData) {
//     cardsList.append(cardData);
// }


enableValidation(validationConfig)

// загрузим с сервера имеющиеся карточки, для этого сделаем 2 запроса: массив имеющихся карточек 
// и данные о текущем пользователе
Promise.all([getData('/cards'), getData('/users/me')])
    .then(data =>{
        const dataCards=data[0]
        const dataProfile=data[1]
        dataCards.forEach(
            (card) => {
            renderCard(createCard(card, dataProfile._id, deleteCard, likeCardHandler, showBigImage), 'after')})
        })
    .catch(handleError)


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
