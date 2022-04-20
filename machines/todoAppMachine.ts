import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiALQAmLQHYKAZgCcAVlvu3WgCwBGX2dbZwAaEABPG2dfXwp3ADYE118E-39nBy1XBIBfXPChHAISTgl6UkYhNjAAJ1rUWooDABsVADNG7AoikVLxWgqqmTkFJVNNXXMjWBM1UnMrBGtfB1sKAA53Xw2HBNsdjI2N8KjlhPcXLS9XWwcN1wffa-zCmWLRTmrMcshWAGFamAVGBMOQAO7TYwTRaIfwHTbHTzudwOZ5aDbOMKRRDOLQUPbpfwbfxaQJEravEC9EpiHojH6DP4AETALTAyjAUNmMKQllxqQJGx2thJGxCN3cpxsotcFCSJMyjncHge7ipNM+lEBwNUlTBYHBmGUMgoAGVCKhwVJOrVsJgyAYAK7KVgAMS6DtIzuUmCIuEqkG5czMfKW1nSGwo8JVaP2rgcselCBi+KODmJcay-g17z6dJ1KikEONpotVptnsdLtYZqdACNsCZg7zQEt-ImKH53BsEg4UndMwlk15LomHg5E2i-K4tM5cxgPv0KIW9YwSyaMObcNwpJvUOx1JQFAJ6Yv85xV8XDaWt2ad3uZPJSLxxvNtHo+TMQwsw4gDnE7hkr4nhit4njJis-jRh4Kq+LYITHGS6oFNSea0peQJFvqG5lg++r7qwdQNE0rQdF0Z7CBh2pYWuBpGvu267gRT5jEW6gfi28ywggpJRloCTZMEqQZgJqLJqm8oJKszgKgEtgpAuVFahQrLsnRhEcMeL78II6EqWpHKPhgz6vuxkyfoY0LcX+yzOMSLgPEhgn2SE2JnNYiTrM4GxaAJCl7CiqJKUudKGRpMhEfUjTNG0yi2t0mrLuFxmoKZijmZxX7WaGbaIN4UZ7PsOwZjExzDjiyxeNBk7+EkdXbKsfgbCFF6UClLGLsRjR-GaBhgJAmBOgYXG5fyKYqtGwpxhi5WCRVHnEnKySuf5xwkq11GqWyRmdVg3VAhArAWLAygghQuDtJytQABReH5ACUrBJWFO0RV10WHaNv55SmziXPYCQPHOvlogpkHwgkFCPIEuwdrsDyivkqGkOgcDmC9ZSDFI1TfTxKy+fECRYuKaRpEB-iQfYcrkmsZIeGirgxJtKnfL8EB47ZHgEvZpP2ImPYHBDOQwVkWIBDEzwtahmMDJIe2wJgB1BtlPI2b9Kwi+iuw+UJCZC5VPaOf9s62H2Wx3F4LPLleOE3ox5bWvqCVej6nMayiFB3CBiMhB2GKuCO-3Q7ODyPMT-3pPOMv6TbtHXgxeHMYw+7u+NCnrI4MkKWVsk5EHTh+IJs7Er2OyeNbBbx3bicYGn4aBOsMYJqkAVJpVdXOF2tgdhkWieApjWV5wHUpzI9e4p7CbSY4zdAWikE7FGs4xHsc79ii0tvOeW2j7e+2fSrVlq2NSzuB28SovGmK+Qh7k2BkXe+B4-iohT447MPXKqz++OePi2sHC6yZvrSCxNLgxCZtcOciFsjI1yEAA */
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
                cond: "Has todos",
                target: "Todos Loaded",
              },
              {
                target: "Creating new todo",
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
      guards: {
        "Has todos": (context, event) => {
          return event.data.length > 0;
        },
      },
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
