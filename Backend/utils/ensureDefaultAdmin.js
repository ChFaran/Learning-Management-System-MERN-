const User = require("../models/User");

async function ensureDefaultAdmin() {
  const name = process.env.DEFAULT_ADMIN_NAME || "farhan";
  const email = process.env.DEFAULT_ADMIN_EMAIL || "a.chfrn@gmail.com";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "11111111";

  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      name,
      email,
      password,
      role: "Admin",
      authProvider: "local",
    });
    console.log(`[seed] default admin created: ${email}`);
    return;
  }

  if (existing.role !== "Admin") {
    existing.role = "Admin";
    await existing.save();
    console.log(`[seed] user promoted to admin: ${email}`);
  }
}

module.exports = { ensureDefaultAdmin };
