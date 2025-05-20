import { FC, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import c from 'classnames'
import s from './index.module.less'

type HeaderActions = {
  value: string;
  label: string;
}

const Header:FC = () => {
  const actions:HeaderActions[] = [{
    value: 'ai',
    label: 'AI'
  }, {
    value: 'love',
    label: 'Love'
  },
  {
    value: 'three',
    label: 'Three'
  },{
    value: 'home',
    label: '首页'
  }, {
    value: 'personal',
    label: '个人中心'
  }]
  const [active, setActive] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    
  }, [])

  const clickHeader = (e:HeaderActions) => {
    setActive(e.value)
    navigate(`/${e.value}`)
  }

  return <div className={s['header-wrapper']}>
    <div className={s['header-actions']}>
      {
        actions.map(e => <div className={c({
          [s['header-item']]: true,
          [s['is-active']]: active === e.value
        })} key={e.value} onClick={() => clickHeader(e)}>
          { e.label }
        </div>)
      }
    </div>
  </div>
}
export default Header
