import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

function SimpleApp() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Traffic Light Control System
          </h1>
          <p className="text-gray-600 mt-2">Simple version loading...</p>
          <Routes>
            <Route
              path="/"
              element={
                <div className="mt-4 p-4 bg-green-100 rounded">
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                  <p>Basic dashboard without complex components</p>
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="mt-4 p-4 bg-red-100 rounded">
                  Page Not Found
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default SimpleApp;
