import path from 'path';
import { readFileSync } from 'fs';

export const PRIVATE_KEY = readFileSync(path.join(process.cwd(), 'credentials', 'secret'), 'utf-8');
export const PUBLIC_KEY = readFileSync(path.join(process.cwd(), 'credentials', 'secret.pub'), 'utf-8');
