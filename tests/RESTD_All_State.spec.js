import { test, expect } from '@playwright/test';
import xlsx from 'xlsx';
import path from 'path';

test.setTimeout(30 * 60 * 1000); // 30 minutes

const workbook = xlsx.readFile(
    path.join(process.cwd(), 'tests', 'DATA', 'RESTD AllState.xlsx')
);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

test('Excel data based automation', async ({ page }) => {

    // ===================== LOGIN =====================
    await page.goto('https://www.landydev.com');

    await page.getByRole('textbox', { name: 'Email' })
        .fill('velmueugan@stepladdersolutions.com');

    await page.getByRole('textbox', { name: 'Password' })
        .fill('Test@123');

    const loginBtn = page.getByRole('button', { name: 'Login' });
    await loginBtn.waitFor({ state: 'visible', timeout: 60000 });
    await page.getByRole('link', { name: /Applications/i })
  .waitFor({ state: 'visible', timeout: 90000 });

console.log('Login successful, Applications menu visible');

    // HARD ASSERT — STOP TEST IF LOGIN FAILED
    if (page.url().includes('/auth/login')) {
        throw new Error('Login failed – still on login page');
    }

    // ===================== EXCEL LOOP =====================
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        console.log(`Starting row ${i + 1}`, row);
        console.log('Current URL:', page.url());

        await page.screenshot({
            path: `before-new-app-row-${i + 1}.png`,
            fullPage: true
        });

        try {
            await page.goto('https://www.landydev.com/#/pages/riskPolicySearch');
            await page.waitForLoadState('domcontentloaded');

            await page.getByRole('link', { name: /Applications/i }).click();
            await page.waitForLoadState('networkidle');

            await page.getByLabel('State').selectOption(row.State);
            await page.locator('#state').nth(1).selectOption(row.Lob);

            const producer = page.getByRole('textbox', { name: 'Pick a producer' });
            await producer.click();
            await producer.type('hhl');
            await page.waitForTimeout(3000);
            await page.getByText('HHL01-A, Herbert H. Landy').click();

            await page.getByRole('textbox', { name: 'Search Firm Name' }).fill(row.FirmName);

            const locationAL = page.getByRole('textbox', { name: 'Sizing example input' }).first();
            await locationAL.fill(row.Location);
            await page.waitForTimeout(3000);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            await page.locator('input[name="effDate1"]')
                .fill(new Date().toISOString().split('T')[0]);

            await page.getByLabel('Retroactive Date ---Choose an')
                .selectOption(row.PriorCheck);

            await page.getByRole('button', { name: 'save & Close' }).click();

            // ---------------- APPLICATION DETAILS ----------------
            await page.getByText('Application Details', { timeout: 60000 }).click();
            await page.getByPlaceholder('Full Time')
                .fill(row.AppDetlFullTimeProfessionals);

            await page.locator('select[name="typeOfFirmReId"]')
                .selectOption(row.AppDetlTypeOfFirm);

            await page.getByRole('button', { name: 'save & Close' }).click();
            await page.waitForTimeout(3000);

            // ---------------- AREAS OF PRACTICE ----------------
            await page.getByText('Areas of Practice').click();
            await page.locator("(//ngx-rev-trans//table)[1]//tr[1]/td[3]")
                .type(row.ArsPracSalesLeasingLastYr);

            await page.locator("(//ngx-rev-trans//table)[1]/tbody/tr[1]/td[4]//input")
                .type(row.TotalTransactions);

            await page.getByRole('button', { name: 'save & Close' }).click();
            await page.waitForTimeout(3000);

            // ---------------- QUOTE SELECTION ----------------
            await page.locator('nb-accordion-item-header')
                .filter({ hasText: 'Quote Selection &' }).click();

            await page.getByText(row.QutSelContLimit).click();
            await page.getByText(row.QutSelContDeductible).click();
            await page.getByText(row.QutSelContLimitType).click();
            await page.getByText(row.QutSelContDeductibleType).click();

            await page.getByRole('button', { name: 'save & Close' }).click();
            await page.waitForTimeout(2000);

            // ---------------- RATE ----------------
            await page.getByRole('button', { name: /Rate/i }).click();
            await page.waitForLoadState('networkidle');

            // ---------------- SUCCESS ----------------
            await page.screenshot({ path: `row-${i + 1}-success.png` });

            console.log({
                row: i + 1,
                RiskId: row.RiskId,
                Status: 'SUCCESS'
            });

        } catch (error) {
            console.error(`FAILED ROW ${i + 1} | RiskId: ${row.RiskId}`, error);

            if (!page.isClosed()) {
                await page.screenshot({ path: `row-${i + 1}-error.png` });
            }
            continue;
        }
    }

    await page.waitForTimeout(2000);
});
