package tests;

import org.testng.annotations.Test;
import pages.ChargeOrderPage;
import utils.BaseTest;
import utils.ReportManager;


public class ChargeOrderTest extends BaseTest {
    /*
    @Test(priority = 1, description = "ID=TC_48,49 Verify that the Charge order option is functional or not")
    public void verifyChargeOrderOptionOnQuotationForm() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        coPage.clickSaleManagementDropdown();
        coPage.clickQuotationDropdown();
        coPage.clickChargeOrderButton();
        coPage.clickCancelModalButton();
    }
    @Test(priority = 2, description = "ID=TC_51 Verify the functionality of quantity input field on charge order modal")
    public void verifyChargeOrderZeroQtyErrorMessageOnModal() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        coPage.clickSaleManagementDropdown();
        coPage.clickQuotationDropdown();
        coPage.clickChargeOrderButton();
        coPage.inputQtyForRow1();
    }


    @Test(priority = 3, description = "ID=TC_60,61 Verify that charge order created from quotation appears on charge order page")
    public void verifyChargeOrderCreatedFromQuotationForm() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        coPage.clickSaleManagementDropdown();
        coPage.clickQuotationDropdown();
        coPage.clickChargeOrderButton();
        coPage.inputCustomerPo();
        coPage.inputQtyForAllRow();
        coPage.selectAllRows();
        coPage.clickSaveChargeModalButton();
        coPage.verifyChargeOrderCreatedMessage();
        String expectedText = coPage.getQuotationNoWhoseOrderIsCreatingText();
        coPage.verifyChargeCreatedSuccessfullyAndListedonChargeOrderListView(expectedText);
    }
     */
    @Test(priority = 4, description = "ID=TC_62 Verify that charge order triggers 4 related docs")
    public void verifyOnChargeOrderCreationRelatedToItFourDocumentIsCreated() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();

        ReportManager.logInfo("Step 3: Click on the Quotations option under Sale Management module");
        coPage.clickQuotationDropdown();

        ReportManager.logInfo("Step 4: Now, click on Charge order option and a dialog box appears");
        coPage.clickChargeOrderButton();

        ReportManager.logInfo("Step 5: Input Customer PO");
        coPage.inputCustomerPo();

        ReportManager.logInfo("Step 6: Input Qty For All Rows");
        coPage.inputQtyForAllRow();

        ReportManager.logInfo("Step 7: Select All Rows");
        coPage.selectAllRows();

        ReportManager.logInfo("Step 8: Click Save Charge Modal Button");
        coPage.clickSaveChargeModalButton();

        ReportManager.logInfo("Step 9: Verify Charge Order Created Message");
        coPage.verifyChargeOrderCreatedMessage();

        ReportManager.logInfo("Step 10: Click Charge Order Detail");
        coPage.clickChargeOrderDetail();

        String expectedIJOText = coPage.getNewCreatedChargeOrderNo();
        String expectedServiceOrderText = coPage.getNewCreatedChargeOrderNo();
        String expectedPickListText = coPage.getNewCreatedChargeOrderNo();
        String expectedServiceListText = coPage.getNewCreatedChargeOrderNo();

        ReportManager.logInfo("Step 11: Click IJO Dropdown");
        coPage.clickIJODropdown();

        ReportManager.logInfo("Step 12: Open Edit Form IJO Top Row");
        coPage.openEditFormIJOTopRow();

        ReportManager.logInfo("Step 13: Verify IJO Created");
        coPage.verifyIJOCreatedForNewlyCreatedChargeOrder(expectedIJOText);

        ReportManager.logInfo("Step 14: Click Service Order Dropdown");
        coPage.clickServiceOrderDropdown();

        ReportManager.logInfo("Step 15: Verify Service Order Created");
        coPage.verifyServiceOrderCreatedForNewlyCreatedChargeOrder(expectedServiceOrderText);

        ReportManager.logInfo("Step 16: Click Warehouse Dropdown");
        coPage.clickWarehouseDropdown();

        ReportManager.logInfo("Step 17: Click Pick List Dropdown");
        coPage.clickPickListDropdown();

        ReportManager.logInfo("Step 18: Verify Pick List Created");
        coPage.verifyPickListCreatedForNewlyCreatedChargeOrder(expectedPickListText);

        ReportManager.logInfo("Step 19: Click Service List Dropdown");
        coPage.clickServiceListDropdown();

        ReportManager.logInfo("Step 20: Verify Service List Created");
        coPage.verifyServiceListCreatedForNewlyCreatedChargeOrder(expectedServiceListText);

        ReportManager.logPass("✅ All 4 related documents created and verified!");
    }
    @Test(priority = 5,description = "ID=TC_63 Verify update on Charge order reflected in related documents")
    public void VerifyUpdateOnChargeOrderReflectedInRelatedDocuments() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Quotations option under the Sales Management module");
        coPage.clickQuotationDropdown();
        ReportManager.logInfo("Step 4: Click on the Charge Order option and verify that a dialog box appears");
        coPage.clickChargeOrderButton();
        ReportManager.logInfo("Step 5: Select the quotation and enter the quantity if you want to edit");
        coPage.selectAllRows();
        coPage.inputQtyForAllRow();
        ReportManager.logInfo("Step 6: Click on the Charge button to create the charge order");
        coPage.clickSaveChargeModalButton();
        coPage.verifyChargeOrderCreatedMessage();
        ReportManager.logInfo("Step 7: Create another charge order under the same event");

    }



}
