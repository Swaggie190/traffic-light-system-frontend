import { BrowserRouter, Routes, Route } from "react-router-dom";

function TestApp() {
  return (
    <BrowserRouter>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Traffic Light Control System
        </h1>
        <p className="text-gray-600 mt-2">System is loading...</p>
        <Routes>
          <Route
            path="/"
            element={
              <div className="mt-4 p-4 bg-green-100 rounded">
                Dashboard Test Page
              </div>
            }
          />
          <Route
            path="*"
            element={
              <div className="mt-4 p-4 bg-red-100 rounded">Page Not Found</div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default TestApp;
