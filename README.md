#  proxy-detector

This project uses [Tensorflows Linear Classifier](https://www.tensorflow.org/api_docs/python/tf/contrib/learn/LinearClassifier)  to predict if an IP Address is a proxy or not.


# Install

## Git clone

```
https://github.com/x052/proxy-detector.git
```

##  Setup environment

1.  [Download and install Node.js](https://nodejs.org/download/), which is used to gather training data and run a web server.
    
2.  Navigate to the project directory and run  `npm install`  to install local dependencies listed in  `package.json`.

## Training

In order to run the program you need a fully trained model, the steps to train the model are as follows:

1.  Navigate to the `data` directory and run `node proxyScraper`, this will scrape several million proxies and write them to a file.
2. Run `node datagen`, this will convert some of the proxies into training data.
3. Navigate to the root directory `cd ../` and run `python train.py`

## Running

The program will setup a web server with an API that gives you the chance of the IP address being a proxy,

1.  Make sure that you have [zmq](http://zeromq.org/) installed and is running. Executing `setup.sh` will automatically install and run [zmq](http://zeromq.org/).
2. Run the web server `node index`
3. Run the worker process `python server.py`
