// Замыкаем код в самовызывающейся функции для изоляции переменных и предотвращения конфликтов в глобальной области видимости
(function () {
  // Объявляем переменную для хранения списка задач
  let todoList;

  // Функция для создания заголовка приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Функция для создания формы добавления новой задачи
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    // Назначаем классы элементам формы для стилизации
    form.classList.add("input-group");
    input.classList.add("form-control", "form-color");
    input.placeholder = "Enter new case";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Add new case";

    // Добавляем элементы в форму
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // Деактивируем кнопку "Add new case" при загрузке страницы
    button.disabled = true;

    // Обработчик события изменения в поле ввода для активации/деактивации кнопки
    input.addEventListener("input", function () {
      button.disabled = !input.value.trim();
    });

    return {
      form,
      input,
      buttonWrapper,
      button,
    };
  }

  // Функция для создания списка задач
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return {
      list,
      items: [],
    };
  }

  // Функция для создания элемента списка задач
  function createTodoItem(todoData, items) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // Назначаем классы элементам для стилизации
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = todoData.name;

    buttonGroup.classList.add("btn", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Done!";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Delete ?";

    // Добавляем кнопки в группу, а группу в элемент списка
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // Обработчик события для кнопки Done!
    doneButton.addEventListener("click", function () {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === todoData.id) {
          items[i].done = !items[i].done;
          updateItemAppearance(item, items[i].done);
          break;
        }
      }
      // Обновляем данные и сохраняем их в локальное хранилище
      todoList.items = items;
      saveDataToLocalStorage(todoList.todoListKey, items);
    });

    // Обработчик события для кнопки "Delete ?"
    deleteButton.addEventListener("click", function () {
      if (confirm("Are you sure?")) {
        // Фильтруем массив задач и удаляем соответствующий элемент
        items = items.filter((item) => item.id !== todoData.id);
        item.remove();
        // Обновляем данные и сохраняем их в локальное хранилище
        todoList.items = items;
        saveDataToLocalStorage(todoList.todoListKey, items);
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // Функция для изменения внешнего вида элемента списка в зависимости от статуса done
  function updateItemAppearance(item, done) {
    item.classList.toggle("list-group-item-success", done);
  }

  // Функция для создания приложения для списка задач
  function createTodoApp(container, title = "List") {
    // Генерируем уникальный ключ для хранения данных в локальном хранилище
    let todoListKey = `todoList_${title}`;
    todoList = createTodoList();
    todoList.todoListKey = todoListKey;

    // Создаем заголовок и форму для ввода новой задачи
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();

    // Добавляем элементы в контейнер
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList.list);

    // Загружаем сохраненные данные из локального хранилища
    let storedData = loadDataFromLocalStorage(todoListKey);

    // Если данные есть, восстанавливаем список задач
    if (storedData) {
      todoList.items = storedData;
      storedData.forEach((todoItemData) => {
        let todoItem = createTodoItem(todoItemData, todoList.items);
        todoList.list.appendChild(todoItem.item);
      });
    }

    // Обработчик события отправки формы
    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Проверка наличия текста в поле ввода
      if (!todoItemForm.input.value) {
        return;
      }

      // Генерация уникального ID
      function generateUniId() {
        return Math.floor(new Date().getTime() * Math.random());
      }

      let id = generateUniId();

      // Создаем данные новой задачи
      let todoItemData = {
        id: id,
        name: todoItemForm.input.value,
        done: false,
      };

      // Создаем элемент списка и добавляем его в DOM
      let todoItem = createTodoItem(todoItemData, todoList.items);
      todoList.list.appendChild(todoItem.item);
      todoList.items.push(todoItemData);

      // Сохраняем данные в локальное хранилище
      saveDataToLocalStorage(todoListKey, todoList.items);

      // Очищаем поле ввода
      todoItemForm.input.value = "";
    });
  }

  // Функция для сохранения данных в локальное хранилище
  function saveDataToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Функция для загрузки данных из локального хранилища
  function loadDataFromLocalStorage(key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Делаем функцию createTodoApp доступной в глобальной области видимости
  window.createTodoApp = createTodoApp;
})();
