#!/bin/bash

# set execution so we fail the script when a command fials
# set -Eeuo pipefail

host="localhost"

for search_term in "$@"
do
    echo "Scraping $search_term"
    twint -s "$search_term" --index-tweets=sramota --elasticsearch="$host:9200"
done
