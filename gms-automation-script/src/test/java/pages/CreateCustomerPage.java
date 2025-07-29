package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import utils.BaseTest;

import java.time.Duration;
import java.util.List;

public class CreateCustomerPage {
    private final BaseTest baseTest;
    WebDriver driver;
    WebDriverWait wait;
    By clickAdministration = By.cssSelector("div[data-menu-id*=\"administration\"][aria-controls*=\"administration-popup\"]");
    By clickGeneralSetup = By.cssSelector(".ant-menu-title-content");
    By clickCustomer = By.xpath("//span[@class=\"ant-menu-title-content\"]//a[contains(text(), \"Customer\")]");
    By clickCreateCustomerButton = By.xpath("//*[contains(@class, 'ant-btn-variant-solid')]//span[contains(text(), 'Add New')]");
    By clickCreatePaymentTermsButton = By.xpath("//*[contains(@class, 'ant-btn-variant-solid')]//span[contains(text(), 'Add New')]");
    By inertName = By.id("customer_name");
    By cutomerEmail = By.id("customer_email_sales");
    By cutomerEmailAccounting = By.id("customer_email_accounting");
    By customerRebatePercent = By.id("customer_rebate_percent");
    By cutomerPhooneNo = By.id("customer_phone_no");
    By cutomerCustomrAddress = By.id("customer_address");
    By cutomerCustomrBillingAddress = By.id("customer_billing_address");
    By selectSalesman = By.id("customer_salesman_id");
    By selectPaymentTerms = By.id("customer_payment_id");
    By clickCreateSalesmanPlusButton = By.cssSelector("#customer > div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(3) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    By clickCreatePaymentTermsPlusButton = By.cssSelector("#customer > div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(8) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    By insertSalesman = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    By insertTerms = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    By insertSalesmanPercentage = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(3) input");
    By clickSaveSalesmanButton = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(5) div button:nth-child(2)");
    By clickSavePaymentTermsButton = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) div button:nth-child(2)");
    By customerCreatedPupup = By.xpath("//div[text()='Customer created successfully']");

    By clickSave = By.cssSelector(".w-28");

    public CreateCustomerPage(WebDriver driver, BaseTest baseTest) {
        this.driver = driver;
        this.baseTest = baseTest;
        // Set an explicit wait timeout of 10 seconds (adjust as needed)
        wait = new WebDriverWait(driver, Duration.ofSeconds(40));
    }


    public void createCustomer(String CustomerName, String CustomerEmail, String CustomerEmailAccounting, String CustomerPhoneNo, String CustomerRebatePercen, String CustomerAddress, String CustomerBillingAddress, String salesName, String salesNamePercentage, String termText) throws InterruptedException {
        String parentWindow = baseTest.getCurrentWindowHandle();
        wait.until(ExpectedConditions.visibilityOfElementLocated(clickAdministration)).click();
        List<WebElement> elements = driver.findElements(clickGeneralSetup);
        for (WebElement el : elements) {
            if (el.getText().equals("General Setup")) {
                el.click(); // or perform your assertion
//                break;
            }
        }

        wait.until(ExpectedConditions.visibilityOfElementLocated(clickCustomer)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(clickCreateCustomerButton)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(inertName)).sendKeys(CustomerName);

        // Wait for the selectSalesman element and click it
        wait.until(ExpectedConditions.visibilityOfElementLocated(selectSalesman)).click();
        wait.until(ExpectedConditions.attributeToBe(selectSalesman, "aria-expanded", "true"));

// Initialize the isListVisible flag
        boolean isListVisible;
        try {
            System.out.println("Waiting for the salesman list to become visible...");

            // Use a broader CSS selector instead of ID to make it more flexible
            // Replace this with the actual locator you find to be correct
            By listLocator = By.cssSelector(".rc-virtual-list-holder-inner");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));

            isListVisible = true;
            System.out.println("Salesman list found and visible.");
        } catch (TimeoutException e) {
            isListVisible = false;
            System.out.println("Salesman list not found within the timeout.");
        }

// If the list is visible, select the first item
        if (isListVisible) {
            System.out.println("Selecting the first item from the list...");

            // Use a broader selector for the first item in the list
            By firstItemLocator = By.cssSelector(".rc-virtual-list-holder-inner div");

            // Wait until the first item is present and clickable
            WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
            System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));

            wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
            System.out.println("First item selected from the list.");
        }



