import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiALQBGAMwBWClscA2AJxuA7ACYALI6ODoEANCAAnjb2WrYUbm7+ABy23rZu9v4eSW4AvrnhQjgEJJwS9KSMQmxgAE61qLUUBgA2KgBmjdgURSKl4rQVVTJyCkqmmrrmRrAmaqTmVgjWQVoUvl6Zth72OUneSeFRy472FNu+vt6OO0lXHlf5hTLFopzVmOWQrADCtWAqMCYcgAd2mxgmixs2XiWm8Pk8CV8bmRRxs3m8FHciI8fkc-jcWmyTxAvRKYgofwBqkqwLAIMwyhkFAAyoRUCCpJ1athMGQDABXZSsABiXT5pEFykwRFwlUg4NmkKQlhstl8SQo3nsiTctiSmw8QUcaIQ2w853saUcSSSOuy-nyBRApHQcHMZLeA0ktOqirmZhVSxWNpcWmSyRiCQ8HlNdlxLnstn8WnsmX8ITyzs9-R6I0+gwVKpmAYWQbVVy1iX8GpryN8cP8cf1mu8qfS+MJGNTSRJOYp5SkTJYmDqDX+EH9ytAwcc2ooSRraY8WRjBN8prbFCy9g8cNs2wJ3mSfZefQpVJUUlBjOZbI5XPF-KFU-mUOWbmctsccMSBqSWg+BukSICuFDZDsu5GjqWxZs8GCvLml40owN7Dqgr6BjOaqOL4Wo6gS+qGsapq+HEMaLvibYIgejingh57kJhZbYScCaLr4y6riuKJxla-jxEEnjIjEvhzvCTq5EAA */
  createMachine(
    {
      context: {
        todos: [] as string[],
        errorMessage: undefined as string | undefined,
        createNewTodoFormInput: "",
      },
      tsTypes: {} as import("./todoAppMachine.typegen").Typegen0,
      schema: {
        services: {} as {
          loadTodos: {
            data: string[];
          };
        },
        events: {} as
          | {
              type: "Create new";
            }
          | {
              type: "Form input changed";
              value: string;
            },
      },
      id: "Todo machine",
      initial: "Loading Todos",
      states: {
        "Loading Todos": {
          invoke: {
            src: "loadTodos",
            onDone: [
              {
                actions: "assignTodosToContext",
                target: "Todos Loaded",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "Loading todos errored",
              },
            ],
          },
        },
        "Todos Loaded": {
          on: {
            "Create new": {
              target: "Creating new todo",
            },
          },
        },
        "Loading todos errored": {},
        "Creating new todo": {
          initial: "Showing form input",
          states: {
            "Showing form input": {
              on: {
                "Form input changed": {
                  actions: "assignFormInputToContext",
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        assignTodosToContext: assign((context, event) => {
          return {
            todos: event.data,
          };
        }),
        assignErrorToContext: assign((context, event) => {
          return {
            errorMessage: (event.data as Error).message,
          };
        }),
        assignFormInputToContext: assign((context, event) => {
          return {
            createNewTodoFormInput: event.value,
          };
        }),
      },
    },
  );
