//////////////////////////////////// Class /////////////////////////////////////

/* Класс для загрузки списка учеников */
class student {
    /*
    Имя              let name,  
    Фамилия          surname;
    Город            let city;
    Название Унив.   let nameSchool,
    Курс             let yearSchool;
    День рождения    let birthday;
    Время выхода     let lastTimeOnline;
    Друзья           let friends = [];
    Айди             let id,
    Айди фото        let idPhoto;
    Статус           let status;
    Номер телефона   let phoneNumber;
    */
    constructor(object) {
        let {
            information: {
                name = 'NoName',
                surname = "NoSurname",
                city = "NoWhere",
                nameSchool = "NoSchool",
                yearSchool = "0",
                birthday = "NoBirthday"
                } = {},
            lastTimeOnline = new Date(1999, 1, 1, 0, 0),
            id= 0,
            idPhoto = "NoAvatar",
            friends = [],
            status = "",
            phoneNumber = "lucky number!"
        } = object;
        
        this.name = name;
        this.surname = surname;
        this.city = city;
        this.nameSchool = nameSchool;
        this.yearSchool = yearSchool;
        this.birthday = birthday;
        this.lastTimeOnline = lastTimeOnline;
        this.id = id;
        this.idPhoto = idPhoto;
        this.friends = friends;
        this.status = status;
        this.phoneNumber = phoneNumber;
    }

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }

    getCity() {
        return this.city;
    }

    getNameSchool() {
        return this.nameSchool;
    }

    getYearSchool() {
        return this.yearSchool;
    }

    getBirthday() {
        return this.birthday;
    }

    getLastTimeOnline() {
        return this.lastTimeOnline;
    }

    getId() {
        return this.id;
    }

    getIdPhoto() {
        return this.idPhoto;
    }

    getFriends() {
        return this.friends;
    }

    getStatus() {
        return this.status;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }

    CountLastTime() {
        let months = [
		'Января', 'Февраля', 'Марта',
		'Апреля', 'Мая', 'Июня',
		'Июля', 'Августа', 'Сентября',
		'Октября', 'Ноября', 'Декабря'
        ];

        let worldTime = new Date();
        let dayOnline, hoursOnline, minutesOnline;
        if (worldTime.getUTCDate() == this.getLastTimeOnline().getDate())
            dayOnline = "сегодня"
        else dayOnline = this.getLastTimeOnline().getDate() + ' ' + months[this.getLastTimeOnline().getMonth() - 1];

        if (this.getLastTimeOnline().getHours() == 0)
            hoursOnline = "00";
        else
            hoursOnline = this.getLastTimeOnline().getHours();

        if (this.getLastTimeOnline().getMinutes() == 0)
            minutesOnline = "00";
        else
            minutesOnline = this.getLastTimeOnline().getMinutes();

        return ('Был(а) ' + dayOnline + ' в ' + hoursOnline + ':' + minutesOnline);
    }

    CountYears() {
        let worldTime = new Date();
        let [, birthMonth, birthYear] = this.getBirthday().split(".");
        if (worldTime.getUTCMonth() < birthMonth)
            return (worldTime.getUTCFullYear() - birthYear + 1);
        else return (worldTime.getUTCFullYear() - birthYear);
    }

    CountYearsWord() {
        let [, , yearOfStudent] = this.getBirthday().split(".");
        let wordForBirthYear = " лет";
        if ((2020 - yearOfStudent) >= 22 && (2020 - yearOfStudent) < 24)
            wordForBirthYear = " года";
        return wordForBirthYear;
    }

    FindStatus() {
        if (SelectElemByStyle(".window-profile__status").style.display == "none") {
            SelectElemByStyle(".window-profile__status").style.display = "block";
            SelectElemByStyle(".window-profile__information_disp_grid").style.gridTemplateRows = "minmax(36px,42px) 20px auto";
            SelectElemByStyle(".window-profile__avatar_size").style.paddingBottom = "14px";
        }

        if (this.getStatus() == "") {
            SelectElemByStyle(".window-profile__status").style.display = "none";
            SelectElemByStyle(".window-profile__information_disp_grid").style.gridTemplateRows = "minmax(36px,42px) auto";
            SelectElemByStyle(".window-profile__avatar_size").style.paddingBottom = "4px";
        } else
            return ("\"" + students[id].getStatus() + "\"");
    }

    FindNameSurname() {
        return (this.name + " " + this.surname);
    }

    FindProfilePhotoPng() {
        return ("img/avatars/" + this.getIdPhoto() + ".png");
    }

    /* Рендер карточки Student */
    RenderStudentBody(positionInStudents) {
        let option = `
    <div class="student student_disp_flex student_size student_hover"  onmouseenter="MouseEnterStudent(event)" onmouseleave="MouseLeaveStudent(event)">
                <img class="student__photo student__photo_size student__photo_position" src="img/avatars/${this.getIdPhoto()}.png" alt="${this.FindNameSurname()}" />
                <div class="student__about student__about_disp_flex">
                    <p class="student__name" title="${this.FindNameSurname()}">${this.FindNameSurname()}</p>
                    <span class="student__school" title="${this.getNameSchool() + " " + this.getYearSchool() + " курс "}">${this.getNameSchool() + " " + this.getYearSchool() + " курс "}</span>
                </div>
                <div class="student__id">"id" + ${this.getId()}</div>
                <div class="student__position">${positionInStudents}</div>
            </div>
    `;
        WriteToBlock(".students", option);
    }
}

