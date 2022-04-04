import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';

import { BsHouse, BsInfoCircle, BsGear, BsPower } from 'react-icons/bs';

export default function Sidebar() {
  const handleLogout = (e: any) => {
    e.preventDefault();
    Router.push('/api/users/logout');
  };

  return (
    <>
      <div className="logo font-extrabold">
        <Image className="mx-auto h-12 w-auto" priority={true} src="/workflow.svg" height="30px" width="32px" alt="Workflow" />
        <span>Next.js</span>
      </div>
      <div className="menu">
        <Link href="/">
          <a className="menu__link">
            <BsHouse />
            <p>Dashboard</p>
          </a>
        </Link>
        <Link href="/profile">
          <a className="menu__link">
            <BsInfoCircle />
            <p>Profile</p>
          </a>
        </Link>
        <Link href="/logout">
          <a className="menu__link" onClick={handleLogout}>
            <BsPower />
            <p>Logout</p>
          </a>
        </Link>
      </div>
    </>
  );
}
