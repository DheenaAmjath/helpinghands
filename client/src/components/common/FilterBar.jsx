export default function FilterBar({value,onChange,options,label='Filter'}) {
  return <label className="filter-bar"><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value)}>{options.map(option=><option key={option} value={option}>{option||'All'}</option>)}</select></label>
}
