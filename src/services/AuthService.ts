import { User, LoginCredentials, SignupData } from '../types/auth';

// Mock database - in production this would be a real API
const mockUsers: User[] = [];

// Helper to generate mock token
const generateMockToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// Helper to generate user ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(1000); // Simulate network delay

    const { email, password } = credentials;

    // Validate input
    if (!email || !password) {
      throw new AuthServiceError('MISSING_CREDENTIALS', 'Email and password are required');
    }

    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new AuthServiceError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // In production, you'd verify the password hash
    // For demo purposes, we'll accept any password for existing users
    // or specific test passwords
    const validTestPasswords = ['password', 'test123', 'demo123'];
    if (!validTestPasswords.includes(password) && password !== 'admin123') {
      throw new AuthServiceError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const token = generateMockToken(user.id);

    return { user, token };
  }

  static async signup(signupData: SignupData): Promise<{ user: User; token: string }> {
    await delay(1500); // Simulate network delay

    const { firstName, lastName, email, phoneNumber, password, confirmPassword, role } = signupData;

    // Validate input
    if (!firstName.trim()) {
      throw new AuthServiceError('INVALID_DATA', 'First name is required');
    }

    if (!lastName.trim()) {
      throw new AuthServiceError('INVALID_DATA', 'Last name is required');
    }

    if (!email.trim()) {
      throw new AuthServiceError('INVALID_DATA', 'Email is required');
    }

    if (!this.isValidEmail(email)) {
      throw new AuthServiceError('INVALID_EMAIL', 'Please enter a valid email address');
    }

    if (!phoneNumber.trim()) {
      throw new AuthServiceError('INVALID_DATA', 'Phone number is required');
    }

    if (!this.isValidPhoneNumber(phoneNumber)) {
      throw new AuthServiceError('INVALID_PHONE', 'Please enter a valid phone number');
    }

    if (password.length < 6) {
      throw new AuthServiceError('WEAK_PASSWORD', 'Password must be at least 6 characters long');
    }

    if (password !== confirmPassword) {
      throw new AuthServiceError('PASSWORD_MISMATCH', 'Passwords do not match');
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new AuthServiceError('USER_EXISTS', 'An account with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email: email.toLowerCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      role: role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock database
    mockUsers.push(newUser);

    const token = generateMockToken(newUser.id);

    return { user: newUser, token };
  }

  static async validateToken(token: string): Promise<User | null> {
    await delay(500);

    // In production, you'd validate the JWT token with your backend
    // For demo purposes, we'll extract user ID from mock token
    if (!token || !token.startsWith('mock_token_')) {
      return null;
    }

    const parts = token.split('_');
    if (parts.length < 3) {
      return null;
    }

    const userId = parts[2];
    const user = mockUsers.find(u => u.id === userId);

    return user || null;
  }

  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await delay(800);

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new AuthServiceError('USER_NOT_FOUND', 'User not found');
    }

    // Validate email if being updated
    if (updates.email) {
      if (!this.isValidEmail(updates.email)) {
        throw new AuthServiceError('INVALID_EMAIL', 'Please enter a valid email address');
      }

      // Check if email is already taken by another user
      const existingUser = mockUsers.find(u =>
        u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== userId
      );
      if (existingUser) {
        throw new AuthServiceError('EMAIL_TAKEN', 'This email is already in use');
      }
    }

    // Validate phone number if being updated
    if (updates.phoneNumber && !this.isValidPhoneNumber(updates.phoneNumber)) {
      throw new AuthServiceError('INVALID_PHONE', 'Please enter a valid phone number');
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    return mockUsers[userIndex];
  }

  // Demo method to add test users
  static addTestUsers(): void {
    const testUsers: User[] = [
      {
        id: 'test_customer_1',
        email: 'customer@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+27 11 123 4567',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'test_staff_1',
        email: 'staff@test.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+27 11 765 4321',
        role: 'staff',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'test_admin_1',
        email: 'admin@shybay.com',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '+27 11 999 0000',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add test users if they don't exist
    testUsers.forEach(testUser => {
      const exists = mockUsers.find(u => u.email === testUser.email);
      if (!exists) {
        mockUsers.push(testUser);
      }
    });

    console.log('Test users added. You can login with:');
    console.log('- customer@test.com / password');
    console.log('- staff@test.com / password');
    console.log('- admin@shybay.com / admin123');
  }

  // Validation helpers
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhoneNumber(phone: string): boolean {
    // Basic South African phone number validation
    const phoneRegex = /^(\+27|0)[0-9]{9,10}$/;
    const cleanPhone = phone.replace(/\s|-/g, '');
    return phoneRegex.test(cleanPhone);
  }
}

// Custom error class for internal use
class AuthServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'AuthServiceError';
  }
}