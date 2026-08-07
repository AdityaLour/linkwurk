import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const universitiesPath = path.join(__dirname, '../data/universities.json');
const allUniversities = JSON.parse(fs.readFileSync(universitiesPath, 'utf-8'));

export const searchUniversities = (req, res) => {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.status(200).json({ universities: [] });

    const matches = allUniversities.filter((u) => u.name.toLowerCase().includes(q)).slice(0, 20);
    res.status(200).json({ universities: matches });
};