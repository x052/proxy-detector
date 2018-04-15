
#!/usr/bin/env bash

if [ ! -e ./.zmq ]; then
  
  # Move into temporary directory.
  mkdir .zmq
  cd .zmq
  
  # Add repository for 0MQ.
  sudo add-apt-repository ppa:chris-lea/zeromq

  # Update apt and install packages.
  sudo apt-get update
  sudo apt-get install --force-yes --yes libzmq-dev python-dev uuid-dev

  # Download 0MQ itself.
  wget http://download.zeromq.org/zeromq-2.0.10.tar.gz
  tar -xzvf zeromq-2.0.10.tar.gz

  # Make and install 0MQ.
  cd zeromq-2.0.10
  ./configure
  make
  sudo make install
  sudo ldconfig

  # Install 0MQ Ruby binding.
  gem install zmq

  # Get the Python 0MQ packge and extract.
  wget https://github.com/downloads/zeromq/pyzmq/pyzmq-2.0.10.tar.gz --no-check-certificate
  tar -xzvf pyzmq-2.0.10.tar.gz
  cd pyzmq-2.0.10

  # Install Python 0MQ from source.
  cp setup.cfg.template setup.cfg
  sudo python setup.py install

  # Get 0MQ daemon source.
  cd ../
  git clone git@github.com:esp/zeromq_daemon.git
  cd zeromq_daemon

  # Install 0MQ daemon script.
  sudo cp init/zmq /etc/init.d/zmq
  sudo chmod +x /etc/init.d/zmq
  sudo mkdir /usr/local/zeromq
  sudo cp daemon_core.py /usr/local/zeromq/daemon_core.py
  sudo cp zmq_daemon.py /usr/local/zeromq/zmq_daemon.py

  # Start 0MQ.
  sudo /etc/init.d/zmq start

  # Move out of tmp directory and remove it.
  cd ../
  # rm -rf .zmq

else

  echo "Not installing 0MQ, you've already got it!"  
  
fi