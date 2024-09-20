import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./router/router";

function App() {
  return <RouterProvider router={browserRouter} />;
}

export default App;
