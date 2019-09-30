/**
 * easytask/script.js
 * The script file for the 'easytask' project in the 'for-recruiters' repository.
 * © George Pickering 2019, https://github.com/tedjenkins
 */

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

  // Add task id in data attribute to make amending / deleting individual tasks easier
  taskEl.dataset.id = task.id;

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
 * @description Task submit function.
 * @param {Event} e Submit event via form.
 */
export const submitTask = e => {
  e.preventDefault();

  const titleInput = document.getElementById('task-title');
  const descInput = document.getElementById('task-description');

  // Return early if title field hasn't been filled in
  if (!titleInput.value) {
    return;
  }

  // Grab values from fields in form
  const inputVals = {
    id: `${titleInput.value.toLowerCase().substring(0, 3)}-${
      values.data() ? values.data().length : 0
    }`,
    title: titleInput.value,
    desc: descInput.value
  };

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

/**
 * @description Amends (edits) specific task in localStorage with changes reflected in the DOM.
 * @param {Event} e Click event.
 * @param {string | undefined} taskId For unit tests only.
 */
export const amendTask = (e, taskId = undefined) => {
  const idTaskToAmend = taskId
    ? taskId
    : e.target.parentElement.parentElement.dataset.id;

  const data = values.data();
  let taskToAmend;
  let taskToAmendIndex;

  data.forEach((entry, index) => {
    if (entry.id === idTaskToAmend) {
      taskToAmend = entry;
      taskToAmendIndex = index;
    }
  });

  // Get new task title and description using ol' fashioned window.prompt()
  const newTaskTitle = window.prompt(
    `(1 of 2) Please specify an amended title (current title: "${taskToAmend.title}")`,
    taskToAmend.title
  );

  const newTaskDesc = window.prompt(
    `(2 of 2) Please specify an amended description${
      taskToAmend.desc ? ` (current description: "${taskToAmend.desc}")` : ``
    }. Leave blank for no description.`,
    taskToAmend.desc
  );

  // If user cancels at either step then the value will be undefined
  if (!newTaskTitle) {
    return;
  }

  // Change task to new details
  taskToAmend.id = `${newTaskTitle
    .toLowerCase()
    .substring(0, 3)}-${taskToAmendIndex}`;
  taskToAmend.title = newTaskTitle;
  taskToAmend.desc = newTaskDesc;

  // Change data then resave to localStorage
  data.splice(taskToAmendIndex, 1, taskToAmend);
  localStorage.setItem(values.locStorageKey, JSON.stringify(data));

  // Amend in DOM
  const taskEl = document.querySelector(`.task[data-id=${idTaskToAmend}]`);
  const taskTitleEl = taskEl.querySelector('.task-title');
  const taskDescEl = taskEl.querySelector('.task-desc') || null;

  taskTitleEl.textContent = newTaskTitle;

  if (taskDescEl && newTaskDesc.length === 0) {
    // Desc element exists, it no longer should, so remove it
    taskDescEl.remove();

    // Make the side bar grey as well
    taskEl.querySelector('.task-bar').classList.remove('task-bar-desc');

    // Task title element will have "display: none" style, remove that
    taskTitleEl.removeAttribute('style');
  } else if (!taskDescEl && newTaskDesc.length > 0) {
    // Create task desc element
    const newTaskDescEl = document.createElement('div');
    newTaskDescEl.classList.add('task-desc');
    newTaskDescEl.textContent = newTaskDesc;

    // Apply display CSS rules
    taskTitleEl.style.display = 'none';
    newTaskDescEl.style.display = 'block';

    taskEl.insertBefore(newTaskDescEl, taskEl.querySelector('.task-btns'));

    taskEl.querySelector('.task-bar').classList.add('task-bar-desc');
  } else {
    taskDescEl.textContent = newTaskDesc;
  }

  taskEl.dataset.id = taskToAmend.id;
};

/**
 * @description Removes specific task from localStorage and from the DOM.
 * @param {Event | object} e Click event. An object literal when in unit tests.
 * @param {string | undefined} taskId For unit tests only.
 */
export const deleteTask = (e, taskId = undefined) => {
  const idTaskToDelete = taskId
    ? taskId
    : e.target.parentElement.parentElement.dataset.id;

  const data = values.data();
  let taskToDelete;
  let taskToDeleteIndex;

  data.forEach((entry, index) => {
    if (entry.id === idTaskToDelete) {
      taskToDelete = entry;
      taskToDeleteIndex = index;
    }
  });

  if (
    window.confirm(
      `Delete task "${taskToDelete.title}"${
        taskToDelete.desc ? ` with description "${taskToDelete.desc}"` : ``
      }? This action cannot be undone.`
    )
  ) {
    // Check if last task remaining, if so then clear whole LS entry
    if (data.length === 1) {
      clearAllTasks();
    } else {
      data.splice(taskToDeleteIndex, 1);
      localStorage.setItem(values.locStorageKey, JSON.stringify(data));

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
    label.innerHTML += `<div class="form-char-count"><span class="char-count-num">0</span> / ${label.nextElementSibling.maxLength} chars</div>`;
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
