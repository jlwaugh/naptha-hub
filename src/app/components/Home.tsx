import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Welcome to the Naptha Hub!</h1>
        <p className="text-xl text-gray-600 mb-2">Use this dashboard to view our agents and nodes.</p>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Sign Up</h2>
          </div>
          <div className="bg-green-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Login</h2>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
