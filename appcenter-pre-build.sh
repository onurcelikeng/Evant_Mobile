#!/usr/bin/env bash

# Example: Change bundle name of an iOS app for non-production
if [ "$APPCENTER_BRANCH" != "master" ];
then
    plutil -replace CFBundleName -string "\$(Evant) Beta" $APPCENTER_SOURCE_DIRECTORY/Evant/Info.plist
fi