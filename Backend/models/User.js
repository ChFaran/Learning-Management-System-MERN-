const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    authProvider: { type: String, enum: ["local", "google", "facebook", "x"], default: "local" },
    oauthId: { type: String, default: null },
    role: { type: String, enum: ["Guest", "Registered", "Admin"], default: "Guest" },
    avatar: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    country: { type: String, default: "" },
    enrolledCourses: [{
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      enrolledAt: { type: Date, default: Date.now },
      progress: { type: Number, default: 0 }
    }],
    hasPaymentDetails: { type: Boolean, default: false },
    paymentDetails: {
      accountHolder: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accountNumberLast4: { type: String, default: "" },
      billingAddress: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if(!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
