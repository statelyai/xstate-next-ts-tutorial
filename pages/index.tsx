import { useMachine } from "@xstate/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { myMachine } from "../machines/myFirstMachine";

const Home: NextPage = () => {
  const [state, send] = useMachine(myMachine);

  return (
    <div>
      {JSON.stringify(state.value)}
      <button
        onClick={() => {
          send("MOUSEOVER");
        }}
      >
        Mouse over
      </button>
      <button
        onClick={() => {
          send("MOUSEOUT");
        }}
      >
        Mouse out
      </button>
    </div>
  );
};

export default Home;
