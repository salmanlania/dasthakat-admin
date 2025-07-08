package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import utils.BaseTest;

import java.time.Duration;
import java.util.List;

public class ChargeOrderPage extends BaseTest {
    private final BaseTest baseTest;
    WebDriver driver;
    WebDriverWait wait;

    private final By CLICK_SALES_MANAGEMENT_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) div");
    private final By CLICK_QUOTATION_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) ul li span a");
    private final By CLICK_CHARGE_ORDER_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div button:nth-child(3)");
    private final By CLICK_CANCEL_BUTTON_OF_CHARGE_ORDER_MODAL = By.cssSelector(".justify-center button.ant-btn.css-dev-only-do-not-override-1u61tqm.ant-btn-default.ant-btn-color-default.ant-btn-variant-outlined.w-40");

    public ChargeOrderPage(WebDriver driver, BaseTest baseTest) {
        this.baseTest = baseTest;
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
        wait.until(ExpectedConditions.elementToBeClickable(
                CLICK_CHARGE_ORDER_BUTTON_QUOTATION_ON_LIST_VIEW)).click();

    wait.until(ExpectedConditions.elementToBeClickable(
            CLICK_CANCEL_BUTTON_OF_CHARGE_ORDER_MODAL)).click();
    }


}
