#! /bin/bash
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" lighttag/es