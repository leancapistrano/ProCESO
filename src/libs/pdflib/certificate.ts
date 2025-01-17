import dayjs from 'dayjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

// Common configuration for both certificate types
export const CERTIFICATE_DIMENSIONS = {
  width: 2000,
  height: 1414,
};

// Configuration for standard certificate
const standardConfig = {
  baseSize: 113,
  minSize: 70,
  baseLength: 15,
  scaleRatio: 2.5,
  verticalPosition: {
    base: 736,
    adjustment: 0.2,
  },
};

// Configuration for cursive certificate
const cursiveConfig = {
  fontPath: './fonts/edwardian.ttf',
  baseSize: 170,
  minSize: 95,
  sizes: [
    { maxLength: 21, fontSize: 170, verticalPos: 525 },
    { maxLength: 24, fontSize: 135, verticalPos: 540 },
    { maxLength: 28, fontSize: 125, verticalPos: 545 },
    { maxLength: 30, fontSize: 115, verticalPos: 555 },
    { maxLength: 32, fontSize: 105, verticalPos: 565 },
    { maxLength: Infinity, fontSize: 95, verticalPos: 560 },
  ],
};

export async function generateCert(
  name: string,
  template: string,
  hash: string,
  activityTitle: string,
  activityEnd: string,
  coordinator: string,
  vpsas: string,
  qrLoc: 'left' | 'right' = 'right',
): Promise<Blob | undefined> {
  try {
    // Create QR code
    const qrDataUrl = await QRCode.toDataURL(
      `https://deuz.tech/certs/${hash}`,
      {
        margin: 1,
      },
    );
    const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    // Create PDF document
    const doc = await PDFDocument.create();
    const page = doc.addPage([
      CERTIFICATE_DIMENSIONS.width,
      CERTIFICATE_DIMENSIONS.height,
    ]);

    // Convert template data URL to bytes
    const templateBytes = Buffer.from(template.split(',')[1], 'base64');

    // Embed template image
    const templateImage = await doc.embedPng(templateBytes);

    // Embed QR code
    const qrImage = await doc.embedPng(qrImageBytes);

    // Draw template
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: CERTIFICATE_DIMENSIONS.width,
      height: CERTIFICATE_DIMENSIONS.height,
    });

    const qrSize = qrImage.scaleToFit(190, 190);
    // Draw QR code
    page.drawImage(qrImage, {
      x: qrLoc === 'right' ? CERTIFICATE_DIMENSIONS.width - 320 : 70,
      y: CERTIFICATE_DIMENSIONS.height - 256,
      width: qrSize.width,
      height: qrSize.height,
    });

    // Add activity title
    page.drawText(activityTitle, {
      x: CERTIFICATE_DIMENSIONS.width / 2 + 180,
      y: 564,
      font: await doc.embedFont(StandardFonts.HelveticaBold),
      color: rgb(0.17, 0.17, 0.17),
      size: 36,
    });

    // Add activity end date
    const dateFormat = dayjs(activityEnd).format('MMMM D, YYYY');
    page.drawText(dateFormat, {
      x: CERTIFICATE_DIMENSIONS.width / 2 - 38,
      y: 424,
      font: await doc.embedFont(StandardFonts.HelveticaBold),
      color: rgb(0.17, 0.17, 0.17),
      size: 36,
    });

    // Embed coordinator and VPSAs signatures
    const coordinatorBytes = Buffer.from(coordinator.split(',')[1], 'base64');
    const vpsasBytes = Buffer.from(vpsas.split(',')[1], 'base64');

    const coordinatorImage = await doc.embedPng(coordinatorBytes);
    const vpsasImage = await doc.embedPng(vpsasBytes);

    const sigSize = [580, 210];
    const scaledCoordinator = coordinatorImage.scaleToFit(
      sigSize[0],
      sigSize[1],
    );
    const scaledVpsas = vpsasImage.scaleToFit(sigSize[0], sigSize[1]);

    // Draw coordinator signature
    page.drawImage(coordinatorImage, {
      x: CERTIFICATE_DIMENSIONS.width / 2 - 710,
      y: 210,
      width: scaledCoordinator.width,
      height: scaledCoordinator.height,
    });

    // Draw VPSAs signature
    page.drawImage(vpsasImage, {
      x: CERTIFICATE_DIMENSIONS.width / 2 + 160,
      y: 210,
      width: scaledVpsas.width,
      height: scaledVpsas.height,
    });

    // Add name text
    const fontSize = Math.max(
      standardConfig.minSize,
      standardConfig.baseSize -
        (name.length - standardConfig.baseLength) * standardConfig.scaleRatio,
    );

    const verticalPos =
      CERTIFICATE_DIMENSIONS.height -
      (standardConfig.verticalPosition.base -
        (standardConfig.baseSize - fontSize) *
          standardConfig.verticalPosition.adjustment);

    const helveticaFont = await doc.embedFont(StandardFonts.HelveticaBold);
    page.setFont(helveticaFont);
    page.setFontSize(fontSize);

    const textWidth = helveticaFont.widthOfTextAtSize(name, fontSize);
    page.drawText(name, {
      x: (CERTIFICATE_DIMENSIONS.width - textWidth) / 2,
      y: verticalPos,
      color: rgb(0.17, 0.17, 0.17),
    });

    // Generate PDF bytes
    const pdfBytes = await doc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error: unknown) {
    console.error('Certificate generation error:', error);
  }
}

export async function generateCertCursive(
  name: string,
  template: string,
  id: string,
): Promise<Blob> {
  // Create QR code
  const qrDataUrl = await QRCode.toDataURL(`https://deuz.tech/certs/${id}`);
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  // Create PDF document
  const doc = await PDFDocument.create();
  const page = doc.addPage([
    CERTIFICATE_DIMENSIONS.width,
    CERTIFICATE_DIMENSIONS.height,
  ]);

  // Embed images
  const templateImage =
    (await doc.embedPng(template)) ?? (await doc.embedJpg(template));

  // embed qr
  const qrImage = await doc.embedPng(qrImageBytes);

  // Draw template
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: CERTIFICATE_DIMENSIONS.width,
    height: CERTIFICATE_DIMENSIONS.height,
  });

  // Draw QR code
  page.drawImage(qrImage, {
    x: CERTIFICATE_DIMENSIONS.width - 200,
    y: CERTIFICATE_DIMENSIONS.height - 220,
    width: 120,
    height: 120,
  });

  // Load and embed custom font
  const customFont = await doc.embedFont(StandardFonts.Courier);

  // Find appropriate size configuration
  const sizeConfig = cursiveConfig.sizes.find(
    (config) => name.length <= config.maxLength,
  )!;

  // Add name text
  page.setFont(customFont);
  page.setFontSize(sizeConfig.fontSize);

  const textWidth = customFont.widthOfTextAtSize(name, sizeConfig.fontSize);
  page.drawText(name, {
    x: (CERTIFICATE_DIMENSIONS.width - textWidth) / 2,
    y: CERTIFICATE_DIMENSIONS.height - sizeConfig.verticalPos,
    color: rgb(0, 0, 0),
  });

  // Generate PDF bytes
  const pdfBytes = await doc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
