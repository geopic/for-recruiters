// Site constants, variables
export const values = {
  locStorageKey: 'easytask-tasks',
  data: function() {
    return JSON.parse(localStorage.getItem(this.locStorageKey)) || null;
  }
};

// Site mixins
/**
 * mixinAddTaskToDOM
 * Takes in task object and displays it on the page.
 * @param {object} task Task object (title: string, desc: string).
 */
const mixinAddTaskToDOM = task => {
  const taskEl = document.createElement('div');
  taskEl.classList.add('task');

  const taskTitleEl = document.createElement('h2');
  taskTitleEl.classList.add('task-title');
  taskTitleEl.textContent = task.title;
  taskEl.appendChild(taskTitleEl);

  if (task.desc) {
    const taskDescEl = document.createElement('div');
    taskDescEl.classList.add('task-desc');
    taskDescEl.textContent = task.desc;
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
  taskBtns.appendChild(amendTaskBtn);

  // 'Delete task' button
  const deleteTaskBtn = document.createElement('button');
  deleteTaskBtn.type = 'button';
  deleteTaskBtn.classList.add('task-delete-btn');
  deleteTaskBtn.textContent = 'Delete';
  taskBtns.appendChild(deleteTaskBtn);

  document.getElementById('tasklist').appendChild(taskEl);
};

// Task submit function -- runs on submit event via form
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

// 'Clear all tasks' function
export const clearAllTasks = () => {
  if (window.confirm('Remove all tasks? This action cannot be undone.')) {
    localStorage.removeItem(values.locStorageKey);

    document.querySelectorAll('.task').forEach(el => el.remove());

    document.getElementById('no-tasks').style.display = 'block';
  }
};

// 'Init' function -- runs on first load of page
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

  // Add handlers to events
  document.querySelector('form').addEventListener('submit', submitTask);
  document
    .getElementById('clear-all-tasks')
    .addEventListener('click', clearAllTasks);
};

window.onload = init;
