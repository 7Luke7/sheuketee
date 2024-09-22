import mongoose, { Schema } from "mongoose";

const DisplayableSkillSchema = new mongoose.Schema({
  displaySkills: {
    type: String,
    default: null,
  },
  completedJobs: {
    type: Number,
    min: 0,
    default: 0,
  },
  reviews: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});

const SkillSchema = new mongoose.Schema(
  {
    parent: {
      type: Array,
      default: null,
      required: [true, "კატეგორია სავალდებულოა."],
    },
    child: {
      type: Array,
      default: null,
      required: [true, "კატეგორია სავალდებულოა."],
    },
    main: {
      type: Array,
      default: null,
      required: [true, "კატეგორია სავალდებულოა."],
    },
    displayableSkills: {
      type: [DisplayableSkillSchema],
      default: [],
    },
  },
  { timestamps: false, _id: false }
);

const ScheduleSchema = new mongoose.Schema(
  {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    day: { type: String, default: null },
  },
  { _id: false, timestamps: false }
);

const LocationSchema = new mongoose.Schema(
  {
    place_id: { type: Number, default: null },
    osm_type: { type: String, default: null },
    osm_id: { type: Number, default: null },
    lat: { type: String, default: null },
    lon: { type: String, default: null },
    display_name: { type: String, default: null },
    boundingbox: [{ type: String, default: null }],
    class: { type: String, default: null },
    type: { type: String, default: null },
    address: {
      house_number: { type: String, default: null },
      road: { type: String, default: null },
      neighbourhood: { type: String, default: null },
      suburb: { type: String, default: null },
      village: { type: String, default: null },
      hamlet: { type: String, default: null },
      isolated_dwelling: { type: String, default: null },
      city: { type: String, default: null },
      town: { type: String, default: null },
      municipality: { type: String, default: null },
      county: { type: String, default: null },
      state: { type: String, default: null },
      region: { type: String, default: null },
      postcode: { type: String, default: null },
      country: { type: String, default: null },
      country_code: { type: String, default: null },
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);

const ServicesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      minLength: 20,
      maxLength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    category: {
      type: Array,
      required: true,
    },
    location: [LocationSchema],
    availability: {
      type: [ScheduleSchema],
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Damkveti" },
        comment: {
          type: String,
          minLength: 10,
          maxLength: 500,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["ხელოსანი", "დამკვეთი"],
    },
    profId: {
      type: String,
      unique: true,
      required: [true, "პროფილის id სავალდებულოა."],
    },
    firstname: {
      type: String,
      trim: true,
      minlength: [1, "სახელი სავალდებულოა."],
      required: [true, "სახელი სავალდებულოა."],
    },
    lastname: {
      type: String,
      trim: true,
      minlength: [1, "გვარი სავალდებულოა."],
      required: [true, "გვარი სავალდებულოა."],
    },
    notificationDevices: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["ქალი", "კაცი"],
      default: undefined,
    },
    date: {
      type: Date,
      default: null,
      min: "1934-01-01",
    },
    phone: {
      type: String,
      unique: [true, "მომხმარებელი ტელეფონის ნომრით უკვე არსებობს."],
      default: undefined,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{9}$/.test(v);
        },
        message: "ტელეფონის ნომერი არასწორია.",
      },
    },
    email: {
      type: String,
      unique: [true, "მომხმარებელი მეილით უკვე არსებობს."],
      default: undefined,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "მეილი არასწორია.",
      },
    },
    password: {
      type: String,
      required: [true, "პაროლი სავალდებულოა."],
      minlength: [8, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."],
    },
    stepPercent: {
      type: Number,
      max: 108,
      min: 0,
      default: 0,
    },
    setupDone: {
      type: Boolean,
      default: false,
    },
    location: {
      type: LocationSchema,
      default: undefined,
    },
    about: {
      type: String,
      minlength: [75, "თქვენს შესახებ უნდა შეიცავდეს მინუმუმ 75 სიმბოლოს."],
      default: undefined,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

const XelosaniSchema = new mongoose.Schema({
  skills: {
    type: SkillSchema,
    default: undefined,
  },
  schedule: {
    type: [ScheduleSchema],
    default: undefined,
  },
  services: {
    type: [ServicesSchema],
    default: undefined,
  },
  workCount: {
    type: Number,
    default: null,
  },
  reviewCount: {
    type: Number,
    default: null,
  },
});

const DamkvetiSchema = new mongoose.Schema({
  jobs: [{ type: Schema.Types.ObjectId, ref: "JobPost" }],
});

export const Xelosani =
  User.discriminators && User.discriminators.Xelosani
    ? User.discriminators.Xelosani
    : User.discriminator("Xelosani", XelosaniSchema);

export const Damkveti =
  User.discriminators && User.discriminators.Damkveti
    ? User.discriminators.Damkveti
    : User.discriminator("Damkveti", DamkvetiSchema);

const jobMileStonesSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [1, "სათაური სავალდებულოა."],
    maxLength: [60, "ეტაპის სათაური უნდა შეიცავდეს მაქსიმუმ 60 ასოს."],
    default: undefined,
    required: [true, "ეტაპის სათაური სავალდებულოა."],
  },
  milestoneDisplayId: {
    type: String,
    sparse: true,
    required: [true, "დაფიქსირდა შეცდომა."],
  },
  description: {
    type: String,
    required: [true, "აეტაპის ღწერა სავალდებულოა."],
    maxLength: [600, "ეტაპის აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს."],
    default: undefined,
  },
  price: {
    type: Number,
    min: 1,
    default: 1,
  },
});

// Allow Premium Xelosani users to view all the bidders
const biddersSchema = new mongoose.Schema({
  bidder: { type: Schema.Types.ObjectId, ref: "Xelosani" },
  title: {
    type: String,
      minlength: [1, "სათაური სავალდებულოა."],
      maxLength: [100, "სათაური უნდა შეიცავდეს მაქსიმუმ 100 ასოს."],
      default: undefined,
      required: [true, "სათაური სავალდებულოა."],
  },
  description: {
    type: String,
    required: [true, "აღწერა სავალდებულოა."],
    maxLength: [1000, "აღწერა უნდა შეიცავდეს მაქსიმუმ 1000 ასოს."],
    default: undefined,
  },
  offerPrice: {
    type: Number,
    min: 1,
    default: 1,
  },
  mileStones: [jobMileStonesSchema]
})

const JobPostSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      required: [true, "publicId სავალდებულოა."],
    },
    _creator: { type: Schema.Types.ObjectId, ref: "Damkveti" },
    title: {
      type: String,
      minlength: [1, "სათაური სავალდებულოა."],
      maxLength: [100, "სათაური უნდა შეიცავდეს მაქსიმუმ 100 ასოს."],
      default: undefined,
      required: [true, "სათაური სავალდებულოა."],
    },
    description: {
      type: String,
      required: [true, "აღწერა სავალდებულოა."],
      maxLength: [1000, "აღწერა უნდა შეიცავდეს მაქსიმუმ 1000 ასოს."],
      default: undefined,
    },
    mileStones: {
      type: [jobMileStonesSchema],
      required: false,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
      default: 1,                                                                                                                                                                                             
    },
    location: {
      type: LocationSchema,
      default: undefined,
      required: [true, "ლოკაცია სავალდებულოა."],
    },
    categories: {
      type: Array,
      required: true,
    },
    bids: {
      type: [biddersSchema],
      default: undefined
    } ,                                              
  },
  { timestamps: true }
);             

export const JobPost =
  mongoose.models.JobPost || mongoose.model("JobPost", JobPostSchema);
