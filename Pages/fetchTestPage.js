class FindFakeGoldBarPage {
  constructor(page) {
    this.page = page;
    this.weighingResult = page.locator('.result #reset.button');
  }

  async weighGoldBars(leftBowlGrid, rightBowlGrid) {
    // Converts the numbers in the left bowl grid to strings
    const leftBowlGridStrings = [];
    for (let i = 0; i < leftBowlGrid.length; i++) {
      leftBowlGridStrings.push(String(leftBowlGrid[i]));
    }

    // Converts the numbers in the right bowl grid to strings
    const rightBowlGridStrings = [];
    for (let i = 0; i < rightBowlGrid.length; i++) {
      rightBowlGridStrings.push(String(rightBowlGrid[i]));
    }

    // Fill left bowl grid
    for (let i = 0; i < leftBowlGridStrings.length; i++) {
      await this.page.fill(`#left_${i}`, leftBowlGridStrings[i]);
    }

    // Fill right bowl grid
    for (let i = 0; i < rightBowlGridStrings.length; i++) {
      await this.page.fill(`#right_${i}`, rightBowlGridStrings[i]);
    }

    // Click "Weigh" button
    await this.page.click('#weigh');

    // Wait for weigh measurement result
    await this.page.waitForSelector(
      '.result #reset.button:not(:has-text("?"))'
    );
  }

  async getWeighingResult() {
    // Get the result of weighing
    if (
      (await this.weighingResult.textContent()) === '<')
    { return '<';
    } else if (
      (await this.weighingResult.textContent()) === '>'
    ) {
      return '>';
    } else {
      return '=';
    }
  }

  async resetBowlGrids() {
    // Click "Reset" button
    await this.page.locator('button:text("Reset")').click();
  }

  async clickGoldBar(goldBarNumber) {
    // Click on the gold bar button at the bottom
    await this.page.click(`#coin_${goldBarNumber}`);

  }

  async waitForAlert() {
    // Wait for the alert
    this.page.on('dialog', async (alert) => {
      const text = alert.message();
      console.log('Alert text:', text);
      await alert.accept();
    });
  }
}

export default FindFakeGoldBarPage;
