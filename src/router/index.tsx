import React from "react"
import { useRoutes } from 'react-router-dom'
import Layout from '../layout/index';
import Home from '@/pages/home';
import Personal from '@/pages/personal';
import Love from '@/components/love';
import Three from '@/components/three';
import AI from '@/components/ai';

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
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/personal',
        element: <Personal/>
      },
      {
        path: '/love',
        element: <Love/>
      },
      {
        path: '/three',
        element: <Three/>
      },
      {
        path: '/ai',
        element: <AI/>
      },
    ]
  }
]

export const Router = () => {
  return useRoutes(routes)
}