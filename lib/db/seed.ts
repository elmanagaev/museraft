import { db } from "./index";
import { users, categories, fonts, colors, layoutTypes } from "./schema";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_FONTS,
  DEFAULT_COLORS,
  DEFAULT_LAYOUT_TYPES,
} from "@/lib/constants";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    const adminResult = await db
      .insert(users)
      .values({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        subscriptionStatus: "pro",
        emailVerified: true,
      })
      .onConflictDoNothing()
      .returning();
    if (adminResult.length > 0) {
      console.log("✅ Admin user created:", adminResult[0].email);
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Create regular test user
    const testPassword = await bcrypt.hash("Test123!", 10);
    const testResult = await db
      .insert(users)
      .values({
        name: "Test User",
        email: "test@example.com",
        password: testPassword,
        role: "user",
        subscriptionStatus: "free",
        emailVerified: true,
      })
      .onConflictDoNothing()
      .returning();
    if (testResult.length > 0) {
      console.log("✅ Test user created:", testResult[0].email);
    } else {
      console.log("ℹ️  Test user already exists");
    }

    // Seed categories for each content type
    for (const [type, categoryNames] of Object.entries(DEFAULT_CATEGORIES)) {
      for (const name of categoryNames) {
        await db
          .insert(categories)
          .values({
            name,
            type: type as "website" | "section" | "dashboard" | "flow",
          })
          .onConflictDoNothing();
      }
    }
    console.log("✅ Categories seeded");

    // Seed fonts
    for (const name of DEFAULT_FONTS) {
      await db.insert(fonts).values({ name }).onConflictDoNothing();
    }
    console.log("✅ Fonts seeded");

    // Seed colors
    for (const color of DEFAULT_COLORS) {
      await db
        .insert(colors)
        .values({
          name: color.name,
          hexCode: color.hexCode,
        })
        .onConflictDoNothing();
    }
    console.log("✅ Colors seeded");

    // Seed layout types
    for (const name of DEFAULT_LAYOUT_TYPES) {
      await db.insert(layoutTypes).values({ name }).onConflictDoNothing();
    }
    console.log("✅ Layout types seeded");

    console.log("🎉 Seeding completed successfully!");
    console.log("\n📝 Login credentials:");
    console.log("Admin: admin@example.com / Admin123!");
    console.log("User: test@example.com / Test123!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    console.log("✨ Seed script finished");
    process.exit(0);
  });
