package utils;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.*;
import pages.CreateQuotePage;
import pages.LoginPage;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.io.File;
import java.lang.reflect.Method;
import java.util.*;
import java.util.List;

public class BaseTest {
    public static WebDriver driver;
//    protected static Properties config;

    @BeforeClass
    public void setup() throws InterruptedException, AWTException {
        // 1. Set up WebDriverManager first
        WebDriverManager.chromedriver().setup();

        // 2. Set up Chrome options
        String downloadFilepath = "E:\\"; // ✅ your download folder

        Map<String, Object> prefs = new HashMap<>();
        prefs.put("download.default_directory", downloadFilepath);
        prefs.put("download.prompt_for_download", false);
        prefs.put("profile.default_content_settings.popups", 0);

        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("prefs", prefs);

        // 3. Initialize driver with options — DO NOT overwrite it!
        driver = new ChromeDriver(options);

        driver.manage().window().maximize();

        // 4. Load your base URL
        String baseUrl = ConfigReader.getProperty("base.url");
        driver.get(baseUrl);

        Thread.sleep(1000); // wait for page load if needed

        // 5. Use Robot for zoom out (~70%)
        Robot robot = new Robot();
        for (int i = 0; i < 3; i++) {
            robot.keyPress(KeyEvent.VK_CONTROL);
            robot.keyPress(KeyEvent.VK_SUBTRACT);
            robot.keyRelease(KeyEvent.VK_SUBTRACT);
            robot.keyRelease(KeyEvent.VK_CONTROL);
            Thread.sleep(200);
        }
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    @BeforeMethod
    public void loginBeforeTests(Method method) {
        Test testAnnotation = method.getAnnotation(Test.class);
        String testDescription = method.getName(); // fallback to method name
        if (testAnnotation != null && !testAnnotation.description().isEmpty()) {
            testDescription = testAnnotation.description();
        }
        ReportManager.createTest(testDescription);
//        ReportManager.createTest("Create Customer Test Case");

        // Assuming you are still on the login page
        LoginPage login = new LoginPage(driver);
        String email = ConfigReader.getProperty("admin.email");
        String password = ConfigReader.getProperty("admin.password");
        login.login(email, password);
    }
    @AfterMethod
    public void SignOutFromSite() {
        CreateQuotePage quotePage = new CreateQuotePage(driver,this);
        quotePage.sigOut();
    }
    @BeforeSuite
    public void globalSetup() {
        // Initialize reports
        ReportManager.initReports();

        // Your existing driver setup code
        // driver = new ChromeDriver();
    }

    @AfterSuite
    public void globalTeardown() {
        // Flush reports
        ReportManager.flushReports();

        // Your existing driver teardown code
        // if (driver != null) driver.quit();
    }
    public void switchToNewWindow() {
        String parentWindow = driver.getWindowHandle();
        Set<String> allWindows = driver.getWindowHandles();

        for (String window : allWindows) {
            if (!window.equals(parentWindow)) {
                driver.switchTo().window(window);
                break;
            }
        }
        // Maximize the window
        driver.manage().window().maximize();

        // Set zoom level to 75% using JavaScript
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.body.style.zoom='75%';");
    }
    public void switchToLastWindow() {
        Set<String> allWindows = driver.getWindowHandles();
        for (String window : allWindows) {
            driver.switchTo().window(window);
        }
        // Maximize the window
        driver.manage().window().maximize();

        // Set zoom level to 75% using JavaScript
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.body.style.zoom='75%';");
    }

    public void switchToSecondWindow() {
        driver.close();
        List<String> windowList = new ArrayList<>(driver.getWindowHandles());

        if (windowList.size() >= 2) {
            driver.switchTo().window(windowList.get(1)); // index 1 means second window
        } else {
            System.out.println("Second window not available.");
        }
        // Maximize the window
        driver.manage().window().maximize();

        // Set zoom level to 75% using JavaScript
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.body.style.zoom='75%';");
    }


    /**
     * Switches back to the original/parent window
     * @param parentWindow The handle of the parent window to switch back to
     */
    public void switchToParentWindow(String parentWindow) {
        driver.close(); // closes the current window
        driver.switchTo().window(parentWindow);
    }
    // 4. Helper method to check if file exists
    public static boolean isFileDownloaded(String downloadPath, String fileName) {
        File dir = new File(downloadPath);

        if (!dir.exists()) {
            System.out.println("❌ Directory does not exist: " + downloadPath);
            return false;
        }

        File[] dirContents = dir.listFiles();
        if (dirContents == null) {
            System.out.println("❌ Could not list files in: " + downloadPath);
            return false;
        }

        // ✅ DEBUG PRINT: show all files in the folder
        System.out.println("📂 Files in download folder:");
        for (File file : dirContents) {
            System.out.println(" - " + file.getName());
        }

        // ✅ FLEXIBLE NAME CHECK with startsWith/endsWith
        for (File file : dirContents) {
            if (file.getName().startsWith(fileName) && file.getName().endsWith(".xlsx"))  {
                if (!file.getName().endsWith(".crdownload")) { // make sure it's fully downloaded
                    System.out.println("✅ File downloaded completely: " + file.getAbsolutePath());
                    return true;
                }
            }
        }

        System.out.println("❌ File not found matching: " + fileName);
        return false;
    }
    /**
     * Gets the handle of the current window
     * @return The window handle
     */
    public String getCurrentWindowHandle() {
        return driver.getWindowHandle();
    }
}
