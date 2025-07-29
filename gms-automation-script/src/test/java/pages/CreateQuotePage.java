package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import utils.BaseTest;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class CreateQuotePage extends BaseTest {
    private final BaseTest baseTest;
    WebDriver driver;
    WebDriverWait wait;
    String impaCode = "IMPA_CODE" + System.currentTimeMillis();
    List<String> windowStack = new ArrayList<>();

    private final By CLICK_SALES_MANAGEMENT_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) div");
    private final By CLICK_QUOTATION_DROPDOWN = By.cssSelector(".ant-layout-sider-children ul li:nth-child(3) ul li span a");
    private final By CLICK_ADD_NEW_QUOTATION_BUTTON = By.xpath("//*[contains(@class, 'ant-btn-variant-solid')]//span[contains(text(), 'Add New')]");

    private final By CLICK_SALESMAN_INPUT = By.id("quotation_salesman_id");
    private final By CLICK_PAYMENT_TERMS_INPUT = By.id("quotation_payment_id");

    private final By SELECT_SALESMAN_FROM_DROPDOWN = By.cssSelector("#quotation_salesman_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_PAYMENT_TERMS_FROM_DROPDOWN = By.cssSelector("#quotation_payment_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_PORT_FROM_DROPDOWN = By.cssSelector("#quotation_port_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_VALIDITY_FROM_DROPDOWN = By.cssSelector("#quotation_validity_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_EVENT_INPUT = By.id("quotation_event_id");
    private final By INSERT_IMO = By.id("vessel_imo");
    private final By INSERT_VESSEL_NAME = By.id("vessel_name");
    private final By SELECT_EVENT_FROM_DROPDOWN = By.cssSelector("#quotation_event_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_PRODUCT_FROM_DROPDOWN = By.cssSelector("#quotation_product_name-0_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_CATEGORY_FROM_DROPDOWN_ON_PRODUCT_POPUP = By.cssSelector("#product_category_id_list~div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_SUB_CATEGORY_FROM_DROPDOWN_ON_PRODUCT_POPUP = By.cssSelector("#product_sub_category_id_list~div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_EVENT_PLUS_BUTTON = By.cssSelector("#quotation> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(3) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_EVENT_VESSEL_POPUP_PLUS_BUTTON = By.cssSelector("#event> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(3) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_FLAG_VESSEL_POPUP_PLUS_BUTTON = By.cssSelector("#vessel> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(4) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_CLASS_1_VESSEL_POPUP_PLUS_BUTTON = By.cssSelector("#vessel> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(5) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_CLASS_2_VESSEL_POPUP_PLUS_BUTTON = By.cssSelector("#vessel> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(6) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_SALESMAN_PLUS_BUTTON = By.cssSelector("#quotation> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(2) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_PAYMENT_TERMS_PLUS_BUTTON = By.cssSelector("#quotation> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(16) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_PORT_PLUS_BUTTON = By.cssSelector("#quotation> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(17) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_VALIDITY_PLUS_BUTTON = By.cssSelector("#quotation> div.ant-row.css-dev-only-do-not-override-1u61tqm > div:nth-child(15) > div > div > div.ant-col.ant-form-item-control.css-dev-only-do-not-override-1u61tqm > div > div > div > span > svg");
    private final By SELECT_TERMS_PLUS_BUTTON = By.cssSelector("#quotation> div.rounded-lg div div div div div div div svg");

    private final By CLICK_CUSTOMER_INPUT_ON_EVENT_POPUP = By.id("event_customer_id");
    private final By CLICK_CUSTOMER_INPUT_ON_VESEL_POPUP = By.id("vessel_customer_id");
    private final By CLICK_FLAG_INPUT_ON_VESEL_POPUP = By.id("vessel_flag_id");
    private final By CLICK_CLASS_1_INPUT_ON_VESEL_POPUP = By.id("vessel_class1_id");
    private final By CLICK_CLASS_2_INPUT_ON_VESEL_POPUP = By.id("vessel_class2_id");
    private final By SELECT_CUSTOMER_FROM_DROPDOWN_ON_EVENT_POPUP = By.cssSelector("#event_customer_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_CUSTOMER_FROM_DROPDOWN_ON_VESSEL_POPUP = By.cssSelector("#vessel_customer_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_VESSEL_FROM_DROPDOWN_ON_VESSEL_POPUP = By.cssSelector("#vessel_flag_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_VESSEL_INPUT_ON_EVENT_POPUP = By.id("event_vessel_id");
    private final By SELECT_VESSEL_FROM_DROPDOWN_ON_EVENT_POPUP = By.cssSelector("#event_vessel_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_FLAG_FROM_DROPDOWN_ON_VESSEL_POPUP = By.cssSelector("#vessel_flag_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_CLASS_1_FROM_DROPDOWN_ON_VESSEL_POPUP = By.cssSelector("#vessel_class1_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By SELECT_CLASS_2_FROM_DROPDOWN_ON_VESSEL_POPUP = By.cssSelector("#vessel_class2_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_CLASS1_INPUT_ON_EVENT_POPUP = By.id("event_class1_id");
    private final By SELECT_CLASS1_FROM_DROPDOWN_ON_EVENT_POPUP = By.cssSelector("#event_class1_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_CLASS2_INPUT_ON_EVENT_POPUP = By.id("event_class2_id");
    private final By SELECT_CLASS2_FROM_DROPDOWN_ON_EVENT_POPUP = By.cssSelector("#event_class2_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_SAVE_EVENT_POPUP_BUTTON = By.cssSelector(".justify-end button[type=submit]");
    private final By CLICK_SAVE_VESSEL_POPUP_BUTTON = By.cssSelector(".justify-end button[type=submit]");
    private final By CLICK_PERSON_INCHARGE_INPUT = By.id("quotation_person_incharge_id");
    private final By SELECT_PERSON_INCHARGE = By.cssSelector("#quotation_person_incharge_id_list ~ div.rc-virtual-list div.ant-select-item-option-active");

    private final By CUSTOMER_REF_INPUT = By.id("quotation_customer_ref");
    private final By DUE_DATE_INPUT = By.id("quotation_service_date");
    private final By ATTN_INPUT = By.id("quotation_attn");
    private final By DELIVERY_INPUY = By.id("quotation_delivery");
    private final By CLICK_PORT_INPUT = By.id("quotation_port_id");
    private final By CLICK_VALIDITY_INPUT = By.id("quotation_validity_id");
    private final By CLICK_TERMS_INPUT = By.cssSelector("#quotation .p-4 div div div div div div div  div div div div input");
    private final By SCROLL_NOTE_DIV = By.cssSelector("#quotation .p-4");
    private final By CLICK_NOTE_TEXT_AREA = By.id("quotation_term_desc");
    private final By SELECT_TERMS_FROM_DROPDOWN = By.cssSelector("#quotation_term_id_list ~  div.ant-select-item-option-active");
    private final By CLICK_LEFT_ADD_GRID = By.cssSelector(".ant-table-cell-fix-left button");
    private final By SEARCH_PRODUCT_TYPE = By.cssSelector("tr.ant-table-row:last-child td:nth-child(3) div span span input");
    private final By ADD_OTHER_PTYPE_DESCRIPTION = By.cssSelector("tr.ant-table-row:last-child td:nth-child(5) div div div div div input");
    private final By ADD_QTY_OF_ITEM = By.cssSelector("tr.ant-table-row:last-child td:nth-child(9) div div div div div input");
    private final By ADD_CUSTOMER_NOTES_EDIT_BUTTON_OF_ITEM = By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div");
    private final By CLICK_DELETE_BUTTON_ON_MODAL = By.xpath("/html/body/div[2]/div/div[2]/div/div[1]/div/div/div/div/button[2]/span");
    private final By ADD_INTERNAL_NOTES_EDIT_BUTTON_OF_ITEM = By.cssSelector("tr.ant-table-row:last-child td:nth-child(7) div div");
    private final By ADD_CUSTOMER_NOTES_TEXT = By.cssSelector(".ant-modal-content form");
    private final By ADD_CUSTOMER_NOTES_SAVE_BUTTON = By.cssSelector(".justify-center button:nth-child(2)");
    private final By ADD_UNIT_OF_ITEM = By.cssSelector("tr.ant-table-row:last-child td:nth-child(10) div div span span input");
    private final By CLICK_VENDOR_INPUT = By.cssSelector("tr.ant-table-row:last-child td:nth-child(11) div div span span input");
    private final By ADD_VENDOR_PORT_NO = By.cssSelector("tr.ant-table-row:last-child td:nth-child(12) input");
    private final By ADD_COST_PRICE = By.cssSelector("tr.ant-table-row:last-child td:nth-child(13) input");
    private final By ADD_MARKUP_PERCENTAGE = By.cssSelector("tr.ant-table-row:last-child td:nth-child(14) input");
    private final By ADD_DISCOUNT_PERCENTAGE = By.cssSelector("tr.ant-table-row:last-child td:nth-child(17) input");
    private final By CLICK_PRODUCT_PLUS_BUTTON_IN_GRID_TO_CREATE_PRODUCT = By.cssSelector("tr.ant-table-row:last-child td:nth-child(4) div div div div div span[unselectable=\"on\"] svg");
    private final By CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID = By.cssSelector("tr.ant-table-row:last-child td:nth-child(4) div div div div div div div span span input");
    private final By ADD_PRODUCT_NAME_PRODUCT_POPUP = By.cssSelector("#product div div div div:nth-child(3) div div div:nth-child(2) div div input");
    private final By CLICK_PRODUCT_TYPE_ON_POPUP = By.xpath("//*[@id=\"product\"]/div[1]/div[1]/div/div[2]//div/div/div[2]/div/div/div/div/span/span/input");

    private final By SELECT_PRODUCT_TYPE_ON_POPUP = By.xpath("//div[@id='product_product_type_id_list']/following-sibling::div[contains(@class, 'rc-virtual-list')]//div[contains(@class, 'ant-select-item-option')]//div[normalize-space(text())='Inventory']");
    private final By SELECT_PRODUCT_TYPE_SERVICE_ON_POPUP = By.xpath("//div[@id='product_product_type_id_list']/following-sibling::div[contains(@class, 'rc-virtual-list')]//div[contains(@class, 'ant-select-item-option')]//div[normalize-space(text())='Service']");
    private final By SELECT_PRODUCT_TYPE_IMPA_ON_POPUP = By.xpath("//div[@id='product_product_type_id_list']/following-sibling::div[contains(@class, 'rc-virtual-list')]//div[contains(@class, 'ant-select-item-option')]//div[normalize-space(text())='IMPA']");
    private final By ADD_PRODUCT_IMPA_CODE_PRODUCT_POPUP = By.cssSelector("#product div div div div:nth-child(4) div div div:nth-child(2) div div input");
    private final By ADD_PRODUCT_COST_PRICE_PRODUCT_POPUP = By.cssSelector("#product div div div div:nth-child(9) div div div:nth-child(2) div div input");
    private final By ADD_PRODUCT_SALES_PRICE_PRODUCT_POPUP = By.cssSelector("#product div div div div:nth-child(10) div div div:nth-child(2) div div input");
    private final By ADD_PRODUCT_SHORT_CODE_PRODUCT_POPUP = By.cssSelector("#product div div div div:nth-child(12) div div div:nth-child(2) div div input");
    private final By CLICK_PRODUCT_CATEGORY_INPUT = By.cssSelector("#product div div div div:nth-child(5) div div div:nth-child(2) div div input");
    private final By CLICK_PRODUCT_CATEGORY_PLUS_BUTTON = By.cssSelector("#product div div div div:nth-child(5) div div div:nth-child(2) div div div span[unselectable=\"on\"] svg");
    private final By CLICK_ADD_NEW_CATEGORY_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By CLICK_ADD_NEW_SALESMAN_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By CLICK_ADD_NEW_FLAG_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By CLICK_ADD_NEW_PAYMENT_TERMS_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By CLICK_ADD_NEW_PORT_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By CLICK_ADD_NEW_VALIDTY_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By CLICK_ADD_NEW_TERMS_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By INSERT_SALESMAN_NAME = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By INSERT_FLAG_NAME = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By INSERT_PAYMENT_TERMS_NAME = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By INSERT_PORT_NAME = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By INSERT_VALIDITY_NAME = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By INSERT_TERMS_NAME = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By INSERT_SALESMAN_PERCENTAGE = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(3) input");
    private final By CLICK_SALESMAN_SAVE_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(5) div button:nth-child(2)");
    private final By CLICK_FLAG_SAVE_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) div button:nth-child(2)");
    private final By CLICK_PAYMENT_TERMS_SAVE_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) div button:nth-child(2)");
    private final By CLICK_PORT_SAVE_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) div button:nth-child(2)");
    private final By CLICK_VALIDITY_SAVE_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) div button:nth-child(2)");
    private final By CLICK_TERMS_SAVE_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) div button:nth-child(2)");

    private final By INSERT_NAME_OF_PRODUCT_CATEGORY = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By CLICK_SAVE_PRODUCT_CATEGORY_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) button:nth-child(2)");

    private final By CLICK_PRODUCT_SUB_CATEGORY_INPUT = By.cssSelector("#product div div div div:nth-child(6) div div div:nth-child(2) div div input");
    private final By CLICK_PRODUCT_SUB_CATEGORY_PLUS_BUTTON = By.cssSelector("#product div div div div:nth-child(6) div div div:nth-child(2) div div div span[unselectable=\"on\"] svg");
    private final By CLICK_ADD_NEW_SUB_CATEGORY_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By INSERT_NAME_OF_PRODUCT_SUB_CATEGORY = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By SELECT_PRODUCT_CATEGORY_FOR_SUB_CATEGORY = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(3) div div span span input");
    private final By SELECT_CATEGORY_FOR_SUB_CATEGORY = By.cssSelector(".ant-select-item-option-active div");
    private final By CLICK_SAVE_PRODUCT_SUB_CATEGORY_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(5) button:nth-child(2)");
    private final By CLICK_PRODUCT_BRAND_INPUT = By.cssSelector("#product div div div div:nth-child(7) div div div:nth-child(2) div div input");
    private final By SELECT_BRAND_FROM_DROPDOWN_ON_PRODUCT_POPUP = By.cssSelector("#product_brand_id_list~div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_PRODUCT_BRAND_PLUS_BUTTON = By.cssSelector("#product div div div div:nth-child(7) div div div:nth-child(2) div div div span[unselectable=\"on\"] svg");

    private final By CLICK_ADD_NEW_BRAND_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By INSERT_NAME_OF_PRODUCT_BRAND = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By CLICK_SAVE_PRODUCT_BRAND_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) button:nth-child(2)");
    private final By CLICK_PRODUCT_UNIT_INPUT = By.cssSelector("#product div div div div:nth-child(8) div div div:nth-child(2) div div input");
    private final By SELECT_UNIT_FROM_DROPDOWN_ON_PRODUCT_POPUP = By.cssSelector("#product_unit_id_list~div.rc-virtual-list div.ant-select-item-option-active");
    private final By CLICK_PRODUCT_UNIT_PLUS_BUTTON = By.cssSelector("#product div div div div:nth-child(8) div div div:nth-child(2) div div div span[unselectable=\"on\"] svg");

    private final By CLICK_ADD_NEW_UNIT_BUTTON = By.xpath("//span[contains(text(), 'Add New')]");
    private final By INSERT_NAME_OF_PRODUCT_UNIT = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(2) input");
    private final By CLICK_SAVE_PRODUCT_UNIT_BUTTON = By.cssSelector(".ant-table-tbody tr:nth-child(2) td:nth-child(4) button:nth-child(2)");
    private final By CLICK_SAVE_PRODUCT_POPUP_BUTTON = By.cssSelector(".justify-end button[type=submit]");
    private final By CLICK_SAVE_QUOTATION_FORM = By.cssSelector(".justify-end button:nth-child(2)");
    private final By CLICK_SAVE_UPDATE_QUOTATION_FORM = By.cssSelector(".justify-end button:nth-child(4)");
    private final By CLICK_CANCEL_QUOTATION_FORM = By.cssSelector(".justify-end button:nth-child(1)");
    private final By SALESMAN_VALIDATION = By.xpath("//div[@id='quotation_salesman_id_help']");
    private final By EVENT_VALIDATION = By.xpath("//div[@id='quotation_event_id_help']");
    private final By QUOTATION_NO = By.cssSelector("#quotation p span:nth-child(2)");
    private final By VERIFY_VESSEL_SELECTION = By.cssSelector("#quotation div div:nth-child(4) div div div:nth-child(2) div div div div span span:nth-child(2)");
    private final By VERIFY_IMO_SELECTION = By.cssSelector("#quotation div div:nth-child(5) div div div:nth-child(2) div div input ");
    private final By VERIFY_CUSTOMER_SELECTION = By.cssSelector("#quotation div div:nth-child(6) div div div:nth-child(2) div div div div span span:nth-child(2)");
    private final By VERIFY_CLASS1_SELECTION = By.cssSelector("#quotation > div div:nth-child(7) > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div > span > span:nth-child(2)");
    private final By VERIFY_CLASS2_SELECTION = By.cssSelector("#quotation div div:nth-child(7) div:nth-child(2) div div:nth-child(2) div div > div div span span:nth-child(2)");
    private final By VERIFY_FLAG_SELECTION = By.cssSelector("#quotation div div:nth-child(8) div div div:nth-child(2) div div div div span span:nth-child(2)");
    private final By VERIFY_SALES_MAN_SELECTION = By.cssSelector("#quotation div div div div div:nth-child(2) div div div div span span:nth-child(2)");
    private final By CLICK_PROFILE_ICON = By.cssSelector(".ant-dropdown-trigger svg");
    private final By CLICK_LOGOUT = By.cssSelector(".ant-dropdown-placement-bottomRight ul li:nth-child(2)");
    private final By GLOBAL_SEARCH_INPUT_ON_LIST_VIEW_LOCATOR = By.cssSelector(".gap-2:nth-child(1) span input");
    private final By CLICK_SEARCHED_EDIT_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div:nth-child(2) a");
    private final By CLICK_PRINT_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div button.ant-btn.css-dev-only-do-not-override-1u61tqm.ant-btn-primary.ant-btn-color-primary.ant-btn-variant-solid.ant-btn-sm.ant-btn-icon-only.bg-rose-600.hover\\:\\!bg-rose-500");
    private final By CLICK_EXPORT_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div button.ant-btn.css-dev-only-do-not-override-1u61tqm.ant-btn-primary.ant-btn-color-primary.ant-btn-variant-solid.ant-btn-sm.ant-btn-icon-only.bg-emerald-800.hover\\:\\!bg-emerald-700");
    private final By CLICK_EXPORT_EXCEL_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type button.ant-tooltip-open");
    private final By CLICK_SINGLE_DELETE_BUTTON_QUOTATION_ON_LIST_VIEW = By.cssSelector(".ant-table-tbody tr:nth-child(3) td:last-of-type div div:nth-child(2) button:nth-child(2)");
    private final By CONFIRM_SINGLE_DELETE_YES = By.cssSelector(".ant-popover-content div.ant-popconfirm-buttons button:nth-child(2)");
    private final By QUOTATION_CREATED_MESSAGE_POPUP = By.xpath("//div[text()='Quotation created successfully']");
    private final By QUOTATION_UPDATED_MESSAGE_POPUP = By.xpath("//div[text()='Quotation updated successfully']");
    private final By QUOTATION_SINGLE_DELETE_MESSAGE_POPUP = By.xpath("//div[text()='Quotation deleted successfully']");
    private final By QUOTATION_BULK_DELETE_MESSAGE_POPUP = By.xpath("//*[@id=\"root\"]/div[2]/div/div/div[2]");
    private final By CLICK_SELECT_ALL_CHECK_BOX = By.cssSelector(".ant-table-selection-column div");
    private final By CLICK_BULK_DELETE_BUTTON = By.cssSelector(".gap-2:nth-child(1) div button");
    String GLOBAL_SEARCH_INPUT_ON_LIST_VIEW = ".gap-2:nth-child(1) span input";
    private By PAGINATION_FIRST_ITEM = By.cssSelector(".ant-pagination-mini li:nth-child(1)");

    public CreateQuotePage(WebDriver driver, BaseTest baseTest) {
        this.baseTest = baseTest;
        this.driver = driver;
//        this.baseTest = baseTest;
        // Set an explicit wait timeout of 10 seconds (adjust as needed)
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
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

    public void clickAddNewQuotationButton() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_ADD_NEW_QUOTATION_BUTTON)).click();
    }

    public void waitAndScrollToElement() {

        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_QUOTATION_BUTTON));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
        // Optional small pause so the scroll finishes smoothly
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public void sigOut() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PROFILE_ICON)).click();
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_LOGOUT)).click();
    }

    public void clickSaveQuotationButton() {
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_QUOTATION_FORM));

        // Scroll element into view using JS
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);

        // Small pause to allow smooth scroll to finish (optional, tweak if needed)
        try {
            Thread.sleep(300);
        } catch (InterruptedException ignored) {
        }

        // Re-check element to avoid stale element after scroll
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_QUOTATION_FORM)).click();
    }

    public void clickSaveUpdateQuotationButton() {
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_UPDATE_QUOTATION_FORM));

        // Scroll element into view using JS
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);

        // Small pause to allow smooth scroll to finish (optional, tweak if needed)
        try {
            Thread.sleep(300);
        } catch (InterruptedException ignored) {
        }

        // Re-check element to avoid stale element after scroll
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_UPDATE_QUOTATION_FORM)).click();
    }

    public void clickCancelQuotationButton() {
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(CLICK_CANCEL_QUOTATION_FORM));

        // Scroll element into view using JS
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);

        // Small pause to allow smooth scroll to finish (optional, tweak if needed)
        try {
            Thread.sleep(300);
        } catch (InterruptedException ignored) {
        }

        // Re-check element to avoid stale element after scroll
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CANCEL_QUOTATION_FORM)).click();
    }

    public void verifySalesManErrorValidations() {
        wait.until(ExpectedConditions.elementToBeClickable(SALESMAN_VALIDATION));
        WebElement element = driver.findElement(SALESMAN_VALIDATION);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});", element);
        WebElement validationMsg = driver.findElement(SALESMAN_VALIDATION);
        String actualText = validationMsg.getText().trim();

        Assert.assertEquals(actualText, "Salesman is required", "❌Salesman Validation message does not match.");
    }


    public void verifyEventErrorValidations() {
        WebElement validationMsg = driver.findElement(EVENT_VALIDATION);
        String actualText = validationMsg.getText().trim();

        Assert.assertEquals(actualText, "Event is required", "❌ Event Validation message does not match.");

    }

    public void verifyQuotationNoAuto() {
        wait.until(ExpectedConditions.elementToBeClickable(QUOTATION_NO));

        WebElement validationMsg = driver.findElement(QUOTATION_NO);
        String actualText = validationMsg.getText().trim();

        Assert.assertEquals(actualText, "AUTO", "❌ Quotation Number AUTO Not Found");
    }

    public void verifyVesselAppearOnSelectionOfEvent() {
        // Wait for the element to be visible AND have non-empty text
        WebElement span = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_VESSEL_SELECTION));

        // Re-fetch inside wait to avoid stale element reference
        wait.until(driver -> {
            WebElement refreshedSpan = driver.findElement(VERIFY_VESSEL_SELECTION);
            String text = refreshedSpan.getText().trim();
            return !text.isEmpty();
        });

        // Get the final (fresh) element and assert
        WebElement finalSpan = driver.findElement(VERIFY_VESSEL_SELECTION);
        String finalText = finalSpan.getText().trim();
        Assert.assertFalse(finalText.isEmpty(), "❌ Span is empty!");
    }

    public void verifyIMOAppearOnSelectionOfEvent() {
        // Wait until input is visible and has a non-empty value
        wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_IMO_SELECTION));
        wait.until(driver -> {
            WebElement input = driver.findElement(VERIFY_IMO_SELECTION);
            String value = input.getAttribute("value").trim();
            return !value.isEmpty();
        });

        // Final assertion
        WebElement input = driver.findElement(VERIFY_IMO_SELECTION);
        String value = input.getAttribute("value").trim();
        System.out.println("✅ Input Value: " + value);
        Assert.assertFalse(value.isEmpty(), "❌ Input value is empty!");
    }

    public void verifyCustomerAppearOnSelectionOfEvent() {
        // Wait for the element to be visible AND have non-empty text
        WebElement span = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_CUSTOMER_SELECTION));

        // Re-fetch inside wait to avoid stale element reference
        wait.until(driver -> {
            WebElement refreshedSpan = driver.findElement(VERIFY_CUSTOMER_SELECTION);
            String text = refreshedSpan.getText().trim();
            return !text.isEmpty();
        });

        // Get the final (fresh) element and assert
        WebElement finalSpan = driver.findElement(VERIFY_CUSTOMER_SELECTION);
        String finalText = finalSpan.getText().trim();
        Assert.assertFalse(finalText.isEmpty(), "❌ Span is empty!");
    }

    public void verifyClass1AppearOnSelectionOfEvent() {
        // Wait for the element to be visible AND have non-empty text
        WebElement span = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_CLASS1_SELECTION));

        // Re-fetch inside wait to avoid stale element reference
        wait.until(driver -> {
            WebElement refreshedSpan = driver.findElement(VERIFY_CLASS1_SELECTION);
            String text = refreshedSpan.getText().trim();
            return !text.isEmpty();
        });

        // Get the final (fresh) element and assert
        WebElement finalSpan = driver.findElement(VERIFY_CLASS1_SELECTION);
        String finalText = finalSpan.getText().trim();
        Assert.assertFalse(finalText.isEmpty(), "❌ Span is empty!");
    }

    public void verifyClass2AppearOnSelectionOfEvent() {
        // Wait for the element to be visible AND have non-empty text
        WebElement span = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_CLASS2_SELECTION));

        // Re-fetch inside wait to avoid stale element reference
        wait.until(driver -> {
            WebElement refreshedSpan = driver.findElement(VERIFY_CLASS2_SELECTION);
            String text = refreshedSpan.getText().trim();
            return !text.isEmpty();
        });

        // Get the final (fresh) element and assert
        WebElement finalSpan = driver.findElement(VERIFY_CLASS2_SELECTION);
        String finalText = finalSpan.getText().trim();
        Assert.assertFalse(finalText.isEmpty(), "❌ Span is empty!");
    }

    public void verifyFlagAppearOnSelectionOfEvent() {
        // Wait for the element to be visible AND have non-empty text
        WebElement span = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_FLAG_SELECTION));

        // Re-fetch inside wait to avoid stale element reference
        wait.until(driver -> {
            WebElement refreshedSpan = driver.findElement(VERIFY_FLAG_SELECTION);
            String text = refreshedSpan.getText().trim();
            return !text.isEmpty();
        });

        // Get the final (fresh) element and assert
        WebElement finalSpan = driver.findElement(VERIFY_FLAG_SELECTION);
        String finalText = finalSpan.getText().trim();
        Assert.assertFalse(finalText.isEmpty(), "❌ Span is empty!");
    }

    public void verifySalesmanAppearOnSelectionOfEvent() {
        // Wait for the element to be visible AND have non-empty text
        WebElement span = wait.until(ExpectedConditions.visibilityOfElementLocated(VERIFY_SALES_MAN_SELECTION));

        // Re-fetch inside wait to avoid stale element reference
        wait.until(driver -> {
            WebElement refreshedSpan = driver.findElement(VERIFY_SALES_MAN_SELECTION);
            String text = refreshedSpan.getText().trim();
            return !text.isEmpty();
        });

        // Get the final (fresh) element and assert
        WebElement finalSpan = driver.findElement(VERIFY_SALES_MAN_SELECTION);
        String finalText = finalSpan.getText().trim();
        Assert.assertFalse(finalText.isEmpty(), "❌ Span is empty!");
    }

    public void clickAddNewCategoryButton() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_ADD_NEW_CATEGORY_BUTTON)).click();
    }

    public void clickAddNewSubCategoryButton() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_ADD_NEW_SUB_CATEGORY_BUTTON)).click();
    }

    public void clickAddNewBrandButton() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_ADD_NEW_BRAND_BUTTON)).click();
    }

    public void clickAddNewUnitButton() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_ADD_NEW_UNIT_BUTTON)).click();
    }

    public void insertNameOfProductCategory() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(INSERT_NAME_OF_PRODUCT_CATEGORY)).sendKeys("This is product Category");
    }

    public void insertNameOfProductSubCategory() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(INSERT_NAME_OF_PRODUCT_SUB_CATEGORY)).sendKeys("This is sub product Category");
    }

    public void insertNameOfProductBrand() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(INSERT_NAME_OF_PRODUCT_BRAND)).sendKeys("This is Product Brand");
    }

    public void insertNameOfProductUnit() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(INSERT_NAME_OF_PRODUCT_UNIT)).sendKeys("KGS");
    }

    public void clickProductCateToSelectCateForSubCategory() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_PRODUCT_CATEGORY_FOR_SUB_CATEGORY)).sendKeys("This is");
    }

    public void selectProductCateForSubCategory() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_CATEGORY_FOR_SUB_CATEGORY)).click();
    }

    public void clickSaveButtonOfProductCategory() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_PRODUCT_CATEGORY_BUTTON)).click();
    }

    public void clickSaveButtonOfProductSubCategory() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_PRODUCT_SUB_CATEGORY_BUTTON)).click();
    }

    public void clickSaveButtonOfProductBrand() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_PRODUCT_BRAND_BUTTON)).click();
    }

    public void clickSaveButtonOfProductUnit() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SAVE_PRODUCT_UNIT_BUTTON)).click();
    }

    public void selectSalesman() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SALESMAN_INPUT)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_SALESMAN_FROM_DROPDOWN)).click();
    }

    public void createSalesManFromPlusButton(String SalesmanName, String salesNamePercentage) {
        // Wait for element to be clickable then click
        String parentWindow = baseTest.getCurrentWindowHandle();
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SALESMAN_INPUT)).click();
        wait.until(ExpectedConditions.attributeToBe(CLICK_SALESMAN_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#quotation_salesman_id_list ~ div.rc-virtual-list");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_SALESMAN_FROM_DROPDOWN;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_SALESMAN_PLUS_BUTTON)).click();
                baseTest.switchToNewWindow();
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_SALESMAN_BUTTON)).click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_SALESMAN_NAME)).sendKeys(SalesmanName);
                wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_SALESMAN_PERCENTAGE)).sendKeys(salesNamePercentage);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_SALESMAN_SAVE_BUTTON)).click();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_SALESMAN_INPUT)).sendKeys("salesman");
                Thread.sleep(5000);
                By firstItemofEvent = SELECT_SALESMAN_FROM_DROPDOWN;
