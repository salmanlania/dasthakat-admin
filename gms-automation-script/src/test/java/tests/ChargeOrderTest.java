package tests;

import org.testng.annotations.Test;
import pages.ChargeOrderPage;
import utils.BaseTest;


public class ChargeOrderTest extends BaseTest {
//    @Test(priority = 1, description = "ID=TC_48,49 Verify that the Charge order option is functional or not")
//    public void verifyChargeOrderOptionOnQuotationForm() throws InterruptedException {
//        ChargeOrderPage coPage = new ChargeOrderPage(driver);
//        coPage.clickSaleManagementDropdown();
//        coPage.clickQuotationDropdown();
//        coPage.clickChargeOrderButton();
//        coPage.clickCancelModalButton();
//    }
    @Test(priority = 2, description = "ID=TC_51 Verify the functionality of quantity input field on charge order modal")
    public void verifyChargeOrderZeroQtyErrorMessageOnModal() throws InterruptedException {
        ChargeOrderPage coPage = new ChargeOrderPage(driver);
        coPage.clickSaleManagementDropdown();
        coPage.clickQuotationDropdown();
        coPage.clickChargeOrderButton();
        coPage.inputQtyForRow1();
//        coPage.clickCancelModalButton();
    }
}
