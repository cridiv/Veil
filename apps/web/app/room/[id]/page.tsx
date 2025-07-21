"use client";
import React from "react";

const page = () => {
  const username = localStorage.getItem("tempUserName");
  const userName = username ? username : "Guest";
  return (
    <div>
      <h1>Room page</h1>
      <p>Hi {userName}, welcome to this room </p>
    </div>
  );
};

export default page;
