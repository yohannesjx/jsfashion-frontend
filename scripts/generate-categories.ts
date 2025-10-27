import fs from "fs"
import path from "path"
import fetch from "node-fetch"

const API_URL = "https://api.jsfashion.et/store/product-categories"
const OUTPUT_PATH = path.resolve("src/data/categories.ts")

// Your Medusa API credentials
const HEADERS = {
  "x-publishable-api-key": "pk_c72d792d3668bd9d14fdc34c45e17a73df7184a41691e6ac115061cfa4f318d5",
  "x-medusa-sales-channel-id": "sc_01K83QVZA2AYWRX4S6YGCC6ZDS",
}

async function generateCategories() {
  try {
    console.log("Fetching categories from Medusa...")

    const res = await fetch(API_URL, { headers: HEADERS })
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }

    const data: any = await res.json()
    const categories = (data?.product_categories as any[]) || []

    if (!categories.length) {
      throw new Error("No categories found.")
    }

    // Build TypeScript file content
    const formatted = `// ⚙️ Auto-generated from Medusa
// Do NOT edit manually — run \`npm run update:categories\` to refresh
export const categories = ${JSON.stringify(
      categories.map((c: any) => ({
        name: c.name.trim(),
        handle: c.handle.trim().toLowerCase(),
      })),
      null,
      2
    )}
`

    // Ensure directory exists
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, formatted, "utf8")
    console.log(`✅ Categories written to ${OUTPUT_PATH}`)
  } catch (error) {
    console.error("❌ Failed to generate categories:", error)
    process.exit(1)
  }
}

generateCategories()