import { AppRoutes } from "./router";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer theme="colored" draggable autoClose={2000} />
      
    </>
  );
}
