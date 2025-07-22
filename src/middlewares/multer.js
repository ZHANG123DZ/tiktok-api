const multer = require("multer");

// --- Cấu hình Multer ---
// Sử dụng memoryStorage() để lưu file vào bộ nhớ dưới dạng Buffer.
// Đây là lựa chọn tốt khi bạn muốn xử lý file ngay lập tiếp (ví dụ: upload lên Cloudinary)
// mà không cần lưu tạm vào ổ đĩa.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // Giới hạn kích thước file: 50MB (tùy chỉnh theo nhu cầu)
  },
  // Optional: Bạn có thể thêm fileFilter để kiểm tra loại file
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại MIME của file
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Chấp nhận file
    } else {
      cb(
        new Error(
          "Loại file không được phép. Chỉ chấp nhận JPG, PNG, GIF, MP4, MOV."
        ),
        false
      ); // Từ chối file
    }
  },
});

// --- Export các middleware Multer đã cấu hình ---
// Bạn có thể export từng loại upload để dễ dàng sử dụng
module.exports = {
  // Để xử lý một file duy nhất
  single: (fieldName) => upload.single(fieldName),

  // Để xử lý nhiều file có cùng tên trường
  array: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),

  // Để xử lý nhiều file với các tên trường khác nhau
  fields: (fieldsArray) => upload.fields(fieldsArray),

  // Nếu bạn cần upload bất kỳ file nào mà không cần tên trường cụ thể (ít dùng hơn)
  any: (maxCount) => upload.any(maxCount),
};
