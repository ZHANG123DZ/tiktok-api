// cloudinaryUploader.js
const cloudinary = require('@/configs/cloudinary'); // Import đối tượng cloudinary đã cấu hình

/**
 * Hàm tiện ích để tải lên tệp (ảnh hoặc video) lên Cloudinary.
 * @param {string} filePath Đường dẫn đến tệp cục bộ hoặc buffer (base64) của tệp.
 * @param {string} fileType 'image' hoặc 'video' để chỉ định loại tài nguyên.
 * @param {string} folder Tên thư mục trên Cloudinary để lưu tệp.
 * @param {string} publicId (Tùy chọn) ID công khai của tệp trên Cloudinary.
 * @returns {Promise<object>} Đối tượng kết quả từ Cloudinary, bao gồm URL, public_id, v.v.
 */
async function uploadFileToCloudinary(
  filePath,
  fileType,
  folder,
  publicId = null
) {
  try {
    if (!filePath || !fileType || !folder) {
      throw new Error(
        'Missing required parameters: filePath, fileType, or folder.'
      );
    }

    const options = {
      resource_type: fileType, // 'image' hoặc 'video'
      folder: folder,
      public_id: publicId,
      overwrite: true,
      timeout: 180000, // Tăng timeout cho chắc
    };

    const uploader =
      fileType === 'video'
        ? cloudinary.uploader.upload_large // 💡 Dùng upload_large cho video
        : cloudinary.uploader.upload;

    const result = await uploader(filePath, {
      ...options,
      chunk_size: fileType === 'video' ? 6 * 1024 * 1024 : undefined, // 6MB mỗi chunk
    });

    console.log(`Uploaded ${fileType} to Cloudinary:`, result.secure_url);
    return result;
  } catch (error) {
    console.error(`Error uploading ${fileType} to Cloudinary:`, error);
    throw error;
  }
}
// Hàm hỗ trợ để lấy public_id từ URL Cloudinary (nếu cần)
function getPublicIdFromCloudinaryUrl(url) {
  if (!url) return null;
  const parts = url.split('/');
  // public_id thường là phần tử cuối cùng trước đuôi mở rộng, và sau folder
  // Ví dụ: .../my_app_uploads/my_image.jpg -> my_image
  // Hoặc nếu không có extension: .../my_app_uploads/my_video -> my_video
  let publicIdWithExtension = parts[parts.length - 1];
  let publicIdWithoutExtension = publicIdWithExtension.split('.')[0];

  // Cần xử lý trường hợp có folder trong public_id nếu bạn lưu Nested folder
  // Ví dụ: my_app_uploads/product_images/item_123.jpg
  // Đoạn code trên chỉ lấy 'item_123'. Nếu bạn muốn 'product_images/item_123', cần điều chỉnh.
  // Cách tốt nhất là lưu trữ public_id trực tiếp khi upload.

  // Một cách khác để lấy publicId đầy đủ nếu biết folder:
  const folderIndex =
    parts.indexOf(cloudinary.config().folder) || parts.indexOf(folder); // Bạn cần biết folder đã dùng khi upload
  if (folderIndex > -1) {
    const remainingParts = parts.slice(folderIndex + 1);
    return remainingParts.join('.').split('.')[0]; // Lấy phần trước dấu . (extension)
  }

  // Nếu không tìm thấy folder hoặc publicId có cấu trúc đặc biệt
  return publicIdWithoutExtension;
}

// Hàm để xóa tệp trên Cloudinary
async function deleteFileFromCloudinary(publicId, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Deleted ${resourceType} from Cloudinary:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting ${resourceType} from Cloudinary:`, error);
    throw error;
  }
}

module.exports = {
  uploadFileToCloudinary,
  getPublicIdFromCloudinaryUrl, // Bạn có thể không cần hàm này nếu luôn lưu public_id
  deleteFileFromCloudinary,
};
