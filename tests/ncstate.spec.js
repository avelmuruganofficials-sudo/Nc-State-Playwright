import { test, expect } from '@playwright/test';
import xlsx from 'xlsx';
const workbook = xlsx.readFile('./tests/DATA/Allstate.xlsx');
const sheetName = 'NCState';
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);
test('Excel data based automation', async ({ page }) => {
  await page.goto('https://www.landydev.com/#/auth/login');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Email' }).fill('svelmurugan@stepladdersolutions.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    console.log(`Starting row ${i + 1} RiskId: ${row.RiskId}`);
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
      await page.getByRole('button', { name: ' Rate' }).click();
      await page.waitForLoadState('networkidle');
      await page.locator('//tbody/tr[1]/td[2]/button[3]').click();
      const today = new Date().toISOString().split('T')[0];
      await page.locator('div input#minDate').fill(today);
      await page.locator('button#save').click();
      await page.locator('button#sendMail > span').click();
      await page.waitForLoadState('networkidle');
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('C:/Users/avelm/Downloads/IL7324_GROU009_RAB4451037-26_830197_858_4278707.pdf');
      await page.locator("div[class='col-sm-6 ng-star-inserted'] td[class='ng-star-inserted']").click();

      await page.waitForTimeout(3000);
      await page.locator('//*[@id="moveToAccounting"]').click();
      await page.locator('//*[@id="accounting"]').click();
      await page.waitForTimeout(3000);
      // ****************************Payment**************************
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
      
      // ********************************Booking***************************************
      
      

      await page.screenshot({ path: `row-${i + 1}-success.png` });
      console.log({
        row: i + 1,
        RiskId: row.RiskId,
        Status: 'SUCCESS'
      });
    } catch (error) {
      console.error(` FAILED ROW ${i + 1} | RiskId: ${row.RiskId}`, error);
      await page.screenshot({ path: `row-${i + 1}-error.png` });
      continue;
    }

    await page.waitForTimeout(2000);
  }
});