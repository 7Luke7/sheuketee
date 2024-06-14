import mongoose from "mongoose"

const SkillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: [true, "უნარის/სპეციალობის სახელი სავალდებულოა."]
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  }
}, {timestamps: false});

const XelosaniSchema = new mongoose.Schema({
  profId: {
    type: String,
    required: [true, "პროფილის id სავალდებულოა."]
  },
  firstname: {
    type: String,
    minlength: [1, "სახელი უნდა შეიცავდეს მინიმუმ 1 ასოს."],
    required: [true, "სახელი სავალდებულოა."]
  },
  notificationDevices: {
    type: [String], 
    default: []
  },
  gender: {
    type: String,
    enum: ["ქალი", "კაცი"],
    sparse: true
  },
  age: {
    type: Number,
    max: 100,
    min: 0,
    sparse: true
  },
  lastname: {
    type: String,
    minlength: [1, "გვარი უნდა შეიცავდეს მინიმუმ 1 ასოს."],
    required: [true, "გვარი სავალდებულოა."]
  },
  about: {
    type: String,
    minlength: [75, "თქვენს შესახებ უნდა შეიცავდეს მინუმუმ 75."],
    sparse: true
  },
  phone: {
    type: String,
    unique: [true, "ხელოსანი ტელეფონის ნომრით უკვე არსებობს."],
    sparse: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v);
      },
      message: props => `ტელეფონის ნომერი ან მეილი ${props.value} არასწორია.`
    }
  },
  email: {
    type: String,
    unique: [true, "ხელოსანი მეილით უკვე არსებობს."],
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `ტელეფონის ნომერი ან მეილი ${props.value} არასწორია.`
    }
  },
  password: {
    type: String,
    required: [true, "პაროლი სავალდებულოა."],
    minlength: [8, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს."],
  },
  stepPercent: {
    type: Number,
    max: 100,
    min: 0,
    default: 0
  },
  skills: {
    type: [SkillSchema],
    default: []
  }
}, { timestamps: true });

const DamkvetiSchema = new mongoose.Schema({
  profId: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  notificationDevices: {
    type: [String], 
    default: [],
  },
  about: {
    type: String,
    sparse: true
  },
  gender: {
    type: String,
    sparse: true,
  },
  age: {
    type: Number,
    sparse: true,
  },
  lastname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: [true, "ხელოსანი ტელეფონის ნომრით უკვე არსებობს."],
    sparse: true,
    validate: {
      validator: function(v) {
        return  /^\d{9}$/.test(v)
      },
      message: props => `მეილი ${props.value} არასწორია.`
    },
  },
  email: {
    type: String,
    unique: [true, "ხელოსანი მეილით უკვე არსებობს."],
    sparse: true,
    validate: {
      validator: function(v) {
        return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: props => `ტელეფონის ნომერი ${props.value} არასწორია.`
    },
 },
  password: {
    type: String,
    required: true,
    minlength: [8, 'პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.'],
  },
  stepPercent: {
    type: Number,
    max: 100,
    min: 0,
    default: 0
  },
},{timestamps: true});

export const Xelosani = mongoose.models.Xelosani || mongoose.model('Xelosani', XelosaniSchema);
export const Damkveti = mongoose.models.Damkveti || mongoose.model('Damkveti', DamkvetiSchema);