<?php

$zip_file = '../vendor.zip';
$extract_to = '../';

if (file_exists($zip_file)) {
    $zip = new ZipArchive;
    if ($zip->open($zip_file) === TRUE) {
        echo "Current working directory: " . getcwd() . "<br>";

        
        if (!file_exists($extract_to)) {
            echo "Creating directory: $extract_to <br>";
            if (mkdir($extract_to, 0777, true)) {
                echo "Directory created successfully.<br>";
            } else {
                echo "Failed to create directory.<br>";
            }
        }

        $zip->extractTo($extract_to);
        $zip->close();
        
        echo 'Unzip successful!';
        
        unlink($zip_file);
    } else {
        echo 'Failed to open zip file!';
    }
} else {
    echo 'Zip file not found!';
}
?>