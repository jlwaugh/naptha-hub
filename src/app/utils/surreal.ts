import { Surreal } from "surrealdb.js";

export let db: Surreal | undefined = new Surreal();

export async function initDb(): Promise<Surreal | undefined> {
    if (db) return db;
    db = new Surreal();
    try {
        await db.connect(process.env.HUB_URL as string, {
            auth: {
                username: process.env.HUB_USER as string,
                password: process.env.HUB_PASS as string,
            },
        });
        await db.use({ namespace: "naptha", database: "naptha" });
        return db;
    } catch (err) {
        console.error("Failed to connect:", err);
        throw err;
    }
}

export async function closeDb(): Promise<void> {
    if (!db) return;
    await db.close();
    db = undefined;
}

export function getDb(): Surreal | undefined {
    return db;
}