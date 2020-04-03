#!/bin/bash
config=$(envsubst < .env)
echo "$config" > .env