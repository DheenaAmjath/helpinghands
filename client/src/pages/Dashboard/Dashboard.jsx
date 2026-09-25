import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { dashboardAPI } from '../../services/api.js'
import Loading from '../../components/common/Loading.jsx'
import PageLayout from '../../components/dashboard/PageLayout.jsx'
import { Link, Navigate } from 'react-router-dom'

export default function Dashboard() {
  const {user}=useAuth()
  const [data,setData]=useState(null)
  const [error,setError]=useState('')
  useEffect(()=>{dashboardAPI.get().then(({data})=>setData(data)).catch(()=>setError('Could not load your dashboard.'))},[])
  if(user.role==='admin') return <Navigate to="/admin" replace/>
  const requester=user.role==='requester'
  const community=user.role==='community'
  const donor=user.role==='donor'
  const description=donor?'Browse verified needs and track the help you have offered.':community?'Submit and track genuine needs on behalf of your community.':'Submit and track your help requests.'
  const action=!donor?<Link className="button" to="/my-requests?new=true">{community?'Submit community need':'Request help'}</Link>:null
  return <PageLayout eyebrow="TRUSTED COMMUNITY GIVING" title={`Welcome back, ${user.name.split(' ')[0]}.`} description={description} actions={action}>{error?<div className="message error">{error}</div>:!data?<Loading/>:<><div className="metrics">{donor&&<article><span>♡</span><strong>{data.donations}</strong><small>My donations</small></article>}{!donor&&<article><span>◇</span><strong>{data.requests}</strong><small>{community?'Community requests':'My requests'}</small></article>}<article><span>✓</span><strong>{data.verifiedNeeds}</strong><small>Verified needs</small></article>{donor&&<article><span>↗</span><strong>{data.matches}</strong><small>Active matches</small></article>}<article><span>◉</span><strong>{data.unreadNotifications}</strong><small>Unread notifications</small></article></div><div className="quick-links">{donor&&<><Link to="/available-needs"><strong>Find someone to help</strong><span>Browse verified community needs →</span></Link><Link to="/my-donations"><strong>My donations</strong><span>Track offers and handovers →</span></Link></>}{(requester||community)&&<><Link to="/my-requests"><strong>{community?'Community requests':'Manage help requests'}</strong><span>Create, edit or track a request →</span></Link>{requester&&<Link to="/available-needs"><strong>Available needs</strong><span>View verified community needs →</span></Link>}</>}<Link to="/notifications"><strong>Notifications</strong><span>{data.unreadNotifications} unread update{data.unreadNotifications===1?'':'s'} →</span></Link></div></>}</PageLayout>
}