//                Thread.sleep(5000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void selectCustomerFromEventPopup() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CUSTOMER_INPUT_ON_EVENT_POPUP)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_CUSTOMER_FROM_DROPDOWN_ON_EVENT_POPUP)).click();
    }
    public void selectCustomerFromVesselFromPopup() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CUSTOMER_INPUT_ON_VESEL_POPUP)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_CUSTOMER_FROM_DROPDOWN_ON_VESSEL_POPUP)).click();
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#vesel_customer_id_list ~ div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_CUSTOMER_FROM_DROPDOWN_ON_VESSEL_POPUP;
            try {
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error selecting first item: " + e.getMessage());
            }
        } else {
            System.out.println("Customer is not available so please create first and try again");

        }
    }
  public void selectFlagFromVesselFromPopup() {
      // Wait for element to be clickable then click
      wait.until(ExpectedConditions.elementToBeClickable(CLICK_FLAG_INPUT_ON_VESEL_POPUP)).click();

      // Wait for the Event element and click it
      wait.until(ExpectedConditions.attributeToBe(CLICK_FLAG_INPUT_ON_VESEL_POPUP, "aria-expanded", "true"));
      // Initialize the isListVisible flag
      boolean isListVisible1;
      try {
          System.out.println("Waiting for the Event list to become visible...");
          By listLocator = By.cssSelector("#vessel_flag_id_list ~ div.rc-virtual-list");
          wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
          isListVisible1 = true;
          System.out.println("Event list found and visible.");
      } catch (TimeoutException e) {
          isListVisible1 = false;
          System.out.println("Event list not found within the timeout.");
      }

// Handle both cases - the rest of the code will run after either block
      if (isListVisible1) {
          System.out.println("Selecting the first item from the Event list...");
          By firstItemLocator = SELECT_FLAG_FROM_DROPDOWN_ON_VESSEL_POPUP;
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


              Set<String> before = driver.getWindowHandles();
              wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_FLAG_VESSEL_POPUP_PLUS_BUTTON)).click();
              String flagWindow = switchToNewWindowAfterAction(before);
              driver.switchTo().window(flagWindow);
              windowStack.add(flagWindow);
              wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_FLAG_BUTTON)).click();
              wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_FLAG_NAME)).sendKeys("Test FLad");
              wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_FLAG_SAVE_BUTTON)).click();
              Thread.sleep(5000);
              driver.close();
              driver.switchTo().window(windowStack.get(windowStack.size() - 2));
              windowStack.remove(windowStack.size() - 1);
              wait.until(ExpectedConditions.elementToBeClickable(CLICK_FLAG_INPUT_ON_VESEL_POPUP)).sendKeys("test");
              By firstItemLocator = SELECT_FLAG_FROM_DROPDOWN_ON_VESSEL_POPUP;
              WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
              System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
              wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
              System.out.println("First item selected from the list.");
          } catch (Exception e) {
              System.out.println("Error in fallback path: " + e.getMessage());
          }
      }
    }
  public void selectClass1FromVesselFromPopup() {
      // Wait for element to be clickable then click
      wait.until(ExpectedConditions.elementToBeClickable(CLICK_CLASS_1_INPUT_ON_VESEL_POPUP)).sendKeys("Test Class 1");

      // Wait for the Event element and click it
      wait.until(ExpectedConditions.attributeToBe(CLICK_CLASS_1_INPUT_ON_VESEL_POPUP, "aria-expanded", "true"));
      // Initialize the isListVisible flag
      boolean isListVisible1;
      try {
          System.out.println("Waiting for the Event list to become visible...");
          By listLocator = By.cssSelector("#vessel_class1_id_list ~ div.rc-virtual-list");
          wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
          isListVisible1 = true;
          System.out.println("Event list found and visible.");
      } catch (TimeoutException e) {
          isListVisible1 = false;
          System.out.println("Event list not found within the timeout.");
      }

// Handle both cases - the rest of the code will run after either block
      if (isListVisible1) {
          System.out.println("Selecting the first item from the Event list...");
          By firstItemLocator = SELECT_CLASS_1_FROM_DROPDOWN_ON_VESSEL_POPUP;
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


              Set<String> before = driver.getWindowHandles();
              wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_CLASS_1_VESSEL_POPUP_PLUS_BUTTON)).sendKeys("Test Class 1");
              String flagWindow = switchToNewWindowAfterAction(before);
              driver.switchTo().window(flagWindow);
              windowStack.add(flagWindow);
              Thread.sleep(5000);
              wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_FLAG_BUTTON)).click();
              wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_FLAG_NAME)).sendKeys("Test CLASS 1");
              wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_FLAG_SAVE_BUTTON)).click();
              Thread.sleep(5000);
              driver.close();
              driver.switchTo().window(windowStack.get(windowStack.size() - 2));
              windowStack.remove(windowStack.size() - 1);
              wait.until(ExpectedConditions.elementToBeClickable(CLICK_CLASS_1_INPUT_ON_VESEL_POPUP)).sendKeys("Test Class 1");
              By firstItemLocator = SELECT_CLASS_1_FROM_DROPDOWN_ON_VESSEL_POPUP;
              WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
              System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
              wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
              System.out.println("First item selected from the list.");
          } catch (Exception e) {
              System.out.println("Error in fallback path: " + e.getMessage());
          }
      }
    }
  public void selectClass2FromVesselFromPopup() {
      // Wait for element to be clickable then click
      wait.until(ExpectedConditions.elementToBeClickable(CLICK_CLASS_2_INPUT_ON_VESEL_POPUP)).sendKeys("Test Class 2");

      // Wait for the Event element and click it
      wait.until(ExpectedConditions.attributeToBe(CLICK_CLASS_2_INPUT_ON_VESEL_POPUP, "aria-expanded", "true"));
      // Initialize the isListVisible flag
      boolean isListVisible1;
      try {
          System.out.println("Waiting for the Event list to become visible...");
          By listLocator = By.cssSelector("#vessel_class2_id_list ~ div.rc-virtual-list");
          wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
          isListVisible1 = true;
          System.out.println("Event list found and visible.");
      } catch (TimeoutException e) {
          isListVisible1 = false;
          System.out.println("Event list not found within the timeout.");
      }

// Handle both cases - the rest of the code will run after either block
      if (isListVisible1) {
          System.out.println("Selecting the first item from the Event list...");
          By firstItemLocator = SELECT_CLASS_2_FROM_DROPDOWN_ON_VESSEL_POPUP;
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


              Set<String> before = driver.getWindowHandles();
              wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_CLASS_2_VESSEL_POPUP_PLUS_BUTTON)).click();
              String class2Window = switchToNewWindowAfterAction(before);
              driver.switchTo().window(class2Window);
              windowStack.add(class2Window);
              Thread.sleep(5000);
              wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_FLAG_BUTTON)).click();
              wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_FLAG_NAME)).sendKeys("Test CLASS 2");
              wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_FLAG_SAVE_BUTTON)).click();
              Thread.sleep(5000);
              driver.close();
              driver.switchTo().window(windowStack.get(windowStack.size() - 2));
              windowStack.remove(windowStack.size() - 1);
              wait.until(ExpectedConditions.elementToBeClickable(CLICK_CLASS_2_INPUT_ON_VESEL_POPUP)).sendKeys("test");
              By firstItemLocator = SELECT_CLASS_2_FROM_DROPDOWN_ON_VESSEL_POPUP;
              WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
              System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
              wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
              System.out.println("First item selected from the list.");
          } catch (Exception e) {
              System.out.println("Error in fallback path: " + e.getMessage());
          }
      }
    }



    public void selectVesselFromEventPopup() {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_VESSEL_INPUT_ON_EVENT_POPUP)).click();

        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_VESSEL_INPUT_ON_EVENT_POPUP, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#event_vessel_id_list ~ div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_VESSEL_FROM_DROPDOWN_ON_EVENT_POPUP;
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

                Set<String> before = driver.getWindowHandles();
                wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_EVENT_VESSEL_POPUP_PLUS_BUTTON)).click();
                String vesselWindow = switchToNewWindowAfterAction(before);
                driver.switchTo().window(vesselWindow);
                windowStack.add(vesselWindow);
