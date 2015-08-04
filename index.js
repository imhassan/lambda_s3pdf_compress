// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var fs = require('fs');

// get reference to S3 client
var s3 = new AWS.S3();
var resolution = 150; // 150,300,600,
exports.handler = function(event, context) {
	// Read options from the event.
	// console.log("Reading options from event:\n", util.inspect(event, {depth :
	// 5}));
	var srcBucket = event.Records[0].s3.bucket.name;
	// Object key may have spaces or unicode non-ASCII characters.
	var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
	var dstBucket = srcBucket + "resized";
	var dstKey = "resized-" + srcKey;

	// Sanity check: validate that source and destination are different buckets.
	if (srcBucket == dstBucket) {
		console.error("Destination bucket must not match source bucket.");
		return;
	}

	// Infer the image type.
	var typeMatch = srcKey.match(/\.([^.]*)$/);
	if (!typeMatch) {
		console.error('unable to infer image type for key ' + srcKey);
		return;
	}
	var imageType = typeMatch[1];
	console.log("imageType: " + imageType);
	if (imageType != "pdf") {
		// console.log('skipping non-image ' + srcKey);
		// return;
	}

	async
		.waterfall(
			[
				function download(next) {
					console.log('download start ');
					s3.getObject({
						Bucket : srcBucket,
						Key : srcKey
					}, function(err, data) {
						// var buffer = new Buffer(data.Body);
						console.log("createReadStream : " + srcKey);
						console.log("body2: ");
						// console.log(JSON.stringify(data));
						// console.log('body done');
						// console.log("body: "+data.Body);

						fs.writeFile('/tmp/a.pdf', data.Body, {
							encoding : null
						}, function(fserr) {
							console.log("fserr: " + fserr)
							if (fserr) {
								// if there is problem just print to console and
								// move on.
							} else {
								console.log('File Downloaded! ' + data.ContentType);
								next(fserr, data.ContentType);
							}
						});

					});
				},
				function compress(contentType, next) {
					console.log("compress start  contentType: " + contentType);

					var exec = require('child_process').exec, child;
					child = exec(
						'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=/tmp/b.pdf /tmp/a.pdf',
						function(error, stdout, stderr) {
							console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);
							if (error !== null) {
								console.log('exec error: ' + error);
							} else {
								next(null, contentType);
							}
						});

				}, function upload(contentType) {
					console.log("upload start  contentType: " + contentType);

					s3.putObject({
						Bucket : dstBucket,
						Key : dstKey,
						Body : fs.createReadStream("/tmp/b.pdf"),
						ContentType : contentType
					}, function(error, data) {

						console.log("pdf ends+error" + error);
						context.done();
					});
				} ], function(e, r) {
				if (e)
					throw e;
			});

	console.log('done');
	// context.done();

};