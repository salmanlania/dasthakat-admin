package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import utils.BaseTest;

import java.time.Duration;
import java.util.List;

public class ChargeOrderPage extends BaseTest {
    WebDriver driver;
    WebDriverWait wait;

    private final By CLICK_SALES_MANAGEMENT_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) div");
    private final By CLICK_WAREHOUSE_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(4) div");
    private final By CLICK_QUOTATION_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) ul li span a");
    private final By CLICK_PICK_LIST_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(4) ul li span a");
    private final By CLICK_CHARGE_ORDER_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div button:nth-child(3)");
    private final By VERIFY_MODAL_IS_OPEN = By.xpath("//p[contains(.,'Select products to charge order.')]");
    private final By CLICK_CANCEL_BUTTON_OF_CHARGE_ORDER_MODAL = By.cssSelector("#charge-order-modal div:nth-child(3) button:nth-child(1)");
    private final By CLICK_CHARGE_BUTTON_OF_CHARGE_ORDER_MODAL = By.cssSelector("#charge-order-modal div:nth-child(3) button:nth-child(2)");
    private final By INPUT_QTY_ROW_1 = By.cssSelector("#charge-order-modal > div.ant-table-wrapper.css-dev-only-do-not-override-1u61tqm > div > div > div > div > div.ant-table-body > table > tbody tr:nth-child(2) td:nth-child(8) input");
    private final By INPUT_QTY_ROW_1_ERROR_MESSAGE = By.cssSelector("#charge-order-modal > div.ant-table-wrapper.css-dev-only-do-not-override-1u61tqm > div > div > div > div > div.ant-table-body > table > tbody tr:nth-child(2) td:nth-child(8) div.ant-form-item-explain-error");
    private final By CHARGE_ORDER_CREATED_MESSAGE = By.cssSelector(".animate-enter div div div:nth-child(2) p:nth-child(1)");
    private final By CLICK_VIEW_DETAIL_CHARGE_ORDER = By.cssSelector(".animate-enter div div div:nth-child(2) p:nth-child(2)");
    private final By SELECT_ALL_ROWS = By.cssSelector("#charge-order-modal div.ant-table-header thead tr th label.ant-checkbox-wrapper");
    private final By CLICK_IJO_TOP_ROW_EDIT = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:last-of-type div a");
    private final By CLICK_PICK_LIST_TOP_ROW_EDIT = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:last-of-type div a");
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

    public void clickChargeOrderButton() throws InterruptedException {
        Thread.sleep(2000);
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
    public void clickSaveChargeModalButton() {
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CHARGE_BUTTON_OF_CHARGE_ORDER_MODAL)).click();

        // ✅ Wait for success toast/modal to confirm the request did not fail
        wait.until(ExpectedConditions.visibilityOfElementLocated(CHARGE_ORDER_CREATED_MESSAGE));
    }
    public void selectAllRows() {
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_ALL_ROWS)).click();

    }
    public void inputQtyForRow1() throws InterruptedException {
        WebElement qtyInput = wait.until(ExpectedConditions.visibilityOfElementLocated(INPUT_QTY_ROW_1));
        qtyInput.sendKeys(Keys.chord(Keys.CONTROL, "a", Keys.DELETE));
        qtyInput.sendKeys("0");
        Thread.sleep(2000);
        clickSaveChargeModalButton();

        WebElement modalTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(INPUT_QTY_ROW_1_ERROR_MESSAGE));

        String actualText = modalTitle.getText();
        Assert.assertTrue(actualText.contains("Quantity must be greater than 0"),
                "Modal text is incorrect! Found: " + actualText);
    }
    public void inputQtyForAllRow() throws InterruptedException {
        WebElement qtyInput = wait.until(ExpectedConditions.visibilityOfElementLocated(INPUT_QTY_ROW_1));
        List<WebElement> inputs = driver.findElements(By.cssSelector(
                "#charge-order-modal tbody tr td:nth-child(8) input"
        ));
        for (WebElement input : inputs) {
            input.sendKeys(Keys.chord(Keys.CONTROL, "a", Keys.DELETE));
            input.sendKeys("1");
        }
    }
    public String getQuotationNoWhoseOrderIsCreatingText(){
        WebElement paragraph = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".ant-modal-body div p:nth-child(2)")
        ));
        return paragraph.getText();
    }

    public void verifyChargeOrderCreatedMessage(){
        WebElement modalTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(CHARGE_ORDER_CREATED_MESSAGE));

        String actualText = modalTitle.getText();
        Assert.assertTrue(actualText.contains("Charge order has been created."),
                "Charge order has been created. Message Not Found or Popup Not Appears" + actualText);

    }
    public String getReferenceDocumentIdentityOfCreatedChargeOrder() {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.id("chargeOrder_ref_document_identity")
        ));
        return input.getAttribute("value");
    }

    public void verifyChargeCreatedSuccessfullyAndListedonChargeOrderListView(String expectedText){
        // Get expected text (Quotation No)

//        System.out.println("Expected Text: " + expectedText);

        // Click 'View Detail' button for the charge order
        wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_VIEW_DETAIL_CHARGE_ORDER)).click();

        // Get actual text (Reference Document Identity)
        String actualText = getReferenceDocumentIdentityOfCreatedChargeOrder();
        System.out.println("Actual Text: " + actualText);

        // Assert that they match
        Assert.assertEquals(actualText.trim(), expectedText.trim(),
                "Charge Order Reference Document Identity does not match expected Quotation No!");


    }

    public String getNewCreatedChargeOrderNo(){
        WebElement paragraph = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#chargeOrder p span.ml-4")
        ));
        return paragraph.getText();
    }

    public void clickChargeOrderDetail(){
        wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_VIEW_DETAIL_CHARGE_ORDER)).click();

    }

    public void clickIJODropdown() {
        // Wait for element to be clickable then click
        List<WebElement> links = driver.findElements(CLICK_QUOTATION_DROPDOWN);

        for (WebElement link : links) {
            if (link.getText().trim().equals("IJO")) {
                link.click();
                break;
            }
        }
    }

    public void openEditFormIJOTopRow(){
        wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_IJO_TOP_ROW_EDIT)).click();

    }
    public String getReferenceDocumentIdentityOfIJO() {
        WebElement paragraph = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".ant-table-tbody tr:last-child td:nth-child(2)")
        ));
        return paragraph.getText();
    }
    public void verifyIJOCreatedForNewlyCreatedChargeOrder(String expectedIJOText){
        System.out.println("IJO Expected Text: " + expectedIJOText);
        String actualText = getReferenceDocumentIdentityOfIJO();

        System.out.println("IJO Actual Text: " + actualText);

        Assert.assertEquals(actualText.trim(), expectedIJOText.trim(),
                "On IJO Charge order does not Match!");


    }
    public void clickServiceOrderDropdown() {
        // Wait for element to be clickable then click
        List<WebElement> links = driver.findElements(CLICK_QUOTATION_DROPDOWN);

        for (WebElement link : links) {
            if (link.getText().trim().equals("Service Order")) {
                link.click();
                break;
            }
        }
    }
    public String getReferenceDocumentIdentityOfServiceOrder() {
        WebElement paragraph = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(7)")
        ));
        return paragraph.getText();
    }
    public String getReferenceDocumentIdentityOfPickList() {
        WebElement paragraph = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2)")
        ));
        return paragraph.getText();
    }
    public String getReferenceDocumentIdentityOfServiceList() {
        WebElement paragraph = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2)")
        ));
        return paragraph.getText();
    }
    public void verifyServiceOrderCreatedForNewlyCreatedChargeOrder(String expectedServiceOrderText){
        System.out.println("Service OrderExpected Text: " + expectedServiceOrderText);
        String actualText = getReferenceDocumentIdentityOfServiceOrder();
        System.out.println("Service OrderActual Text: " + actualText);

        Assert.assertEquals(actualText.trim(), expectedServiceOrderText.trim(),
                "On Service Order Form Charge order does not Match!");


    }
    public void clickWarehouseDropdown() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_WAREHOUSE_DROPDOWN)).click();
        WebElement subMenu = wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PICK_LIST_DROPDOWN));
        Assert.assertTrue(subMenu.isDisplayed(), "❌ Submenu is not displayed after clicking Warehouse dropdown.");
    }
    public void clickPickListDropdown() {
        // Wait for element to be clickable then click
        List<WebElement> links = driver.findElements(CLICK_PICK_LIST_DROPDOWN);

        for (WebElement link : links) {
            if (link.getText().trim().equals("Pick List")) {
                link.click();
                break;
            }
        }
    }
    public void verifyPickListCreatedForNewlyCreatedChargeOrder(String expectedPickListText){
        System.out.println("Pick List Expected Text: " + expectedPickListText);
        String actualText = getReferenceDocumentIdentityOfPickList();
        System.out.println("Pic kList Actual Text: " + actualText);

        Assert.assertEquals(actualText.trim(), expectedPickListText.trim(),
                "On Pick List Charge order does not Match!");


    }
    public void clickServiceListDropdown() {
        // Wait for element to be clickable then click
        List<WebElement> links = driver.findElements(CLICK_PICK_LIST_DROPDOWN);

        for (WebElement link : links) {
            if (link.getText().trim().equals("Service List")) {
                link.click();
                break;
            }
        }
    }
    public void verifyServiceListCreatedForNewlyCreatedChargeOrder(String expectedServiceListText){
        System.out.println("Service List Expected Text: " + expectedServiceListText);
        String actualText = getReferenceDocumentIdentityOfServiceList();
        System.out.println("Service List Actual Text: " + actualText);

        Assert.assertEquals(actualText.trim(), expectedServiceListText.trim(),
                "On Service List Charge order does not Match!");


    }




}
