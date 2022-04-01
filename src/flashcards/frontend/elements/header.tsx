import { StoreContext } from "flashcards/frontend/store";
import { logout } from "flashcards/frontend/user/actions";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

export default observer(function () {
  const store = useContext(StoreContext);
  const { user } = store.userStore;

  return (
    <header className="bg-gray-100 text-xs">
      <div className="container mx-auto sm:flex p-4  sm:justify-between sm:items-center sm:px-4 sm:py-3 flex justify-between w-full">
        <ul className="flex items-center justify-between space-x-1.5">
          <li>
            <NavLink to="/">Front page</NavLink>
          </li>
          <li>
            <NavLink to="/overview">Flashcards</NavLink>
          </li>
        </ul>

        <div className="flex">
          {user ? (
            <div className="flex items-center space-x-1.5">
              <span>
                Logged in as <b>{user.username}</b>
              </span>
              <button type="submit" className="btn btn-xs" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <ul>
              <li>
                <NavLink to="/signup">Sign up</NavLink>
              </li>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
});
