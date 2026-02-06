import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
test.setTimeout(30 * 60 * 1000); // 30 minutes
import xlsx from 'xlsx';
const workbook = xlsx.readFile('./tests/DATA/RESTD AllState.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
test('Excel data based automation', async ({ page }) => {
  await page.goto('https://www.landydev.com/#/auth/login');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Email' }).fill('velmurugan@stepladdersolutions.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  for (let i = 3; i < data.length; i++) {
    const rowNumber = i + 1;
    const row = data[i];
    const riskId = row.Option?.toString().trim();
    if (!riskId) {
      console.warn(`Skipping row ${i + 1} - RiskId missing`);
      continue;
    }
    console.log(`Starting row ${i + 1} RiskId: ${riskId}`);
    try {
      await page.goto('https://www.landydev.com/#/pages/riskPolicySearch');
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: '   New Application' }).click();
      await page.getByLabel('State').selectOption(row.State);
      await page.locator('#state').nth(1).selectOption(row.Lob);
      const producer = page.getByRole('textbox', { name: 'Pick a producer' });
      await producer.click();
      await producer.type('hhl');
      await page.waitForTimeout(3000);
      await page.getByText('HHL01-A, Herbert H. Landy').click();
      await page.getByRole('textbox', { name: 'Search Firm Name' }).click();
      await page.getByRole('textbox', { name: 'Search Firm Name' }).type(row.FirmName);
      const locationAL = page.getByRole('textbox', { name: 'Sizing example input' }).first();
      await locationAL.click();
      await locationAL.type(row.Location);
      await page.waitForTimeout(3000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      await page.locator('input[name="effDate1"]').fill(new Date().toISOString().split('T')[0]);
      await page.getByLabel('Retroactive Date ---Choose an').selectOption(row.PriorCheck);
      await page.getByRole('button', { name: 'save & Close' }).click();
      await page.getByText('Application Details').click();
      await page.getByPlaceholder('Full Time').click();
      await page.getByPlaceholder('Full Time').fill(row.AppDetlFullTimeProfessionals);
      await page.locator('select[name="typeOfFirmReId"]').selectOption(row.AppDetlTypeOfFirm);
      await page.getByRole('button', { name: 'save & Close' }).click();
      await page.waitForTimeout(3000);
      await page.getByText('Areas of Practice').click();
      await page.locator("(//ngx-rev-trans//table)[1]//tr[1]/td[3]").click();
      await page.getByRole('textbox').first().press('ArrowLeft');
      await page.getByRole('textbox').first().press('ArrowLeft');
      await page.getByRole('textbox').first().press('ArrowLeft');
      await page.locator("(//ngx-rev-trans//table)[1]//tr[1]/td[3]").type(row.ArsPracSalesLeasingLastYr);
      await page.locator("(//ngx-rev-trans//table)[1]/tbody/tr[1]/td[4]//input").click();
      await page.locator("(//ngx-rev-trans//table)[1]/tbody/tr[1]/td[4]//input").type(row.TotalTransactions);
      await page.getByRole('button', { name: 'save & Close' }).click();
      await page.waitForTimeout(3000);
      await page.locator('nb-accordion-item-header').filter({ hasText: 'Quote Selection &' }).click();
      await page.locator('span').filter({ hasText: 'Pick a Limit' }).first().click();
      await page.getByText(row.QutSelContLimit).click();
      await page.locator('span').filter({ hasText: 'Pick a Deductible' }).first().click();
      await page.getByText(row.QutSelContDeductible, { exact: true }).click();
      await page.getByText('Pick a Limit Type').click();
      await page.getByText(row.QutSelContLimitType).click();
      await page.getByText('Pick a Deductible Type').click();
      await page.getByText(row.QutSelContDeductibleType).click();
      await page.getByRole('button', { name: 'save & Close' }).click();
      await page.waitForTimeout(2000);

      // Click Rate
      await page.getByRole('button', { name: /Rate/ }).click();

      // After clicking Rate
      await page.waitForLoadState('networkidle');

      const regenBtn = page.getByRole('button', { name: /re-?generate sheets/i });

      if (await regenBtn.isVisible({ timeout: 120_000 })) {
        await regenBtn.click();
        console.log('Re-Generate Sheets clicked');
      } else {
        throw new Error('Re-Generate Sheets button not visible');
      }

      await page.waitForTimeout(5000);

      await page.locator('//tbody/tr[1]/td[2]/button[3]').click();
      const today = new Date().toISOString().split('T')[0];
      await page.locator('div input#minDate').fill(today);
      await page.locator('button#save').click();
      await page.locator('button#sendMail > span').click();
      await page.waitForLoadState('networkidle');
      await page.locator("div[class='col-sm-6 ng-star-inserted'] td[class='ng-star-inserted']").click();
      await page.waitForTimeout(3000);
      await page.locator('//*[@id="moveToAccounting"]').click();
      await page.locator('//*[@id="accounting"]').click();
      await page.waitForTimeout(3000);
      // ************************Payment******************
      await page.getByRole('link', { name: 'Payment', exact: true }).click();
      await page.waitForLoadState('networkidle');
      const balanceText = await page.locator("//ngx-payment-tab//tr[2]/td[9]").innerText();
      // const balanceText = await page.locator("//td[contains(@class,'text-right')]//span").innerText();
      const balanceValue = balanceText
        .replace('$', '')
        .replace(/,/g, '')
        .trim();
      const paymentInput = page.locator('#paymentReceived3');
      await paymentInput.click();
      await paymentInput.press('Control+A');
      await paymentInput.press('Backspace');
      await paymentInput.pressSequentially(balanceValue, { delay: 100 });
      await paymentInput.press('Tab');
      await page.waitForTimeout(500);
      await page.locator('#checkNumber').fill(row.Option);
      await page.locator('#autofill').click();
      await page.getByRole('button', { name: 'Save  & Issue' }).click();
      // **********************************************************************************
      await page.getByRole('button', { name: 'Okay' }).click();
      await page.getByRole('link', { name: 'Notes' }).click();
      await page.locator('//nb-tabset//ul/li[1]/a').click();
      await page.locator('nb-accordion-item-header').filter({ hasText: 'Client Information' }).click();
      const riskIdInput1 = page.locator("input[placeholder='Risk Id']");
      await riskIdInput1.click();
      await riskIdInput1.press('Control+A');
      await riskIdInput1.press('Control+C');
      await page.getByRole('link', { name: 'Accounting' }).click();
      await page.getByRole('link', { name: 'Policy Queued' }).click();
      await page.locator('#globalSearch').click();
      await page.locator('#globalSearch').press('Control+V');
      await page.locator('#search').first().click();
      await page.locator("//ng2-smart-table//tbody/tr[1]/td[1]//input[@type='checkbox']").check();
      await page.getByRole('button', { name: 'Issue Policy' }).click();
      await page.getByRole('button', { name: 'Yes' }).click();
      await page.waitForTimeout(3000);
      await page.getByRole('link', { name: 'Accounting' }).click();
      await page.getByRole('link', { name: 'Underwriting' }).click();
      await page.locator('#globalSearch').click();
      await page.locator('#globalSearch').press('Control+V');
      await page.locator('#search').first().click();
      await page.locator("//tr[@class='ng2-smart-row selected ng-star-inserted']").click();
      await page.locator('//nb-tabset//ul/li[1]/a').click();
      // ********************************Booking***************************************
      // await page.locator('nb-accordion-item-header').filter({ hasText: 'Client Information' }).click();
      // const riskIdInput = page.locator("input[placeholder='Risk Id']");
      // await riskIdInput.click();
      // await riskIdInput.press('Control+A');
      // await riskIdInput.press('Control+C');
      // await page.getByRole('link', { name: 'Accounting' }).click();
      // await page.getByRole('link', { name: 'Booking' }).click();
      // await page.waitForTimeout(3000);
      // await page.locator("//i[contains(@class,'ion-refresh')]").click();
      // await page.waitForTimeout(6000);
      // await page.locator("//i[@class='fa fa-file-pdf']").click();
      // await page.waitForTimeout(6000);
      // await page.locator("//i[contains(@class,'ion-refresh')]").click();
      // await page.waitForTimeout(6000);
      // await page.locator('#globalSearch').click();
      // await page.locator('#globalSearch').press('Control+V');
      // await page.locator('#search').first().click();
      // await page.waitForTimeout(5000);
      // await page.locator("//ng2-smart-table//tbody/tr[1]/td[1]//input[@type='checkbox']").check();
      // await page.getByRole('button', { name: 'Mark For Booking' }).click();
      // await page.getByRole('button', { name: 'Yes' }).click();
      // await page.getByRole('link').filter({ hasText: /^$/ }).nth(3).click();
      // await page.getByRole('button', { name: 'Yes' }).click();
      // await page.locator("//ng2-smart-table//tbody/tr[1]/td[7]//a").click();
      // await page.locator('#check-0-pending').check();
      // await page.getByRole('button', { name: 'Post' }).click();
      // await page.getByRole('button', { name: 'Yes' }).click();
      // // // *****************************************Deposit********************************************
      // await page.getByRole('link', { name: 'Deposit' }).click();
      // await page.locator('#globalSearch').click();
      // await page.locator('#globalSearch').press('Control+V');
      // await page.locator('#search').first().click();
      // await page.locator("//ng2-smart-table//tbody/tr[1]/td[1]//input[@type='checkbox']").check();
      // await page.getByRole('button', { name: 'Mark For Deposit' }).click();
      // await page.getByRole('button', { name: 'Yes' }).click();
      // await page.goto('https://www.landydev.com/#/pages/depositBatchTab/DepositBatch');
      // await page.getByRole('link').filter({ hasText: /^$/ }).nth(3).click();
      // await page.getByRole('button', { name: 'Yes' }).click();
      // await page.locator("//ng2-smart-table//tbody/tr[1]/td[7]//a").click();
      // await page.locator('#check-0-pending').check();
      // await page.getByRole('button', { name: 'Post' }).click();
      // await page.getByRole('button', { name: 'Yes' }).click();
      // await page.getByRole('link', { name: 'Underwriting' }).click();
      // await page.locator('#globalSearch').click();
      // await page.locator('#globalSearch').press('Control+V');
      // await page.locator('#search').first().click();
      // await page.locator("//tr[@class='ng2-smart-row selected ng-star-inserted']").click();
      // await page.locator('//nb-tabset//ul/li[1]/a').click();
      // await page.getByRole('link', { name: 'Payment', exact: true }).click();
      // await page.getByRole('cell').filter({ hasText: /^$/ }).nth(2).click();
      // await page.getByRole('cell').filter({ hasText: /^$/ }).nth(2).click();
      // await page.getByRole('cell').filter({ hasText: /^$/ }).nth(3).click();
      // await page.getByRole('cell').filter({ hasText: /^$/ }).nth(3).click();
      // await page.getByRole('link', { name: 'Accounting' }).click();
      // --- Optional: screenshot for success ---
      await page.screenshot({ path: `row-${i + 1}-success.png` });
      console.log({
        row: i + 1,
        RiskId: riskId,
        Status: 'SUCCESS'
      });
    } catch (error) {
      console.error(` FAILED ROW ${i + 1} | RiskId: ${riskId}`, error);

      if (page && !page.isClosed()) {
        await page.screenshot({ path: `row-${i + 1}-error.png` });
      } else {
        console.log(' Page already closed, skipping screenshot');
      }
      continue;
    }

  }
  // small delay between rows
  await page.waitForTimeout(2000);
});