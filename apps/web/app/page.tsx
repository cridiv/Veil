import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Tailwind CSS and DaisyUI Test</h1>
      <button className="btn btn-primary mb-4">Primary Button</button>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>This is a card component from DaisyUI!</p>
          <div className="card-actions justify-end">
            <button className="btn btn-accent">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
