import { Link, useLocation } from 'react-router-dom'
import Modal from '../common/Modal.jsx'
export default function LoginPromptModal({onClose}) { const location=useLocation();return <Modal title="Join Helping Hands" onClose={onClose} actions={<><Link className="button" to="/login" state={{from:location,authenticationRequired:true}}>Login</Link><Link className="button secondary" to="/register" state={{from:location}}>Register</Link></>}><p>Log in or create an account to offer help and coordinate safely.</p></Modal> }
