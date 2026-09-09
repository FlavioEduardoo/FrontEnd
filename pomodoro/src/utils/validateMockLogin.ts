import { MOCK_PASSWORD, MOCK_USERNAME } from "../constants/mockCredentials";


export function validateMockLogin(username: string, password: string): boolean {
  return username.trim() === MOCK_USERNAME && password === MOCK_PASSWORD;
}