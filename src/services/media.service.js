const DatauriParser = require("datauri/parser");
const path = require("path");

const parser = new DatauriParser();

const {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
  getPublicIdFromCloudinaryUrl,
} = require("@/utils/cloudinaryUploader");

class MediaService {
  #cloudinaryUrlRegex =
    /^https?:\/\/(?:[^\.]+\.)?cloudinary\.com\/.+\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/;

  #formatBufferToDataUriContent(file) {
    if (!file || !file.originalname || !file.buffer) {
      throw new Error(
        "Invalid file object provided to formatBufferToDataUriContent."
      );
    }
    const dataUri = parser.format(
      path.extname(file.originalname).toString(),
      file.buffer
    );
    return dataUri.content;
  }

  #getResourceType(mimetype) {
    if (mimetype.startsWith("image/")) {
      return "image";
    }
    if (mimetype.startsWith("video/")) {
      return "video";
    }
    return "raw";
  }

  #isCloudinaryUrl(url) {
    return this.#cloudinaryUrlRegex.test(url);
  }

  async getPublicIdFromUrl(url) {
    if (!url) {
      throw new Error("URL is required to get public ID.");
    }
    const publicId = await getPublicIdFromCloudinaryUrl(url);
    return publicId;
  }

  async uploadSingleFile(file, folder = "uploads", user) {
    if (!file) {
      throw new Error("No file provided for upload.");
    }
    folder = `user/${user.id}/${folder}`;

    try {
      const fileDataUriContent = this.#formatBufferToDataUriContent(file);
      const resource_type = this.#getResourceType(file.mimetype);
      const result = await uploadFileToCloudinary(
        fileDataUriContent,
        resource_type,
        folder
      );
      if (!result || !result.secure_url || !result.public_id) {
        throw new Error("Cloudinary upload did not return expected data.");
      }
      return {
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      };
    } catch (error) {
      throw new Error(`Failed to upload single file: ${error.message}`);
    }
  }

  async uploadMulti(files, folder = "uploads", user) {
    if (!files || files.length === 0) {
      return [];
    }
    folder = `user/${user.id}/${folder}`;

    const uploadPromises = files.map(async (file) => {
      try {
        const fileDataUriContent = this.#formatBufferToDataUriContent(file);
        const resourceType = this.#getResourceType(file.mimetype);
        const result = await uploadFileToCloudinary(
          fileDataUriContent,
          resourceType,
          folder
        );

        if (!result || !result.secure_url || !result.public_id) {
          throw new Error(
            "Cloudinary upload did not return expected data for one of the files."
          );
        }

        return {
          originalName: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type || resourceType,
        };
      } catch (error) {
        return {
          originalName: file.originalname,
          url: null,
          publicId: null,
          error: error.message,
        };
      }
    });

    return Promise.all(uploadPromises);
  }

  async replace(file, oldUrl, folder = "uploads", user) {
    if (!file) {
      throw new Error("No new file provided for replacement.");
    }
    if (!oldUrl) {
      throw new Error("Old URL is required to replace media.");
    }
    let oldPublicId = null;
    folder = `user/${user.id}/${folder}`;

    if (this.#isCloudinaryUrl(oldUrl)) {
      try {
        oldPublicId = await getPublicIdFromCloudinaryUrl(oldUrl);
      } catch (error) {
        console.warn(
          `Could not extract public ID from old Cloudinary URL: ${oldUrl}. Error: ${error.message}.`
        );
        oldPublicId = null;
      }
    }

    const fileDataUriContent = this.#formatBufferToDataUriContent(file);
    const resourceType = this.#getResourceType(file.mimetype);
    try {
      const result = await uploadFileToCloudinary(
        fileDataUriContent,
        resourceType,
        folder,
        oldPublicId
      );

      return {
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type || resourceType,
      };
    } catch (error) {
      console.error("Error uploading new file during replacement:", error);
      throw new Error(`Failed to replace file: ${error.message}`);
    }
  }

  async del(url, resourceType, user) {
    //Sẽ check trong bảng media_files
    if (!url) {
      throw new Error("URL is required to delete media.");
    }
    let publicId = null;
    if (this.#isCloudinaryUrl(url)) {
      try {
        publicId = await getPublicIdFromCloudinaryUrl(url);
      } catch (error) {
        console.warn(
          `Could not extract public ID from old Cloudinary URL: ${url}. Error: ${error.message}.`
        );
        publicId = null;
      }
    }

    if (!publicId) {
      throw new Error("Public ID is required to delete media.");
    }

    const expectedFolderPrefix = `user/${user.id}/`;

    // Kiểm tra xem publicId có bắt đầu bằng tiền tố thư mục của người dùng hay không
    if (!publicId.startsWith(expectedFolderPrefix)) {
      throw new Error(
        "Attempt to delete a file outside of the user's designated folder."
      );
    }

    try {
      const result = await deleteFileFromCloudinary(publicId, resourceType);
      return result && result.result === "ok";
    } catch (error) {
      console.error(
        `Error deleting media with public ID '${publicId}':`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = new MediaService();
