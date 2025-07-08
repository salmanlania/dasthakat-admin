package utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

public class ReportManager {
    public static ExtentReports extent;
    public static ExtentTest test;

    public static void initReports() {
        extent = new ExtentReports();
        ExtentSparkReporter spark = new ExtentSparkReporter("test-output/ExtentReport.html");
        spark.config().setTheme(Theme.STANDARD);
        spark.config().setDocumentTitle("Automation GMS Test Report");
        spark.config().setReportName("GMS Test Report");
        extent.attachReporter(spark);
        extent.setSystemInfo("OS", System.getProperty("os.name"));
        extent.setSystemInfo("Java Version", System.getProperty("java.version"));
    }

    public static void createTest(String testName) {
        test = extent.createTest(testName);
//        System.out.println("📘 Starting Test: " + testName);
    }

    public static void flushReports() {
        extent.flush();
    }

    public static void logPass(String message) {
        test.pass(message);
    }

    public static void logFail(String message) {
        test.fail(message);
    }

    public static void logInfo(String message) {
        test.info(message);
    }


}
