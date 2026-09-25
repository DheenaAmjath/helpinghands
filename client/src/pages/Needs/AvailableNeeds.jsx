import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../../components/dashboard/PageLayout.jsx'
import NeedCard from '../../components/needs/NeedCard.jsx'
import SearchBar from '../../components/common/SearchBar.jsx'
import FilterBar from '../../components/common/FilterBar.jsx'
import Loading from '../../components/common/Loading.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { needsAPI } from '../../services/api.js'

export default function AvailableNeeds(){const [needs,setNeeds]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [search,setSearch]=useState('');const [category,setCategory]=useState('');useEffect(()=>{needsAPI.list().then(({data})=>setNeeds(data.needs||[])).catch(()=>setError('Could not load verified needs.')).finally(()=>setLoading(false))},[]);const categories=useMemo(()=>['',...new Set(needs.map(need=>need.category))],[needs]);const filtered=needs.filter(need=>(!category||need.category===category)&&`${need.title} ${need.description} ${need.location}`.toLowerCase().includes(search.toLowerCase()));return <PageLayout eyebrow="HELP WHERE IT MATTERS" title="Available needs" description="Browse community-reviewed requests. Exact addresses and private details remain protected."><div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search needs"/><FilterBar value={category} onChange={setCategory} options={categories} label="Category"/></div>{loading?<Loading/>:error?<div className="message error">{error}</div>:filtered.length?<div className="needs-grid">{filtered.map(need=><NeedCard key={need._id} need={need}/>)}</div>:<EmptyState title="No matching needs" message="Try another search or category."/>}</PageLayout>}
