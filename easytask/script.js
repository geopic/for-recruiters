// Site constants, variables
export const values = {
  locStorageKey: 'easytask-tasks',
  data: function() {
    return JSON.parse(localStorage.getItem(this.locStorageKey)) || null;
  }
};

/**
 * @description Takes in task object and displays it on the page.
 * @param {object} task Task object (title: string, desc: string).
 * @mixin
 */
const mixinAddTaskToDOM = task => {
  const taskEl = document.createElement('div');
  taskEl.classList.add('task');

  // 'Bar' element on side of task, coloured if task has a description
  const taskBar = document.createElement('div');
  taskBar.classList.add('task-bar');
  taskEl.appendChild(taskBar);

  const taskTitleEl = document.createElement('h2');
  taskTitleEl.classList.add('task-title');
  taskTitleEl.textContent = task.title;
  taskEl.appendChild(taskTitleEl);

  if (task.desc) {
    const taskDescEl = document.createElement('div');
    taskDescEl.classList.add('task-desc');
    taskDescEl.textContent = task.desc;

    // Hide desc until user hovers over task
    taskDescEl.style.display = 'none';

    // Colour 'bar' element
    taskBar.classList.add('task-bar-desc');

    taskEl.appendChild(taskDescEl);
  }

  // Main button-containing part of task display
  const taskBtns = document.createElement('div');
  taskBtns.classList.add('task-btns');
  taskEl.appendChild(taskBtns);

  // Add data attribute to make amending / deleting individual tasks easier
  taskBtns.dataset.task = JSON.stringify(task);

  // 'Amend task' button
  const amendTaskBtn = document.createElement('button');
  amendTaskBtn.type = 'button';
  amendTaskBtn.classList.add('task-amend-btn');
  amendTaskBtn.textContent = 'Amend';
  amendTaskBtn.addEventListener('click', amendTask);
  taskBtns.appendChild(amendTaskBtn);

  // 'Delete task' button
  const deleteTaskBtn = document.createElement('button');
  deleteTaskBtn.type = 'button';
  deleteTaskBtn.classList.add('task-delete-btn');
  deleteTaskBtn.textContent = 'Delete';
  deleteTaskBtn.addEventListener('click', deleteTask);
  taskBtns.appendChild(deleteTaskBtn);

  // Handle mouse and hover events on element
  taskEl.addEventListener('mouseenter', toggleTaskTitleDesc);
  taskEl.addEventListener('mouseleave', toggleTaskTitleDesc);
  taskEl.addEventListener('touchstart', toggleTaskTitleDesc);

  document.getElementById('tasklist').appendChild(taskEl);
};

/**
 * @description Compares two objects to check if they are identical.
 * @param {object} obj1 First object to compare.
 * @param {object} obj2 Second object to compare.
 * @returns {boolean} True if objects are identical, false if not.
 * @mixin
 */
