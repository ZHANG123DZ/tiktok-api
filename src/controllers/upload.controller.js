const response = require("@/utils/response");
const throwError = require("@/utils/throwError");
const uploadService = require("@/services/upload.service");

const uploadSingleFile = async (req, res) => {
  try {
    const user = req.user;

    if (!req.files) {
      return response.error(res, 400, "No file uploaded");
    }
    const file = req.files[0];
    const folder = req.body.folder || "";
    const fileResult = await uploadService.uploadSingle(file, folder, user);
    return response.success(res, 200, fileResult);
  } catch (error) {
    return response.error(res, 500, error);
  }
};

const uploadMultipleFiles = async (req, res) => {
  let filesToProcess = [];
  const user = req.user;

  if (req.files) {
    filesToProcess = req.files;
  } else if (req.file) {
    filesToProcess = [req.file];
  }

  if (filesToProcess.length === 0) {
    return response.error(res, 400, "No image file(s) provided.");
  }

  try {
    const { folder = "uploads" } = req.body;

    const uploadResults = await uploadService.uploadMultiple(
      filesToProcess,
      folder,
      user
    );
    const successfulUploads = uploadResults.filter((r) => r.url !== null);
    const failedUploads = uploadResults.filter((r) => r.url === null);

    if (successfulUploads.length > 0) {
      return response.success(res, 200, successfulUploads);
    } else {
      return response.error(res, 500, failedUploads);
    }
  } catch (error) {
    return response.error(res, 500, error);
  }
};
const replace = async (req, res) => {
  const user = req.user;

  try {
    if (!req.files) {
      return response.error(res, 400, "No file uploaded");
    }
    const file = req.files[0];
    const folder = req.body.folder || "uploads";
    const oldUrl = req.body.oldUrl;

    const result = await uploadService.replaceFile(file, oldUrl, folder, user);

    return response.success(res, 200, result);
  } catch (error) {
    return response.error(res, 500, error);
  }
};

const deleteFile = async (req, res) => {
  const user = req.user;
  const url = req.params.url;

  const result = await uploadService.deleteFile(url, user);
  if (!result) throwError(404, "Not Found.");
  response.success(res, 204);
};

module.exports = {
  uploadMultipleFiles,
  deleteFile,
  uploadSingleFile,
  replace,
};