//////////////////////////////////// Global elem /////////////////////////////////////

/* 
   На какой последний элемент был совершен клик 
   0 - не на студента, нуль элемент
   id - сохраняет номер элемента студента
*/
let lastIdClick = 0,
    id;
/* 
   screenModeHeight - сколько элементов student
   у нас в строке
*/
let screenModeDivider;
/* База всех студентов */
let students = [];
/* Таймер для вызова всплывающего окна */
let timer;
/* Проверка, смотрит ли пользователь через клик или просто наведя курсор */
let hoverShowPopUp = false;
let clickedShowPopUp = false;
/* Сколько учеников рендерить */
let howMuchStudentsRender = 6;

//////////////////////////////////// Functions ////////////////////////////////////////

/* Меняет размер окна профиля в зависимости от карточки student */
function makeSizeWindowProfile() {
    studentElem = document.querySelector(".student");
    windowProfile = document.querySelector(".window-profile");
    bodyElem = document.querySelector(".main_limits");
    // use if you need to make your own height
    //windowProfile.style.height = studentElem.offsetHeight + "px";
}
/* Определяем сколько элементов в строке Grid */
function findElemRowGrid() {
    bodyWidth = document.querySelector(".main_limits");
    if (bodyWidth.offsetWidth >= 650)
        screenModeDivider = 3;
    else if (bodyWidth.offsetWidth >= 420)
        screenModeDivider = 2;
    else screenModeDivider = 1;
}
/* Определяем положение для окна профиля */
function setPositionWindowProfile(id) {
    bodyElem = document.querySelector(".main_limits");
    headerElem = document.querySelector(".header");
    studentElem = document.querySelector(".student");
    let studentsGridColumnGap = 15;
    let studentsGridRowGap = 10;
    /* Определяет положение окна профиля по вертикале */
    let whichStudentHeight = Math.ceil(id / screenModeDivider) - 1;
    /* Определяет положение окна профиля по горизонтале  */
    let whichStudentWidth = id % screenModeDivider - 1;
    if (whichStudentWidth == -1) whichStudentWidth = screenModeDivider - 1;
    /* Положение окна профиля по вертикале */
    let posY = bodyElem.offsetHeight - headerElem.offsetHeight - (studentElem.offsetHeight + studentsGridColumnGap) * whichStudentHeight;
    /* Положение окна профиля по горизонтале */
    let posX = (studentElem.offsetWidth + studentsGridRowGap) * whichStudentWidth;
    /* Адаптивность под смартфоны */
    if (bodyElem.offsetWidth < 650 && bodyElem.offsetWidth > 420)
        /* Делаем красиво под 2 элемента */
        if (whichStudentWidth == 0) posX = 0;
        else posX = bodyElem.offsetWidth - windowProfile.offsetWidth;
    /* Проверка, чтобы окно профиля не выходил за рамки браузера */
    if (this.window.innerWidth < (posX + windowProfile.offsetWidth))
        posX = this.window.innerWidth - windowProfile.offsetWidth;
    if (posX < 0) posX = 0;
    /* Перемещаем окно пользователя по вертикале */
    windowProfile.style.marginTop = -posY + "px";
    /* Перемещаем окно пользователя по горизонтале */
    windowProfile.style.marginLeft = posX + "px";
}
/* Функция подгрузки элементов окна профиля */
function loadAllElementsWindowProfile() {
    /* Здесь происходит загрузка и показ окна профиля */
    windowProfileDisplay = document.querySelector(".window-profile_disp_grid");
    windowProfileDisplay.style.display = "grid";

    windowProfileElement = SelectElemByStyle(".window-profile__name-surname");
    windowProfileElement.innerHTML = students[id].FindNameSurname();

    windowProfileElement = SelectElemByStyle(".window-profile__online-status");
    windowProfileElement.innerHTML = students[id].CountLastTime();

    windowProfileElement = SelectElemByStyle(".window-profile__status-word-changed");
    windowProfileElement.innerHTML = students[id].FindStatus();

    windowProfileElement = SelectElemByStyle(".window-profile__city-word-changed");
    windowProfileElement.innerHTML = students[id].getCity();

    windowProfileElement = SelectElemByStyle(".window-profile__university-word-changed");
    windowProfileElement.innerHTML = students[id].getNameSchool();

    windowProfileElement = SelectElemByStyle(".window-profile__university-year-word-changed");
    windowProfileElement.innerHTML = students[id].getYearSchool();

    windowProfileElement = SelectElemByStyle(".window-profile__birth-day-DM");
    windowProfileElement.innerHTML = students[id].getBirthday();

    windowProfileElement = SelectElemByStyle(".window-profile__years");
    windowProfileElement.innerHTML = students[id].CountYears();

    windowProfileElement = SelectElemByStyle(".window-profile__years-word");
    windowProfileElement.innerHTML = students[id].CountYearsWord();

    windowProfileElement = SelectElemByStyle(".window-profile__phone-number");
    windowProfileElement.innerHTML = students[id].getPhoneNumber();

    windowProfileElement = SelectElemByStyle(".window-profile__avatar");
    windowProfileElement.src = students[id].FindProfilePhotoPng();
}
/* 
   Добавляем, иначе удаляем hover, чтобы пользователь не видел, что может
   взаимодействовать с карточками сзади
   !!! Можно подстроить под карточки сзади профиля
*/
function AddElseRemoveHover(flag) {
    var studentElemHoverAll = document.querySelectorAll(".student");
    studentElemHoverAll.forEach(function (studentElemHover) {
        if (flag)
            studentElemHover.classList.add("student_hover");
        else
            studentElemHover.classList.remove("student_hover");
    });
}
/* проверка, а не кликнул ли пользователь на окно профиля */
function checkClickOnWindowProfile(e) {
    if (!e.target.parentElement.classList.contains("window-profile") &&
        !e.target.parentElement.parentElement.classList.contains("window-profile") &&
        !e.target.parentElement.parentElement.classList.contains("window-profile__body") &&
        !e.target.parentElement.classList.contains("window-profile__button-hide") &&
        !e.target.parentElement.classList.contains("window-profile__hide-open-information") &&
        !e.target.parentElement.classList.contains("window-profile__friends") &&
        !e.target.parentElement.classList.contains("window-profile__gallery") &&
        !e.target.parentElement.classList.contains("window-profile__phone") &&
        !e.target.parentElement.classList.contains("window-profile__born") &&
        !e.target.parentElement.classList.contains("window-profile__where-study") &&
        !e.target.parentElement.classList.contains("window-profile__status") &&
        !e.target.parentElement.classList.contains("window-profile__city") &&
        !e.target.parentElement.parentElement.classList.contains("window-profile__where-study"))
        return (true);
    else return (false);
}
/* Показ окна профиля (вспомог. функция для MouseEnterStudent)*/
function ShowWindowProfile(e) {
    id = e.target.children[3].innerHTML;
    loadAllElementsWindowProfile();
    setPositionWindowProfile(id);
    windowProfile = document.querySelector(".window-profile");
    windowProfile.style.visibility = "visible";
    hoverShowPopUp = true;
}
/* Появление окна через n секунд через таймер */
function MouseEnterStudent(event) {
    if (!clickedShowPopUp)
        timer = setTimeout(() => ShowWindowProfile(event), 2000);
}

