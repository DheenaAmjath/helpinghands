export default function SearchBar({value,onChange,placeholder='Search'}) {
  return <label className="search-bar"><span className="sr-only">{placeholder}</span><input value={value} onChange={event=>onChange(event.target.value)} placeholder={placeholder}/></label>
}
