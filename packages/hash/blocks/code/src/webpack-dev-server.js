/**
 * This is the entry point for developing and debugging.
 * This file is not bundled with the library during the build process.
 */
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Component from "./index.ts";

import { tw } from "twind";

const node = document.getElementById("app");

const initialData = {
  content: 'var foo = "bar";',
  language: "javascript",
  caption: "",
};

const App = () => {
  const [data, setData] = useState(initialData);

  const updateData = async (actions) => {
    // do something with the data
    const newData = actions[0].data;

    setTimeout(() => setData(newData), 500);
  };

  return (
    <div className={tw`mx-auto mt-14 max-w-3xl`}>
      <Component
        entityTypeId={"code"}
        entityId={"entity-code"}
        accountId={"account-code"}
        update={updateData}
        {...data}
      />
    </div>
  );
};

ReactDOM.render(<App />, node);
