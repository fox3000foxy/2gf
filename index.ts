import { createCanvas, loadImage, type Image } from "canvas";
import { imageSizeFromFile } from "image-size/fromFile";
import fs from "node:fs";
import path from "node:path";
import resemble from "resemblejs";

console.clear();

const texturepackDir = "./texturepack";

void (async () => {
	const fontImage = await loadImage("./font.png");
	const files = fs.readdirSync(texturepackDir);

	for (const file of files) {
		await processTexture(file, fontImage);
	}
})();

async function processTexture(imgFileName: string, fontImage: Image): Promise<void> {
	const imagePath = path.join(texturepackDir, imgFileName);
	const hasAlpha = await hasAlphaChannel(imagePath);

	if (!hasAlpha) {
		const dimensions = await imageSizeFromFile(imagePath);
		if (!dimensions.width || !dimensions.height) {
			return;
		}

		const canvas = createCanvas(dimensions.width, dimensions.height);
		const context = canvas.getContext("2d");
		const pattern = context.createPattern(fontImage, "repeat");

		if (!pattern) {
			return;
		}

		context.fillStyle = pattern;
		context.fillRect(0, 0, dimensions.width, dimensions.height);
		const outputBuffer = new Uint8Array(canvas.toBuffer());
		fs.writeFileSync(imagePath, outputBuffer);
		return;
	}

	fs.unlinkSync(imagePath);
}

function hasAlphaChannel(imagePath: string): Promise<boolean> {
	return new Promise((resolve) => {
		resemble(fs.readFileSync(imagePath)).onComplete((data) => {
			const result = data as { alpha?: number };
			resolve((result.alpha ?? 0) > 0);
		});
	});
}