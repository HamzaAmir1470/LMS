import mongoose, { Model, Schema, Document } from "mongoose";

interface IComment extends Document {
  user: object;
  comment: string;
  commentReplies: IComment[];
}

interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Object,
  },
  rating: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
  },
  commentReplies: [
    {
      type: Object,
    },
  ],
});

const linkSchema = new Schema<ILink>({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
});

const commentSchema = new Schema<IComment>({
  user: {
    type: Object,
  },
  comment: {
    type: String,
  },
  commentReplies: [
    {
      type: Object,
    },
  ],
});

const courseDataSchema = new Schema<ICourseData>({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  videoSection: {
    type: String,
  },
  videoLength: {
    type: Number,
  },
  videoPlayer: {
    type: String,
  },
  links: [linkSchema],
  suggestion: {
    type: String,
  },
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [
    {
      title: {
        type: String,
      },
    },
  ],
  prerequisites: [
    {
      title: {
        type: String,
      },
    },
  ],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
});

const CourseModel: Model<ICourse> = mongoose.model<ICourse>(
  "Course",
  courseSchema,
);

export default CourseModel;
