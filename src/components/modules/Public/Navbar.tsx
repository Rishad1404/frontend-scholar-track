import { getUserInfo } from "@/services/auth.services";
import NavbarContent from "./NavbarContent";

const Navbar = async () => {
  const userInfo = await getUserInfo();

  return <NavbarContent userInfo={userInfo} />;
};

export default Navbar;