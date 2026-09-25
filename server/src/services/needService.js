import Need from '../models/Need.js'

const publicFields = {
  title: 1,
  description: 1,
  category: 1,
  location: 1,
  urgency: 1,
  quantityNeeded: 1,
  quantityFulfilled: 1,
  verificationStatus: 1,
  createdAt: 1,
}

export function findPublicVerifiedNeeds() {
  return Need.find({verificationStatus: 'Verified'})
    .select(publicFields)
    .sort({createdAt: -1})
    .limit(100)
    .lean()
}
