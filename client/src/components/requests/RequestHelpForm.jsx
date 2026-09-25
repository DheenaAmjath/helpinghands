import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'
import Input from '../common/Input.jsx'

const blank={title:'',description:'',category:'',location:'',urgency:'Medium',quantityNeeded:1}
export default function RequestHelpForm({initialValue,onSubmit,onCancel,saving=false}){
  const [form,setForm]=useState(blank)
  const [supportingProofs,setSupportingProofs]=useState([])
  const [proofError,setProofError]=useState('')
  useEffect(()=>{setForm(initialValue?{...blank,...initialValue}:blank);setSupportingProofs([]);setProofError('')},[initialValue])
  const set=(key,value)=>setForm(current=>({...current,[key]:value}))
  const selectProofs=event=>{const files=Array.from(event.target.files||[]);if(files.length>3){setProofError('You can attach up to 3 files.');setSupportingProofs(files.slice(0,3))}else{setProofError('');setSupportingProofs(files)};event.target.value=''}
  const removeProof=index=>setSupportingProofs(files=>files.filter((_,fileIndex)=>fileIndex!==index))
  return <form className="stack-form" onSubmit={event=>{event.preventDefault();if(!initialValue&&!supportingProofs.length){setProofError('Please upload at least one supporting proof document.');return}setProofError('');onSubmit({...form,quantityNeeded:Number(form.quantityNeeded),supportingProofs})}}>
    <Input label="What is needed?" required maxLength="120" value={form.title} onChange={event=>set('title',event.target.value)}/>
    <label className="field"><span>Description</span><textarea required maxLength="1500" value={form.description} onChange={event=>set('description',event.target.value)}/></label>
    <div className="form-grid"><Input label="Category" required maxLength="60" value={form.category} onChange={event=>set('category',event.target.value)}/><Input label="Approximate location" required maxLength="100" value={form.location} onChange={event=>set('location',event.target.value)}/><Input label="Quantity" type="number" min="1" max="10000" required value={form.quantityNeeded} onChange={event=>set('quantityNeeded',event.target.value)}/><label className="field"><span>Urgency</span><select value={form.urgency} onChange={event=>set('urgency',event.target.value)}>{['Low','Medium','High','Critical'].map(value=><option key={value}>{value}</option>)}</select></label></div>
    {!initialValue&&<label className="field"><span>Supporting Proof</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple onChange={selectProofs}/><small>Required · PDF, JPG or PNG · Up to 3 files · 5 MB each</small></label>}
    {proofError&&<div className="message error">{proofError}</div>}
    {!initialValue&&supportingProofs.length>0&&<div className="record-list">{supportingProofs.map((file,index)=><article key={`${file.name}-${file.lastModified}-${index}`}><small>{file.name}</small><Button className="secondary" type="button" onClick={()=>removeProof(index)}>Remove</Button></article>)}</div>}
    <div className="form-actions"><Button disabled={saving}>{saving?'Saving…':initialValue?'Save changes':'Submit for verification'}</Button>{onCancel&&<Button className="secondary" type="button" onClick={onCancel}>Cancel</Button>}</div>
  </form>
}