//                baseTest.switchToSecondWindow();
                wait.until(ExpectedConditions.elementToBeClickable(INSERT_IMO)).sendKeys("IMo-0101");
                wait.until(ExpectedConditions.elementToBeClickable(INSERT_VESSEL_NAME)).sendKeys("Test Vessel name");
                selectCustomerFromVesselFromPopup();
                selectFlagFromVesselFromPopup();
                selectClass1FromVesselFromPopup();
                selectClass2FromVesselFromPopup();
                WebElement dropdown = driver.findElement(By.id("vessel_block_status")); // Use correct locator
                Actions actions = new Actions(driver);
                actions.moveToElement(dropdown).click().sendKeys(Keys.ARROW_DOWN).sendKeys(Keys.ENTER).build().perform();
                clickSaveVesselPopupButton();
                Thread.sleep(2000);
                driver.close();
                driver.switchTo().window(windowStack.get(windowStack.size() - 2));
                windowStack.remove(windowStack.size() - 1);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_VESSEL_INPUT_ON_EVENT_POPUP)).sendKeys("Test Vessel name");
                By firstItemLocator = SELECT_VESSEL_FROM_DROPDOWN_ON_EVENT_POPUP;
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemLocator));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");


            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }

    }

    public void selectClass1FromEventPopup() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CLASS1_INPUT_ON_EVENT_POPUP)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_CLASS1_FROM_DROPDOWN_ON_EVENT_POPUP)).click();
    }

    public void selectClass2FromEventPopup() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_CLASS2_INPUT_ON_EVENT_POPUP)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_CLASS2_FROM_DROPDOWN_ON_EVENT_POPUP)).click();
    }

    public void clickSaveEventPopupButton() {
        wait.until((ExpectedConditions.elementToBeClickable(CLICK_SAVE_EVENT_POPUP_BUTTON))).click();
    }
    public void clickSaveVesselPopupButton() {
        wait.until((ExpectedConditions.elementToBeClickable(CLICK_SAVE_VESSEL_POPUP_BUTTON))).click();
    }

    public void clickSaveProductPopupButton() {
        wait.until((ExpectedConditions.elementToBeClickable(CLICK_SAVE_PRODUCT_POPUP_BUTTON))).click();
    }

    public void selectEvent() {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_EVENT_INPUT)).click();

        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_EVENT_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#quotation_event_id_list ~ div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_EVENT_FROM_DROPDOWN;
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
                Set<String> before = driver.getWindowHandles();
                wait.until(ExpectedConditions.elementToBeClickable(SELECT_EVENT_PLUS_BUTTON)).click();
                String eventWindow = switchToNewWindowAfterAction(before);
                windowStack.add(eventWindow);
