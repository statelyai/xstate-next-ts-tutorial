import { useMachine } from "@xstate/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { myMachine } from "../machines/myFirstMachine";
import { todosMachine } from "../machines/todoAppMachine";

const Home: NextPage = () => {
  const [state, send] = useMachine(todosMachine, {
    services: {
      loadTodos: async () => {
        throw new Error("Oh noooooo");
        return ["Take bins out", "Do laundry"];
      },
    },
  });

  return (
    <div>
      <pre>{JSON.stringify(state.value)}</pre>
      <pre>{JSON.stringify(state.context)}</pre>
    </div>
  );
};

export default Home;
