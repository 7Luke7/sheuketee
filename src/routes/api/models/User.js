import mongoose from "mongoose"

const SkillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: [true, "უნარის/სპეციალობის სახელი სავალდებულოა."]
  },
  completedJobs: {
    type: Number,
    min: 0,
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {timestamps: false, _id: false});

const LocationSchema = new mongoose.Schema({
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
      country_code: { type: String, default: null }
    },
}, {
    _id: false,
    timestamps: false
});

const ScheduleSchema = new mongoose.Schema({
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    day: {type: String, default: null}
}, {_id: false, timestamps: false})

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['ხელოსანი', 'დამკვეთი']
  },
  profId: {
    type: String,
    required: [true, "პროფილის id სავალდებულოა."]
  },
  firstname: {
    type: String,
    minlength: [1, "სახელი უნდა შეიცავდეს მინიმუმ 1 ასოს."],
    required: [true, "სახელი სავალდებულოა."]
  },
  lastname: {
    type: String,
    minlength: [1, "გვარი უნდა შეიცავდეს მინიმუმ 1 ასოს."],
    required: [true, "გვარი სავალდებულოა."]
  },
  notificationDevices: {
    type: [String],
    default: []
  },
  gender: {
    type: String,
    enum: ["ქალი", "კაცი"],
    default: undefined
  },
  date: {
    type: Date,
    default: null,
    min: '1934-01-01',
  },
  phone: {
    type: String,
    unique: [true, "მომხმარებელი ტელეფონის ნომრით უკვე არსებობს."],
    default: undefined,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v);
      },
      message: "ტელეფონის ნომერი არასწორია."
    }
  },
  email: {
    type: String,
    unique: [true, "მომხმარებელი მეილით უკვე არსებობს."],
    default: undefined,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "მეილი არასწორია."
    }
  },
  password: {
    type: String,
    required: [true, "პაროლი სავალდებულოა."],
    minlength: [8, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."]
  },
  stepPercent: {
    type: Number,
    max: 100,
    min: 0,
    default: 0
  },
  location: {
    type: LocationSchema,
    default: undefined
  },
  about: {
    type: String,
    minlength: [75, "თქვენს შესახებ უნდა შეიცავდეს მინუმუმ 75 სიმბოლოს."],
    default: undefined
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

const XelosaniSchema = new mongoose.Schema({
  skills: {
    type: [SkillSchema],
    default: undefined
  },
  schedule: {
    type: [ScheduleSchema],
    default: undefined
  },
  workCount: {
    type: Number,
    default: null
  },
  reviewCount: {
    type: Number,
    default: null
  }
});

const DamkvetiSchema = new mongoose.Schema({
});

export const Xelosani = User.discriminators && User.discriminators.Xelosani
  ? User.discriminators.Xelosani
  : User.discriminator('Xelosani', XelosaniSchema);

export const Damkveti = User.discriminators && User.discriminators.Damkveti
  ? User.discriminators.Damkveti
  : User.discriminator('Damkveti', DamkvetiSchema);
