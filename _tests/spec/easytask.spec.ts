import {
  values,
  submitTask,
  amendTask,
  deleteTask,
  countCharsInField,
  toggleTaskTitleDesc,
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
    test('displays task correctly with title and description', () => {
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

    test('displays task correctly with title and no description', () => {
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
    test('shows the appropriate message', () => {
      init();
      expect(document.body.textContent).toMatch('no tasks');
      expect(document.getElementById('no-tasks')!.style.display).not.toBe(
        'none'
      );
    });
  });
});

describe('submitTask', () => {
  const mockEv = new Event('submit');

  test('saves inputs to LS', () => {
    (document.getElementById('task-title') as HTMLInputElement).value = 'foo';
    submitTask(mockEv);

    expect(localStorage.getItem(values.locStorageKey)).toBeDefined();
  });

  test('adds new task to the DOM', () => {
    (document.getElementById('task-title') as HTMLInputElement).value = 'foo';
    submitTask(mockEv);

    expect(document.querySelectorAll('.task').length).toBe(1);

    (document.getElementById('task-title') as HTMLInputElement).value = 'bar';
    submitTask(mockEv);

    expect(document.querySelectorAll('.task').length).toBe(2);

    // Ensure 'no tasks' message is not displayed
    expect(document.getElementById('no-tasks')!.style.display).toBe('none');
  });

  test("doesn't save if title is not supplied", () => {
    submitTask(mockEv);

    expect(localStorage.getItem(values.locStorageKey)).toBeNull();
  });
});

describe('amendTask', () => {});

describe('deleteTask', () => {});

describe('countCharsInField', () => {
  const mockEv = new Event('input');

  test("displays the length of an input field's value correctly", () => {
    document.body.innerHTML =
      '<div><input type="text"/><span class="char-count-num"></span></div>';

    const inputEl = document.querySelector('input')!;
    const countEl = document.querySelector('.char-count-num')!;

    countCharsInField(mockEv, inputEl);
    expect(+countEl.textContent!).toBe(0);

    inputEl.value = 'foobar';

    countCharsInField(mockEv, inputEl);
    expect(+countEl.textContent!).toBe(6);
  });
});

describe('toggleTaskTitleDesc', () => {
  const mockEv = new Event('mouseenter');

  test('toggles between title and description', () => {
    document.body.innerHTML =
      '<div class="task"><div class="task-title">Title</div> <div class="task-desc" style="display: none">Description</div></div>';
    const taskEl = document.querySelector('.task') as HTMLElement;
    const titleEl = document.querySelector('.task-title') as HTMLElement;
    const descEl = document.querySelector('.task-desc') as HTMLElement;

    toggleTaskTitleDesc(mockEv, taskEl);

    expect(titleEl.style.display).toBe('none');
    expect(descEl.style.display).toBe('block');

    toggleTaskTitleDesc(mockEv, taskEl);

    expect(titleEl.style.display).toBe('block');
    expect(descEl.style.display).toBe('none');
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
