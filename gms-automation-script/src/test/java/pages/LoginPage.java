package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.time.Duration;

public class LoginPage {
    WebDriver driver;
    WebDriverWait wait;

    By usernameField = By.id("login_email");
    By passwordField = By.id("login_password");
    By loginButton = By.xpath("//button[@type='submit' and .//span[text()='Login']]");
    By submitButton= By.cssSelector("#session button[type=\"submit\"]");
    By dashboardHeader = By.xpath("//h1[text()='DASHBOARD']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        // Set an explicit wait timeout of 10 seconds (adjust as needed)
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void login(String username, String password) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField)).sendKeys(username);
        wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField)).sendKeys(password);
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        wait.until(ExpectedConditions.elementToBeClickable(submitButton)).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(dashboardHeader));
        // Find the element

        WebElement successMessage = driver.findElement(dashboardHeader );

// Get the actual text
        String actualText = successMessage.getText();

// Expected text
        String expectedText = "DASHBOARD";

       // Assert exact match
        Assert.assertEquals(actualText, expectedText, "Login Confirm Text does not match expected message");
    }


}
