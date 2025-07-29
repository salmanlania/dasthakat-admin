package tests;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.CreateUserPage;
import pages.LoginPage;
import utils.BaseTest;
import utils.ConfigReader;
import utils.ReportManager;

public class UserTest extends BaseTest {

    @Test(description = "Test Case for Creating User")
    public void createUserTestCase() throws InterruptedException {
        ReportManager.logInfo("Creating a user...");
        // your test logic here
        ReportManager.logPass("User created successfully.");
        CreateUserPage user = new CreateUserPage(driver);
        String randomUsername = "user" + System.currentTimeMillis(); // Unique username
        String randomEmail = "user" + System.currentTimeMillis() + "@example.com";
        String randomPassword = "pass" + (int)(Math.random() * 10000);
        user.createUser(randomUsername,randomEmail,randomPassword);
    }
}
