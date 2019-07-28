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

/**
 * @description Set up test environment for amendTask and deleteTask.
 * @mixin
 */
const mixinAmendDeleteTaskEnv = () => {
  const data = [
    { id: 'foo-0', title: 'foo', desc: 'bar' },
    { id: 'baz-1', title: 'baz', desc: 'hello' }
  ];
  localStorage.setItem(values.locStorageKey, JSON.stringify(data));
  for (const entry of data) {
    document.body.innerHTML += `<div class="task" data-id="${
      entry.id
    }"><div class="task-title">${entry.title}</div><div class="task-desc">${
      entry.desc
    }</div><div class="task-btns"></div></div>`;
  }
};

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

describe('amendTask', () => {
  beforeEach(mixinAmendDeleteTaskEnv);

  const mockEv = new Event('click');

  window.prompt = (str: string) => 'Amended value';

  test('amends the task in localStorage', () => {
    amendTask(mockEv, 'foo-0');

    expect(
      JSON.parse(localStorage.getItem(values.locStorageKey) as string)[0]
    ).toEqual({
      id: 'ame-0',
      title: 'Amended value',
      desc: 'Amended value'
    });

    amendTask(mockEv, 'baz-1');

    expect(
      JSON.parse(localStorage.getItem(values.locStorageKey) as string)
    ).toEqual([
      {
        id: 'ame-0',
        title: 'Amended value',
        desc: 'Amended value'
      },
      {
        id: 'ame-1',
        title: 'Amended value',
        desc: 'Amended value'
      }
    ]);
  });

  test('updates the DOM', () => {
    amendTask(mockEv, 'foo-0');

    expect(document.body.textContent).not.toMatch(/foo|bar/);

    expect((document.querySelector('.task')! as HTMLElement).dataset.id).toBe(
      'ame-0'
    );

    expect(document.querySelector('.task')!.children[0]).toEqual(
      document.querySelector('.task-title')
    );
    expect(document.querySelector('.task')!.children[1]).toEqual(
      document.querySelector('.task-desc')
    );
    expect(document.querySelector('.task')!.children[2]).toEqual(
      document.querySelector('.task-btns')
    );
  });
});

describe('deleteTask', () => {
  beforeEach(mixinAmendDeleteTaskEnv);

  // Complex DOM work involved...
  const mockEv = {
    target: {
      parentElement: {
        parentElement: {
          remove: () => document.querySelector('.task')!.remove() // Note that this removes the first instance of .task only
        }
      }
    }
  };

  window.confirm = (str: string) => true;

  test('deletes the task from localStorage', () => {
    deleteTask(mockEv, 'foo-0');

    const lsData = JSON.parse(localStorage.getItem(
      values.locStorageKey
    ) as string);

    expect(lsData.length).toBe(1);
    expect(lsData[0]).toEqual({ id: 'baz-1', title: 'baz', desc: 'hello' });

    deleteTask(mockEv, 'baz-1');
    expect(localStorage.getItem(values.locStorageKey)).toBeNull();
  });

  test('updates the DOM', () => {
    deleteTask(mockEv, 'foo-0');
    expect(document.body.textContent).not.toMatch(/foo|bar/);

    expect(document.querySelectorAll('.task-title').length).toBe(1);
    expect(document.querySelectorAll('.task-desc').length).toBe(1);

    deleteTask(mockEv, 'baz-1');
    expect(document.querySelector('.task-title')).toBeNull();
    expect(document.body.textContent).toMatch('no tasks');
  });
});

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
