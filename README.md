# children_health_approval

Instructions to host your own free approval website using heroku
1. Fork and download project, create an empty ".env" file in the root folder

2. Create a MongoDB database
    * Signup at https://account.mongodb.com/account/login
    * Choose your Project name (i.e. Gan Mongo)
    * Choose "Javascript" in “What is your preferred language?”
    * Create free cluster
    * Leave all default settings and click “Create cluster”
    * Wait for cluster creation to finish
    * In the cluster card, Click on the "Connect" button
    * Select “Allow Access from Anywhere” and “Add IP address”
    * Create admin database user (for simplicity, use only numbers and English letters), Click next
    * Choose “Connect your application”
    * Make sure "Node.js" and "3.6 or later" is selected
    * Click on Copy
    * Save to the ".env" file under MONGODB_URI

3. Create app in heroku
    * Sign in/up at https://id.heroku.com/login
    * Create a new app
    * Choose a name
    * In "Deployment method" select "GitHub"
    * Write your repository name (i.e. children_health_approval) and click "Search"
    * Click on "Connect" button
    * Switch to "Resources" tab
    * Under "Add-ons", search for "Auth0" and click on "Provision" for the free plan

4. Update environment variables
    * Switch to "Settings" tab
    * Under "Config Vars", click on "Reveal Config Vars"
    * Add the following
    
        |Name|Value|example|notes
        |---|---|---|---
        |MONGODB_URI|Connection string from step 2|mongodb+srv://admin:12345678@cluster0.XXXXX.mongodb.net/children?retryWrites=true&w=majority
        |TEAMS|comma seperated list of team names|צעירים א׳,בוגרים ב׳
        |KINDERGARTEN_NAME|גן אדמון|
        |ADMINS|comma seperated list of emails that will have permissions to see all children approvals|admon@email.com,someone@email.com
        |JWT_SECRET|Some random string for encryption| |You can use the output from http://www.unit-conversion.info/texttools/random-string-generator/
        |BASE_URL|https://YOUR_APP_NAME.herokuapp.com|https://children-health-approval.herokuapp.com||Replace YOUR_APP_NAME with the App Name on top of the current tab
        ---------------------

5. Deploy
    * Switch to "Deploy" tab
    * Click on "Deploy Branch"
