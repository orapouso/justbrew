sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install build-essential python-software-properties python g++ make git mongodb nodejs

npm install

make migrate
mkdir log

echo "Justbrew installed successfully"
echo "node server.js to start on development mode"
echo "NODE_ENV=production node server.js to start on production mode"
echo "Configuration can be modified in file: user-config.js"