//                baseTest.switchToNewWindow();
                selectCustomerFromEventPopup();
                selectVesselFromEventPopup();
//                selectClass1FromEventPopup();
                Thread.sleep(5000);
//                selectClass2FromEventPopup();
                clickSaveEventPopupButton();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_EVENT_INPUT)).sendKeys("0001");
                By firstItemofEvent = SELECT_EVENT_FROM_DROPDOWN;
//                Thread.sleep(5000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void selectPersonIncharge() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PERSON_INCHARGE_INPUT)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_PERSON_INCHARGE)).click();
    }

    public void insertCustomerReference(String CustomerRefText) {
        wait.until(ExpectedConditions.elementToBeClickable(CUSTOMER_REF_INPUT)).sendKeys(CustomerRefText);
    }

    public void DateOfService() throws InterruptedException {
        wait.until(ExpectedConditions.elementToBeClickable(DUE_DATE_INPUT)).click();
        Thread.sleep(1000);

        // Select a specific date (example: current date)
        LocalDate desiredDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d");
        String dayToSelect = desiredDate.format(formatter);

        // Find and click the day in the calendar
        // Note: Ant Design calendar structure might vary - you may need to adjust the locator
        WebElement dayElement = driver.findElement(By.xpath("//div[contains(@class, 'ant-picker-cell-inner') and text()='" + dayToSelect + "']"));
        dayElement.click();
    }

    public void insertAttn(String attn) {
        wait.until(ExpectedConditions.elementToBeClickable(ATTN_INPUT)).sendKeys(attn);
    }

    public void insertDelivery(String delivery) {
        wait.until(ExpectedConditions.elementToBeClickable(DELIVERY_INPUY)).sendKeys(delivery);
    }

    public void selectPort() {
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PORT_INPUT)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SELECT_PORT_FROM_DROPDOWN)).click();
    }


    public void selectCategoryOnProductPopup() {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_CATEGORY_INPUT)).click();

        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_CATEGORY_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#product_category_id_list~div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check

            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_CATEGORY_FROM_DROPDOWN_ON_PRODUCT_POPUP;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_CATEGORY_PLUS_BUTTON)).click();
                baseTest.switchToLastWindow();
                Thread.sleep(2000);
                clickAddNewCategoryButton();
                insertNameOfProductCategory();
                Thread.sleep(1000);
                clickSaveButtonOfProductCategory();
                Thread.sleep(2000);
                baseTest.switchToSecondWindow();
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_CATEGORY_INPUT)).click();
                Thread.sleep(4000);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_CATEGORY_INPUT)).sendKeys("This is");
                By firstItemofEvent = SELECT_CATEGORY_FROM_DROPDOWN_ON_PRODUCT_POPUP;
                Thread.sleep(3000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void selectSubCategoryOnProductPopup() {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_SUB_CATEGORY_INPUT)).click();

        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_SUB_CATEGORY_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#product_sub_category_id_list~div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_SUB_CATEGORY_FROM_DROPDOWN_ON_PRODUCT_POPUP;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_SUB_CATEGORY_PLUS_BUTTON)).click();
                baseTest.switchToLastWindow();
                clickAddNewSubCategoryButton();
                insertNameOfProductSubCategory();
                clickProductCateToSelectCateForSubCategory();
                selectProductCateForSubCategory();
                clickSaveButtonOfProductSubCategory();
                Thread.sleep(2000);
                baseTest.switchToSecondWindow();
                Thread.sleep(2000);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_SUB_CATEGORY_INPUT)).click();
                Thread.sleep(4000);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_SUB_CATEGORY_INPUT)).sendKeys("This is");
                By firstItemofEvent = SELECT_SUB_CATEGORY_FROM_DROPDOWN_ON_PRODUCT_POPUP;
                Thread.sleep(3000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void selectBrandOnProductPopup() {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_BRAND_INPUT)).click();

        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_BRAND_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#product_brand_id_list~div.rc-virtual-list");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_BRAND_FROM_DROPDOWN_ON_PRODUCT_POPUP;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_BRAND_PLUS_BUTTON)).click();
                baseTest.switchToLastWindow();
                Thread.sleep(2000);
                clickAddNewBrandButton();
                insertNameOfProductBrand();
                clickSaveButtonOfProductBrand();
                Thread.sleep(2000);
                baseTest.switchToSecondWindow();
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_BRAND_INPUT)).click();
                Thread.sleep(4000);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_BRAND_INPUT)).sendKeys("This is");
                By firstItemofEvent = SELECT_BRAND_FROM_DROPDOWN_ON_PRODUCT_POPUP;
                Thread.sleep(3000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void selectUnitProductPopup() {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_UNIT_INPUT)).click();

        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_UNIT_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#product_unit_id_list~div.rc-virtual-list");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_UNIT_FROM_DROPDOWN_ON_PRODUCT_POPUP;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_UNIT_PLUS_BUTTON)).click();
                baseTest.switchToLastWindow();
                clickAddNewUnitButton();
                insertNameOfProductUnit();
                clickSaveButtonOfProductUnit();
                Thread.sleep(2000);
                baseTest.switchToSecondWindow();
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_UNIT_INPUT)).click();
                Thread.sleep(4000);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_UNIT_INPUT)).sendKeys("KGS");
                By firstItemofEvent = SELECT_UNIT_FROM_DROPDOWN_ON_PRODUCT_POPUP;
                Thread.sleep(3000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    private void addNotes(By editButton, String noteText) {
        WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(editButton));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", button);
        wait.until(ExpectedConditions.elementToBeClickable(button)).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".ant-modal-content")));
        WebElement textarea = wait.until(ExpectedConditions.elementToBeClickable(By.id("notes-form_notes")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", textarea);
        textarea.clear();
        textarea.sendKeys(noteText);
        wait.until(ExpectedConditions.elementToBeClickable(ADD_CUSTOMER_NOTES_SAVE_BUTTON)).click();
    }



    public void addOtherProductTypeItemInGrid() throws InterruptedException {
        WebElement element = driver.findElement(CLICK_LEFT_ADD_GRID);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});", element);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_LEFT_ADD_GRID)).click();
        wait.until(ExpectedConditions.elementToBeClickable(SEARCH_PRODUCT_TYPE)).sendKeys("Ot");
        Thread.sleep(5000);
        Actions actionsToSelectProductType = new Actions(driver);
        actionsToSelectProductType.sendKeys(Keys.ENTER).perform();
        wait.until(ExpectedConditions.elementToBeClickable(ADD_OTHER_PTYPE_DESCRIPTION)).sendKeys("This is Other Product Description");
        actionsToSelectProductType.sendKeys(Keys.ENTER).perform();

        addNotes(ADD_CUSTOMER_NOTES_EDIT_BUTTON_OF_ITEM, "For Other Products My Customer note text!");
