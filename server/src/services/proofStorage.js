import { randomUUID } from 'node:crypto'
import { access, mkdir, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fileTypeFromBuffer } from 'file-type'
import httpError from '../utils/httpError.js'

export const MAX_PROOF_FILES = 3
export const MAX_PROOF_SIZE = 5 * 1024 * 1024

const proofRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../private/proofs')
const allowedTypes = new Map([
  ['application/pdf','pdf'],
  ['image/jpeg','jpg'],
  ['image/png','png'],
])

const safeDisplayName = name => basename(name || 'supporting-proof').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,180) || 'supporting-proof'

export async function storeSupportingProofs(files,needId) {
  if(!files?.length)return []
  if(files.length>MAX_PROOF_FILES)throw httpError(400,'You can attach up to 3 supporting proof files.')
  const directory=resolve(proofRoot,String(needId))
  await mkdir(directory,{recursive:true,mode:0o700})
  const proofs=[]
  try {
    for(const file of files){
      if(!Buffer.isBuffer(file.buffer)||file.buffer.length===0)throw httpError(400,'Supporting proof files cannot be empty.')
      if(file.buffer.length>MAX_PROOF_SIZE)throw httpError(413,'Each supporting proof file must be 5 MB or smaller.')
      const detected=await fileTypeFromBuffer(file.buffer)
      const extension=allowedTypes.get(detected?.mime)
      if(!extension)throw httpError(400,'Supporting proof must be a PDF, JPG, or PNG file.')
      const storageKey=`${needId}/${randomUUID()}.${extension}`
      await writeFile(resolve(proofRoot,storageKey),file.buffer,{flag:'wx',mode:0o600})
      proofs.push({originalName:safeDisplayName(file.originalname),storageKey,mimeType:detected.mime,size:file.buffer.length})
    }
    return proofs
  } catch(error) {
    await rm(directory,{recursive:true,force:true})
    throw error
  }
}

export async function removeStoredProofs(needId) {
  await rm(resolve(proofRoot,String(needId)),{recursive:true,force:true})
}

export function resolveStoredProof(storageKey) {
  const filePath=resolve(proofRoot,storageKey)
  if(!filePath.startsWith(`${proofRoot}${sep}`))throw httpError(404,'Supporting proof not found.')
  return filePath
}

export async function storedProofIsAvailable(proof) {
  if(!proof||!allowedTypes.has(proof.mimeType)||!Number.isInteger(proof.size)||proof.size<1||proof.size>MAX_PROOF_SIZE)return false
  try {await access(resolveStoredProof(proof.storageKey));return true} catch {return false}
}
