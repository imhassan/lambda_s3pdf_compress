## Lamda Amazon Service 

Lamda is an Amazon service that runs your code in response to any events. 
You upload your application code as "Lambda" functions and AWS Lambda runs your code.
All you need to do is supply your code in one of the languages that AWS Lambda supports (currently Node.js or Java).

For example whenever image uploads into your s3 bucket, 
you want to create its thumnail,  You create a lambda function in nodejs and attach it with s3-bucket. Now each time when any
image upload into that bucket, its thumbnail will be created automatically. 

In this project I am compressing pdf file and uploading into 2nd bucket. 
<ul>
<li> 	Upload PDF to s3 bucket named as  "hassan-bucket".</li>
<li>	A new file created using ghostscript.</li>
<li> 	New Compressed file will be uploaded to another bucket named as "resized-hassan-bucket".</li>
</ul>

Lets say if your  first bucket name is "mybucket" then the second bucket should be "resized-" as a prefix "resized-mybucket". 
If you want to change you can do from code.  

## Installation
<ul>
<li>Node-modules that are used in this project.<br />
npm install async aws-sdk fs
</li>
<li>Create new Lambda function, Zip this whole projecct and upload this zip file. </li>

<li>Set the Handler index.handler in the configuration</li>

<li>Attach event sources with s3-bucket with event-type  'PUT'.</li>



