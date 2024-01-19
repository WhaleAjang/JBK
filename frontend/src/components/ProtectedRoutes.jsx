import { Navigate, Outlet } from "react-router-dom"

//로그인이 필요한 페이지에 비회원이 들어가려할 때 redirect해야됨
const ProtectedRoutes = ({isAuth}) => {
  return (
      isAuth ? <Outlet /> : <Navigate to = {'/login'}/>
    )
}

export default ProtectedRoutes