#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

sudo docker build -f sajt/Dockerfile sajt -t sramota:latest
sudo docker tag sramota:latest rg.fr-par.scw.cloud/djnd/sramota:latest
sudo docker push rg.fr-par.scw.cloud/djnd/sramota:latest
