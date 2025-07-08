package tests;

import org.testng.annotations.Test;
import pages.ChargeOrderPage;
import utils.BaseTest;


public class ChargeOrderTest extends BaseTest {
    @Test(priority = 1, description = "ID=TC_48 Verify that the Charge order option is functional or not")
    public void verifyChargeOrderOptionOnQuotationForm() {
        ChargeOrderPage coPage = new ChargeOrderPage(driver,this);
        coPage.clickSaleManagementDropdown();
        coPage.clickQuotationDropdown();
        coPage.clickChargeOrderButton();
    }
}
