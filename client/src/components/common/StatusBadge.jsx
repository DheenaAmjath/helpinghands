export default function StatusBadge({status='Pending'}) {
  return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ','-')}`}>{status}</span>
}
