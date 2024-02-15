# **Dogagatchi+**

Dogagatchi+ combines trivia, collecting and caretaking game components to create an immersive dog-owning experience.

## **Basic Instructions for End User**

The first thing you want to do is answer questions on the Pooch Picker page. Every correct answer earns you one coin, with which you can spend to purchase dogs and buy your dogs treats. You must keep the dogs in your kennel happy and well fed, otherwise they'll run away. Walking your dog does not cost any coins, a treat costs 3 coins, and a meal from le Bone Appétit Cafe will make your dog full and happy. Enjoy.

## **Starting the app for local development**

Clone the repository down and then...

### **Install dependencies**

```npm install```

### **Set the database connection string**

Create an untracked .env file in the root of the project. In that file, declare a database connection string environment variable, inserting the appropriate values for your database setup, like so:

> ATLAS_URI=mongodb+srv://database-User:database-Password@database-Cluster>>.mongodb.net/database-Name

You'll have to set up the connection string for a deployed version a bit differently, and that process is spelled out later in this document. See the 'Database' section below for details on MongoDB's Atlas service (which is dope).

### Compile with webpack

```npm run build-dev```

This runs webpack in watch mode.

### Start express server and socket.io server

```npm run start```

```npm run socket```

These above commands start the two necessary servers for the application.  The socket server was a later addition, and never fully integrated into the original server, so it needs to be run in its own terminal.

## **Environment Variables**

Environment variables are loaded from the .env file through the config.js file using the dotenv package.

Only seven environment variables require assigning to serve/deploy Dogagatchi+:

1. MongoDB Atlas database connection string (see above and below)
2. Google Passport Client ID
3. Google Passport Client Secret
4. Cloudinary
5. 'true' or 'false' for deployed status (for correct CORS options with socket)
6. Deployed Instance URL with the port number
7. OpenAI API key

Checkout config.js in the server folder to see the three in action, and define them for your version in the .env file (which is not tracked by git and will therefore not show up when you pull the repo down).

Your .env file should look like this:

```(.env)
ATLAS_URI=someConnectionString
GOOGLE_CLIENT_ID=someClientId
GOOGLE_CLIENT_SECRET=someClientSecret
CLOUDINARY_URL=someCloudinaryAPIEnvironmentVariable
IS_DEPLOYED=true-or-false
DEPLOYED_URL=DeployedInstanceURLWithPortNumber
OPENAI_KEY=someOpenAIKey
```

