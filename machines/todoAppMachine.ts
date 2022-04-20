import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiABzWKAFgDMATgBM1gOyPr9gGy+AVntrABoQAE9EAFpHLWcKAEYA619rAISE30znAF8csKEcAhJOCXpSRiE2MAAnGtQaigMAGxUAMwbsCkKREvFacsqZOQUlU01dcyNYEzVScysEGNdfCmstDc9YtK1bMMil3y0KVKyna2c4+2dfZ3s8gpki0U4qzDLIVgBhGrAVMEw5AA7lNjOMFogEq57GtbAFXAEAh57JtHI59ohYhQPFkMtYEloEvYMgk0g8QD1imJusN3gNPgARMDNMDKMCgmbgpCWTF+bE+azuUmuRwI5wBDFLdzxfz4xweLQeALii4BcmUl6UH5-VQVQFgIGYZQyCgAZUIqCBUg6NWwmDIBgArspWAAxTr20hO5SYIi4CqQDmzMzcxZRPGJMXI3yuZxKuOSxwoxLeDyk6MKhLqp69analRSYFGk3my3Wj0O52sU2OgBG2BMQa5oEWCSVFC09mSvg8d1cac8vklCIC2OScaVyM7l0c2Ywzz6FHzusYReNGDNuG4UnXqHY6koCgENPnuc4y8LBuLG9NW53MnkpF4Yzm2j03OmwfmocQ0JhAUJLshTSRx4UlKJiUScVlXsVwRVsQk1XyCkcypc9fgLPU1xLO89V3VhanqRoWnaToT2ENCtQwld9UNXdN23PCH1GAt1DfJs5ghBACTsLQjmcUU-DTPikUTZN-HsLxZWJWN7mQjVFyZFkaPwjhDyffhBFQzUKCU1l7wwR9n1YiZ30MMFOJ-JYoXiODfG8Ww7JWFJwK7VZLmRC4CXHFJfDnCidL0lSZAIuoGiaVplBtLoFOpIKDNQIzFBM9iPwskMW0QAJvGxfxoU8BIk1sIcImiBEEmxNN-EyIJJM7ax-IXOLmX0pj50IhpPgsWBlH+ChcDaNkagACgRDYAEpWFizh4rarAOt+CAOIynkEDRUdXD4i4tG8RVYOccCoXc-FgjTDxPAudxGrPShZsYXdMAWz5TQMMBIEwR0DGW79MrW5VEh8aNdmKo4SoOcMLhOASoT49xbCzclSHQOBzGm-pJD1Kpvq4mIkwoAC0gEntAk2hJwM2-8EX7GzUi0ADXGuyjyNgOk6EDNLOUs37xWxRxhRjRVEUFexDpuKCFTRYkkxRBr5O0xcygSlmnqWjmvxx0DjiTI4BVuHEPARSV7I7DYducTIezjOnGZ0i8sKvejSytPVos9b1sasqJEQofsu0ukU212A7SoQEVR2cS4LmcFJ1oyWc5dPJm7dXB2cMY+6ZA937Y1cDtkS8WMiscW4wd-eUOz8OJCWK4J4Rtxdk9o69UCz1bw1gyNlWjWN4w8SVMkcDsEmg9wAkCEH6+a5SEtbxZQPDnEUTTMUAORVzbAoGdJKOeVoNlx5E8ClrgvasLFtnrK23xpEY2j3a4PREPwzRBxxSSJVCSVAVJ-IC+lnlGE2tdjBD1j2Q2T8x4VU8JJDy+I7iyzyEAA */
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
            }
          | {
              type: "Speed up";
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
        "Deleting todo errored": {
          after: {
            "2500": {
              target: "Todos Loaded",
            },
          },
          on: {
            "Speed up": {
              target: "Todos Loaded",
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
