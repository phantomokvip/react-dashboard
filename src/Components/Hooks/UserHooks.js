import { useEffect, useState } from "react";
import { getToken } from "../../helpers/common";
import { useUserDetails } from "../../context/UserDetailContext";

const useProfile = () => {
  const { state } = useUserDetails();
  const token = getToken();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(state.userDetails);


  useEffect(() => {
    const token = getToken();
    setUserProfile(state.userDetails);
    setLoading(token ? false : true);
  }, [state.userDetails]);

  return { userProfile, loading, token };
};

export { useProfile };