Checkout [this link](https://developers.google.com/identity/protocols/oauth2) to learn about configuring Passport for Google Authentication. You'll need to set up a project in Google Cloud Platform and configure the Client ID and Secret in the API's & Services section.

Go to [Cloudinary.com](https://cloudinary.com/pricing) and select free account. After you sign up you can find your API environment variable in your Cloudinary console dashboard.

Go to [OpenAI.com](https://openai.com/product) and sign up for a free account. You can get an API Key and a free trial, which should be enough for what you need during development. They have a user dashboard that provides all the information you need and allows you to track quota usage.

Lastly, to eliminate the need to sift through client-side files to make changes between local development and deployment, a clientId.js file was added in ```client/components/assets```.  An example has been added to the git history for your help.  Create a 'clientId.js' file in this folder and assign these variables.  **Note**: the deployed URL requires the port the socket is listening on, which in the current set-up is 4001.

## **Database**

The app is built to use a database hosted on MongoDB's Atlas service. The uri to connect to the database from the app is stored as an environment variable; the uri is loaded into the database connection method through the server's config.js file.

MongoDB's Atlas service requires the whitelisting of IP addresses that are allowed access to the database. To add an IP address to the whitelist, go to the project's page on Atlas' site (cloud.mongodb.com), and use the sidebar navigation to go to Network Access, located under the Security tab.  For local development, add your personal IP address to the whitelist. For deployment, add the VM's public IPv4 address once the instance is spun up.

**Sidenote**: While the app was originally architected around the Atlas service, a local MongoDB instance will also suffice. Simply provide the local database uri in the .env file if you go this route.

## **Deployment**

Deploy to an AWS EC2 Ubuntu machine with the following steps:

### **1. Set up AWS root account**

[Here](https://aws.amazon.com/) if you do not already have an account...

### **2. Launch an Ubuntu instance**

Provide a project name, select the Ubuntu option in the 'Quick Start' menu, then select a free tier, and create a new key pair for SSH access (see Shortly Deploy instructions for clarity if needed), and save the key where you can find it. Create a new security group, then skip configuring ssh and IP access for now-we'll do it all in a sec. Lastly, click 'Launch instance' in the lower-right corner of the screen.

Beware: make sure you only have one running instance, or you will quickly deplenish the free-tier hours and incur overage charges.

### **3. Change firewall rules**

Navigate to the 'Instance summary' in AWS and click on the Security tab about halfway down the page. Then click the link to access the Security Group that contains the firewall rules for the instance ("sg-somethingSomethingSomething" or similar). Then click 'Edit inbound rules', and add the three rules below:

|     TYPE      |  PORT RANGE   |     SOURCE      |      WHY?                             |
| ------------- | ------------- | -------------   | ------------------------------------- |
| SSH           |  22           | Local-Dev-IP/32 |  SSH into instance from your computer |
| Custom TCP    | 4000 (server) | 0.0.0.0/0       | User access from internet             |
| Custom TCP    | 27017         |  VM-public-IP/32| VM access to cloud Mongo db           |
| Custom TCP    | 4001 (socket) | 0.0.0.0/0       | Socket access for Chatroom            |

Now that SSH access is enabled, we'll connect to the instance and set it up to host the app.

### **4. Connect to instance**

Instructions for connecting to the instance can be found by clicking Connect in the menu at the top of the AWS instance panel.

SSH into the instance by using either OpenSSH or Putty.

AWS suggests running ```chmod 400 your-Key.pem``` from the folder in which the key is located to ensure the key is private. A typical OpenSSH command to access the instance from that same directory location is below:

> ssh -i "your-Key.pem" ubuntu@public-DNS-Address

The public DNS address typically ends with 'compute.amazonaws.com'.

### **5. Install nvm and node**

We're more or less following the steps outlined in Shortly Deploy to install nvm and node. The instance already comes with git, so we don't need to install that.

For nvm:

> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

After running the above command to install nvm, you'll be prompted to run three more commands to get nvm working. Run them:

> export NVM_DIR="$HOME/.nvm"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
> [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

 The app was developed with version 20.9 of Node, so install it to the instance.

 > nvm install v20.9.0

Double-check versions with the following commands:

  ```(node)
  >git --version
  >nvm --version
  >node --version
  >npm --version
  ```

### **6. Clone repo, download dependencies, configure db**

From the instance's root folder, clone down the app's repo from Github.

```git clone https://github.com/use-Name/repo-Name```

Then cd into the project's folder and install its dependencies.

```npm install```

To load the database connection in deployment, run the following command from the VM's command line:

```export ATLAS_URI=mongodb+srv://database-User:database-Password@database-Cluster>>.mongodb.net/database-Name```

Check out [Mongo docs](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-connections-connection-examples) for more.

Alternatively, you can simply recreate the .env file and the clientId.js file by running the following commands:

```nano .env``` (and paste in variables from the git-ignored file, with the necessary change for deployed status)

```nano client/components/assets/clientId.js``` (and paste in the variables and exports to this file with necessary changes)

### 7. Build the app, start the server, and access

Run the following commands to a build the app for deployment and start the server:

```npm run build```

```npm run start```

```npm run socket```

Make sure you've whitelisted your VM's public IP address in MongoDB Atlas. You can now navigate to the instance using the following url format:

> http://public-IP-Address-Of-Instance:server-Port

## **Updating Source Code & Redeployment**

To update the code running on the VM, cd into the project's folder on the VM and run a git pull from the origin.

> git pull your-Origin your-Branch

You'll probably be pulling from 'origin main'.

Next, run the following command to set the Atlas DB connection string:

> export ATLAS_URI=mongodb+srv://database-User:database-Password@database-Cluster>>.mongodb.net/database-Name

Finally, build the app and start the servers:

```npm run build```

```npm run start```

```npm run socket```

### **Troubleshooting**

Most issues with deployment stem from problems connecting to the MongoDB Atlas database. Please be sure to both:

1) Whitelist any IP addresses in MongoDB Atlas that need access to the hosted database
2) Set up the connection string as an environment variable, either by including it locally in a .env file or by loading it into the production build by running the 'export' command included above.
3) Additionally, the authentication strategy originally employed will require you to specify the "test users" in the Google Developer Console in order for any possible team members to access the deployed instance via Google Sign-In

### **Contact**

Reach out to one of the following with issues.

[AJ Bell](https://github.com/abell10101)

[Geremy Fisher](https://github.com/gfish94)

[Evan Perry](https://github.com/evmaperry)

Sydney Andre: https://github.com/saandre0217\
James Sheppard: https://github.com/Jshep23prog

[Robert Frank]
[Nathan Cassiani]
[Raven Hughes]
[Ky Patton]

### **FAQ**

*If my dog runs away, can I get it back?*
Nope, make sure to check on your dog at least once a day. A dog will run away if it is not fed or walked in 24h.

*How do I earn the moneybags achievement?*
You must obtain and hold 60 or more coins.

*How are you getting the photos of the dog breeds?*
The [Dog API](https://dog.ceo/dog-api/).
