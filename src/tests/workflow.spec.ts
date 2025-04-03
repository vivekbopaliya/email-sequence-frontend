// File: tests/workflow-canvas.spec.js
import { test, expect } from '@playwright/test';

test.describe('Workflow Canvas - UI Interaction Tests with Initial Nodes', () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!'
  };

  test.beforeEach(async ({ page }) => {
    // Login through UI
    await page.goto('/auth');
    await page.getByRole('tab', { name: 'Login' }).click();
    await page.locator('#login-email').fill("vivekpatel1nov@gmail.com");
    await page.locator('#login-password').fill("asdasd");
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard'); // Assuming successful login redirects to dashboard
  });

  test('should create and save new workflow with initial nodes through UI', async ({ page }) => {
    const workflowName = `New Workflow ${Date.now()}`;

    // Navigate to new workflow page from dashboard
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();
    await expect(page).toHaveURL('/workflows/new');

    // Fill workflow name
    await page.locator('#flowchart-name').fill(workflowName);

    // Save workflow
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save Workflow').click();
    
    // Verify success and navigation
    await expect(page.getByText('Workflow saved successfully')).toBeVisible();
  });

  test('should save and start new workflow with initial nodes through UI', async ({ page }) => {
    const workflowName = `New Workflow ${Date.now()}`;

    // Navigate to new workflow page
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();

    // Fill workflow name
    await page.locator('#flowchart-name').fill(workflowName);

    // Save and start workflow
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save & Start Scheduler').click();

    // Verify success and navigation
    await expect(page.getByText('Workflow saved and scheduler started successfully')).toBeVisible();
  });

  test('should update existing workflow with initial nodes through UI', async ({ page }) => {
    // First create a workflow
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();
    
    await page.locator('#flowchart-name').fill(`Initial Workflow ${Date.now()}`);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save Workflow').click();
    await expect(page.getByText('Workflow saved successfully')).toBeVisible();

    // Go back to dashboard and edit
    await page.getByRole('button', { name: 'Back' }).click();
    await page.getByRole('button', { name: 'Edit' }).last().click();

    // Update workflow name
    const updatedName = `Updated Workflow ${Date.now()}`;
    await page.locator('#flowchart-name').fill(updatedName);

    // Update workflow
    await page.getByRole('button', { name: 'Update' }).click();
    await page.getByText('Update Workflow').click();

    // Verify success
    await expect(page.getByText('Workflow updated successfully')).toBeVisible();
  });

  test('should update and start existing workflow with initial nodes through UI', async ({ page }) => {
    // Create initial workflow
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();
    
    await page.locator('#flowchart-name').fill(`Initial Workflow ${Date.now()}`);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save Workflow').click();
    const workflowUrl = page.url();

    // Go back and edit
    await page.getByRole('button', { name: 'Back' }).click();
    await page.getByRole('button', { name: 'Edit' }).first().click();

    // Update and start
    await page.getByRole('button', { name: 'Update' }).click();
    await page.getByText('Update & Start Scheduler').click();

    // Verify success
    await expect(page.getByText('Workflow updated and scheduler started successfully')).toBeVisible();
  });

  test('should validate workflow before saving with initial nodes through UI', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();

    // Leave initial nodes invalid (assuming they start empty)
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save Workflow').click();

    // Verify validation error
    await expect(page.getByText('All Lead Source nodes must have at least one email address')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  });

  test('should start scheduler for existing workflow with initial nodes through UI', async ({ page }) => {
    // Create workflow
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();
    
    await page.locator('#flowchart-name').fill(`Workflow ${Date.now()}`);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save Workflow').click();

    // Start scheduler
    await page.getByRole('button', { name: 'Start' }).click();

    // Verify success
    await expect(page.getByText('Scheduler started successfully')).toBeVisible();
  });

  test('should stop scheduler for running workflow with initial nodes through UI', async ({ page }) => {
    // Create and start workflow
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Create New Workflow' }).click();
    
    await page.locator('#flowchart-name').fill(`Workflow ${Date.now()}`);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Save Workflow').click();

    // Start scheduler
    await page.getByRole('button', { name: 'Start' }).click();

    // Go back and stop
    await page.getByRole('button', { name: 'Stop Scheduler' }).click();

    // Verify success
    await expect(page.getByText('Scheduler stopped successfully')).toBeVisible();
  });

});