/* Отлючаем таймер, чтобы всплывающее окно не открылось */
function MouseLeaveStudent(event) {
    clearTimeout(timer);
}

/* Пользователь посмотрел окно профиля с помощью указателя мыши*/
function MouseLeaveWindow(event) {
    if (hoverShowPopUp) {
        windowProfile = document.querySelector(".window-profile");
        windowProfile.style.visibility = "hidden";
        windowProfile = document.querySelector(".window-profile_disp_grid");
        windowProfile.style.display = "none";
        hoverShowPopUp = false;
    }
}
//////////////////////////////////// Events ///////////////////////////////////////////

/* Загрузка всех пользователей во время прогрузки страницы */
window.onload = function () {
    makeSizeWindowProfile();
    findElemRowGrid();
    /*
        При открытие страницы загружаем всю базу студентов
        !!! Потом можно сделать функию и вызывать, когда того требует
    */
    //students.push(new student);
    let personId1 = {
        information: {
            name: "Маша",
            surname: "Иванова",
            city: "Уфа",
            nameSchool: "УГАТУ",
            yearSchool: 2,
            birthday: "23.03.1998"
        },
        lastTimeOnline: new Date(2020, 04, 07, 19, 0),
        id: 1,
        idPhoto: "ava1",
        friends: [2, 3, 4, 5],
        status: "Мне так хорошо! (Дайте покушать)",
        phoneNumber: 89177777777
    };
    
    let personId2 = {
        information: {
            name: "Миша",
            surname: "Петров",
            city: "Москва",
            nameSchool: "СурГУ",
            yearSchool: 3,
            birthday: "01.04.1996"
        },
        lastTimeOnline: new Date(2020, 03, 07, 10, 10),
        id: 2,
        idPhoto: "ava2",
        friends: [1, 3, 4, 5],
        status: "Eto Eng ili ya ne smenil raskladku?",
        phoneNumber: 89177777333
    };
    
    let personId3 = {
        information: {
            name: "Марат",
            surname: "Сидоров",
            city: "Уфа",
            nameSchool: "БГУ",
            yearSchool: 4,
            birthday: "28.07.1992"
        },
        lastTimeOnline: new Date(2020, 04, 08, 10, 0),
        id: 3,
        idPhoto: "ava3",
        friends: [1, 2, 4, 5],
        status: "выглядишь круто!!!",
        phoneNumber: 89177757775
    };
    
    let personId4 = {
        information: {
            name: "Оля",
            surname: "Александровна",
            city: "Уфа",
            nameSchool: "БГУ",
            yearSchool: 2,
            birthday: "12.02.1998"
        },
        lastTimeOnline: new Date(2020, 04, 05, 15, 0),
        id: 4,
        idPhoto: "ava4",
        friends: [2, 3],
        status: "Я очень бодра сегодня сутра! (нет)",
        phoneNumber: 89177757375
    };
    
    let personId5 = {
        information: {
            name: "Артур",
            surname: "Иванов",
            city: "Уфа",
            nameSchool: "УГАТУ",
            yearSchool: 3,
            birthday: "17.09.1997"
        },
        lastTimeOnline: new Date(2020, 04, 08, 20, 30),
        id: 5,
        idPhoto: "ava5",
        friends: [1, 4],
        status: "А он мне не нужен",
        phoneNumber: 89177757722
    };
    
    let personId6 = {
        information: {
            name: "Олег",
            surname: "Степов",
            city: "Уфа",
            nameSchool: "УГАТУ",
            yearSchool: 4,
            birthday: "11.11.1978"
        },
        lastTimeOnline: new Date(2020, 02, 07, 20, 0),
        id: 6,
        idPhoto: "ava6",
        friends: [],
        phoneNumber: 89177757111
    };
    students.push(new student({}));
    students.push(new student(personId1));
    students.push(new student(personId2));
    students.push(new student(personId3));
    students.push(new student(personId4));
    students.push(new student(personId5));
    students.push(new student(personId6));
    for (let i = 1; i <= howMuchStudentsRender; i++) {
        students[i].RenderStudentBody(i);
    }
}

