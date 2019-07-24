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
 * @param {Event} e submit event via form.
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

export const deleteTask = () => {};

/**
 * @description Handler which runs on mouseenter and mouseleave events on each task element.
 * @param {Event} e Mouseenter, mouseleave event
 * @param {EventTarget} targ For unit tests only
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

  // Focus on 'title' input
  document.getElementById('task-title').focus();

  // Apply handlers to events not yet handled
  document.querySelector('form').addEventListener('submit', submitTask);

  document
    .getElementById('clear-all-tasks')
    .addEventListener('click', clearAllTasks);
};

window.onload = init;
