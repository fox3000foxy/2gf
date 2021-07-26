const { createCanvas,loadImage } = require('canvas')
const fs = require('fs')
const resemble = require('resemblejs')
console.clear()
loadImage("./font.png").then((image) => {
	fs.readdir('./texturepack', (err, files) => {
		files.forEach(file => {
			getGreenScreen(file,image)
		});
	});
});

async function getGreenScreen(imgUrl,img){
	await resemble(fs.readFileSync("./texturepack/"+imgUrl)).onComplete(function (data) {
		if(data.alpha<=0){
			var sizeOf = require('image-size');
			var dimensions = sizeOf("./texturepack/"+imgUrl);
			const canvas = createCanvas(dimensions.width, dimensions.height)
			const context = canvas.getContext('2d')
			pattern = context.createPattern(img, 'repeat');
			context.fillStyle = pattern//'#0f0'
			context.fillRect(0, 0, dimensions.width, dimensions.height)
			fs.writeFileSync("./texturepack/"+imgUrl,canvas.toBuffer())			
		}
		else {
			fs.unlinkSync("./texturepack/"+imgUrl)
		}
	});
}