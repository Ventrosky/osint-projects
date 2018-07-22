#!/bin/bash
apt-get update
apt-get install tor git bison libexif-dev
apt-get install python-pip
pip install stem
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
[[ -s "$HOME/.gvm/scripts/gvm" ]] && source "$HOME/.gvm/scripts/gvm"
source /root/.gvm/scripts/gvm
gvm install go1.10 --binary
gvm use go1.10
go get github.com/s-rah/onionscan
go install github.com/s-rah/onionscan

echo "ControlPort xxxx" >> /etc/tor/torrc
echo "ControlListenAddress 127.0.0.1" >> /etc/tor/torrc
echo "HashedControlPassword xx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" >> /etc/tor/torrc

service tor restart

wget https://raw.githubusercontent.com/automatingosint/osint_public/master/onionrunner/onion_master_list.txt
