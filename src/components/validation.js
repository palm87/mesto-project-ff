
export function enableValidation(validationConfig) {
  //собираем в массив все формы
  const formList = Array.from(
    document.querySelectorAll(validationConfig['formSelector'])
  );
  //для каждой формы навешиваем слушатель, проверяющий валидность данных
  formList.forEach(function (formElement) {
    setEventListeners(formElement, validationConfig);
  });
}

//функция для отображения сообщения об ошибке
function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  //находим спан, в котором отобразим ошибку
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  //добавляем класс полю ввода, чтобы оно подсвечивалось красным
  inputElement.classList.add(validationConfig['inputErrorClass']);
  //вставляем в спан текст ошибки
  errorElement.textContent = errorMessage;
  //добавляем спану класс - чтобы отобразить, поменяв opacity с 0 до 1
  errorElement.classList.add(validationConfig['errorClass']);
}

//функция для скрытия сообщения об ошибке (передаем форму, поле ввода)
function hideInputError(formElement, inputElement, validationConfig) {
  //находим спан, в котором скроем ошибку
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  //удаляем класс, который подсвечивает поле красным
  inputElement.classList.remove(validationConfig['inputErrorClass']);
  //удаляем класс, с помощью которого ошибка отображается (убираем opacity в 0)
  errorElement.classList.remove(validationConfig['errorClass']);
  //сбрасываем для спана текст
  errorElement.textContent = '';
}

//функция для проверки валидности данных в наборе полей
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

//функция для проверки, не нужно ли заблокировать кнопку отправки формы(список полей формы, валидность которых проверяется, кнопка, которую блокируем)
function toggleButtonState(inputList, buttonElement, validationConfig) {
  //если хоть какое-то поле невалидно
  if (hasInvalidInput(inputList)) {
    // добавляем кнопке класс, делающий ее неактивной
    buttonElement.classList.add(validationConfig['inactiveButtonClass']);
  } else {
    // в противном случае(все поля прошли проверку) удаляем этот класс
    buttonElement.classList.remove(validationConfig['inactiveButtonClass']);
  }
}

//функция для отображение валидности введенных данных (передаем форму, поле ввода)
function checkInputValidity(formElement, inputElement, validationConfig) {
  //если в поле ввода есть ошибка валидности из-за несоответствия паттерну
  if (inputElement.validity.patternMismatch) {
    //поставим элементу кастомное сообщение об ошибке из дата-атрибута
    inputElement.setCustomValidity(inputElement.dataset.errorMessagePattern);
  } else {
    inputElement.setCustomValidity('');
  }
  //если введенные данные в поле ввода не валидные
  if (!inputElement.validity.valid) {
    //показываем ошибку (в какой форме, у какого элемента, какое сообщение)
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    //в противном случае скрываем ошибку (в какой форме, у какого поля ввода)
    hideInputError(formElement, inputElement, validationConfig);
  }
}

//функция для установки слушателей всем полям (принимает форму)
function setEventListeners(formElement, validationConfig) {
  //собираем в массив все поля ввода из переданной формы
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig['inputSelector'])
  );
  //находим кнопку для отправки формы
  const buttonElement = formElement.querySelector(
    validationConfig['submitButtonSelector']
  );
  //проверяем, не нужно ли заблокировать кнопку отправки формы
  toggleButtonState(inputList, buttonElement, validationConfig);
  //для каждого поля ввода на этой форме
  inputList.forEach((inputElement) => {
    //устанавливаем слушатель на событие  ввода в поле
    inputElement.addEventListener('input', function () {
      //в зависимости от состояния каждого поля воода, проверяем, не нужно ли заблокировать кнопку отпарвки формы
      toggleButtonState(inputList, buttonElement, validationConfig);
      //при вводе запускаем функцию проверки валидности в данной форме для данного поля ввода
      checkInputValidity(formElement, inputElement, validationConfig);
    });
  });
}

// функция для очистки результатов валидации
// (при заполнении формы профиля во время её открытия и при очистке формы добавления карточки.)
export function clearValidation(formElement, validationConfig) {
  //осберем в массив все поля это формы
  const inputErrorList = Array.from(
    formElement.querySelectorAll(validationConfig['inputSelector'])
  );
  inputErrorList.forEach((inputErrorElement) => {
    hideInputError(formElement, inputErrorElement, validationConfig);
  });

  const submitButton = formElement.querySelector(
    validationConfig['submitButtonSelector']
  );
  submitButton.classList.remove(validationConfig['inactiveButtonClass']);
  toggleButtonState(inputErrorList, submitButton, validationConfig);
}
