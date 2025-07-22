const mediaService = require("@/services/media.service");

const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

const getPublicIdFromUrl = async (req, res) => {
  const url = req.params.url;
  const media = await mediaService.getPublicIdFromUrl(url);
  response.success(res, 200, media);
};

const uploadSingleFile = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    if (!req.files) {
      return response.error(res, 400, "No file uploaded");
    }
    const file = req.files[0];
    const folder = req.body.folder || "uploads";
    const result = await mediaService.uploadSingleFile(
      file,
      folder,
      currentUserId
    );
    return response.success(res, 200, result);
  } catch (error) {
    return response.error(res, 500, error);
  }
};

const uploadMultipleFiles = async (req, res) => {
  let filesToProcess = [];
  const currentUserId = req.user.id;

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

    const uploadResults = await mediaService.uploadMulti(
      filesToProcess,
      folder,
      currentUserId
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
  const currentUserId = req.user.id;

  try {
    if (!req.files) {
      return response.error(res, 400, "No file uploaded");
    }
    const file = req.files[0];
    const folder = req.body.folder || "uploads";
    const oldUrl = req.body.oldUrl;

    const result = await mediaService.replace(
      file,
      oldUrl,
      folder,
      currentUserId
    );

    return response.success(res, 200, result);
  } catch (error) {
    return response.error(res, 500, error);
  }
};

const del = async (req, res) => {
  const currentUserId = req.user.id;
  const resourceType = req.body.resourceType;
  //Tạo thêm bảng media_files có url file, type, author_id
  const result = await mediaService.del(url, resourceType, currentUserId);
  if (!result) throwError(404, "Not Found.");
  response.success(res, 204);
};

module.exports = {
  getPublicIdFromUrl,
  uploadMultipleFiles,
  del,
  uploadSingleFile,
  replace,
};
