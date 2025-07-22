package tests;

import org.testng.annotations.Test;
import pages.CreateQuotePage;
import utils.BaseTest;

public class MarkuoQuotationTest extends BaseTest {
    @Test(priority = 11,description = "MI=01 Verify That Markup Value remain same if user has moved on that field ")
    public void createQuotationTestCase() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        quotePage.selectEvent();
        quotePage.selectPersonIncharge();
        String CustomerRefText ="Customer Ref" + System.currentTimeMillis();
        quotePage.insertCustomerReference(CustomerRefText);
        quotePage.DateOfService();
        String attn ="attn" + System.currentTimeMillis();
        quotePage.insertAttn(attn);
        String delivery ="attn" + System.currentTimeMillis();
        quotePage.insertDelivery(delivery);
        Thread.sleep(2000);
        String validity = "validity  " + System.currentTimeMillis();
        quotePage.createOrSelectValidityFromPlusButton(validity);
        String paymentTerms = "This is the Payment Terms " + System.currentTimeMillis();
        quotePage.createPaymentTermsFromPlusButton(paymentTerms);
        String portName = "Test Port " + System.currentTimeMillis();
        quotePage.createOrSelectPortFromPlusButton(portName);
        Thread.sleep(5000);
        String additionalTextForNote ="This is Additional Text" + System.currentTimeMillis();
        quotePage.selectQuotationTerm(additionalTextForNote);
        Thread.sleep(5000);
        quotePage.addOtherProductTypeItemInGrid();
        Thread.sleep(5000);
        quotePage.addInventoryProductIntoGrid();
        quotePage.addServiceProductIntoGrid();
        quotePage.addIMPAProductIntoGrid();
        Thread.sleep(2000);
        quotePage.clickSaveQuotationButton();
        quotePage.verifyQuotationSaveMessage();
    }
}
