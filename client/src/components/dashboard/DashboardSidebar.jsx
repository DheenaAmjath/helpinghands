import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const roleLinks = {
  requester: [['/dashboard','Overview'],['/available-needs','Available needs'],['/my-requests','My requests'],['/my-requests?new=true','Request help'],['/profile','Profile'],['/notifications','Notifications'],['/settings','Settings']],
  donor: [['/dashboard','Overview'],['/available-needs','Available needs'],['/my-donations','My donations'],['/profile','Profile'],['/notifications','Notifications'],['/settings','Settings']],
  community: [['/dashboard','Overview'],['/my-requests','Community requests'],['/my-requests?new=true','Submit community need'],['/profile','Profile'],['/notifications','Notifications'],['/settings','Settings']],
  admin: [['/admin','Admin dashboard'],['/admin/users','Manage users'],['/admin/requests','Manage requests'],['/admin/verifications','Manage verification'],['/admin/reports','Reports']],
}

export function isSidebarLinkActive(to,pathname,search,isActive=false){const requestHelpActive=(pathname==='/my-requests'&&new URLSearchParams(search).get('new')==='true')||pathname==='/my-requests/new';if(to==='/my-requests')return pathname==='/my-requests'&&!requestHelpActive;if(to==='/my-requests?new=true')return requestHelpActive;return isActive}

export default function DashboardSidebar(){const {user}=useAuth();const {pathname,search}=useLocation();const links=roleLinks[user.role]||[];return <aside className="dashboard-sidebar" aria-label="Account navigation">{links.map(([to,label])=><NavLink key={to} to={to} end={to==='/admin'} className={({isActive})=>isSidebarLinkActive(to,pathname,search,isActive)?'active':''}>{label}</NavLink>)}</aside>}
