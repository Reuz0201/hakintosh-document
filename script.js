let currentUser = null;
let userFileData = {}; // Хранилище данных файлов для каждого пользователя

// Функция смены пользователя
function promptUsername() {
    const username = prompt('Введите ваш ник:');
    if (username) {
        currentUser = username;
        document.getElementById('currentUser').textContent = `Текущий пользователь: ${currentUser}`;
        loadUserFiles(); // Загружаем файлы пользователя
    }
}

// Функция добавления файла
function addFile() {
    if (!currentUser) {
        alert('Пожалуйста, войдите как пользователь.');
        return;
    }

    const input = document.getElementById('fileInput');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = e.target.result.split(',')[1]; // Сохраняем данные в формате Base64

            // Если еще нет данных для этого пользователя, создаем пустой массив
            if (!userFileData[currentUser]) {
                userFileData[currentUser] = [];
            }

            userFileData[currentUser].push({ name: file.name, data: fileData });
            saveUserFiles(); // Сохраняем данные в localStorage
            displayFiles(); // Отображаем файлы
        };

        reader.readAsDataURL(file); // Читаем файл как Data URL
        input.value = ''; // Очищаем поле ввода
    } else {
        alert('Пожалуйста, выберите файл для добавления.');
    }
}

// Функция отображения файлов
function displayFiles() {
    const list = document.getElementById('fileList');
    list.innerHTML = ''; // Очищаем список

    // Проверяем наличие файлов для текущего пользователя
    const files = userFileData[currentUser] || [];
    files.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;

        const downloadLink = document.createElement('a');
        downloadLink.href = `data:application/octet-stream;base64,${file.data}`;
        downloadLink.download = file.name;
        downloadLink.innerHTML = '<i class="fa fa-download"></i> Скачать';
        listItem.appendChild(downloadLink);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = '<i class="fa fa-trash"></i> Удалить';
        deleteButton.onclick = () => deleteFile(index); // Убедитесь, что передаем правильный индекс
        listItem.appendChild(deleteButton);

        list.appendChild(listItem);
    });
}

// Функция удаления файла
function deleteFile(index) {
    if (currentUser && userFileData[currentUser]) {
        // Удаляем файл по индексу
        userFileData[currentUser].splice(index, 1);
        saveUserFiles(); // Сохраняем изменения в localStorage
        displayFiles(); // Обновляем список файлов
    }
}

// Сохранение данных файлов в localStorage
function saveUserFiles() {
    // Сохраняем данные для всех пользователей в localStorage
    localStorage.setItem('userFiles', JSON.stringify(userFileData));
}

// Загрузка файлов из localStorage
function loadUserFiles() {
    const savedData = localStorage.getItem('userFiles');
    if (savedData) {
        userFileData = JSON.parse(savedData); // Загружаем все данные
    }
    // Если у пользователя уже есть файлы, они отобразятся
    displayFiles();
}

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Изначально загружаем данные
window.onload = function() {
    loadUserFiles();
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
};
