import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsPath = path.join(__dirname, '../data/skills.json');
const allSkills = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));

export const searchSkills = (req, res) => {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.status(200).json({ skills: [] });

    const matches = allSkills.filter((skill) => skill.toLowerCase().includes(q)).slice(0, 20);
    res.status(200).json({ skills: matches });
};