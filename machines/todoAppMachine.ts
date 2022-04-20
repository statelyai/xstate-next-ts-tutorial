import { createMachine } from "xstate";

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAIC2BDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALqJQAB1nFV6-SAAeiALQBGAExaKATmcAWABy2AzF+cB2WzdbABoQAE8bB2cKe3cvNy1vWy0ANh8AXwywoRwCEk4JelJGITYwACcK1AqKAwAbFQAzGuwKXJEC8Vpi0pk5BSVTTV1zI1gTNVJzKwQ7Rxd4nz9A4LDIudSnbyTnHzdPAFY3f0P7LOyQUnQ4cw78sWoeqTKx42GZm28dik9gxK09kS-jcqXWUQOFAcHmch0OWnhbns9n8-iyORkeVEnDKmCKkDeEw+SEsiFcFFOqRRzg8Wy0SX83nBcx8hwoHnpgUCqX8CI8h1S6JA92x3UkJUwyn6mEq1QqBJJ40mZhJs389govi0tM5NJ2WmczOsqVSmoNXlShw8bmOJ2cQpFXUJyumqq+x1+1qC9KBWhBYIiNnstn8UNsNMcgQ8lNsgouQA */
  createMachine({
    tsTypes: {} as import("./todoAppMachine.typegen").Typegen0,
    schema: {
      // events: {} as
      //   | { type: "Todos loaded"; todos: string[] }
      //   | { type: "Loading todos failed"; errorMessage: string },
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
              target: "Todos Loaded",
            },
          ],
          onError: [
            {
              target: "Loading todos errored",
            },
          ],
        },
      },
      "Todos Loaded": {},
      "Loading todos errored": {},
    },
  });
