# Google Drive ZIP Extractor (Google Apps Script)

A simple and efficient Google Apps Script (GAS) that extracts `.zip` files directly within Google Drive while perfectly preserving the original, nested folder structure. 

By default, Google Apps Script's `Utilities.unzip()` extracts all files into a single flat directory. This script solves that problem by reading the internal paths of the zipped files and dynamically rebuilding the subfolders inside your designated Google Drive destination.

## Features
* **Preserves Folder Hierarchy:** Accurately reconstructs all parent and child directories from the ZIP file.
* **Cloud-Native:** Runs entirely on Google Apps Script—no need to download files to your local machine.
* **Automated Routing:** Automatically detects whether an item is a file or a directory and routes it accordingly.

## Prerequisites
* A Google Account with access to Google Drive.
* The ID of the `.zip` file you want to extract.
* The ID of the destination folder where the contents will be saved.

*(Note: You can find a file or folder ID by looking at its Google Drive URL. It is the long string of alphanumeric characters between `/d/` and `/view` or at the end of the folder URL).*

## Installation & Setup

1. Go to [Google Apps Script](https://script.google.com/) and click **New Project**.
2. Name your project (e.g., "Drive ZIP Extractor").
3. Delete any default code in the editor and paste the code from the `Code.gs` section below.
4. Replace the `zipFileId` and `destinationFolderId` variables with your actual Google Drive IDs.
5. Save the project (Ctrl+S / Cmd+S).

## Usage

1. Select the `extractZipWithFolders` function from the dropdown menu at the top of the Apps Script editor.
2. Click **Run**.
3. **Authorization:** The first time you run this script, Google will prompt you to authorize it. Click **Review Permissions**, select your Google account, click **Advanced**, and proceed to the script.
4. Check your Execution Log to monitor the progress. Once completed, your files will be available in the destination folder!

## Code (`Code.gs`)

```javascript
function extractZipWithFolders() {
  // The ID of the ZIP file in Google Drive
  var zipFileId = '[ZIPID]';
  
  // The ID of the main destination folder
  var destinationFolderId = '[destination folder id]';

  try {
    var zipFile = DriveApp.getFileById(zipFileId);
    var mainFolder = DriveApp.getFolderById(destinationFolderId);
    
    var blob = zipFile.getBlob();
    blob.setContentType('application/zip');
    
    // Unzip the file
    var unzippedFiles = Utilities.unzip(blob);
    
    for (var i = 0; i < unzippedFiles.length; i++) {
      var currentBlob = unzippedFiles[i];
      var fullPath = currentBlob.getName(); // The name usually includes the path, e.g., "folder1/folder2/file.txt"
      
      // Check if this item is just an empty directory (usually ends with '/')
      var isDirectory = fullPath.charAt(fullPath.length - 1) === '/';
      
      // Split the path components by '/'
      var pathParts = fullPath.split('/');
      var currentFolder = mainFolder;
      
      for (var j = 0; j < pathParts.length; j++) {
        var partName = pathParts[j];
        
        // Skip if the part name is empty
        if (partName === '') {
          continue;
        }
        
        // If it's the last part of the path and NOT a directory, it's a file
        if (j === pathParts.length - 1 && !isDirectory) {
          // Remove the path to get just the actual file name
          currentBlob.setName(partName);
          // Create the file in the current designated folder
          currentFolder.createFile(currentBlob);
          Logger.log('Created file: ' + partName + ' in folder: ' + currentFolder.getName());
        } else {
          // If it's not the last part, it's a folder
          // Check if a folder with this name already exists in the current directory
          var existingFolders = currentFolder.getFoldersByName(partName);
          
          if (existingFolders.hasNext()) {
            // If it exists, navigate into it
            currentFolder = existingFolders.next();
          } else {
            // If it doesn't exist, create a new subfolder
            currentFolder = currentFolder.createFolder(partName);
            Logger.log('Created subfolder: ' + partName);
          }
        }
      }
    }
    
    Logger.log('ZIP file extracted and folder structure created successfully!');
    
  } catch (error) {
    Logger.log('Error occurred: ' + error.toString());
  }
}
