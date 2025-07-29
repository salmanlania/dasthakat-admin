package tests;
import org.testng.annotations.Test;
import pages.CreateQuotePage;
import utils.BaseTest;

public class QuotationTest extends BaseTest {

    @Test(priority = 1, description = "ID=TC_01 Verify the functionality of required field validation for 'Quotation date', 'Salesman' and 'Event'")
    public void verifyRequiredFieldValidationFormOfQuotationForm() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        quotePage.clickSaveQuotationButton();
        quotePage.verifySalesManErrorValidations();
        quotePage.verifyEventErrorValidations();
    }

    @Test(priority = 2, description = "ID=TC_02 Verify the functionality of auto generated quotation number")
    public void verifyQuotationNumberAutoOnNewFormOfQuotationForm() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        quotePage.verifyQuotationNoAuto();
    }


    @Test(priority = 3, description = "ID=TC_03 Verify Select Event and auto populate related fields functionality")
    public void selectEventAndVerifyAutoPopulateFields() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        quotePage.selectEvent();
        quotePage.verifySalesmanAppearOnSelectionOfEvent();
        quotePage.verifyVesselAppearOnSelectionOfEvent();
        quotePage.verifyIMOAppearOnSelectionOfEvent();
        quotePage.verifyCustomerAppearOnSelectionOfEvent();
        quotePage.verifyClass1AppearOnSelectionOfEvent();
        quotePage.verifyClass2AppearOnSelectionOfEvent();
        quotePage.verifyFlagAppearOnSelectionOfEvent();

    }

    @Test(priority = 4, description = "ID=TC_04 Verify that a quotation is created successfully when all required fields are filled correctly")
    public void verifyQuotationSaveAfterFillAllRequiredFields() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        quotePage.selectEvent();
        quotePage.clickSaveQuotationButton();
        quotePage.verifyQuotationSaveMessage();


    }

    @Test(priority = 5, description = "ID=TC_05 Verify Sales dropdown displays data correctly, ID=TC_06 Verify the functionality of Add New(+) option in salesman dropdown menu")
    public void verifySalesmanDropDownDataAndPlusFunctionality() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        String salesmanName = "Test Salesman Name" + System.currentTimeMillis();
        String salesNamePercentage = String.valueOf((System.currentTimeMillis() % 2000) / 100.0);
        quotePage.createSalesManFromPlusButton(salesmanName, salesNamePercentage);
        Thread.sleep(1000);

    }
    @Test(priority = 6, description = "ID=TC_09 Verify Person In_charge dropdown displays data correctly")
    public void verifyOrSelectPersonInChargeDropDownData() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
       quotePage.selectPersonIncharge();
    }
    @Test(priority = 7, description = "ID=TC_11 Verify Payment terms dropdown displays data correctly,ID=TC_12 Verify the functionality of Add New(+) option in Payment terms dropdown menu")
    public void verifyPaymentTermDropDownDataAndPlusFunctionality() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        String paymentTerms = "This is the Payment Terms " + System.currentTimeMillis();
        quotePage.createPaymentTermsFromPlusButton(paymentTerms);

    }
    @Test(priority = 8, description = "ID=TC_13 Verify Port dropdown displays data correctly,ID=TC_14 Verify the functionality of Add New(+) option in Port dropdown menu")
    public void verifyPortDropDownDataAndPlusFunctionality() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        String portName = "Test Port " + System.currentTimeMillis();
        quotePage.createOrSelectPortFromPlusButton(portName);
    }

    @Test(priority = 9, description = "ID=TC_17 Verify the functionality of validity field whether it displays the data correctly, ID=TC_18 Verify the functionality of Add New(+) option in Validity dropdown menu")
    public void verifyValidityDropDownDataAndPlusFunctionality() {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        String validity = "validity  " + System.currentTimeMillis();
        quotePage.createOrSelectValidityFromPlusButton(validity);
    }


    @Test(priority = 10, description = "ID=TC_19 Verify Select Terms dropdown displays data and show selected value in notes, ID=TC_20 Verify the input functionality of notes section")
    public void verifyNotesOrTermsDropDownDataAndPlusFunctionality() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickAddNewQuotationButton();
        String additionalTextForNote ="This is Additional Text" + System.currentTimeMillis();
        quotePage.selectQuotationTerm(additionalTextForNote);
    }






    @Test(priority = 11,description = "ID=TC_19...31, 33, 34 ,37 Whole Quotation Create ")
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
    @Test(priority = 12, description = "ID=TC_38 Verify the functionality of Cancel button")
    public void createCancelSaveFunctionality() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        String beforeCount = quotePage.beforeAddQuotation();
        System.out.println(beforeCount);
        quotePage.waitAndScrollToElement();
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
        quotePage.clickCancelQuotationButton();
//        String afterCount = quotePage.afterAddQuotation();
//        System.out.println(afterCount);
//        boolean areCountsEqual = quotePage.compareCounts(beforeCount, afterCount);
//        assert areCountsEqual : "Pagination text changed unexpectedly.";
    }

    @Test(priority = 13, description = "ID=TC_39 Verify list view global Search filter functionality Turn on screen reader support")
    public void verifyGlobalSearchOfQuotationListView(){
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.searchClear();
        boolean isSearchValid = quotePage.verifyGlobalSearch("KHI/QT-0004");
        assert isSearchValid : "Search failed to filter results.";

    }

    @Test(priority = 14, description = "ID=TC_40 Verify the Edit option is functional on Quotations page")
    public void verifyEditFunctionalityOfQuotationListView() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        String quotationNumber="KHI/QT-0004";
        quotePage.serachQuotaionNumberandClickEditButtonofSearchedQuotation(quotationNumber);
        quotePage.verifyQuotationNoOnEdit(quotationNumber);
        quotePage.addOtherProductTypeItemInGrid();
        Thread.sleep(5000);
        quotePage.addInventoryProductIntoGrid();
        quotePage.addServiceProductIntoGrid();
        quotePage.addIMPAProductIntoGrid();
        Thread.sleep(2000);
        quotePage.clickSaveUpdateQuotationButton();
        quotePage.verifyQuotationUpdateMessage();

    }


    @Test(priority = 15, description = "ID=TC_41 Verify the functionality of Delete option")
    public void verifySingleDeleteFunctionalityOfQuotationListView() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.searchClear();
        quotePage.clickSinglyeDeleteButtonFromFlistView();
        quotePage.verifySingleQuotationDeleteMessage();
    }
    @Test(priority = 16, description = "ID=TC_45 Verify bulk delete functionality")
    public void verifyBulkDeleteFunctionalityOfQuotationListView() throws InterruptedException {
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.selectAllForBulkDelete();
        quotePage.clickBulkDeleteButton();
        quotePage.clickDeleteButtonForModal();
        quotePage.verifyBulkQuotationDeleteMessage();
    }

    @Test(priority = 17, description = "ID=TC_46 Verify that the print option is functional")
    public void verifyPrintfQuotationListView() throws InterruptedException {

        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickPrintButtonOnListView();
    }

    @Test(priority = 18, description = "ID=TC_47 Verify that the export option is functional")
    public void verifyExportOfQuotationListView() throws InterruptedException {

        CreateQuotePage quotePage = new CreateQuotePage(driver, this);
        quotePage.clickSaleManagementDropdown();
        quotePage.clickQuotationDropdown();
        quotePage.clickExportButton();

    }


}

