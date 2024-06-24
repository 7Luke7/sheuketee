import mongoose from "mongoose"

const SkillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: [true, "უნარის/სპეციალობის სახელი სავალდებულოა."]
  },
  completedJobs: {
    type: Number,
    min: 0,
    sparse: true
  },
  reviews: {
    type: Number,
    min: 0,
    max: 5,
    sparse: true
  }
}, {timestamps: false});

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
        type: {
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
        default: {}
    },
}, {
    timestamps: false
});

const ScheduleSchema = new mongoose.Schema({
    monday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
    tuesday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
    wednesday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
    thursday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
    friday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
    saturday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
    sunday: {
        startTime: { type: String, default: null },
        endTime: { type: String, default: null }
    },
}, {timestamps: false})

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
    default: undefined
  },
  date: {
    type: Date,
    sparse: true,
    min: '1934-01-1',
  },
  schedule: {
    type: ScheduleSchema,
    default: undefined
  },
  location: {
    type: LocationSchema,
    default: undefined,
  },
  lastname: {
    type: String,
    minlength: [1, "გვარი უნდა შეიცავდეს მინიმუმ 1 ასოს."],
    required: [true, "გვარი სავალდებულოა."]
  },
  about: {
    type: String,
    minlength: [75, "თქვენს შესახებ უნდა შეიცავდეს მინუმუმ 75 სიმბოლოს."],
    default: undefined
  },
  phone: {
    type: String,
    unique: [true, "ხელოსანი ტელეფონის ნომრით უკვე არსებობს."],
    default: undefined,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v);
      },
      message: "ტელეფონის ნომერი არასწორია."
    }
  },
  email: {
    type: String,
    unique: [true, "ხელოსანი მეილით უკვე არსებობს."],
    default: undefined,
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
    default: undefined
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
    enum: ["კაცი", "ქალი"],
    sparse: true,
  },
  date: {
    type: Date,
    sparse: true
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