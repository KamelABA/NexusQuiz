import mongoose from 'mongoose'

const ScoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    classNumber: { type: String, required: false, trim: true, maxlength: 50 },
    code: { type: String, required: true, trim: true, maxlength: 50 },
    score: { type: Number, required: true, min: 0 },
    durationMs: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

ScoreSchema.index({ score: -1, durationMs: 1, createdAt: 1 })

export default mongoose.model('Score', ScoreSchema)


