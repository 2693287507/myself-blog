import React from "react"
import { useRoutes } from 'react-router-dom'
import Layout from '../layout/index';

export type RouterType = {
  path: string;
  element: React.ReactNode;
  root?: string[];
  children?: RouterType[];
  notExect?: boolean;
};

const routes: RouterType[] = [
  {
    path: '/',
    element: <Layout />,
  }
]

export const Router = () => {
  return useRoutes(routes)
}