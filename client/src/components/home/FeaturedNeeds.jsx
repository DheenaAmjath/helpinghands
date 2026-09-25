import { useEffect, useState } from 'react'
import { needsAPI } from '../../services/api.js'
import Loading from '../common/Loading.jsx'
import NeedCard from '../needs/NeedCard.jsx'

export default function FeaturedNeeds() {
  const [needs,setNeeds] = useState([]); const [loading,setLoading] = useState(true); const [error,setError] = useState('')
  useEffect(() => { needsAPI.list().then(({data}) => setNeeds(Array.isArray(data.needs) ? data.needs : [])).catch(() => setError('Verified needs are temporarily unavailable.')).finally(() => setLoading(false)) }, [])
  return <section className="section tinted" id="needs"><div className="section-heading"><p className="eyebrow">COMMUNITY-REVIEWED REQUESTS</p><h2>Verified needs</h2><p>Only approximate locations are public. Sensitive personal details remain protected.</p></div>{loading ? <Loading/> : error ? <div className="message error">{error}</div> : needs.length ? <div className="needs-grid">{needs.slice(0,3).map(need => <NeedCard key={need._id} need={need}/>)}</div> : <div className="message">No verified needs available right now.</div>}</section>
}