// Step 4: If list is not visible, click the fallback path
        if (!isListVisible) {
            wait.until(ExpectedConditions.visibilityOfElementLocated(clickCreateSalesmanPlusButton)).click();
            baseTest.switchToNewWindow();
            Thread.sleep(10000);
            wait.until(ExpectedConditions.visibilityOfElementLocated(clickCreateCustomerButton)).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(insertSalesman)).sendKeys(salesName);
            wait.until(ExpectedConditions.visibilityOfElementLocated(insertSalesmanPercentage)).sendKeys(salesNamePercentage);
            wait.until(ExpectedConditions.visibilityOfElementLocated(clickSaveSalesmanButton)).click();
            Thread.sleep(10000);
            baseTest.switchToParentWindow(parentWindow);
            // back to parent window and click the salesman and select the created salesman
            // Use a broader selector for the first item in the list
            Thread.sleep(1000);
            wait.until(ExpectedConditions.visibilityOfElementLocated(selectSalesman)).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(selectSalesman)).sendKeys(salesName);
            By firstItemLocator = By.cssSelector(".rc-virtual-list-holder-inner div");

            // Wait until the first item is present and clickable
            WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
            System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));

            wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
            System.out.println("First item selected from the list.");
        }



        wait.until(ExpectedConditions.visibilityOfElementLocated(cutomerEmail)).sendKeys(CustomerEmail);
        wait.until(ExpectedConditions.visibilityOfElementLocated(cutomerEmailAccounting)).sendKeys(CustomerEmailAccounting);
        wait.until(ExpectedConditions.visibilityOfElementLocated(cutomerPhooneNo)).sendKeys(CustomerPhoneNo);

        // Wait for the Payment Terms  element and click it
        wait.until(ExpectedConditions.visibilityOfElementLocated(selectPaymentTerms)).click();
        wait.until(ExpectedConditions.attributeToBe(selectPaymentTerms, "aria-expanded", "true"));
// Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Payment list to become visible...");
            By listLocator = By.cssSelector("#customer_payment_id_list ~ div.rc-virtual-list");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));
            isListVisible1 = true;
            System.out.println("Payment list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Payment list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Payment list...");
            By firstItemLocator = By.cssSelector("#customer_payment_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");

            try {
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error selecting first item: " + e.getMessage());
            }
        } else {
            System.out.println("Taking fallback path...");
            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(clickCreatePaymentTermsPlusButton)).click();
                baseTest.switchToNewWindow();
                Thread.sleep(10000);
                wait.until(ExpectedConditions.visibilityOfElementLocated(clickCreatePaymentTermsButton)).click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(insertTerms)).sendKeys(termText);
                wait.until(ExpectedConditions.visibilityOfElementLocated(clickSavePaymentTermsButton)).click();
                Thread.sleep(10000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.visibilityOfElementLocated(selectPaymentTerms)).click();

                By firstItemLocator = By.cssSelector("#customer_payment_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }

// THIS CODE WILL RUN AFTER EITHER IF OR ELSE BLOCK
        System.out.println("Continuing with rest of the operations...");
        wait.until(ExpectedConditions.visibilityOfElementLocated(customerRebatePercent)).sendKeys(CustomerRebatePercen);
        wait.until(ExpectedConditions.visibilityOfElementLocated(cutomerCustomrAddress)).sendKeys(CustomerAddress);
        wait.until(ExpectedConditions.visibilityOfElementLocated(cutomerCustomrBillingAddress)).sendKeys(CustomerBillingAddress);

        List<WebElement> elements3 = driver.findElements(clickSave);
        for (WebElement el : elements3) {
            if (el.getText().equals("Save")) {
                el.click();
                break;
            }

        }

        wait.until(ExpectedConditions.visibilityOfElementLocated(customerCreatedPupup));
        WebElement successMessage = driver.findElement(customerCreatedPupup);


      // Get the actual text
        String actualText = successMessage.getText();

      // Expected text
        String expectedText = "Customer created successfully";

        // Assert exact match
        Assert.assertEquals(actualText, expectedText, "Customer created successfully");

    }
}
