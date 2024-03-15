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
    const inputList = Array.from(formElement.querySelectorAll('.form__input'));
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
    const formList = Array.from(document.querySelectorAll('.form'))
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
  