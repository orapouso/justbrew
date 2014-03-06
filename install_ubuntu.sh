sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install build-essential python-software-properties python g++ make git mongodb nodejs

npm install

grunt migrate
grunt install
mkdir log

echo "Justbrew installed successfully"
echo "grunt dev to start development mode"
echo "grunt server to start app server on development mode"
echo "NODE_ENV=production grunt server to start on production mode"
echo "Configuration can be modified in file: user-config.js"