// Shell layout: TopBar di atas, sidebar nav default di kiri, halaman router di kanan.
//
// /owner punya sidebar khusus (OwnerSidebar di dalam OwnerDashboard), jadi
// di route itu kita sembunyikan SideNav generik supaya tidak double sidebar.
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import SideNav from './SideNav.jsx';

export default function Shell() {
  const location = useLocation();
  const hideDefaultNav = location.pathname.startsWith('/owner');

  return (
    <div className="h-full w-full flex flex-col overflow-hidden grid-bg">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        {hideDefaultNav ? null : <SideNav />}
        <main className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
