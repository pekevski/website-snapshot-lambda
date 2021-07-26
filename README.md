# Website Snapshot
A serverless AWS lambda service + api gateway which takes a url and uses
Pupeteer to take a screenshot of the webpage. 

## How to run
```bash
cd src/ && npm install
serverless config credentials --provider aws --key XXX --secret XXX
serverless deploy
```