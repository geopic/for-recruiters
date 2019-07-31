declare module 'easytask/script.js' {
  const values: {
    locStorageKey: string;
    data: () => object;
  };

  function submitTask(e: Event): void;

  function amendTask(e: Event, taskId?: string): void;

  function deleteTask(e: Event | object, taskId?: string): void;

  function countCharsInField(e: Event, targ?: EventTarget): void;

  function toggleTaskTitleDesc(e: Event, targ?: EventTarget): void;

  function clearAllTasks(): void;

  function init(): void;
}

declare module 'emojiweather/script.js';
