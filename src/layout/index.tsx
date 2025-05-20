import { FC } from "react"
import { Outlet } from 'react-router-dom';
import Header from "./header";
// import Love from "@/components/love";
// import Three from "@/components/three";
// import s from './index.module.less'

const Layout:FC = () => {
  return <div>
    <Header/>
    {/* <Love/> */}
    {/* <Three/> */}
    <Outlet/>
  </div>
}

export default Layout