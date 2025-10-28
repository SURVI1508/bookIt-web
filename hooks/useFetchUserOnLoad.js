import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "~/lib/redux/slice/auth-slice";

export const useFetchUserOnLoad = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.name && token) {
      dispatch(fetchUserDetails(token));
    }
  }, [token, dispatch]);
};
