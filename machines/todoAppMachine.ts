import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiABzWKAFgDMATgBM1gOyPr9gGy+AVntrABoQAE9EAFpHLWcKAEYA619rAISE30znAF8csKEcAhJOCXpSRiE2MAAnGtQaigMAGxUAMwbsCkKREvFacsqZOQUlU01dcyNYEzVScysEGNdfCmstDc9YtK1bMMil3y0KVKyna2c4+2dfZ3s8gpki0U4qzDLIVgBhGrAVMEw5AA7lNjOMFogEq57GtbAFXAEAh57JtHI59ohYhQPFkMtYEloEvYMgk0g8QD1imJusN3gNPgARMDNMDKMCgmbgpCWTF+bE+azuUmuRwI5wBDFLdzxfz4xweLQeALii4BcmUl6UH5-VQVQFgIGYZQyCgAZUIqCBUg6NWwmDIBgArspWAAxTr20hO5SYIi4CqQDmzMzcxZRPGJMXI3yuZxKuOSxwoxLeDyk6MKhLqp69analRSYFGk3my3Wj0O52sU2OgBG2BMQa5oEWCSVFC09mSvg8d1cac8vklCIC2OScaVyM7l0c2Ywzz6FHzusYReNGDNuG4UnXqHY6koCgENPnuc4y8LBuLG9NW53MnkpF4Yzm2j03OmwfmocQ0JhAUJLshTSRx4UlKJiUScVlXsVwRVsQk1XyCkcypc9fgLPU1xLO89V3VhanqRoWnaToT2ENCtQwld9UNXdN23PCH1GAt1DfJs5ghBACTsLQjmcUU-DTPikUTZN-HsLxZWJWN7mQjVFyZFkaPwjhDyffhBFQzUKCU1l7wwR9n1YiZ30MMFOJ-JYoXiODfG8Ww7JWFJwK7VZLmRC4CXHFJfDnCidL0lSZAIuoGiaVplBtLoFOpIKDNQIzFBM9iPwskMW0QexJIoUDbC8UkAMRCUImiaEPAoZwoRcDYu2sUUUjyZDSHQOBzFi0oBikKoOIynkljRf9dmVRwe0CVxCXAib-wRfsbNSLQANcfyF2pN4PggXrv0yhBxWxRxhRjRVEUFexwISG4oIVQaEiTFFrBWs9+kkJiWEwQiGkDNLOUsnaYgA3K-F2YJbhxDwEUleyOw2LQXEyHs40Wx7KKXajLzoksLStPVos9b0tq4qJEQofs6rcEU212Zxh1AyrLguZwUjRdJbuRnSLywq96NvRjGF3AmrNjVwO2RLxYyTerbiHUqEBFCrO34wlbF8YJ4TZxcOdXLmZAFv6iWFqFlWjWN4w8SVMmF5wrZuDw0nWJUtGW+TtMU5l9Ne1Bdf60DRzjFXFUN8VFTOmWINsSrYcko55Wgh7ndPFH4o996wt+Tbvq-LjYNWJJHaCWIVTcc7YxOPK7YEqFdg8dWxC9sN5RhJMjgFUGewh0OAiyNY7m8UbYdiTumpyIA */
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
          saveTodo: {
            data: void;
          };
          deleteTodo: {
            data: void;
          };
        },
        events: {} as
          | {
              type: "Create new";
            }
          | {
              type: "Form input changed";
              value: string;
            }
          | {
              type: "Submit";
            }
          | {
              type: "Delete";
              todo: string;
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
            Delete: {
              target: "Deleting todo",
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
                Submit: {
                  target: "Saving todo",
                },
              },
            },
            "Saving todo": {
              invoke: {
                src: "saveTodo",
                onDone: [
                  {
                    target: "#Todo machine.Loading Todos",
                  },
                ],
                onError: [
                  {
                    actions: "assignErrorToContext",
                    target: "Showing form input",
                  },
                ],
              },
            },
          },
        },
        "Deleting todo": {
          invoke: {
            src: "deleteTodo",
            onDone: [
              {
                target: "Loading Todos",
              },
            ],
            onError: [
              {
                actions: "assignErrorToContext",
                target: "Deleting todo errored",
              },
            ],
          },
        },
        "Deleting todo errored": {},
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
