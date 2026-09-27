import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import App from "./App";
import { store } from "./apps/pages/store/store";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </Provider>
);