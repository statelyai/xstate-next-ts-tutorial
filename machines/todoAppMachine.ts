import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiAJwAmCgBYAbAGYA7A4CMW9579bbABoQAE9EAFpbBwAOCjcnWxcnaOinazdU6IBfLOChHAISTgl6UkYhNjAAJyrUKooDABsVADM67Ap8kSLxWlLymTkFJVNNXXMjWBM1UnMrBHCXW3s3NwBWVySNrVdE4LCF6wpo6zWta2tPWy03HfcXHNyQUnQ4cy7CsWo+qQqJ41GcwiLhcWkc0S8Di0AShHic+wingcDgoVxOazOZwcy1WOTyMgKok4FUwJUg-ymgKQlhsR3WCTc1lS0J8bhcCIWnhca2O0Lcnn5Tlua2iGzxIA+RN6kjKmGUg0w1VqVXJ1Mm0zM1PmbnsLmiWmZNyZoPOHPCTicFFBTM8ThFDjWyMZ4slPQpGtmWuBjvBkOhURuzjNS08cTWSzSDsS0LWjyyQA */
  createMachine(
    {
      context: {
        todos: [] as string[],
        errorMessage: undefined as string | undefined,
      },
      tsTypes: {} as import("./todoAppMachine.typegen").Typegen0,
      schema: {
        services: {} as {
          loadTodos: {
            data: string[];
          };
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
        "Todos Loaded": {},
        "Loading todos errored": {},
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
      },
    },
  );
