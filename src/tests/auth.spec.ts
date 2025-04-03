
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  // Define dynamic test user data
  const testUser = {
    name: `TestUser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the auth page before each test
    await page.goto('/auth');
  });

  test('should register a new user', async ({ page }) => {
    // Fill out the registration form with dynamic data
    await page.locator('#register-name').fill(testUser.name);
    await page.locator('#register-email').fill(testUser.email);
    await page.locator('#register-password').fill(testUser.password);
    
    // Submit the form
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Check for success indication
    await expect(page.locator('text=Registration successful')).toBeVisible({ 
      timeout: 10000 
    });
  });

  test('should login a user and redirect to dashboard', async ({ page }) => {
    // Switch to login tab
    await page.getByRole('tab', { name: 'Login' }).click();
    
    // Fill out the login form with dynamic data
    await page.locator('#login-email').fill(testUser.email);
    await page.locator('#login-password').fill(testUser.password);
    
    
    // Submit the form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check that we are redirected to the dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should show error on failed login', async ({ page }) => {
    // Switch to login tab
    await page.getByRole('tab', { name: 'Login' }).click();
    
    // Fill out the login form with invalid credentials
    // Using a variation of the dynamic email to ensure it's different
    await page.locator('#login-email').fill(`invalid_${testUser.email}`);
    await page.locator('#login-password').fill('WrongPassword');
    
    // Submit the form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check that we're still on the auth page
    await expect(page.url()).toContain('/auth');
    
    // Check for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ 
      timeout: 10000 
    });
  });
});