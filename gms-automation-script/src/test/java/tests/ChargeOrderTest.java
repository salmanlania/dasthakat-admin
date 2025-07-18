package tests;

import org.testng.annotations.Test;
import pages.ChargeOrderPage;
import utils.BaseTest;
import utils.ReportManager;

import javax.swing.plaf.IconUIResource;


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
    @Test(priority = 5,description = "ID=TC_64 Verify IJO only created on first charge order")
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
        ReportManager.logInfo("Step 7:On the resulting popup click on view details");
        coPage.clickChargeOrderDetail();
        ReportManager.logInfo("Step 8: Navigate to the Edit Charge Order page and copy the Event number");
        String eventOfNewlyCreatedChargeOrder = coPage.getEventNoOfNewChargeOrder();
        String eventNumberOfCO = eventOfNewlyCreatedChargeOrder.replaceAll("\\s.*", "");
        System.out.println(eventNumberOfCO);
        ReportManager.logInfo("Step 9: Now navigate to the IJO page");
        coPage.clickIJODropdown();
        ReportManager.logInfo("Step 10: Verify that system should not create more then 1 IJO for the same event");
        String beforSearchTotal = coPage.getIJOTotalPagenationText();
        coPage.verifyThatIJOisCreatedSingleForTheEvent(eventNumberOfCO,beforSearchTotal);


    }

    @Test(priority = 6,description = "ID=TC_65 Verify that no picklist is generated without inventory items")
    public void VerifyNoPickListWillBeCreatedWhenChargeOrderCreatedWithNonInventoryProducts() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Quotations option under the Sales Management module");
        coPage.clickQuotationDropdown();
        ReportManager.logInfo("Step 4: Now Click Add New and Create Quotation With Non Inventory Products.");
        coPage.createQuotationNonInventoryProducts();
        String getQuotationNoForSearch = coPage.getQuotationNo();
        coPage.clickExitQuotationButton();
        coPage.searchQuotation(getQuotationNoForSearch);
        ReportManager.logInfo("Step 5: Now, click on Charge order option of the Quotation and a dialog box appears");
        coPage.clickChargeOrderButton();
        ReportManager.logInfo("Step 6: Select a row with non-inventory items and enter the quantity");
        coPage.selectAllRows();
        coPage.inputQtyForAllRow();
        ReportManager.logInfo("Step 7: Click on Charge button");
        coPage.clickSaveChargeModalButton();
        coPage.verifyChargeOrderCreatedMessage();
        ReportManager.logInfo("Step 8:On the resulting popup click on view details");
        coPage.clickChargeOrderDetail();
        ReportManager.logInfo("Step 9: Navigate to the Edit Charge Order page and copy the Charge order number");
        String getChargeOrderNoForSearch = coPage.getChargeOrderNo();
        ReportManager.logInfo("Step 10: Now navigate to the Picklist page");
        coPage.clickWarehouseDropdown();
        coPage.clickPickListDropdown();
        coPage.searchPickList(getChargeOrderNoForSearch);
        ReportManager.logInfo("Step 11: Verify that no Picklist should be generated since the Charge Order does not contain any Inventory products");
        coPage.verifyPickListCreatedOrNot(getChargeOrderNoForSearch);
    }

    @Test(priority = 7,description = "ID=TC_6 Verify that no service document is generated without service items")
    public void VerifyNoServiceListWillBeCreatedWhenChargeOrderCreatedWithNonInventoryProducts() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Quotations option under the Sales Management module");
        coPage.clickQuotationDropdown();
        ReportManager.logInfo("Step 4: Now Click Add New and Create Quotation With Non Service Type Products.");
        coPage.createQuotationNonServiceProducts();
        String getQuotationNoForSearch = coPage.getQuotationNo();
        coPage.clickExitQuotationButton();
        coPage.searchQuotation(getQuotationNoForSearch);
        ReportManager.logInfo("Step 5: Now, click on Charge order option of the Quotation and a dialog box appears");
        coPage.clickChargeOrderButton();
        ReportManager.logInfo("Step 6: Select a row with non-inventory items and enter the quantity");
        coPage.selectAllRows();
        coPage.inputQtyForAllRow();
        ReportManager.logInfo("Step 7: Click on Charge button");
        coPage.clickSaveChargeModalButton();
        coPage.verifyChargeOrderCreatedMessage();
        ReportManager.logInfo("Step 8:On the resulting popup click on view details");
        coPage.clickChargeOrderDetail();
        ReportManager.logInfo("Step 9: Navigate to the Edit Charge Order page and copy the Charge order number");
        String getChargeOrderNoForSearch = coPage.getChargeOrderNo();
        ReportManager.logInfo("Step 10: Now navigate to the Service List page");
        coPage.clickWarehouseDropdown();
        coPage.clickServiceListDropdown();
        coPage.searchServiceList(getChargeOrderNoForSearch);
        ReportManager.logInfo("Step 11: Verify that no Service list should be generated since the Charge Order does not contain any Inventory products");
        coPage.verifyServiceListCreatedOrNot(getChargeOrderNoForSearch);
    }

  @Test(priority = 8,description = "ID=TC_69 Verify the functionality of Delete option on Charge Order page")
    public void VerifyTheSingleDeleteFunctionality() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Charge Order option under Sales Management module");
        coPage.clickChargeOrderDropdown();
        ReportManager.logInfo("Step 4: Click on any of charge order Delete option in the action column. and Check if the deleted Charge Order removed from the list");
        coPage.clickSinglyeDeleteButtonFromFlistView();
        coPage.verifySingleChargeOrderDeleteMessage();
  }


  @Test(priority = 10,description = "ID=TC_72 Verify the functionality of No option on delete dialog box")
    public void VerifyTheNoDeleteFunctionalityOfChargeOrder() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Charge Order option under Sales Management module");
        coPage.clickChargeOrderDropdown();
        ReportManager.logInfo("Step 4: Locate a specific Charge Order record and Click on Delete option for that Charge Order");
        coPage.clickDeleteRowButton();
      ReportManager.logInfo("Step 5: Locate a specific Charge Order record and Click on Delete option for that Charge Order");
      coPage.clickNoButtonOnDeleteConfirmationPopup();
  }
  @Test(priority = 11,description = "ID=TC_73 Verify the functionality of No option on delete dialog box")
    public void VerifyTheBulkDeleteFunctionalityOfChargeOrder() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Charge Order option under Sales Management module");
        coPage.clickChargeOrderDropdown();
        ReportManager.logInfo("Step 4:Select checkboxes beside multiple Charge Orders");
        coPage.selectAllRowsForBulDeleteOfChargeOrder();
        ReportManager.logInfo("Step 5: Click on delete button");
        coPage.clickDeleteForBulKDeleteOfChargeOrder();
        ReportManager.logInfo("Step 6: Confirm the delete action");
        coPage.verifyBulkChargeOrderDeleteMessage();
        ReportManager.logInfo("Step 7: Verify that dialog box should closed by clicking on no option");
        coPage.verifyTheAllDataDeletedSuccessfully();


  }

     */
    @Test(priority = 12,description = "ID=TC_86 Verify Search filter functionality")
    public void VerifyTheBulkDeleteFunctionalityOfChargeOrder() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        ReportManager.logInfo("Step 2: Navigate to the Sales Management module from the main menu");
        coPage.clickSaleManagementDropdown();
        ReportManager.logInfo("Step 3: Click on the Charge Order option under Sales Management module");
        coPage.clickChargeOrderDropdown();
        ReportManager.logInfo("Step 4: Locate the search filter");
        Thread.sleep(1000);
        String getChargeOrderNoForSearch = coPage.getChargeOrderFromNumberFromListView();
//        System.out.println(getChargeOrderNoForSearch);
        Thread.sleep(5000);
        coPage.verifyGlobalSearchOfChargeOrder(getChargeOrderNoForSearch);




    }



}
