import dotenv from 'dotenv';
dotenv.config();

export const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY;
export const CALENDLY_ORGANIZATION = process.env.CALENDLY_ORGANIZATION;
export const CALENDLY_BASE_URL = 'https://api.calendly.com/v2'; 