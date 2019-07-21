import { values, submitTask, clearAllTasks, init } from '../easytask/script.js';

describe('init', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<form><input type="text" id="task-title" name="task-title" required /> <textarea id="task-description" name="task-description"></textarea></form> <div id="tasklist"></div> <button type="button" id="clear-all-tasks"></button>';
    localStorage.clear();
  });

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
      expect(document.querySelector('.no-tasks')).toBeDefined();
    });
  });
});

describe('submitTask', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<input type="text" id="task-title" name="task-title" required /> <textarea id="task-description" name="task-description">';
    localStorage.clear();
  });

  const mockEv = {
    preventDefault: () => true
  };

  test('inputs are saved to LS', () => {
    (document.getElementById('task-title') as HTMLInputElement).value = 'foo';
    submitTask(mockEv);

    expect(localStorage.getItem(values.locStorageKey)).toBeDefined();
  });

  test('no save to LS if title is not supplied', () => {
    submitTask(mockEv);

    expect(localStorage.getItem(values.locStorageKey)).toBeNull();
  });
});

describe('clearAllTasks', () => {
  test('clears data from localStorage', () => {
    window.confirm = (str: string) => true;

    localStorage.setItem(
      values.locStorageKey,
      JSON.stringify([{ title: 'foo', desc: 'bar' }])
    );

    clearAllTasks();

    expect(localStorage.getItem(values.locStorageKey)).toBeNull();
  });
});