/* Пользователь меняет разрешение окна */
window.addEventListener("resize", event => {
    makeSizeWindowProfile();
    findElemRowGrid();
    if (id != null)
        setPositionWindowProfile(id);
}, false);

/* Пользователь кликает на студента */
document.addEventListener("click", function (e) {
    /* 
       Определяем по которому блоку кликнули
       !!! В будущем можно будет реализовать рандомное заполнение
       !!! блоков student рандомными людьми из базы
    */
    id = -1;
    /* Работа со стилем окна */
    windowProfile = document.querySelector(".window-profile");
    windowProfileDisplay = document.querySelector(".window-profile_disp_grid");
    /* Получаем id студента, на которого кликнул пользователь 
       Проверяем, кликнул ли пользователь на окно профиля
       Если нет, то проверяем на какой элемент student был
       сделан клик, чтобы определить id
    */
    /* Проверяем не кликнул ли пользователь дальше body */
    if (!e.target.classList.contains("body")) {
        /* проверка по всем элементам в окне */
        //Возможно можно оптимизировать еще подгрузку элементов
        //С помощью loadAllElementsWindowProfile(); 
        if (checkClickOnWindowProfile(e)) {
            if (e.target.classList.contains("student")) {
                id = e.target.children[3].innerHTML;
                loadAllElementsWindowProfile();
            } else if (e.target.parentElement.classList.contains("student")) {
                id = e.target.parentElement.children[3].innerHTML;
                loadAllElementsWindowProfile();
            } else if (e.target.parentElement.parentElement.classList.contains("student")) {
                id = e.target.parentElement.parentElement.children[3].innerHTML;
                loadAllElementsWindowProfile();
            } else {
                /* пользователь кликнул не на студента */
                lastIdClick = 0;
            }
        } else {
            /* Пользователь кликнул на окно профиля */
            id = 0;
            lastIdClick = 0;
            /* Пользователь кликнул на иконку "закрыть" */
            if (e.target.classList.contains("window-profile__icon-close"))
                id = -1;
        }
    } else {
        /* Пользователь кликнул вне body*/
        lastIdClick = 0;
    }
    /* Открытие или закрытие профиля при клике */
    if (id == -1) {
        AddElseRemoveHover(true);
        clickedShowPopUp = false;
        windowProfile.style.visibility = "hidden";
        windowProfileDisplay.style.display = "none";
    } else if (lastIdClick != id && windowProfile.style.visibility == "visible") {
        AddElseRemoveHover(true);
        clickedShowPopUp = false;
        windowProfile.style.visibility = "hidden";
        windowProfileDisplay.style.display = "none";
    } else {
        AddElseRemoveHover(false);
        if (id != 0) {
            setPositionWindowProfile(id);
        }
        clickedShowPopUp = true;
        windowProfile.style.visibility = "visible";
    }
    lastIdClick = id;
});

//////////////////////////////////// Pattern //////////////////////////////////////////
function SelectElemByStyle(nameOfStyle) {
    return document.querySelector(nameOfStyle);
}

function WriteToBlock(nameOfStyleOfBlock, options) {
    element = SelectElemByStyle(nameOfStyleOfBlock);
    element.innerHTML += '\n' + options;
}
