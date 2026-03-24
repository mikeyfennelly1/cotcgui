#!/bin/bash

################################################
# SETUP
################################################
OS=$(uname)
if [[ "$OS" == "Darwin" ]]; then
	# OSX uses BSD readlink
	BASEDIR="$(dirname "$0")"
else
	BASEDIR=$(readlink -e "$(dirname "$0")/")
fi
pushd "${BASEDIR}/.."

set -eou pipefail

source ${BASEDIR}/../../scripts/helpers.sh
ENVFILE=${BASEDIR}/../../.env
source "${ENVFILE}"

var_must_exist NEXT_PUBLIC_API_BASE_URL

export NEXT_PUBLIC_API_BASE_URL
IMAGE_NAME="mikeyfennelly/cotcgui:latest"
docker build -t "${IMAGE_NAME}" .

docker login
docker push "${IMAGE_NAME}"

popd
