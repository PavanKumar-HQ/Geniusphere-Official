import mongoose from 'mongoose';

const videoTestimonialSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    quote: String,
    author: String,
    role: String,
    category: { type: String, enum: ['Student', 'Parent', 'Teacher', 'School'] },
    videoThumbnail: String,
    videoUrl: String,
    flagCode: String
}, {
    timestamps: true
});

export default mongoose.model('VideoTestimonial', videoTestimonialSchema);
