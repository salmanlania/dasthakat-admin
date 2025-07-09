package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import utils.BaseTest;

import java.security.Key;
import java.time.Duration;
import java.util.List;

public class ChargeOrderPage extends BaseTest {
    WebDriver driver;
    WebDriverWait wait;

    private final By CLICK_SALES_MANAGEMENT_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) div");
    private final By CLICK_QUOTATION_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) ul li span a");
    private final By CLICK_CHARGE_ORDER_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div button:nth-child(3)");
    private final By VERIFY_MODAL_IS_OPEN = By.xpath("//p[contains(.,'Select products to charge order.')]");
    private final By CLICK_CANCEL_BUTTON_OF_CHARGE_ORDER_MODAL = By.cssSelector("button.ant-btn.css-dev-only-do-not-override-1u61tqm.ant-btn-primary.ant-btn-color-primary.ant-btn-variant-solid.w-40");
    private final By CLICK_CHARGE_BUTTON_OF_CHARGE_ORDER_MODAL = By.cssSelector("button.ant-btn.css-dev-only-do-not-override-1u61tqm.ant-btn-default.ant-btn-color-default.ant-btn-variant-outlined.w-40");
    private final By INPUT_QTY_ROW_1 = By.cssSelector("#charge-order-modal > div.ant-table-wrapper.css-dev-only-do-not-override-1u61tqm > div > div > div > div > div.ant-table-body > table > tbody tr:nth-child(2) td:nth-child(8) input");
    private final By INPUT_QTY_ROW_1_ERROR_MESSAGE = By.cssSelector("#charge-order-modal > div.ant-table-wrapper.css-dev-only-do-not-override-1u61tqm > div > div > div > div > div.ant-table-body > table > tbody tr:nth-child(2) td:nth-child(8) div.ant-form-item-explain-error");
    private final By ENTER_CUSTOMER_PO = By.id("charge-order-modal_customer_po_no");

    public ChargeOrderPage(WebDriver driver) {
        this.driver = driver;
//        this.baseTest = baseTest;
        // Set an explicit wait timeout of 10 seconds (adjust as needed)
        wait = new WebDriverWait(driver, Duration.ofSeconds(40));
    }
    public void clickSaleManagementDropdown() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SALES_MANAGEMENT_DROPDOWN)).click();
        WebElement subMenu = wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_QUOTATION_DROPDOWN));
        Assert.assertTrue(subMenu.isDisplayed(), "❌ Submenu is not displayed after clicking Sales Management dropdown.");
    }
    public void clickQuotationDropdown() {
        // Wait for element to be clickable then click
        List<WebElement> links = driver.findElements(CLICK_QUOTATION_DROPDOWN);

        for (WebElement link : links) {
            if (link.getText().trim().equals("Quotation")) {
                link.click();
                break;
            }
        }
    }

    public void clickChargeOrderButton(){
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CHARGE_ORDER_BUTTON_QUOTATION_ON_LIST_VIEW)).click();
        // Wait for modal title to be visible
        WebElement modalTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_MODAL_IS_OPEN));

// Get text and assert
        String actualText = modalTitle.getText();
        Assert.assertTrue(actualText.contains("Select products to charge order."),
                "Modal text is incorrect! Found: " + actualText);
    }
    public void inputCustomerPo(){
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.ant-modal-content")));
        wait.until(ExpectedConditions.visibilityOfElementLocated(ENTER_CUSTOMER_PO)).sendKeys("PO123456");
    }
   public void clickCancelModalButton(){
        wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_CANCEL_BUTTON_OF_CHARGE_ORDER_MODAL)).click();
    }
    public void clickSaveChargeModalButton(){
        wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_CHARGE_BUTTON_OF_CHARGE_ORDER_MODAL)).click();
    }
    public void inputQtyForRow1() throws InterruptedException {
        WebElement qtyInput = wait.until(ExpectedConditions.visibilityOfElementLocated(INPUT_QTY_ROW_1));
        qtyInput.sendKeys(Keys.chord(Keys.CONTROL, "a", Keys.DELETE));
        qtyInput.sendKeys("0");
        Thread.sleep(2000);
        clickSaveChargeModalButton();

        WebElement modalTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(INPUT_QTY_ROW_1_ERROR_MESSAGE));

// Get text and assert
        String actualText = modalTitle.getText();
        Assert.assertTrue(actualText.contains("Quantity must be greater than 0"),
                "Modal text is incorrect! Found: " + actualText);
    }

}