const mixinCompareObjects = (obj1, obj2) => {
  return Object.is(obj1, obj2);
  console.log(obj1, obj2);
  for (const prop in obj1) {
    if (!obj2.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
};

/**
 * @description Task submit function.
 * @param {Event} e Submit event via form.
 */
export const submitTask = e => {
  e.preventDefault();

  const titleInput = document.getElementById('task-title');
  const descInput = document.getElementById('task-description');

  // Grab values from fields in form
  const inputVals = {
    title: titleInput.value,
    desc: descInput.value
  };

  // Return early if title field hasn't been filled in
  if (!inputVals.title) {
    return;
  }

  // Grab data array from LS or make new array
  const arr = values.data() ? values.data() : [];
  arr.push(inputVals);

  // Save to LS
  localStorage.setItem(values.locStorageKey, JSON.stringify(arr));

  // Add new task to DOM
  mixinAddTaskToDOM(inputVals);

  // Remove 'no tasks' message from view
  document.getElementById('no-tasks').style.display = 'none';

  // Clear fields
  titleInput.value = '';
  descInput.value = '';

  // Focus on 'title' input
  titleInput.focus();
};

export const amendTask = () => {};

/**
 * @description Removes specific task from localStorage and from the DOM.
 * @param {Event} e Click event.
 * @param {EventTarget} task For unit tests only.
 */
export const deleteTask = (e, task = null) => {
  const taskToDelete = task
    ? task
    : JSON.parse(e.target.parentElement.dataset.task);

  if (
    window.confirm(
      `Delete task "${taskToDelete.title}"${
        taskToDelete.desc ? `with description "${taskToDelete.desc}"` : ``
      }? This action cannot be undone.`
    )
  ) {
    // Remove from LS
    const newData = values.data();

    // Check if last task remaining, if so then clear whole LS entry
    if (newData.length === 1) {
      clearAllTasks();
    } else {
      let indexToRemove;

      newData.forEach((entry, index) => {
        if (
          entry.title === taskToDelete.title &&
          entry.desc === taskToDelete.desc
        ) {
          indexToRemove = index;
        }
      });
      newData.splice(indexToRemove, 1);
      localStorage.setItem(values.locStorageKey, JSON.stringify(newData));

      // Remove from DOM
      e.target.parentElement.parentElement.remove();
    }
  }
};

/**
 * @description Displays CURRENT char-count in input and textarea fields as well as max amount allowed.
 * @param {Event} e Input event.
 * @param {EventTarget} targ For unit tests only.
 */
export const countCharsInField = (e, targ = e.target) => {
  const parentEl = targ.parentElement;
  parentEl.querySelector('.char-count-num').textContent = targ.value.length;
};

/**
 * @description Handler which runs on mouseenter and mouseleave events on each task element.
 * @param {Event} e Mouseenter, mouseleave event.
 * @param {EventTarget} targ For unit tests only.
 */
export const toggleTaskTitleDesc = (e, targ = e.target) => {
  if (targ.className !== 'task' || !targ.querySelector('.task-desc')) {
    return;
  }
  targ.querySelector('.task-title').style.display =
    targ.querySelector('.task-title').style.display === 'none'
      ? 'block'
      : 'none';
  targ.querySelector('.task-desc').style.display =
    targ.querySelector('.task-desc').style.display === 'none'
      ? 'block'
      : 'none';
};

/**
 * @description Clears all tasks from localStorage.
 */
export const clearAllTasks = () => {
  if (window.confirm('Remove all tasks? This action cannot be undone.')) {
    localStorage.removeItem(values.locStorageKey);

    document.querySelectorAll('.task').forEach(el => el.remove());

    document.getElementById('no-tasks').style.display = 'block';
  }
};

/**
 * @description Initialising function (runs on first load of page).
 */
export const init = () => {
  // 'No tasks to display' message
  const noTasksEl = document.createElement('div');
  noTasksEl.id = 'no-tasks';
  noTasksEl.textContent = 'There are no tasks to display...';
  document.getElementById('tasklist').appendChild(noTasksEl);

  // Display tasks
  if (values.data()) {
    noTasksEl.style.display = 'none';

    for (const task of values.data()) {
      mixinAddTaskToDOM(task);
    }
  }

  // Programmatically add char counts to title and desc fields in form
  document.querySelectorAll('label').forEach(label => {
    label.innerHTML += `<div class="form-char-count"><span class="char-count-num">0</span> / ${
      label.nextElementSibling.maxLength
    } chars</div>`;
  });

  // Focus on 'title' input
  document.getElementById('task-title').focus();

  // Apply handlers to events not yet handled
  document.querySelector('form').addEventListener('submit', submitTask);

  const taskNameField = document.getElementById('task-title');
  const taskDescField = document.getElementById('task-description');

  taskNameField.addEventListener('input', countCharsInField);
  taskDescField.addEventListener('input', countCharsInField);

  document
    .getElementById('clear-all-tasks')
    .addEventListener('click', clearAllTasks);
};

window.onload = init;
