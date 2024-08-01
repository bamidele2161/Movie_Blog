const { getQR, verifyQR } = require("../service/security");

exports.GetQR = async (req, res, next) => {
  try {
    const userId = 4;

    const qr = await getQR(userId);

    return res.status(qr.statusCode).json({
      message: qr.message,
      image: qr.image,
      statusCode: qr.statusCode,
    });
  } catch (error) {
    
    next(error);
  }
};

exports.VerifyQR = async (req, res, next) => {
  try {
    const userId = 4;
    const code = req.body.qrCode;
    const qr = await verifyQR(userId, code);

    return res.status(qr.statusCode).json({
      message: qr.message,
      data: qr.data,
      statusCode: qr.statusCode,
    });
  } catch (error) {

    next(error);
  }
};
