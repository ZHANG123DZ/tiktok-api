const path = require("path");
const fs = require("fs").promises;

const UPLOAD_BASE_DIR = path.join(__dirname, "../../public/uploads");

const ensureDirectoryExistence = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const sanitizeFilename = (filename) =>
  filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");

class UploadService {
  async uploadSingle(file, folder = "", user) {
    const uniqueFilename = `${Date.now()}-${sanitizeFilename(
      file.originalname
    )}`;
    const targetDirPath = path.join(UPLOAD_BASE_DIR, `${user.id}`, folder);
    await ensureDirectoryExistence(targetDirPath);
    const filePathOnServer = path.join(targetDirPath, uniqueFilename);
    await fs.writeFile(filePathOnServer, file.buffer);
    const publicUrl = path.posix.join(
      "/uploads",
      user.id,
      folder,
      uniqueFilename
    );
    return {
      url: publicUrl,
      filename: uniqueFilename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      serverPath: filePathOnServer,
    };
  }
  async uploadMultiple(files, folder = "", user) {
    const uploadPromises = files.map(async (file) => {
      try {
        const result = await this.uploadSingle(file, folder, user);
        return { status: "success", ...result };
      } catch (error) {
        console.error(`Failed to upload ${file.originalname}:`, error);
        return {
          status: "failed",
          originalname: file.originalname,
          error: error.message,
        };
      }
    });
    return Promise.all(uploadPromises);
  }

  async replaceFile(newFile, oldUrl, folder = "", user) {
    try {
      const oldFilePath = path.join(__dirname, "../../public", oldUrl);
      await fs.unlink(oldFilePath);
      const newFileUploadResult = await this.uploadSingle(
        newFile,
        folder,
        user
      );
      return newFileUploadResult;
    } catch (error) {
      console.error(`Error replacing file ${oldUrl}:`, error);
      if (error.code === "ENOENT") {
        throw new Error(`Old file not found at ${oldUrl}.`);
      }
      throw error;
    }
  }

  async deleteFile(url, user) {
    try {
      const urlParts = url.split(path.posix.sep).filter(Boolean);

      if (urlParts.length < 3 || urlParts[0] !== "uploads") {
        console.warn(`Invalid URL format for deletion: ${url}`);
        throw new Error("Invalid file URL for deletion.");
      }

      const ownerFolder = urlParts[1];

      if (ownerFolder !== user.id) {
        console.warn(
          `User ${user.id} attempted to delete file ${url} not owned by them.`
        );
        throw new Error("You do not have permission to delete this file.");
      }
      const filePath = path.join(__dirname, "../../public", url);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`Attempted to delete non-existent file: ${url}`);
        return false;
      }
      console.error(`Error deleting file ${url}:`, error);
      throw error;
    }
  }
}

module.exports = new UploadService();
