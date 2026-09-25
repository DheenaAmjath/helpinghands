export default function VerificationBadge({status = 'Verified'}) { return <span className={`badge ${status.toLowerCase().replaceAll(' ','-')}`}>✓ {status}</span> }
