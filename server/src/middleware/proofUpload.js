import multer from 'multer'
import { MAX_PROOF_FILES, MAX_PROOF_SIZE } from '../services/proofStorage.js'

const upload=multer({storage:multer.memoryStorage(),limits:{files:MAX_PROOF_FILES,fileSize:MAX_PROOF_SIZE}}).array('supportingProofs',MAX_PROOF_FILES)

export function uploadSupportingProofs(req,res,next) {
  upload(req,res,error=>{
    if(!error)return next()
    if(error.code==='LIMIT_FILE_SIZE')return res.status(413).json({message:'Each supporting proof file must be 5 MB or smaller.'})
    if(['LIMIT_FILE_COUNT','LIMIT_UNEXPECTED_FILE'].includes(error.code))return res.status(400).json({message:'You can attach up to 3 supporting proof files.'})
    return next(error)
  })
}
