import { createMachine, assign } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiABzWKAFgDMATgBM1gOyPr9gGy+AVntrABoQAE9EAFpHLWcKAEYA619rAISE30znAF8csKEcAhJOCXpSRiE2MAAnGtQaigMAGxUAMwbsCkKREvFacsqZOQUlU01dcyNYEzVScysEGNdfCmstDc9YtK1bMMil3y0KVKyna2c4+2dfZ3s8gpki0U4qzDLIVgBhGrAVMEw5AA7lNjOMFogEq57GtbAFXAEAh57JtHI59ohYhQPFkMtYEloEvYMgk0g8QD1imIKD8-qoKoCwEDMMoZBQAMqEVBAqQdGrYTBkAwAV2UrAAYp1BaQRcpMERcBVIKCZuCkJZonjEgjnMjfK5dQFdRiEI4UYlvB5SXqPITyZSXpRaSopMCWWzOdzeVKhaLWOzhQAjbAmFWzMzqxYJDwBChaezJXweO6uK2eXwmhGxmMXDwx5Hxy6Oe1PXrU530xhu1kYDm4bhSGuoVi1eqNFrtTrdUtUzgV11M9219n1xsyeSkXhjObaPTq6bh+aRyG7ONHZyOaFJgmBDwms3Hfz2Lz+HxQu4ljDPPo034uhnVj2jhlN9jqSgKATdq9lvt3yuMsyTZ1g2L7jqMLrqLOYZqqAizQjCASEgm7ikgEjjwiaUTEokziIimrjeOsSR5PkICkOgcDmA6N5lFIVQwXMEJLGiiG7EajhJoEriElhPGIQiqbnqkWhIa4l7CL2gjDO8AzKvOYJMcuCB4dijikisPExsk0JYQkNy4barEJGaKLWBJ17UnRYEsJgrYNPJhiKRGcHRBhxxmkcPgpLqSYIiaviOHGGxaC4mRJrqokWb+Tr-gOQEelyPIMnyAq+sojEuRqSyIhQqYJhcriEdGuzOJmGEUM4lwXM4KRoukJnRVJt50vFQ6oCBY4YJlS6uQgBquHGyJeAaZrWJxNzlR4cZ+HEhK2L4wTwk1jotfeVaDk2PXMVERKDVCRp6gaMbGhEkL6pVVW1XEaTrKkHgrX023KTEyIUJ5uzBLcOIeP5Z0sdY+3XIi6EbtG9jQqRORAA */
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
                Submit: {
                  target: "Saving todo",
                },
              },
            },
            "Saving todo": {
              invoke: {
                src: "saveTodo",
                onError: [
                  {
                    target: "Showing form input",
                    actions: "assignErrorToContext",
                  },
                ],
                onDone: [
                  {
                    target: "#Todo machine.Loading Todos",
                  },
                ],
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
