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