//        Thread.sleep(10000); // Optional wait if needed
        addNotes(ADD_INTERNAL_NOTES_EDIT_BUTTON_OF_ITEM, "For Other Products My Internal note text!");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_QTY_OF_ITEM)).sendKeys("25");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_UNIT_OF_ITEM)).sendKeys("KGS");
        Thread.sleep(5000);
        Actions actionsToSelectUnit = new Actions(driver);
        actionsToSelectUnit.sendKeys(Keys.ENTER).perform();
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_VENDOR_INPUT)).click();
        Thread.sleep(5000);
        Actions actionsToSelectVendor = new Actions(driver);
        actionsToSelectVendor.sendKeys(Keys.ENTER).perform();
        wait.until(ExpectedConditions.elementToBeClickable(ADD_VENDOR_PORT_NO)).sendKeys("PORT_1233");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_COST_PRICE)).sendKeys("4501");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_MARKUP_PERCENTAGE)).sendKeys("16");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_DISCOUNT_PERCENTAGE)).sendKeys("5");
        Thread.sleep(5000);
        scrollUntilElementVisible(driver, By.cssSelector(".ant-table-body"), By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div") // Replace with your actual target
        );
        WebElement target = driver.findElement(By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});", target);

        Thread.sleep(500);
    }
    public By getLatestProductNameList() {
        // 1. Find all dropdown containers
        List<WebElement> allDropdowns = driver.findElements(
                By.cssSelector("div[id^='quotation_product_name-'][id$='_list']")
        );

        if (allDropdowns.isEmpty()) {
            throw new NoSuchElementException("No product name dropdowns found");
        }

        // 2. Extract numbers and find the highest
        int highestId = allDropdowns.stream().mapToInt(e -> {
            String id = e.getAttribute("id");
            String numPart = id.split("-")[1].split("_")[0];
            return Integer.parseInt(numPart);
        }).max().orElseThrow();

        // 3. Build the CSS selector string
        String selector = "#quotation_product_name-" + highestId + "_list ~ div.rc-virtual-list";

        System.out.println("✅ Dynamic By.cssSelector: " + selector);

        // 4. Return as By
        return By.cssSelector(selector);
    }
    public By getLatestProductNameOptionSelector() {
        // 1. Find all dropdown containers
        List<WebElement> allDropdowns = driver.findElements(
                By.cssSelector("div[id^='quotation_product_name-'][id$='_list']")
        );

        if (allDropdowns.isEmpty()) {
            throw new NoSuchElementException("No product name dropdowns found");
        }

        // 2. Extract numbers and find the highest
        int highestId = allDropdowns.stream().mapToInt(e -> {
            String id = e.getAttribute("id");
            String numPart = id.split("-")[1].split("_")[0];
            return Integer.parseInt(numPart);
        }).max().orElseThrow();

        // 3. Build the CSS selector string
        String selector = "#quotation_product_name-" + highestId + "_list ~ div.rc-virtual-list div.ant-select-item-option-active";

        System.out.println("✅ Dynamic By.cssSelector: " + selector);

        // 4. Return as By
        return By.cssSelector(selector);
    }





    public void selectOrCreateInventoryProduct() throws InterruptedException {
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID)).sendKeys("This is Inventory Product 13123123");
        Thread.sleep(2000);
        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {

            System.out.println("Waiting for the Event list to become visible...");
          By listLocator = getLatestProductNameList();
          wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check

            isListVisible1 = true;
            System.out.println("Product list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Product list not found within the timeout.");
        }
