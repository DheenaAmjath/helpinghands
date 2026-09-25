import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/dashboard/PageLayout.jsx'
import Loading from '../../components/common/Loading.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import { notificationsAPI } from '../../services/api.js'
export default function Notifications(){const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const load=()=>notificationsAPI.list().then(({data})=>setItems(data.notifications||[])).catch(()=>setError('Could not load notifications.')).finally(()=>setLoading(false));useEffect(()=>{load()},[]);const readAll=async()=>{await notificationsAPI.readAll();setItems(current=>current.map(item=>({...item,read:true})))};return <PageLayout eyebrow="UPDATES" title="Notifications" actions={items.some(item=>!item.read)&&<Button className="secondary" onClick={readAll}>Mark all read</Button>}>{error&&<div className="message error">{error}</div>}{loading?<Loading/>:items.length?<div className="notification-list">{items.map(item=><article className={item.read?'':'unread'} key={item._id}><div><strong>{item.title}</strong><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString()}</small></div>{item.link&&<Link to={item.link} onClick={()=>notificationsAPI.read(item._id)}>View →</Link>}</article>)}</div>:<EmptyState title="You are all caught up" message="Updates about your requests and offers will appear here."/>}</PageLayout>}
