# Website Snapshot
A serverless AWS lambda service + api gateway which takes a url and uses
Pupeteer to take a screenshot of the webpage. 

# website-snapshot-lambda
Take a screenshot of any website provided with AWS Lambda + Puppeteer
## How to run
```bash
cd src/ && npm install
serverless config credentials --provider aws --key XXX --secret XXX
serverless deploy
```
