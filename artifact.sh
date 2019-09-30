#!/bin/bash -e
wget -q -O artifact_node.sh 'https://raw.githubusercontent.com/mdblp/tools/dblp/artifact/artifact_node.sh'
wget -q -O artifact_images.sh 'https://raw.githubusercontent.com/mdblp/tools/dblp/artifact/artifact_images.sh'

. ./version.sh
bash -e artifact_images.sh
bash -e artifact_node.sh
