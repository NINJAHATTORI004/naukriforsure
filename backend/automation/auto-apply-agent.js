const { chromium } = require('playwright');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

/**
 * Autonomous Application Agent
 * Uses Playwright and GPT-4o Vision for self-healing form navigation.
 */
class AutoApplicationAgent {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.browser = null;
    }

    async initialize() {
        this.browser = await chromium.launch({ headless: true });
    }

    /**
     * Main execution method to apply for a job autonomously
     */
    async applyToJob(jobUrl, userData, resumePath) {
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            viewport: { width: 1280, height: 800 }
        });
        const page = await context.newPage();

        try {
            console.log(`[Auto-Apply] Navigating to ${jobUrl}`);
            await page.goto(jobUrl, { waitUntil: 'networkidle' });

            // Step 1: Standard heuristic mapping
            const success = await this.heuristicFormFill(page, userData, resumePath);
            
            // Step 2: If heuristics fail, trigger Self-Healing Vision Agent
            if (!success) {
                console.log('[Auto-Apply] Standard DOM selectors failed. Engaging Vision Self-Healing...');
                await this.visionSelfHealFill(page, userData);
            }

            // Step 3: Submit application
            await this.clickSubmitButton(page);
            console.log(`[Auto-Apply] Application submitted successfully to ${jobUrl}`);
            return { status: 'SUCCESS', message: 'Applied successfully' };
            
        } catch (error) {
            console.error(`[Auto-Apply] Failed: ${error.message}`);
            await page.screenshot({ path: `logs/error-${Date.now()}.png` });
            return { status: 'FAILED', error: error.message };
        } finally {
            await page.close();
        }
    }

    /**
     * Attempt to fill forms using standard CSS selectors
     */
    async heuristicFormFill(page, userData, resumePath) {
        try {
            // Fill basic details if standard inputs are found
            const nameInput = await page.$('input[name*="name" i], input[id*="name" i]');
            if (nameInput) await nameInput.fill(userData.fullName);

            const emailInput = await page.$('input[name*="email" i], input[type="email"]');
            if (emailInput) await emailInput.fill(userData.email);
            
            // Upload resume
            const fileInput = await page.$('input[type="file"]');
            if (fileInput) {
                await fileInput.setInputFiles(path.resolve(resumePath));
            } else {
                return false; // Force vision healing if resume input isn't found
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Vision AI Agent: Takes a screenshot, sends to GPT-4o, gets X/Y coordinates to click/type
     */
    async visionSelfHealFill(page, userData) {
        const screenshotPath = `logs/temp-vision-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        
        const base64Image = fs.readFileSync(screenshotPath, { encoding: 'base64' });

        // Ask GPT-4o to map the visual UI elements
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Identify the input fields for 'First Name', 'Email', and 'Submit Button' in this screenshot. Return a JSON object with approximate X, Y pixel coordinates for the center of each element like: {"firstName": {x, y}, "email": {x, y}, "submit": {x, y}}` },
                        { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        });

        const coordinates = JSON.parse(response.choices[0].message.content);
        fs.unlinkSync(screenshotPath); // Cleanup

        // Execute mouse clicks based on AI vision mapping
        if (coordinates.firstName) {
            await page.mouse.click(coordinates.firstName.x, coordinates.firstName.y);
            await page.keyboard.type(userData.fullName);
        }
        if (coordinates.email) {
            await page.mouse.click(coordinates.email.x, coordinates.email.y);
            await page.keyboard.type(userData.email);
        }
    }

    async clickSubmitButton(page) {
        const submitBtn = await page.$('button[type="submit"], input[type="submit"], button:has-text("Submit"), button:has-text("Apply")');
        if (submitBtn) {
            await submitBtn.click();
            await page.waitForTimeout(3000); // wait for navigation/success response
        } else {
            throw new Error("Submit button not found by heuristics");
        }
    }

    async close() {
        if (this.browser) await this.browser.close();
    }
}

module.exports = { AutoApplicationAgent };