import jsonwebtoken from 'jsonwebtoken';
import { ENV } from './dotenv.js';

export const generateToken = (payload) => {
    return jsonwebtoken.sign(payload, ENV.JWT_SECRET, { expiresIn: '1h' });
}

