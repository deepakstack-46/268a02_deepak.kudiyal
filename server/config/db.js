import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "..", "data", "users.json");

//read from json file

export async function readUsers() {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        //if no file
        if (error.code === "ENOENT") {  //ENOENT means no such file or directory
            await writeUsers([]);
            return[];
        }
        throw error;
    }
    
}

//write users back to json file
export async function writeUsers(users) {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    
}

//generate unique id
export function generateId() {
    return "user_" + Math.random().toString(36).substring(2, 9);   // "user_"  is to create unique user id
}

//find user by email
export async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find(u => u.email === email);
}


//find user by Id
export async function findUserById(id) {
  const users = await readUsers();
  return users.find(u => u.id === id);
}