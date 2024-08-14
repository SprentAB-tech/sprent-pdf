import React, { useState, useEffect } from "react";

function App() {
  const [id, setId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get("id");
    if (urlId) {
      setId(urlId);
      submitForm(urlId);
    }
    const storedPassword = localStorage.getItem("adminPassword");
    if (storedPassword) {
      setAdminPassword(storedPassword);
    }
  }, []);

  const submitForm = async (submittedId) => {
    try {
      const response = await fetch(
        `/api/getHousing?id=${submittedId}&adminPassword=${adminPassword}`,
      );
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiResponse({ error: "Failed to fetch data" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm(id);
  };

  const handlePasswordChange = () => {
    const newPassword = prompt("Enter new admin password:");
    if (newPassword) {
      localStorage.setItem("adminPassword", newPassword);
      setAdminPassword(newPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <button
            onClick={handlePasswordChange}
            className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Set Admin Password
          </button>
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-semibold">Housing ID Lookup</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Housing ID
                    </label>
                    <input
                      type="text"
                      id="id"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </form>
              </div>
              {apiResponse && (
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h3 className="text-xl font-semibold">API Response:</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
