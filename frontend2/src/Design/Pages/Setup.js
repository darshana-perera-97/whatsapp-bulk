import React from "react";
import State from "../Components/State";
import Counter from "../Components/Counter";
import SingleMessage from "../Components/SingleMessage";
import WhatsAppWindow from "../Layouts/WhatsAppWindow";
export default function Setup() {
  return (
    <div>
      {/* <State /> */}
      <Counter />
      <SingleMessage />
      {/* <WhatsAppWindow /> */}
    </div>
  );
}
