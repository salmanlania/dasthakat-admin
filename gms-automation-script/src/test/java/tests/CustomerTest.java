package tests;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.CreateCustomerPage;
import pages.LoginPage;
import utils.BaseTest;
import utils.ConfigReader;
import utils.ReportManager;

public class CustomerTest extends BaseTest {

    @BeforeMethod
    public void loginBeforeTests() {
        ReportManager.createTest("Create Customer Test Case");

        // Assuming you are still on the login page
        LoginPage login = new LoginPage(driver);
        String email = ConfigReader.getProperty("admin.email");
        String password = ConfigReader.getProperty("admin.password");
        login.login(email, password);
    }
    @Test(description = "Test Case for Creating Customer")
    public void createCustomerTestCase() throws InterruptedException {
        ReportManager.logInfo("Creating a customer...");
        // your test logic here
        ReportManager.logPass("Customer created successfully.");
        CreateCustomerPage customer = new CreateCustomerPage(driver, this);
        String randomCustomername = "Customer" + System.currentTimeMillis(); // Unique Customername
        String CustomerEmail ="Customer" + System.currentTimeMillis() + "@example.com";
        String CustomerEmailAccounting="Customer" + System.currentTimeMillis() + "@example.com";
        // Generate unique customer data using timestamp
        String CustomerPhoneNo = "555" + (System.currentTimeMillis() % 10000000); // 10-digit phone
        String CustomerRebatePercen = String.valueOf((System.currentTimeMillis() % 2000) / 100.0); // 0.00-20.00
        String CustomerAddress = "Address" + (System.currentTimeMillis() % 10000) + " St";
        String CustomerBillingAddress = "Billing" + (System.currentTimeMillis() % 10000) + " Ave";
        String salesName ="Salesman" + System.currentTimeMillis();
        String salesNamePercentage=String.valueOf((System.currentTimeMillis() % 2000) / 100.0);
        String termText ="This is testing Terms" + System.currentTimeMillis();
        customer.createCustomer(randomCustomername,CustomerEmail,CustomerEmailAccounting,CustomerPhoneNo,CustomerRebatePercen,CustomerAddress,CustomerBillingAddress,salesName, salesNamePercentage,termText);
        Thread.sleep(10000);
    }

}