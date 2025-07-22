package listeners;

import org.testng.ITestListener;
import org.testng.ITestResult;
import utils.ReportManager;
import utils.ScreenshotUtil;
import utils.BaseTest;

public class TestListener implements ITestListener {
    @Override
    public void onTestStart(ITestResult result) {
        // Do nothing
    }
    @Override
    public void onTestSuccess(ITestResult result) {
        ReportManager.logPass("Test passed: " + result.getName());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        String screenshotPath = ScreenshotUtil.captureScreenshot(BaseTest.driver, result.getName());
        ReportManager.logFail("Test failed: " + result.getThrowable().getMessage());
        ReportManager.test.addScreenCaptureFromPath(screenshotPath);
    }

}