//        #quotation_product_name-0_list ~ div.rc-virtual-list div.ant-select-item-option-active

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = getLatestProductNameOptionSelector();
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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_PLUS_BUTTON_IN_GRID_TO_CREATE_PRODUCT)).click();

                baseTest.switchToNewWindow();
//                WebElement element = driver.findElement(ADD_PRODUCT_NAME_PRODUCT_POPUP);
//                JavascriptExecutor js = (JavascriptExecutor) driver;
//                js.executeScript(
//                        "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});",
//                        element
//                );
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_TYPE_ON_POPUP)).click();
                Thread.sleep(2000);
                wait.until(ExpectedConditions.elementToBeClickable(SELECT_PRODUCT_TYPE_ON_POPUP)).click();
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_NAME_PRODUCT_POPUP)).sendKeys("This is Inventory Product 13123123");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_IMPA_CODE_PRODUCT_POPUP)).sendKeys(impaCode);
                selectCategoryOnProductPopup();
                selectSubCategoryOnProductPopup();
                Thread.sleep(3000);
                selectBrandOnProductPopup();
                selectUnitProductPopup();
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_COST_PRICE_PRODUCT_POPUP)).sendKeys("100.12");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_SALES_PRICE_PRODUCT_POPUP)).sendKeys("200.23");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_SHORT_CODE_PRODUCT_POPUP)).sendKeys("SHORT_CODE123");
                clickSaveProductPopupButton();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                Thread.sleep(2000);
                WebElement inputField = wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID));
                inputField.clear();
                inputField.sendKeys("This is Inventory Product");
                Thread.sleep(2000);
                inputField.sendKeys(Keys.ENTER);
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public WebElement toCreatingLocatortoselecttheProductNameinGrid() throws InterruptedException {
//        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID)).click();


        // 1. First verify if ANY elements exist with the pattern
        wait.until(d -> {
            List<WebElement> elements = d.findElements(By.cssSelector("div[id^='quotation_product_id-']"));
            return !elements.isEmpty() ? elements : null;
        });

        // 2. Now find all matching dropdowns
        List<WebElement> allDropdowns = driver.findElements(By.cssSelector("div[id^='quotation_product_id-'][id$='_list']"));

        // 3. If still not found, try more flexible search
        if (allDropdowns.isEmpty()) {
            allDropdowns = driver.findElements(By.xpath("//div[contains(@id, 'quotation_product_id-') and contains(@id, '_list')]"));
        }

        // 4. If none found, throw meaningful exception
        if (allDropdowns.isEmpty()) {
            // Debugging help - print similar elements
            System.out.println("DEBUG: Found these similar elements:");
            driver.findElements(By.cssSelector("div[id*='product']")).forEach(e -> System.out.println(" - " + e.getAttribute("id")));

            throw new NoSuchElementException("No dropdowns matching pattern 'quotation_product_id-*_list' found. " + "Page source may have changed or elements not loaded yet.");
        }

        // 5. Find highest ID
        int highestId = allDropdowns.stream().mapToInt(e -> {
            String id = e.getAttribute("id");
            return Integer.parseInt(id.split("-")[1].split("_")[0]);
        }).max().orElseThrow();

        // 6. Return the element
        String targetId = "#" + "quotation_product_id-" + highestId + "_list" + "~div.rc-virtual-list div.ant-select-item-option:not(.ant-select-item-option-disabled)";
        System.out.println(targetId);
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(targetId)));
    }

    // Hardcoded locator for the scrollable div
    private static final By SCROLL_DIV_LOCATOR = By.cssSelector(".ant-table-body");

    // Scroll to the full right
    public static void scrollUntilElementVisible(WebDriver driver, By scrollable, By targetElement) throws InterruptedException {
        WebElement container = driver.findElement(scrollable);
        JavascriptExecutor js = (JavascriptExecutor) driver;

        for (int i = 0; i < 15; i++) {
            if (driver.findElements(targetElement).size() > 0 && driver.findElement(targetElement).isDisplayed()) {
                System.out.println("✅ Target element is visible");
                return;
            }

            js.executeScript("arguments[0].scrollBy({ left: 300, behavior: 'smooth' });", container);
            Thread.sleep(300);
        }

        System.out.println("❌ Target element not found after scrolling");
    }

    public void addInventoryProductIntoGrid() throws InterruptedException {
        WebElement element = driver.findElement(CLICK_LEFT_ADD_GRID);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});", element);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_LEFT_ADD_GRID)).click();
//        wait.until(ExpectedConditions.elementToBeClickable(SEARCH_PRODUCT_TYPE)).sendKeys("in");
//        Thread.sleep(5000);
//        Actions actionsToSelectProductType = new Actions(driver);
//        actionsToSelectProductType.sendKeys(Keys.ENTER).perform();
//        Thread.sleep(2000);
        selectOrCreateInventoryProduct();
        addNotes(ADD_CUSTOMER_NOTES_EDIT_BUTTON_OF_ITEM, "For Inventory Products My Customer note text!");
//        Thread.sleep(10000); // Optional wait if needed
        addNotes(ADD_INTERNAL_NOTES_EDIT_BUTTON_OF_ITEM, "For Inventory Products My Internal note text!");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_QTY_OF_ITEM)).sendKeys("25");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_VENDOR_PORT_NO)).sendKeys("PORT_1233");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_COST_PRICE)).sendKeys("4501");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_MARKUP_PERCENTAGE)).sendKeys("16");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_DISCOUNT_PERCENTAGE)).sendKeys("5");
        Thread.sleep(5000);
        scrollUntilElementVisible(driver, By.cssSelector(".ant-table-body"), By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div") // Replace with your actual target
        );
        WebElement target = driver.findElement(By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});", target);

        Thread.sleep(500);
    }

    public void selectOrCreateServiceProduct() throws InterruptedException {
        String parentWindow = baseTest.getCurrentWindowHandle();
        String impaCode2 = "IMPA_CODE" + System.currentTimeMillis();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID)).sendKeys("This is service Product");
        Thread.sleep(3000);
        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {

            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = getLatestProductNameList();
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Product list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Product list not found within the timeout.");
        }
// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = getLatestProductNameOptionSelector();
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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_PLUS_BUTTON_IN_GRID_TO_CREATE_PRODUCT)).click();
                baseTest.switchToNewWindow();
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_TYPE_ON_POPUP)).click();
                Thread.sleep(2000);
                wait.until(ExpectedConditions.elementToBeClickable(SELECT_PRODUCT_TYPE_SERVICE_ON_POPUP)).click();
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_NAME_PRODUCT_POPUP)).sendKeys("This is service Product");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_IMPA_CODE_PRODUCT_POPUP)).sendKeys(impaCode2);
                selectCategoryOnProductPopup();
                selectSubCategoryOnProductPopup();
                Thread.sleep(3000);
                selectBrandOnProductPopup();
                selectUnitProductPopup();
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_COST_PRICE_PRODUCT_POPUP)).sendKeys("100.12");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_SALES_PRICE_PRODUCT_POPUP)).sendKeys("200.23");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_SHORT_CODE_PRODUCT_POPUP)).sendKeys("SHORT_CODE123");
                clickSaveProductPopupButton();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                Thread.sleep(2000);
                WebElement inputField = wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID));
                inputField.clear();
                inputField.sendKeys("This is service Product");
                Thread.sleep(2000);
                inputField.sendKeys(Keys.ENTER);
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void selectOrCreateIMPAProduct() throws InterruptedException {
        String impaCode3 = "IMPA_CODE" + System.currentTimeMillis();
        String parentWindow = baseTest.getCurrentWindowHandle();
        // Wait for element to be clickable then click
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID)).sendKeys("This is IMPA product");
        Thread.sleep(2000);
        // Wait for the Event element and click it
        wait.until(ExpectedConditions.attributeToBe(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {

            System.out.println("Waiting for the Event list to become visible...");
//            By listLocator = By.cssSelector("div.rc-virtual-list [id^=\"quotation_product_id-\"]");
            By listLocator = getLatestProductNameList();
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check

            isListVisible1 = true;
            System.out.println("Product list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Product list not found within the timeout.");
        }
// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = getLatestProductNameOptionSelector();
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
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PRODUCT_PLUS_BUTTON_IN_GRID_TO_CREATE_PRODUCT)).click();
                baseTest.switchToNewWindow();
