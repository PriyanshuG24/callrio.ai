// src/actions/stream.action.ts
'use server'

import { generateToken } from "./generate-token";

export const tokenProvider = async () => {
  try {
    return await generateToken();
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}