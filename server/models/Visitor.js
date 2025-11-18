import mongoose from 'mongoose'

const VisitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    userAgent: { type: String, required: false },
  },
  { timestamps: true }
)

VisitorSchema.index({ createdAt: -1 })

export default mongoose.model('Visitor', VisitorSchema)

