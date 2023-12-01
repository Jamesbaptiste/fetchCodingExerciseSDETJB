import { test, expect } from '@playwright/test';
import FindFakeGoldBarPage from '../Pages/fetchTestPage';

test('Find fake gold bar test', async ({ page }) => {
  const findFakeGoldBarPage = new FindFakeGoldBarPage(page);

  // Go to website
  await page.goto('http://sdetchallenge.fetch.com/');

  
  let goldBarNumbersRange = [];
  for (let i = 0; i < 8; i++) {
    goldBarNumbersRange.push(i);
  }

  // Initializing number of weighings count
  let weighCount = 0;

  while (goldBarNumbersRange.length > 1) {
    const middle = Math.floor(goldBarNumbersRange.length / 2);
    const leftHalf = goldBarNumbersRange.slice(0, middle);
    const rightHalf = goldBarNumbersRange.slice(middle);

    // Weigh the left and right halves
    await findFakeGoldBarPage.weighGoldBars(leftHalf, rightHalf);

    // Increment number of weighings count after each weighing
    weighCount++;

    // Get the weighing result
    const result = await findFakeGoldBarPage.getWeighingResult();

    // Make a decision based on the result
    if (result.includes('<')) {
      goldBarNumbersRange = leftHalf;
    } else if (result.includes('>')) {
      goldBarNumbersRange = rightHalf;
    } else {
      // Weights are equal; the fake bar is outside the weighed bars
      goldBarNumbersRange = [];
      for (let i = 0; i < 9; i++) {
        if (!(leftHalf.includes(i) || rightHalf.includes(i))) {
          goldBarNumbersRange.push(i);
        }
      }
    }

    // Reset bowls for the next iteration
    await findFakeGoldBarPage.resetBowlGrids();
  }

  // Wait for the alert
  await findFakeGoldBarPage.waitForAlert();

  // Once the range is narrowed down to a single bar, click on the corresponding gold bar number
  const fakeGoldBar = goldBarNumbersRange[0];
  await findFakeGoldBarPage.clickGoldBar(fakeGoldBar);
  console.log('The fake gold bar is number: ', fakeGoldBar)
  console.log('Number of weighings: ', weighCount)
      console.log(
        'List of weighings made: ',
        await page.locator('.game-info > ol').textContent()
      );
});
