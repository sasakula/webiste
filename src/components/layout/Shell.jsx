// Shell layout: TopBar di atas, sidebar nav di kiri, halaman router di kanan.
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import SideNav from './SideNav.jsx';

export default function Shell() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden grid-bg">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <SideNav />
        <main className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
