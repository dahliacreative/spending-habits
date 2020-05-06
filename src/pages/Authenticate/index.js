import { useAuth } from "../../context/auth";
import qs from "query-string";
import api from "../../api";

const Authenticate = ({ history, location }) => {
  const { setUser } = useAuth();
  const { code, state } = qs.parse(location.search);
  const stateId = localStorage.getItem("stateId");
  if (state === stateId) {
    localStorage.removeItem("stateId");
    const formData = new URLSearchParams();
    formData.set("grant_type", "authorization_code");
    formData.set("client_id", process.env.REACT_APP_CLIENT_ID);
    formData.set("client_secret", process.env.REACT_APP_CLIENT_SECRET);
    formData.set("redirect_uri", process.env.REACT_APP_REDIRECT);
    formData.set("code", code);
    api.post("/oauth2/token", formData.toString()).then((res) => {
      api.defaults.headers.common = {
        Authorization: `Bearer ${res.data.access_token}`,
      };
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      history.replace("/");
    });
  } else {
    history.replace("/");
  }

  return null;
};

export default Authenticate;
