import React, { FC } from "react"
import { Outlet } from 'react-router-dom';
import s from './index.module.less'

const Layout:FC = () => {
  return <div>
    <Outlet/>
  </div>
}

export default Layout