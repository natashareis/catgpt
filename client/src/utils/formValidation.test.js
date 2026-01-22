import { validateEmail, validateName, validateMessage } from './formValidation';

describe('formValidation', () => {
  describe('validateEmail', () => {
    test('returns null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name@domain.co.uk')).toBeNull();
    });

    test('returns error for invalid email', () => {
      expect(validateEmail('invalid')).toBeTruthy();
      expect(validateEmail('no@domain')).toBeTruthy();
      expect(validateEmail('@domain.com')).toBeTruthy();
    });

    test('returns error for empty email', () => {
      expect(validateEmail('')).toBeTruthy();
      expect(validateEmail('  ')).toBeTruthy();
    });
  });

  describe('validateName', () => {
    test('returns null for valid name', () => {
      expect(validateName('John Doe')).toBeNull();
      expect(validateName('María José')).toBeNull();
    });

    test('returns error for empty name', () => {
      expect(validateName('')).toBeTruthy();
      expect(validateName('  ')).toBeTruthy();
    });

    test('returns error for too short name', () => {
      expect(validateName('A')).toBeTruthy();
    });
  });

  describe('validateMessage', () => {
    test('returns null for valid message', () => {
      expect(validateMessage('Hello, this is a test message.')).toBeNull();
    });

    test('returns error for empty message', () => {
      expect(validateMessage('')).toBeTruthy();
      expect(validateMessage('   ')).toBeTruthy();
    });

    test('returns error for too short message', () => {
      expect(validateMessage('Hi')).toBeTruthy();
    });
  });
});
