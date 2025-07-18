import React from "react";
import Link from "next/link";
import Image from "next/image";

const DashboardNav = () => {
  return (
    <div>
      <div className="navbar bg-stone-100 text-black shadow-sm">
        <div className="flex-1">
          <Link
            href="/dashboard"
            className="btn text-purple-600 btn-ghost text-xl"
          >
            Veil
          </Link>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="input border-[2px] border-gray-500 rounded-full input-bordered w-24 md:w-auto"
          />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  alt="User Avatar"
                  src="/avatar.svg"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white text-gray-900 rounded-[15px] z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between text-[14px] hover:text-purple-700">
                  Profile
                </a>
              </li>
              <div className="my-1 border-t border-gray-200"></div>
              <li>
                <a className="text-[14px] hover:text-purple-700">Settings</a>
              </li>
              <div className="my-1 border-t border-gray-200"></div>
              <li>
                <a className="text-[14px] hover:text-red-700">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
