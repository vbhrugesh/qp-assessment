import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
    },
  })
  console.log("User created:", user)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
