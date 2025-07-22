package utils;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;

public class ScreenshotUtil {
    public static String captureScreenshot(WebDriver driver, String screenshotName) {
        try {
            TakesScreenshot ts = (TakesScreenshot) driver;
            File source = ts.getScreenshotAs(OutputType.FILE);

            String folderPath = "test-output/screenshots/";
            File folder = new File(folderPath);
            if (!folder.exists()) folder.mkdirs();

            String dest = folderPath + screenshotName + ".png";
            FileUtils.copyFile(source, new File(dest));
            return "screenshots/" + screenshotName + ".png"; // return relative path for report
        } catch (IOException e) {
            System.out.println("Failed to capture screenshot: " + e.getMessage());
            return "";
        }
    }

}
