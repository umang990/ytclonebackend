import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: Number, default: 0 },
    views: { type: Number, default: 0, }, 
    isPublished: { type: Boolean, default: true, },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }
    // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
    // dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
    
    // category: { type: String, default: "General", index: true },
    // tags: [{ type: String, index: true }],
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", index: true }],
    // playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist", index: true }],
    // reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report", index: true }],
    // scheduledPublish: { type: Date, index: true },
    // ageRestriction: { type: Number, default: 0 },
    // language: { type: String, default: "English", index: true },
    // subtitles: [
    //   {
    //     language: String,
    //     url: String,
    //   },
    // ],
    // monetization: {
    //   isMonetized: { type: Boolean, default: false, index: true },
    //   adRevenue: { type: Number, default: 0 },
    // },
    // analytics: {
    //   dailyViews: [
    //     {
    //       date: Date,
    //       views: Number,
    //       index: true,
    //     },
    //   ],
    //   watchTime: { type: Number, default: 0 },
    // },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);
