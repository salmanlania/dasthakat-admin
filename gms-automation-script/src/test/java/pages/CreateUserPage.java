package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.time.Duration;
import java.util.List;

public class CreateUserPage {
    WebDriver driver;
    WebDriverWait wait;
    By openMenu= By.cssSelector("nav.flex button[type=\"button\"]");
    By clickAdministration= By.cssSelector("div[data-menu-id*=\"administration\"][aria-controls*=\"administration-popup\"]");
    By clickUserManagement= By.cssSelector(".ant-menu-title-content");
    By clickCreateButton= By.cssSelector("a[href=\"/staging/gms/user/create\"] button");
    By insertUserName= By.id("user_user_name");
    By insertEmail= By.id("user_email");
    By insertPassword= By.id("user_password");
    By clickPermission=By.id("user_permission_id");
    By selectPermission=By.xpath("//div[text()=\"Admin Access\"]");
    By clickSaveButton=By.cssSelector("button[type='submit']");
    By userCreatedSuccessfullyMessage=By.xpath("//div[contains(text(), \"User created successfully\")]");

    public CreateUserPage(WebDriver driver) {
        this.driver = driver;
        // Set an explicit wait timeout of 10 seconds (adjust as needed)
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }
    public void createUser(String UserUserName, String Email, String Password ) {

        wait.until(ExpectedConditions.visibilityOfElementLocated(clickAdministration)).click();
        List<WebElement> elements = driver.findElements(clickUserManagement);
        for (WebElement el : elements) {
            if (el.getText().equals("User Management")) {
                el.click(); // or perform your assertion
//                break;
            }
        }
        List<WebElement> elements2= driver.findElements(clickUserManagement);
        for (WebElement el : elements2) {
            if (el.getText().equals("User")) {
                el.click(); // or perform your assertion
//                break;
            }
        }
        wait.until(ExpectedConditions.visibilityOfElementLocated(clickCreateButton)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(insertUserName)).sendKeys(UserUserName);
        wait.until(ExpectedConditions.visibilityOfElementLocated(insertEmail)).sendKeys(Email);
        wait.until(ExpectedConditions.visibilityOfElementLocated(insertPassword)).sendKeys(Password);
        wait.until(ExpectedConditions.visibilityOfElementLocated(clickPermission)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(selectPermission)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(clickSaveButton)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(userCreatedSuccessfullyMessage));
        // Find the element

        WebElement successMessage = driver.findElement(userCreatedSuccessfullyMessage);

// Get the actual text
        String actualText = successMessage.getText();

// Expected text
        String expectedText = "User created successfully";

// Assert exact match
        Assert.assertEquals(actualText, expectedText, "Text does not match expected message");

    }

}
