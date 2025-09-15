import React from "react";
import "./Cta.scss";
import { DecoratedHeader } from "../DecoratedHeader/DecoratedHeader.jsx";
import { LargeBtn } from "../LargeBtn/LargeBtn.jsx";

export function Cta() {
  return (
    <div className="Cta">
      <DecoratedHeader
        text1={`Start helping!`}
        text2={`Give away unwanted things with confidence`}
      />
     <div className="Cta-btns">
  <LargeBtn text={`GIVE AWAY`} link={`/give-away`} />
  <LargeBtn text={`DONATE NOW`} link={`https://rzp.io/rzp/EhCRHWiD`} target="_blank" />
</div>

    </div>
  );
}
