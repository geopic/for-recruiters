import {
  values,
  submitTask,
  clearAllTasks,
  init
} from '../../easytask/script.js';

beforeEach(() => {
  document.body.innerHTML =
    '<form><input type="text" id="task-title" name="task-title" required /> <textarea id="task-description" name="task-description"></textarea></form> <div id="tasklist"><div id="no-tasks">There are no tasks to display...</div></div> <button type="button" id="clear-all-tasks"></button>';
  localStorage.clear();
});

describe('init', () => {
  describe('data exists', () => {
    test('task with title and description', () => {
      localStorage.setItem(
        values.locStorageKey,
        JSON.stringify([{ title: 'foo', desc: 'bar' }])
      );

      init();

      expect(document.body.textContent).toMatch('foo');
      expect(document.body.textContent).toMatch('bar');

      expect(document.querySelector('.task-title')).toBeDefined();
      expect(document.querySelector('.task-desc')).toBeDefined();
    });

    test('task with title and no description', () => {
      localStorage.setItem(
        values.locStorageKey,
        JSON.stringify([
          { title: 'foo', desc: 'bar' },
          { title: 'baz', description: '' }
        ])
      );

      init();

      expect(document.body.textContent).toMatch('baz');

      expect(document.querySelectorAll('.task-desc').length).toBe(1);
      expect(document.querySelectorAll('.task').length).toBe(2);
    });
  });

  describe('data does not exist', () => {
    test('appropriate message is shown', () => {
      init();
      expect(document.body.textContent).toMatch('no tasks');
      expect(document.getElementById('no-tasks')!.style.display).not.toBe(
        'none'
      );
    });
  });
});

describe('submitTask', () => {
  // mock Event.preventDefault()
  const mockEv = {
    preventDefault: () => true
  };

  test('inputs are saved to LS', () => {
    (document.getElementById('task-title') as HTMLInputElement).value = 'foo';
    submitTask(mockEv);

    expect(localStorage.getItem(values.locStorageKey)).toBeDefined();
  });

  test('the new task is added to the DOM', () => {
    (document.getElementById('task-title') as HTMLInputElement).value = 'foo';
    submitTask(mockEv);

    expect(document.querySelectorAll('.task').length).toBe(1);

    (document.getElementById('task-title') as HTMLInputElement).value = 'bar';
    submitTask(mockEv);

    expect(document.querySelectorAll('.task').length).toBe(2);

    // Ensure 'no tasks' message is not displayed
    expect(document.getElementById('no-tasks')!.style.display).toBe('none');
  });

  test('no save if title is not supplied', () => {
    submitTask(mockEv);

    expect(localStorage.getItem(values.locStorageKey)).toBeNull();
  });
});

describe('clearAllTasks', () => {
  beforeEach(() => {
    localStorage.setItem(
      values.locStorageKey,
      JSON.stringify([{ title: 'foo', desc: 'bar' }])
    );
  });

  window.confirm = (str: string) => true;

  test('clears data from localStorage', () => {
    clearAllTasks();

    expect(localStorage.getItem(values.locStorageKey)).toBeNull();
  });

  test('updates the DOM', () => {
    init();
    expect(document.body.textContent).toMatch(/foo|bar/);

    clearAllTasks();

    expect(document.querySelectorAll('.task').length).toBe(0);
    expect(document.getElementById('no-tasks')!.style.display).toBe('block');
  });
});