//                WebElement element = driver.findElement(ADD_PRODUCT_NAME_PRODUCT_POPUP);
//                JavascriptExecutor js = (JavascriptExecutor) driver;
//                js.executeScript(
//                        "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});",
//                        element
//                );
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_TYPE_ON_POPUP)).click();
                Thread.sleep(2000);
                wait.until(ExpectedConditions.elementToBeClickable(SELECT_PRODUCT_TYPE_IMPA_ON_POPUP)).click();
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_NAME_PRODUCT_POPUP)).sendKeys("This is IMPA Product");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_IMPA_CODE_PRODUCT_POPUP)).sendKeys(impaCode3);
                selectCategoryOnProductPopup();
                selectSubCategoryOnProductPopup();
                Thread.sleep(3000);
                selectBrandOnProductPopup();
                selectUnitProductPopup();
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_COST_PRICE_PRODUCT_POPUP)).sendKeys("100.12");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_SALES_PRICE_PRODUCT_POPUP)).sendKeys("200.23");
                wait.until(ExpectedConditions.elementToBeClickable(ADD_PRODUCT_SHORT_CODE_PRODUCT_POPUP)).sendKeys("SHORT_CODE123");
                clickSaveProductPopupButton();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                Thread.sleep(2000);
                WebElement inputField = wait.until(ExpectedConditions.elementToBeClickable(CLICK_PRODUCT_INPUT_FIELD_TO_ADD_PRODUCT_IN_GRID));
                inputField.clear();
                inputField.sendKeys("This is IMPA product");
                Thread.sleep(2000);
                inputField.sendKeys(Keys.ENTER);
                System.out.println("First item selected from the list.");
            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }


    }

    public void addServiceProductIntoGrid() throws InterruptedException {
        WebElement element = driver.findElement(CLICK_LEFT_ADD_GRID);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});", element);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_LEFT_ADD_GRID)).click();
//        wait.until(ExpectedConditions.elementToBeClickable(SEARCH_PRODUCT_TYPE)).sendKeys("in");
//        Thread.sleep(5000);
//        Actions actionsToSelectProductType = new Actions(driver);
//        actionsToSelectProductType.sendKeys(Keys.ENTER).perform();
//        Thread.sleep(2000);
        selectOrCreateServiceProduct();
        addNotes(ADD_CUSTOMER_NOTES_EDIT_BUTTON_OF_ITEM, "For Service Products My Customer note text!");
//        Thread.sleep(10000); // Optional wait if needed
        addNotes(ADD_INTERNAL_NOTES_EDIT_BUTTON_OF_ITEM, "For Service Products My Internal note text!");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_QTY_OF_ITEM)).sendKeys("25");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_VENDOR_PORT_NO)).sendKeys("PORT_1233");
//        wait.until(ExpectedConditions.elementToBeClickable(ADD_COST_PRICE)).sendKeys("4501");
//        wait.until(ExpectedConditions.elementToBeClickable(ADD_MARKUP_PERCENTAGE)).sendKeys("16");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_DISCOUNT_PERCENTAGE)).sendKeys("5");
        Thread.sleep(5000);
        scrollUntilElementVisible(driver, By.cssSelector(".ant-table-body"), By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div") // Replace with your actual target
        );
        WebElement target = driver.findElement(By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});", target);

        Thread.sleep(500);
    }

    public void addIMPAProductIntoGrid() throws InterruptedException {
        WebElement element = driver.findElement(CLICK_LEFT_ADD_GRID);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});", element);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_LEFT_ADD_GRID)).click();
//        wait.until(ExpectedConditions.elementToBeClickable(SEARCH_PRODUCT_TYPE)).sendKeys("in");
//        Thread.sleep(5000);
//        Actions actionsToSelectProductType = new Actions(driver);
//        actionsToSelectProductType.sendKeys(Keys.ENTER).perform();
//        Thread.sleep(2000);
        selectOrCreateIMPAProduct();
        addNotes(ADD_CUSTOMER_NOTES_EDIT_BUTTON_OF_ITEM, "For IMPA Products My Customer note text!");
//        Thread.sleep(10000); // Optional wait if needed
        addNotes(ADD_INTERNAL_NOTES_EDIT_BUTTON_OF_ITEM, "For IMPA Products My Internal note text!");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_QTY_OF_ITEM)).sendKeys("25");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_VENDOR_PORT_NO)).sendKeys("PORT_1233");
