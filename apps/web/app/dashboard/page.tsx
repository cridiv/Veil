import React from "react";

const page = () => {
  return (
    <div>
      <h1>Moderator dashboard</h1>
      <p>
        {" "}
        Welcome to the moderator dashboard. Here you can manage your room and
        users.
      </p>
      <p>
        name: <span> the user name </span>
      </p>
      <p>
        email: <span> the user email </span>
      </p>
      <p>
        id: <span> the user uid </span>
      </p>
    </div>
  );
};

export default page;
