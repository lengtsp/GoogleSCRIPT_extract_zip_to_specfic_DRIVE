
function extractZipWithFolders() {
  // ไอดีของไฟล์ ZIP 
  var zipFileId = '[ID zip file]';
  
  // ไอดีของโฟลเดอร์ปลายทางหลัก
  var destinationFolderId = '[ID folder บน google drive]';

  try {
    var zipFile = DriveApp.getFileById(zipFileId);
    var mainFolder = DriveApp.getFolderById(destinationFolderId);
    
    var blob = zipFile.getBlob();
    blob.setContentType('application/zip');
    
    // ทำการแตกไฟล์
    var unzippedFiles = Utilities.unzip(blob);
    
    for (var i = 0; i < unzippedFiles.length; i++) {
      var currentBlob = unzippedFiles[i];
      var fullPath = currentBlob.getName(); // ชื่อไฟล์ที่ได้มามักจะมี path ติดมาด้วย เช่น "folder1/folder2/file.txt"
      
      // เช็คว่ารายการนี้เป็นแค่โฟลเดอร์เปล่าๆ หรือไม่ (มักจะลงท้ายด้วย '/')
      var isDirectory = fullPath.charAt(fullPath.length - 1) === '/';
      
      // แยกส่วนประกอบของ path ด้วยเครื่องหมาย '/'
      var pathParts = fullPath.split('/');
      var currentFolder = mainFolder;
      
      for (var j = 0; j < pathParts.length; j++) {
        var partName = pathParts[j];
        
        // ข้ามหากส่วนนั้นเป็นค่าว่าง
        if (partName === '') {
          continue;
        }
        
        // ถ้าเป็นส่วนสุดท้ายของ Path และไม่ใช่โฟลเดอร์เปล่าๆ หมายความว่ามันคือ "ไฟล์"
        if (j === pathParts.length - 1 && !isDirectory) {
          // เปลี่ยนชื่อ Blob ให้เหลือแค่ชื่อไฟล์จริงๆ (ตัด path ออก)
          currentBlob.setName(partName);
          // สร้างไฟล์ในโฟลเดอร์ปัจจุบันที่มันควรจะอยู่
          currentFolder.createFile(currentBlob);
          Logger.log('สร้างไฟล์: ' + partName + ' ในโฟลเดอร์ ' + currentFolder.getName());
        } else {
          // ถ้าไม่ใช่ส่วนสุดท้าย แสดงว่ามันคือ "โฟลเดอร์"
          // เช็คว่าในโฟลเดอร์ปัจจุบัน มีโฟลเดอร์ชื่อนี้สร้างไว้หรือยัง
          var existingFolders = currentFolder.getFoldersByName(partName);
          
          if (existingFolders.hasNext()) {
            // ถ้ามีแล้ว ให้เปลี่ยนโฟลเดอร์ปัจจุบันไปที่โฟลเดอร์นั้น
            currentFolder = existingFolders.next();
          } else {
            // ถ้ายังไม่มี ให้สร้างโฟลเดอร์ขึ้นมาใหม่
            currentFolder = currentFolder.createFolder(partName);
            Logger.log('สร้างโฟลเดอร์ย่อย: ' + partName);
          }
        }
      }
    }
    
    Logger.log('แตกไฟล์และสร้างโครงสร้างโฟลเดอร์สำเร็จ!');
    
  } catch (error) {
    Logger.log('เกิดข้อผิดพลาด: ' + error.toString());
  }
}
