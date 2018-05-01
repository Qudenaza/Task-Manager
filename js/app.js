const calendar = document.querySelector('.calendar'),
      frontSide = document.querySelector('.calendar__side--front'),
      modal = document.querySelector('.modal'),
      closeBtn = modal.querySelector('.close__btn'),
      form = modal.querySelector('.form'),
      taskInput = form.querySelector('#inputTask');

let currentDay;      


document.addEventListener('DOMContentLoaded', getTasks);

calendar.addEventListener('click', function(e) {
 if(e.target.nodeName === 'BUTTON') {
    modal.style.display = 'block';
    currentDay = e.target.parentElement.parentElement.firstElementChild.children[1];
 }
});

closeBtn.addEventListener('click', function(e) {
  e.target.parentElement.style.display = 'none';
});

form.addEventListener('submit', addTask);



// При загрузке страницы отрисовывает задачи на днях календаря беря информацию из localStorage
function getTasks() {
  var month = document.querySelectorAll('.calendar__day');

  for(var key in localStorage) {
    if(localStorage[key]) {
      let tasks = JSON.parse(localStorage[key]),
          fragment = document.createDocumentFragment();
      
      tasks.forEach(task => {
        const li = document.createElement('li');

        li.className = 'calendar__item';

        li.textContent = task;

        fragment.appendChild(li);

      });

      month[key - 1].firstElementChild.lastElementChild.appendChild(fragment);
    };
  };
};


function addTask(e) {
  const li = document.createElement('li'),
        date = currentDay.previousElementSibling.textContent;     
        
  li.className = 'calendar__item';

  li.textContent = taskInput.value;

  currentDay.appendChild(li);

  storeTaskInLocalStorage(taskInput.value, date);

  taskInput.value = '';

  e.preventDefault();
};



function storeTaskInLocalStorage(task, date) {
  let tasks;

  tasks = localStorage.getItem(date) === null ? [] : JSON.parse(localStorage.getItem(date));

  tasks.push(task);

  localStorage.setItem(date, JSON.stringify(tasks));

  console.log(tasks);
}
