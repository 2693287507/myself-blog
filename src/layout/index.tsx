import { FC } from "react"
import { Outlet } from 'react-router-dom';
import Header from "./header";
// import s from './index.module.less'

const Layout:FC = () => {
  return <div>
    <Header/>
    <Outlet/>
  </div>
}

export default Layout