//        wait.until(ExpectedConditions.elementToBeClickable(ADD_COST_PRICE)).sendKeys("4501");
//        wait.until(ExpectedConditions.elementToBeClickable(ADD_MARKUP_PERCENTAGE)).sendKeys("16");
        wait.until(ExpectedConditions.elementToBeClickable(ADD_DISCOUNT_PERCENTAGE)).sendKeys("5");
        Thread.sleep(5000);
        scrollUntilElementVisible(driver, By.cssSelector(".ant-table-body"), By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div") // Replace with your actual target
        );
        WebElement target = driver.findElement(By.cssSelector("tr.ant-table-row:last-child td:nth-child(6) div div"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});", target);

        Thread.sleep(500);

    }

    public void verifyQuotationSaveMessage() {
        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(QUOTATION_CREATED_MESSAGE_POPUP));
        String actualText = successMessage.getText().trim();
        String expectedText = "Quotation created successfully";
        Assert.assertEquals(actualText, expectedText, "❌ Quotation success message did not match!");
    }

    public void verifyQuotationUpdateMessage() {
        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(QUOTATION_UPDATED_MESSAGE_POPUP));
        String actualText = successMessage.getText().trim();
        String expectedText = "Quotation updated successfully";
        Assert.assertEquals(actualText, expectedText, "❌ Quotation Update success message did not match!");
    }

    public void verifySingleQuotationDeleteMessage() {
        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(QUOTATION_SINGLE_DELETE_MESSAGE_POPUP));
        String actualText = successMessage.getText().trim();
        String expectedText = "Quotation deleted successfully";
        Assert.assertEquals(actualText, expectedText, "❌ Quotation Delete success message did not match!");
    }
    public void verifyBulkQuotationDeleteMessage() {
        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(QUOTATION_BULK_DELETE_MESSAGE_POPUP));
        String actualText = successMessage.getText().trim();
        String expectedText = "Quotations deleted successfully";
        Assert.assertEquals(actualText, expectedText, "❌ Quotation Bulk Delete success message did not match!");
    }

    public void createPaymentTermsFromPlusButton(String paymentTermName) {
        // Wait for element to be clickable then click
        String parentWindow = baseTest.getCurrentWindowHandle();
        WebElement selectorContainer = driver.findElement(By.cssSelector("#quotation_payment_id")).findElement(By.xpath("ancestor::div[contains(@class, 'ant-select-selector')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", selectorContainer);
        wait.until(ExpectedConditions.elementToBeClickable(selectorContainer)).click();
        wait.until(ExpectedConditions.attributeToBe(CLICK_PAYMENT_TERMS_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#quotation_payment_id_list ~ div.rc-virtual-list");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_PAYMENT_TERMS_FROM_DROPDOWN;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_PAYMENT_TERMS_PLUS_BUTTON)).click();
                baseTest.switchToNewWindow();
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_PAYMENT_TERMS_BUTTON)).click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_PAYMENT_TERMS_NAME)).sendKeys(paymentTermName);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PAYMENT_TERMS_SAVE_BUTTON)).click();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PAYMENT_TERMS_INPUT)).sendKeys("This is the Payment Terms ");
                Thread.sleep(5000);
                By firstItemofEvent = SELECT_PAYMENT_TERMS_FROM_DROPDOWN;
                Thread.sleep(5000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");

            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }

    }

    public void createOrSelectPortFromPlusButton(String portName) {
        // Wait for element to be clickable then click
        String parentWindow = baseTest.getCurrentWindowHandle();
        WebElement selectorContainer = driver.findElement(By.cssSelector("#quotation_port_id")).findElement(By.xpath("ancestor::div[contains(@class, 'ant-select-selector')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", selectorContainer);
        wait.until(ExpectedConditions.elementToBeClickable(selectorContainer)).click();
        wait.until(ExpectedConditions.attributeToBe(CLICK_PORT_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#quotation_port_id_list ~ div.rc-virtual-list");
            WebElement list = wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator));
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_PORT_FROM_DROPDOWN;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_PORT_PLUS_BUTTON)).click();
                baseTest.switchToNewWindow();
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_PORT_BUTTON)).click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_PORT_NAME)).sendKeys(portName);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_PORT_SAVE_BUTTON)).click();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_PORT_INPUT)).sendKeys("Test Port ");
                Thread.sleep(5000);
                By firstItemofEvent = SELECT_PORT_FROM_DROPDOWN;
                Thread.sleep(5000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");

            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }

    }

    public void createOrSelectValidityFromPlusButton(String validity) {
        // Wait for element to be clickable then click
        String parentWindow = baseTest.getCurrentWindowHandle();
        WebElement selectorContainer = driver.findElement(By.cssSelector("#quotation_validity_id")).findElement(By.xpath("ancestor::div[contains(@class, 'ant-select-selector')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", selectorContainer);
        wait.until(ExpectedConditions.elementToBeClickable(selectorContainer)).click();
        wait.until(ExpectedConditions.attributeToBe(CLICK_VALIDITY_INPUT, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#quotation_validity_id_list ~ div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }

// Handle both cases - the rest of the code will run after either block
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");
            By firstItemLocator = SELECT_VALIDITY_FROM_DROPDOWN;

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
                wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_VALIDITY_PLUS_BUTTON)).click();
                baseTest.switchToNewWindow();
                Thread.sleep(5000);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_VALIDTY_BUTTON)).click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_VALIDITY_NAME)).sendKeys(validity);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_VALIDITY_SAVE_BUTTON)).click();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.elementToBeClickable(CLICK_VALIDITY_INPUT)).sendKeys("validity");
                Thread.sleep(5000);
                By firstItemofEvent = SELECT_VALIDITY_FROM_DROPDOWN;
                Thread.sleep(5000);
                WebElement firstItem = wait.until(ExpectedConditions.presenceOfElementLocated(firstItemofEvent));
                System.out.println("First item HTML: " + firstItem.getAttribute("outerHTML"));
                wait.until(ExpectedConditions.elementToBeClickable(firstItem)).click();
                System.out.println("First item selected from the list.");

            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }

    }

    public void selectQuotationTerm(String additionalTextForNote) throws InterruptedException {
        String parentWindow = baseTest.getCurrentWindowHandle();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        WebElement selectedItem = wait.until(driver -> driver.findElement(By.cssSelector(".ant-select-selection-item")));

        String selectedText = selectedItem.getText().trim();
        System.out.println("✅ Selected term text: " + selectedText);
        Assert.assertFalse(selectedText.isEmpty(), "❌ No term is selected!");

        WebElement input = driver.findElement(By.id("quotation_term_id"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", input);
        input.click();

        wait.until(ExpectedConditions.attributeToBe(input, "aria-expanded", "true"));
        // Initialize the isListVisible flag
        boolean isListVisible1;
        try {
            System.out.println("Waiting for the Event list to become visible...");
            By listLocator = By.cssSelector("#quotation_term_id_list ~ div.rc-virtual-list");
            wait.until(ExpectedConditions.visibilityOfElementLocated(listLocator)); // ✅ The real check
            isListVisible1 = true;
            System.out.println("Event list found and visible.");
        } catch (TimeoutException e) {
            isListVisible1 = false;
            System.out.println("Event list not found within the timeout.");
        }
        if (isListVisible1) {
            System.out.println("Selecting the first item from the Event list...");

            try {
                Actions actionsToSelectProductType = new Actions(driver);
                actionsToSelectProductType.sendKeys(Keys.ENTER).perform();
                System.out.println("First item selected from the list.");
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_NOTE_TEXT_AREA)).sendKeys("Extra Text Added--->" + additionalTextForNote + " (added by automation)");

            } catch (Exception e) {
                System.out.println("Error selecting first item: " + e.getMessage());
            }
        } else {
            System.out.println("Taking fallback path...");
            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(SELECT_TERMS_PLUS_BUTTON)).click();
                baseTest.switchToNewWindow();
                Thread.sleep(5000);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_ADD_NEW_TERMS_BUTTON)).click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(INSERT_TERMS_NAME)).sendKeys(additionalTextForNote);
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_TERMS_SAVE_BUTTON)).click();
                Thread.sleep(5000);
                baseTest.switchToParentWindow(parentWindow);
                wait.until(ExpectedConditions.elementToBeClickable(input)).sendKeys("This is");
                Thread.sleep(5000);
                Actions actionsToSelectProductType = new Actions(driver);
                actionsToSelectProductType.sendKeys(Keys.ENTER).perform();
                wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_NOTE_TEXT_AREA)).sendKeys("Extra Text Added--->" + additionalTextForNote + " (added by automation)");

            } catch (Exception e) {
                System.out.println("Error in fallback path: " + e.getMessage());
            }
        }
    }

    public String beforeAddQuotation() {
//        WebElement paginationElement = driver.findElement(PAGINATION_FIRST_ITEM);

        WebElement paginationElement = wait.until(ExpectedConditions.visibilityOfElementLocated(PAGINATION_FIRST_ITEM));

        // Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", paginationElement);
        String beforeText = paginationElement.getText().trim();
        System.out.println("Before Adding Quotation: " + beforeText);
        return beforeText;
    }

    /**
     * Gets the pagination text after adding a quotation.
     *
     * @return the text value.
     */
    public String afterAddQuotation() {
//        WebElement paginationElement = driver.findElement(PAGINATION_FIRST_ITEM);
        WebElement paginationElement = wait.until(ExpectedConditions.visibilityOfElementLocated(PAGINATION_FIRST_ITEM));

        // Scroll into view
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", paginationElement);
        String afterText = paginationElement.getText().trim();
        System.out.println("After Adding Quotation: " + afterText);
        return afterText;
    }

    /**
     * Compares the two counts and asserts the difference.
     */
    public boolean compareCounts(String beforeCount, String afterCount) {
        boolean isEqual = beforeCount.equals(afterCount);
        System.out.println("Is count the same? " + isEqual + " (before: " + beforeCount + ", after: " + afterCount + ")");
        return isEqual;
    }

    public boolean verifyGlobalSearch(String keyword) {
        By searchInput = By.cssSelector(GLOBAL_SEARCH_INPUT_ON_LIST_VIEW);
        wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput));

        WebElement searchBox = driver.findElement(searchInput);
        searchBox.click();

        // ✅ Use Ctrl+A to select all, then delete
        searchBox.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);

        // ✅ Now type the new keyword
        searchBox.sendKeys(keyword);

        // Wait for table to refresh
        By tableRowLocator = By.cssSelector(".ant-table-tbody tr:nth-child(3)");
        wait.until(ExpectedConditions.visibilityOfElementLocated(tableRowLocator));

        List<WebElement> tableRows = driver.findElements(tableRowLocator);
        if (tableRows.isEmpty()) {
            System.out.println("No results found for keyword: " + keyword);
            return false;
        }

        for (WebElement row : tableRows) {
            String rowText = row.getText().toLowerCase();
            if (!rowText.contains(keyword.toLowerCase())) {
                System.err.println("Row does not match keyword: " + keyword + " => Row text: " + rowText);
                return false;
            }
        }

        System.out.println("✅ All " + tableRows.size() + " results matched keyword: " + keyword);
        return true;
    }

    public void serachQuotaionNumberandClickEditButtonofSearchedQuotation(String searchQuoteNo) throws InterruptedException {
        WebElement input = wait.until(ExpectedConditions.elementToBeClickable(GLOBAL_SEARCH_INPUT_ON_LIST_VIEW_LOCATOR));
        input.sendKeys(Keys.chord(Keys.CONTROL, "a")); // Select all text
        input.sendKeys(Keys.DELETE);                   // Delete selected text
        input.sendKeys(searchQuoteNo);                 // Enter new value
        Thread.sleep(5000);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SEARCHED_EDIT_BUTTON_QUOTATION_ON_LIST_VIEW)).click();

    }
    public void searchClear() {
        WebElement input = wait.until(ExpectedConditions.elementToBeClickable(GLOBAL_SEARCH_INPUT_ON_LIST_VIEW_LOCATOR));
        input.sendKeys(Keys.chord(Keys.CONTROL, "a")); // Select all text
        input.sendKeys(Keys.DELETE);                   // Delete selected text

    }

    public void clickSinglyeDeleteButtonFromFlistView() throws InterruptedException {
        Thread.sleep(10000);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SINGLE_DELETE_BUTTON_QUOTATION_ON_LIST_VIEW)).click();
        wait.until(ExpectedConditions.elementToBeClickable(CONFIRM_SINGLE_DELETE_YES)).click();

    }

    public void verifyQuotationNoOnEdit(String quotationNumber) {
        wait.until(ExpectedConditions.elementToBeClickable(QUOTATION_NO));

        WebElement validationMsg = driver.findElement(QUOTATION_NO);
        String actualText = validationMsg.getText().trim();

        Assert.assertEquals(actualText, quotationNumber, "❌ Quotation Number KHI/QT-0011 Not Found");
    }

    public void selectAllForBulkDelete() throws InterruptedException {
        Thread.sleep(5000);
        wait.until(ExpectedConditions.elementToBeClickable(CLICK_SELECT_ALL_CHECK_BOX)).click();
    }


    public void clickBulkDeleteButton() {
        // Locator for all the buttons

// ✅ Wait until all visible
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        List<WebElement> allButtons = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(CLICK_BULK_DELETE_BUTTON));

// ✅ Iterate to find "Delete" and click
        for (WebElement btn : allButtons) {
            if (btn.getText().equals("Delete")) {
                btn.click();
                System.out.println("✅ Clicked the Delete button.");
                break;
            }
        }
    }
    public void clickDeleteButtonForModal() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement deleteButton = wait.until(ExpectedConditions.visibilityOfElementLocated(CLICK_DELETE_BUTTON_ON_MODAL));
        wait.until(ExpectedConditions.elementToBeClickable(deleteButton)).click();    }
    public void clickPrintButtonOnListView() {
        // Save the original tab's handle
        String originalTab = driver.getWindowHandle();

        // Click the Print button
        wait.until(ExpectedConditions.elementToBeClickable(
                CLICK_PRINT_BUTTON_QUOTATION_ON_LIST_VIEW)).click();

        // Wait for new tab to open
        wait.until(driver -> driver.getWindowHandles().size() > 1);

        // Get all window handles
        Set<String> allTabs = driver.getWindowHandles();

        // Switch to the new tab
        for (String handle : allTabs) {
            if (!handle.equals(originalTab)) {
                driver.switchTo().window(handle);
                break;
            }
        }

        // Do your check in the new tab
        System.out.println("New tab title: " + driver.getTitle());

        // ... do anything you need in the new tab

        // Finally switch back to the original tab if needed
        driver.switchTo().window(originalTab);
    }
   public void clickExportButton() throws InterruptedException {
       wait.until(ExpectedConditions.elementToBeClickable(
               CLICK_EXPORT_BUTTON_QUOTATION_ON_LIST_VIEW)).click();
       Thread.sleep(10000);// 3. Wait & verify download
       boolean isDownloaded = isFileDownloaded("E:\\", "Quotation-KHI_QT-");
       System.out.println("Download success: " + isDownloaded);
       Assert.assertTrue(isDownloaded, "❌ Exported file was not downloaded successfully!");


   }


}
